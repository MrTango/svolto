# Listing in Grid - Implementation Tasks

## Overview

Enable listing blocks to be rendered as nested content within grid block columns, with independent pagination per listing block following Volto's pagination pattern.

**Total Tasks:** 20

**Key Components:**
- Pagination utilities in `api.ts` for block-specific pagination keys
- Pagination component update for `blockId` prop support
- Grid block update to allow listing as nested block
- SSR data fetching for nested listings in `+layout.server.js`
- ListingBlockView update for block-specific pagination context

## Task Groups

### Group 1: Pagination Utilities

**Dependencies:** None

This group adds the core utility functions for handling block-specific pagination keys.

- [x] **Task 1.0**: Complete pagination utilities layer
  - [x] **Task 1.1**: Write 2-4 focused tests for pagination utilities
    - Files: `/workspace/src/lib/blocks/listing/api.test.ts` (create)
    - Test `slugifyBlockId` with various block ID formats
    - Test `parsePageFromUrlForBlock` with single and multiple block scenarios
    - Test `buildPageUrlForBlock` with single and multiple block scenarios
    - Test `countPaginatedBlocks` for top-level and nested blocks
    - Done when: Test file exists with 2-4 focused tests covering critical utility behaviors
  - [x] **Task 1.2**: Add `slugifyBlockId` utility function
    - Files: `/workspace/src/lib/blocks/listing/api.ts`
    - Convert block IDs to URL-safe format (lowercase, replace non-alphanumeric with hyphens)
    - Match Volto's slugify behavior for compatibility
    - Done when: Function accepts a block ID string and returns URL-safe slug
  - [x] **Task 1.3**: Add `countPaginatedBlocks` utility function
    - Files: `/workspace/src/lib/blocks/listing/api.ts`
    - Accept blocks object and blocks_layout items array
    - Count blocks of type 'listing' or 'search' at top level
    - Traverse grid blocks to count nested listing/search blocks
    - Done when: Function returns accurate count of all paginated blocks including nested ones
  - [x] **Task 1.4**: Add `parsePageFromUrlForBlock` utility function
    - Files: `/workspace/src/lib/blocks/listing/api.ts`
    - Accept URL, blockId, and paginatedBlockCount parameters
    - When paginatedBlockCount <= 1: use simple `?page=N` parameter
    - When paginatedBlockCount > 1: use `?page-{slugifiedBlockId}=N` parameter
    - Return page number (1-indexed), default to 1 if not present
    - Done when: Function correctly parses page based on single vs multiple block scenarios
  - [x] **Task 1.5**: Add `buildPageUrlForBlock` utility function
    - Files: `/workspace/src/lib/blocks/listing/api.ts`
    - Accept baseUrl, page, blockId, and paginatedBlockCount parameters
    - Build URL with appropriate page parameter key based on block count
    - Preserve existing query parameters when building URL
    - Done when: Function builds URLs with correct pagination parameters
  - [x] **Task 1.6**: Ensure pagination utility tests pass
    - Run ONLY the 2-4 tests written in 1.1
    - Verify all utility functions work correctly
    - Done when: All pagination utility tests pass

**Acceptance Criteria:**
- `slugifyBlockId` converts block IDs to URL-safe format
- `countPaginatedBlocks` correctly counts listing/search blocks including nested ones
- `parsePageFromUrlForBlock` handles both single and multiple block pagination
- `buildPageUrlForBlock` creates correct URLs with proper parameter keys
- Existing `parsePageFromUrl` and `buildPageUrl` functions remain backward compatible

---

### Group 2: Pagination Component Update

**Dependencies:** Task Group 1

This group updates the Pagination component to support block-specific pagination keys.

- [x] **Task 2.0**: Complete pagination component update
  - [x] **Task 2.1**: Write 2-3 focused tests for Pagination component
    - Files: `/workspace/src/lib/components/Pagination.svelte.test.ts` (create)
    - Test pagination renders correctly with blockId prop
    - Test URL building uses block-specific keys when paginatedBlockCount > 1
    - Test URL building uses simple `page` key when paginatedBlockCount <= 1
    - Done when: Test file exists with 2-3 focused tests for pagination behavior
  - [x] **Task 2.2**: Add `blockId` and `paginatedBlockCount` props to Pagination
    - Files: `/workspace/src/lib/components/Pagination.svelte`
    - Add optional `blockId` prop (string | undefined)
    - Add optional `paginatedBlockCount` prop (number, default 1)
    - Import `slugifyBlockId` from listing api utilities
    - Done when: Component accepts new optional props without breaking existing usage
  - [x] **Task 2.3**: Update `buildPageUrl` function for block-specific keys
    - Files: `/workspace/src/lib/components/Pagination.svelte`
    - Modify internal `buildPageUrl` to use `page-{slugifiedBlockId}` when multiple paginated blocks
    - Preserve existing query parameters when building URLs
    - Fall back to simple `page` parameter when single block or no blockId
    - Done when: Pagination links use correct parameter format based on context
  - [x] **Task 2.4**: Ensure pagination component tests pass
    - Run ONLY the 2-3 tests written in 2.1
    - Verify pagination links render with correct URLs
    - Done when: All pagination component tests pass

**Acceptance Criteria:**
- Pagination component accepts optional `blockId` and `paginatedBlockCount` props
- When `paginatedBlockCount > 1`, uses `page-{blockId}` parameter
- When `paginatedBlockCount <= 1`, uses simple `page` parameter
- Existing pagination usage without new props continues to work

---

### Group 3: Grid Block Update

**Dependencies:** None (can run in parallel with Groups 1-2)

This group adds 'listing' to allowed nested blocks in GridBlockView.

- [x] **Task 3.0**: Complete grid block update
  - [x] **Task 3.1**: Write 1-2 focused tests for grid block with listing
    - Files: `/workspace/src/lib/blocks/grid/GridBlockView.svelte.test.ts` (existing file updated)
    - Test that listing blocks render within grid columns
    - Test that listing component receives correct props from grid
    - Done when: Test file exists with 1-2 focused tests for nested listing rendering
  - [x] **Task 3.2**: Add 'listing' to allowedNestedBlocks array
    - Files: `/workspace/src/lib/blocks/grid/GridBlockView.svelte`
    - Add 'listing' to the `allowedNestedBlocks` array (line 44)
    - Array should become: `['slate', 'image', 'teaser', 'listing']`
    - Done when: Listing blocks are recognized and rendered in grid columns
  - [x] **Task 3.3**: Forward listing-specific props to nested blocks
    - Files: `/workspace/src/lib/blocks/grid/GridBlockView.svelte`
    - Accept `listingData` prop (Record<string, ListingResponse>)
    - Accept `currentPage` prop (number)
    - Accept `paginatedBlockCount` prop (number)
    - Pass these props to nested block components
    - Done when: GridBlockView passes listing data and pagination context to nested listing blocks
  - [x] **Task 3.4**: Ensure grid block tests pass
    - Run ONLY the 1-2 tests written in 3.1
    - Verify listing blocks render correctly within grid
    - Done when: All grid block tests pass

**Acceptance Criteria:**
- 'listing' is included in `allowedNestedBlocks` array
- Grid block accepts and forwards `listingData`, `currentPage`, and `paginatedBlockCount` props
- Nested listing blocks receive their initial data from `listingData` keyed by block ID

---

### Group 4: SSR Data Fetching

**Dependencies:** Task Group 1 (needs `countPaginatedBlocks` and `parsePageFromUrlForBlock`)

This group updates the server-side data loading to fetch nested listing data.

- [x] **Task 4.0**: Complete SSR data fetching update
  - [x] **Task 4.1**: Write 2-3 focused tests for SSR listing data fetching
    - Files: `/workspace/src/routes/layout.server.test.ts` (create)
    - Test that nested listing blocks in grids are discovered and fetched
    - Test that block-specific page parameters are correctly parsed
    - Test that listingData object contains data keyed by block ID
    - Done when: Test file exists with 2-3 focused tests for SSR data fetching
  - [x] **Task 4.2**: Import pagination utilities in layout.server.js
    - Files: `/workspace/src/routes/+layout.server.js`
    - Import `countPaginatedBlocks` from listing api
    - Import `parsePageFromUrlForBlock` from listing api
    - Done when: Utility functions are available for use in load function
  - [x] **Task 4.3**: Implement `findAllListingBlocks` helper function
    - Files: `/workspace/src/routes/+layout.server.js`
    - Create helper to traverse blocks and find all listing blocks
    - Include top-level listing blocks
    - Traverse grid blocks to find nested listing blocks in columns
    - Return array of { blockId, blockData, parentGridId? } objects
    - Done when: Helper function discovers all listing blocks including nested ones
  - [x] **Task 4.4**: Update load function to count paginated blocks
    - Files: `/workspace/src/routes/+layout.server.js`
    - Call `countPaginatedBlocks` to get total paginated block count
    - Store count for passing to page component
    - Done when: Load function calculates and returns paginatedBlockCount
  - [x] **Task 4.5**: Update load function to fetch nested listing data
    - Files: `/workspace/src/routes/+layout.server.js`
    - Use `findAllListingBlocks` to get all listing blocks
    - For each listing block, parse its page using `parsePageFromUrlForBlock`
    - Fetch data for each listing block with its specific page
    - Store fetched data in `listingData` object keyed by block ID
    - Done when: All listing blocks (top-level and nested) have pre-fetched data
  - [x] **Task 4.6**: Return paginatedBlockCount in load response
    - Files: `/workspace/src/routes/+layout.server.js`
    - Add `paginatedBlockCount` to return object alongside existing `listingData` and `currentPage`
    - Done when: Layout returns all necessary pagination context
  - [x] **Task 4.7**: Ensure SSR data fetching tests pass
    - Run ONLY the 2-3 tests written in 4.1
    - Verify nested listing data is correctly fetched
    - Done when: All SSR data fetching tests pass

**Acceptance Criteria:**
- Server-side load function discovers listing blocks in both top-level and grid columns
- Each listing block gets its page parsed using block-specific URL parameters
- Pre-fetched data is keyed by block ID in `listingData` object
- `paginatedBlockCount` is returned for client-side pagination context

---

### Group 5: ListingBlockView Update

**Dependencies:** Task Groups 1, 2, 4

This group updates ListingBlockView to support block-specific pagination context.

- [x] **Task 5.0**: Complete ListingBlockView update
  - [x] **Task 5.1**: Add `paginatedBlockCount` prop to ListingBlockView
    - Files: `/workspace/src/lib/blocks/listing/ListingBlockView.svelte`
    - Add optional `paginatedBlockCount` prop (number, default 1)
    - Done when: Component accepts pagination context prop
  - [x] **Task 5.2**: Pass pagination context to Pagination component
    - Files: `/workspace/src/lib/blocks/listing/ListingBlockView.svelte`
    - Pass `blockId={key}` to Pagination component
    - Pass `paginatedBlockCount` to Pagination component
    - Done when: Pagination component receives block context for URL building

**Acceptance Criteria:**
- ListingBlockView accepts `paginatedBlockCount` prop
- Block ID is passed to Pagination component for URL key generation
- Pagination URLs use correct format based on number of paginated blocks

---

### Group 6: RenderBlocks Integration

**Dependencies:** Task Groups 3, 4, 5

This group updates RenderBlocks to pass pagination context through the component tree.

- [x] **Task 6.0**: Complete RenderBlocks integration
  - [x] **Task 6.1**: Add `paginatedBlockCount` prop to RenderBlocks
    - Files: `/workspace/src/lib/RenderBlocks.svelte`
    - Add `paginatedBlockCount` prop (number, default 1)
    - Pass prop to all block components including GridBlockView
    - Done when: RenderBlocks forwards pagination context to all blocks
  - [x] **Task 6.2**: Update page component to pass paginatedBlockCount
    - Files: `/workspace/src/routes/[[path]]/+page.svelte`
    - Receive `paginatedBlockCount` from page data
    - Pass to RenderBlocks component
    - Done when: Pagination context flows from server through to block components

**Acceptance Criteria:**
- RenderBlocks accepts and forwards `paginatedBlockCount` prop
- Page component passes server-calculated pagination count to RenderBlocks
- Full data flow: server -> page -> RenderBlocks -> GridBlock -> ListingBlock -> Pagination

---

### Group 7: Test Review and Integration

**Dependencies:** Task Groups 1-6

This group reviews existing tests and adds integration tests for the complete feature.

- [x] **Task 7.0**: Review and complete test coverage
  - [x] **Task 7.1**: Review tests from Task Groups 1-6
    - Review utility tests from Group 1 (Task 1.1)
    - Review pagination component tests from Group 2 (Task 2.1)
    - Review grid block tests from Group 3 (Task 3.1)
    - Review SSR tests from Group 4 (Task 4.1)
    - Total existing tests: approximately 7-12 tests
    - Done when: All existing tests are reviewed and documented
  - [x] **Task 7.2**: Analyze test coverage gaps
    - Identify critical user workflows lacking coverage
    - Focus on end-to-end pagination flow with multiple listings
    - Focus on grid-nested listing with independent pagination
    - Done when: Gap analysis complete with prioritized list
  - [x] **Task 7.3**: Write up to 5 additional integration tests if needed
    - Files: `/workspace/src/lib/blocks/listing/integration.test.ts` (create if needed)
    - Test: Two listings on same page use different URL parameters
    - Test: Listing in grid receives correct initial data from SSR
    - Test: Pagination navigation updates correct listing only
    - Done when: Critical integration gaps are covered (max 5 new tests)
  - [x] **Task 7.4**: Run all feature-specific tests
    - Run all tests created in Groups 1-7
    - Expected total: approximately 12-17 tests maximum
    - Verify all critical workflows pass
    - Done when: All feature tests pass

**Acceptance Criteria:**
- All tests from Groups 1-6 pass
- Critical integration scenarios are tested
- Total test count stays within 12-17 tests maximum
- Feature is verified to work end-to-end

## Execution Order

Recommended implementation sequence:

1. **Task Group 1: Pagination Utilities** - Foundation for all pagination logic
2. **Task Group 3: Grid Block Update** - Can run in parallel with Group 1 (no dependencies)
3. **Task Group 2: Pagination Component Update** - Depends on Group 1 utilities
4. **Task Group 4: SSR Data Fetching** - Depends on Group 1 utilities
5. **Task Group 5: ListingBlockView Update** - Depends on Groups 1, 2, 4
6. **Task Group 6: RenderBlocks Integration** - Depends on Groups 3, 4, 5
7. **Task Group 7: Test Review and Integration** - Final verification

**Parallel Execution Opportunities:**
- Groups 1 and 3 can be implemented in parallel
- Groups 2 and 4 can be implemented in parallel (both depend only on Group 1)

## File Summary

| File | Action | Group |
|------|--------|-------|
| `/workspace/src/lib/blocks/listing/api.ts` | Modify | 1 |
| `/workspace/src/lib/blocks/listing/api.test.ts` | Create | 1 |
| `/workspace/src/lib/components/Pagination.svelte` | Modify | 2 |
| `/workspace/src/lib/components/Pagination.svelte.test.ts` | Create | 2 |
| `/workspace/src/lib/blocks/grid/GridBlockView.svelte` | Modify | 3 |
| `/workspace/src/lib/blocks/grid/GridBlockView.svelte.test.ts` | Modify | 3 |
| `/workspace/src/routes/+layout.server.js` | Modify | 4 |
| `/workspace/src/routes/layout.server.test.ts` | Create | 4 |
| `/workspace/src/lib/blocks/listing/ListingBlockView.svelte` | Modify | 5 |
| `/workspace/src/lib/RenderBlocks.svelte` | Modify | 6 |
| `/workspace/src/routes/[[path]]/+page.svelte` | Modify | 6 |
| `/workspace/src/lib/blocks/listing/integration.test.ts` | Create (if needed) | 7 |
