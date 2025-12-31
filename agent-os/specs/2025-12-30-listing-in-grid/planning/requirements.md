# Spec Requirements: Listing Block in Grid Block

## Initial Description

Add support for listing blocks as nested content within grid block columns. This enables dynamic content listings to be displayed in grid layouts alongside other block types like text, images, and teasers.

## Requirements Discussion

### First Round Questions

**Q1:** I assume the primary change is simply adding 'listing' to the allowedNestedBlocks array in GridBlockView.svelte. Is that correct, or are there additional structural changes needed?
**Answer:** Yes, the primary change is adding 'listing' to the allowedNestedBlocks array in GridBlockView.svelte.

**Q2:** For SSR data fetching, I'm thinking listing blocks in grids should pre-fetch their initial data server-side for SEO and performance. Should grid blocks pass down any additional context to enable this, or should each listing block handle its own data fetching independently?
**Answer:** Listing blocks can only be on the first level in a grid block. Grid blocks are not nestable. (So only one level of nesting to support)

**Q3:** Regarding pagination behavior with multiple listing blocks in different grid columns: Should each listing maintain independent pagination (like Volto does), or should there be a single pagination that affects all listings on the page?
**Answer:** Support independent pagination per listing, like Volto does.

**Q4:** For responsive behavior, when the grid collapses to a single column on mobile, should listing blocks have any special handling, or just flow naturally with the column?
**Answer:** Just flow with the column.

**Q5:** I assume all listing variations (default, summary, image gallery) should be allowed when nested in a grid. Should there be any restrictions on variations within grid columns?
**Answer:** No restrictions - all variations allowed in grid columns.

**Q6:** Should loading states for listings within grids show individual spinners per listing, or a unified loading state for the entire grid?
**Answer:** Yes, show individual loading spinners per listing.

**Q7:** Is there anything you explicitly want to exclude from this feature scope?
**Answer:** Not explicitly answered, but based on answer #2, no nested grids to worry about.

### Existing Code to Reference

**Similar Features Identified:**

- Feature: GridBlockView - Path: `/workspace/src/lib/blocks/grid/GridBlockView.svelte`
  - Contains the `allowedNestedBlocks` array that needs to be modified
  - Shows pattern for rendering nested block components
  - Passes `contained={true}` prop to nested blocks

- Feature: ListingBlockView - Path: `/workspace/src/lib/blocks/listing/ListingBlockView.svelte`
  - Complete listing block implementation with SSR support
  - Has pagination integration via `Pagination` component
  - Accepts `page` and `initialListingData` props for SSR

- Feature: Pagination Component - Path: `/workspace/src/lib/components/Pagination.svelte`
  - Currently uses simple `?page=N` query parameter
  - Needs modification to support block-specific pagination keys

- Feature: Listing API utilities - Path: `/workspace/src/lib/blocks/listing/api.ts`
  - Contains `parsePageFromUrl()` and `buildPageUrl()` functions
  - Will need modification for block-specific pagination keys

**Volto Reference Implementation:**

- Feature: usePagination hook - Path: `/workspace/volto-svolto/frontend/core/packages/volto/src/helpers/Utils/usePagination.js`
  - Key insight: Uses `page` for single paginated block, `page-{blockId}` for multiple
  - The `useCreatePageQueryStringKey` function detects if multiple paginated blocks exist
  - Slugifies the block ID to create URL-safe parameter names

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

N/A

## Requirements Summary

### Functional Requirements

- Add 'listing' to the `allowedNestedBlocks` array in GridBlockView.svelte
- Support all listing variations (default, summary, image gallery) within grid columns
- Each listing block within a grid maintains independent pagination
- Individual loading spinners per listing block (existing behavior)
- Listing blocks flow naturally with grid column on responsive layouts

### Technical Requirements - Pagination Strategy

Based on Volto's implementation, the pagination system should:

1. **Query Parameter Naming:**
   - Single listing on page: use `?page=N`
   - Multiple listings on page: use `?page-{blockId}=N` (slugified)

2. **Detection Logic:**
   - Count paginated blocks (listing, search) on the page
   - If count > 1, use block-specific pagination keys
   - Pass the block ID to pagination components

3. **Components to Modify:**
   - `Pagination.svelte`: Accept optional `blockId` prop for unique parameter keys
   - `ListingBlockView.svelte`: Pass block ID to pagination
   - `api.ts`: Update `parsePageFromUrl()` and `buildPageUrl()` to handle block-specific keys

### Reusability Opportunities

- The existing `ListingBlockView.svelte` component works as-is when nested
- The existing `Pagination.svelte` component needs minor modification for block-specific keys
- The `contained={true}` prop pattern from GridBlockView applies to nested listings
- The loading spinner is already implemented in ListingBlockView

### Scope Boundaries

**In Scope:**

- Adding 'listing' to allowed nested blocks in GridBlockView
- Implementing independent pagination per listing block (Volto-compatible approach)
- Support for all listing variations within grid columns
- Individual loading states per listing

**Out of Scope:**

- Nested grid blocks (grids containing grids) - not supported per user requirement
- Search blocks in grids (can be added later following same pattern)
- Shared/synchronized pagination across listings
- Custom grid-specific listing variations

### Technical Considerations

- Grid blocks are not nestable (only one level of nesting for listings)
- Block IDs must be slugified for URL-safe query parameters
- SSR data fetching for listings should work independently per listing
- Page layout component needs to detect multiple paginated blocks to determine pagination key strategy
- Pagination URL building must preserve other query parameters when updating
