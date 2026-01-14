# Specification: Listing Block in Grid Block

## Goal

Enable listing blocks to be rendered as nested content within grid block columns, with independent pagination per listing block following Volto's pagination pattern.

## User Stories

- As a content editor, I want to add listing blocks inside grid columns so that I can display dynamic content listings alongside other block types in a grid layout.
- As a site visitor, I want each listing block in a grid to have its own pagination controls so that I can navigate through different listings independently.

## Specific Requirements

**Add listing to allowed nested blocks in GridBlockView**

- Add 'listing' to the `allowedNestedBlocks` array in GridBlockView.svelte
- Listing blocks only nest one level deep (grids are not nestable)
- All listing variations (default, summary, image gallery) are allowed within grid columns

**Implement block-specific pagination keys**

- Single listing block on page: use `?page=N` query parameter
- Multiple listing/search blocks on page: use `?page-{blockId}=N` format
- Block ID must be slugified for URL-safe parameter names (matching Volto pattern)
- Count paginated block types ('listing', 'search') to determine key strategy

**SSR data fetching for nested listing blocks**

- Modify +layout.server.js to traverse grid blocks and find nested listing blocks
- Pre-fetch listing data for all listing blocks (top-level and nested in grids)
- Parse block-specific page parameters from URL for each listing block
- Store fetched data keyed by block ID in `listingData` object

**Pass pagination context through grid to nested blocks**

- GridBlockView must forward `listingData` and `currentPage` props to nested blocks
- GridBlockView must pass block ID to nested listing blocks for pagination key lookup
- Each nested listing block receives its own initial data and page number

**Update Pagination component for block-specific URLs**

- Add optional `blockId` prop to Pagination component
- Add optional `paginatedBlockCount` prop to determine key format
- Modify `buildPageUrl` to use `page-{blockId}` when multiple paginated blocks exist
- Preserve existing query parameters when building pagination URLs

**Update api.ts utility functions**

- Add `parsePageFromUrlForBlock(url, blockId, paginatedBlockCount)` function
- Add `buildPageUrlForBlock(baseUrl, page, blockId, paginatedBlockCount)` function
- Add `slugifyBlockId(blockId)` utility function for URL-safe block IDs
- Maintain backward compatibility with existing single-listing `parsePageFromUrl`

**Update ListingBlockView to support block-specific pagination**

- Accept `blockId` prop (passed from parent via `key` or `id`)
- Accept `paginatedBlockCount` prop to determine pagination key format
- Pass `blockId` and `paginatedBlockCount` to Pagination component
- Use block-specific page parsing when multiple paginated blocks exist

**Count paginated blocks for key determination**

- Create utility function `countPaginatedBlocks(blocks)` to count listing/search blocks
- Traverse both top-level blocks and blocks nested in grid columns
- Return count used to determine if block-specific keys are needed

## Existing Code to Leverage

**GridBlockView.svelte (src/lib/blocks/grid/GridBlockView.svelte)**

- Contains `allowedNestedBlocks` array that needs 'listing' added
- Pattern for rendering nested blocks with `BlockComponent` lookup
- Already passes `blocksConfig`, `metadata`, `properties`, `path` to nested blocks
- Uses `contained={true}` prop pattern for nested blocks

**ListingBlockView.svelte (src/lib/blocks/listing/ListingBlockView.svelte)**

- Complete listing implementation with SSR support via `initialListingData` prop
- Existing `page` prop for pagination state
- Loading spinner already implemented for individual loading states
- Works with Pagination component for navigation

**Pagination.svelte (src/lib/components/Pagination.svelte)**

- Existing pagination UI with prev/next and page numbers
- `buildPageUrl` function needs modification for block-specific keys
- Currently uses simple `?page=N` format
- Good foundation for extending with `blockId` support

**api.ts (src/lib/blocks/listing/api.ts)**

- Contains `parsePageFromUrl` and `buildPageUrl` utility functions
- `fetchListingData` supports server-side client injection
- `calculateBStart` and `calculateTotalPages` work unchanged

**Volto usePagination hook (volto-svolto/frontend/core/packages/volto/src/helpers/Utils/usePagination.js)**

- Reference implementation for multi-block pagination pattern
- Uses `page` for single block, `page-{id}` for multiple blocks
- `useCreatePageQueryStringKey` function shows detection logic
- Uses `slugify` helper for URL-safe block IDs

## Out of Scope

- Nested grid blocks (grids containing grids) - explicitly not supported
- Search blocks in grids - can be added later following same pattern
- Shared/synchronized pagination across multiple listings
- Custom grid-specific listing variations
- Client-side routing for pagination (using standard URL navigation)
- Infinite scroll as pagination alternative
- Custom per-listing batch sizes different from block configuration
- Caching of listing data across page navigations
- Animations or transitions when paginating
- Pre-fetching adjacent pages for faster navigation
