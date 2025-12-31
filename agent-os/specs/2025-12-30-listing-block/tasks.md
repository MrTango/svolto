# Listing Block - Implementation Tasks

## Overview

Implement a Listing Block for Svolto that renders content listings from Plone with three variation templates (Default, Summary, Image Gallery), supporting server-side data fetching with pagination, optional headlines, and "Link More" functionality.

**Total Tasks:** 30 sub-tasks across 6 task groups

## Task Groups

### Task Group 1: Core Infrastructure

**Dependencies:** None

This group establishes the foundational structure for the listing block, including block registration, TypeScript types, and the main component shell.

- [x] **1.0 Complete core infrastructure**

  - [x] **1.1 Write 4 focused tests for block registration and type system**

    - Test that `listing` block is registered in blocks config
    - Test that ListingBlockView component is exported correctly
    - Test TypeScript interfaces compile without errors
    - Test variation registry returns correct component for each variation type
    - Files: `src/lib/blocks/listing/listing.svelte.test.ts`

  - [x] **1.2 Create TypeScript interfaces for listing block data**

    - Define `ListingBlockData` interface with fields: `variation`, `headline`, `headlineTag`, `querystring`, `linkTitle`, `linkHref`, `b_size`
    - Define `ListingItem` interface for API response items
    - Define `ListingResponse` interface with `items`, `total`, `batching`
    - Define `QuerystringQuery` interface matching Plone schema
    - Files: `src/lib/blocks/listing/types.ts`
    - Done when: Interfaces compile and match Plone API structure

  - [x] **1.3 Create variation registry pattern**

    - Create `src/lib/blocks/listing/variations/index.ts`
    - Export `variationRegistry` mapping variation names to components
    - Export `getVariationComponent(variation: string)` helper function
    - Default to `DefaultVariation` when variation not found
    - Follow pattern from `src/lib/blocks/teaser/templates/index.ts`
    - Files: `src/lib/blocks/listing/variations/index.ts`
    - Done when: Registry returns correct component for 'default', 'summary', 'imageGallery'

  - [x] **1.4 Create ListingBlockView.svelte shell component**

    - Accept standard block props: `key`, `id`, `data`, `metadata`, `properties`, `path`
    - Add `page` prop for pagination state (default: 1)
    - Implement loading state placeholder
    - Implement empty results state placeholder
    - Use `$derived` for computed values (following Svelte 5 patterns)
    - Files: `src/lib/blocks/listing/ListingBlockView.svelte`
    - Done when: Component renders without errors, shows loading/empty states

  - [x] **1.5 Register listing block in blocks config**

    - Import `ListingBlockView` in `src/lib/blocks/index.ts`
    - Add `listing` entry with `{ id: 'listing', title: 'Listing', view: ListingBlockView }`
    - Files: `src/lib/blocks/index.ts`
    - Done when: Block appears in blocks config and can be rendered by RenderBlocks

  - [x] **1.6 Ensure core infrastructure tests pass**
    - Run ONLY the 4 tests written in 1.1
    - Verify block registration works
    - Do NOT run the entire test suite at this stage
    - Command: `pnpm test:unit -- --run src/lib/blocks/listing/listing.svelte.test.ts`

**Acceptance Criteria:**

- The 4 tests written in 1.1 pass
- TypeScript interfaces compile without errors
- Block registered and renderable
- Variation registry returns correct components

---

### Task Group 2: Data Fetching & Pagination

**Dependencies:** Task Group 1

This group implements server-side data fetching from Plone's querystring-search API and URL-based pagination.

- [x] **2.0 Complete data fetching layer**

  - [x] **2.1 Write 5 focused tests for data fetching and pagination**

    - Test `fetchListingData` returns items array from API
    - Test pagination calculates correct `b_start` from page number
    - Test `totalPages` calculation from total results and batch size
    - Test default batch size (10) is applied when not specified
    - Test URL page parameter parsing
    - Files: `src/lib/blocks/listing/listing.test.ts`

  - [x] **2.2 Implement fetchListingData utility function**

    - Create `src/lib/blocks/listing/api.ts`
    - Use `client.getQuerystringSearch()` from `$lib/api`
    - Accept `querystring`, `b_start`, `b_size` parameters
    - Return typed `ListingResponse` with `items`, `total`, `batching`
    - Handle API errors gracefully (return empty items array)
    - Files: `src/lib/blocks/listing/api.ts`
    - Done when: Function fetches data from Plone API correctly

  - [x] **2.3 Implement pagination calculation utilities**

    - Add to `src/lib/blocks/listing/api.ts`
    - `calculateBStart(page: number, batchSize: number)`: Returns starting index
    - `calculateTotalPages(total: number, batchSize: number)`: Returns page count
    - `parsePageFromUrl(url: URL)`: Extracts page number from query params
    - Files: `src/lib/blocks/listing/api.ts`
    - Done when: Calculations produce correct values for edge cases

  - [x] **2.4 Integrate data fetching into ListingBlockView**

    - Use `$effect` to fetch data when component mounts or page changes
    - Store results in reactive state: `items`, `total`, `isLoading`
    - Calculate `totalPages` from `total` and `b_size`
    - Handle loading state during fetch
    - Handle empty results state
    - Files: `src/lib/blocks/listing/ListingBlockView.svelte`
    - Done when: Component fetches and displays data from API

  - [x] **2.5 Create reusable Pagination.svelte component**

    - Create `src/lib/components/Pagination.svelte`
    - Props: `currentPage`, `totalPages`, `baseUrl`
    - Render prev/next links and page numbers
    - Use URL query parameter `?page=N` for navigation
    - Style with CSS custom properties for theming
    - Hide pagination when totalPages <= 1
    - Files: `src/lib/components/Pagination.svelte`
    - Done when: Pagination renders correctly and links work

  - [x] **2.6 Ensure data fetching tests pass**
    - Run ONLY the 5 tests written in 2.1
    - Verify API integration works
    - Do NOT run the entire test suite at this stage
    - Command: `pnpm test:unit -- --run src/lib/blocks/listing/listing.test.ts`

**Acceptance Criteria:**

- The 5 tests written in 2.1 pass
- Data fetches correctly from Plone API
- Pagination calculates correctly
- Loading and empty states work

---

### Task Group 3: Default Variation Template

**Dependencies:** Task Groups 1, 2

This group implements the Default variation - a simple list of titles and descriptions.

- [x] **3.0 Complete Default variation**

  - [x] **3.1 Write 3 focused tests for Default variation**

    - Test renders list of item titles as links
    - Test renders item descriptions when available
    - Test renders "Link More" when configured
    - Files: `src/lib/blocks/listing/variations/DefaultVariation.svelte.test.ts`

  - [x] **3.2 Create DefaultVariation.svelte component**

    - Create `src/lib/blocks/listing/variations/DefaultVariation.svelte`
    - Props: `items`, `linkTitle`, `linkHref`
    - Render `<ul>` with `<li>` for each item
    - Each item: title as `<a>` link, description as `<p>`
    - Extract path from item `@id` (reuse hrefPath pattern from TeaserBlockView)
    - Files: `src/lib/blocks/listing/variations/DefaultVariation.svelte`
    - Done when: Items render as linked list with descriptions

  - [x] **3.3 Implement Link More feature for Default variation**

    - Render footer link when `linkTitle` and `linkHref` are provided
    - Extract path from `linkHref[0]['@id']` (same pattern as teaser)
    - Style as button or prominent link
    - Files: `src/lib/blocks/listing/variations/DefaultVariation.svelte`
    - Done when: "Link More" renders and navigates correctly

  - [x] **3.4 Add CSS styling for Default variation**

    - Use scoped styles in component
    - Style list items with appropriate spacing
    - Style links with hover states
    - Style "Link More" button/link
    - Follow existing Svolto styling conventions
    - Files: `src/lib/blocks/listing/variations/DefaultVariation.svelte`
    - Done when: Variation looks consistent with site design

  - [x] **3.5 Ensure Default variation tests pass**
    - Run ONLY the 3 tests written in 3.1
    - Verify variation renders correctly
    - Command: `pnpm vitest run --no-watch src/lib/blocks/listing/variations/DefaultVariation.svelte.test.ts`

**Acceptance Criteria:**

- The 3 tests written in 3.1 pass
- Items render as list with titles and descriptions
- "Link More" feature works
- Styling is consistent

---

### Task Group 4: Summary Variation Template

**Dependencies:** Task Groups 1, 2

This group implements the Summary variation - cards with images, titles, and descriptions.

- [x] **4.0 Complete Summary variation**

  - [x] **4.1 Write 3 focused tests for Summary variation**

    - Test renders items as cards with images
    - Test handles items without images gracefully
    - Test renders title and description in each card
    - Files: `src/lib/blocks/listing/variations/SummaryVariation.svelte.test.ts`

  - [x] **4.2 Create SummaryVariation.svelte component**

    - Create `src/lib/blocks/listing/variations/SummaryVariation.svelte`
    - Props: `items`, `linkTitle`, `linkHref`
    - Render items as cards in a grid/flexbox layout
    - Each card: image (if available), title as link, description
    - Reuse image handling patterns from TeaserBlockView
    - Files: `src/lib/blocks/listing/variations/SummaryVariation.svelte`
    - Done when: Items render as cards with images

  - [x] **4.3 Integrate ResponsiveImage component**

    - Import ResponsiveImage from `$lib/components/ResponsiveImage.svelte`
    - Extract `image_scales` from item data
    - Build `baseUrl` from item `@id`
    - Handle items without `image_field` or `image_scales`
    - Files: `src/lib/blocks/listing/variations/SummaryVariation.svelte`
    - Done when: Images render responsively with srcset

  - [x] **4.4 Add CSS styling for Summary variation**

    - CSS custom properties for theming (--listing-card-gap, --listing-card-aspect-ratio)
    - Responsive grid: 1 column mobile, 2 tablet, 3+ desktop
    - Card hover states
    - Image aspect ratio handling
    - "Link More" styling (reuse from Default)
    - Files: `src/lib/blocks/listing/variations/SummaryVariation.svelte`
    - Done when: Cards are responsive and visually appealing

  - [x] **4.5 Ensure Summary variation tests pass**
    - Run ONLY the 3 tests written in 4.1
    - Verify variation renders correctly
    - Command: `pnpm vitest run --no-watch src/lib/blocks/listing/variations/SummaryVariation.svelte.test.ts`

**Acceptance Criteria:**

- The 3 tests written in 4.1 pass
- Cards render with images, titles, descriptions
- Responsive layout works
- Items without images handled gracefully

---

### Task Group 5: Image Gallery Variation

**Dependencies:** Task Groups 1, 2

This group implements the Image Gallery variation - a carousel/gallery with navigation.

- [x] **5.0 Complete Image Gallery variation**

  - [x] **5.1 Write 3 focused tests for Image Gallery variation**

    - Test filters items to only show Image content types
    - Test renders gallery with navigation controls
    - Test handles empty gallery (no images) gracefully
    - Files: `src/lib/blocks/listing/variations/ImageGalleryVariation.svelte.test.ts`

  - [x] **5.2 Install and configure embla-carousel-svelte**

    - Add `embla-carousel-svelte` to dependencies
    - Verify package works with Svelte 5
    - Document any configuration needed
    - Command: `pnpm add embla-carousel-svelte`
    - Done when: Package installed and importable

  - [x] **5.3 Create ImageGalleryVariation.svelte component**

    - Create `src/lib/blocks/listing/variations/ImageGalleryVariation.svelte`
    - Props: `items`
    - Filter items to only `@type === 'Image'`
    - Integrate embla-carousel-svelte for gallery
    - Render large image with prev/next navigation
    - Files: `src/lib/blocks/listing/variations/ImageGalleryVariation.svelte`
    - Done when: Gallery renders with carousel navigation

  - [x] **5.4 Implement thumbnail navigation**

    - Render thumbnail strip below main image
    - Click thumbnail to navigate to that image
    - Highlight current thumbnail
    - Files: `src/lib/blocks/listing/variations/ImageGalleryVariation.svelte`
    - Done when: Thumbnails navigate and indicate current image

  - [x] **5.5 Implement fullscreen mode**

    - Add fullscreen toggle button
    - Use Fullscreen API or CSS modal approach
    - Maintain navigation controls in fullscreen
    - Handle escape key to exit fullscreen
    - Files: `src/lib/blocks/listing/variations/ImageGalleryVariation.svelte`
    - Done when: Fullscreen mode works with navigation

  - [x] **5.6 Add CSS styling for Image Gallery**

    - CSS custom properties for theming
    - Main image container with aspect ratio
    - Navigation button styling
    - Thumbnail strip styling
    - Fullscreen overlay styling
    - Files: `src/lib/blocks/listing/variations/ImageGalleryVariation.svelte`
    - Done when: Gallery is visually polished

  - [x] **5.7 Ensure Image Gallery tests pass**
    - Run ONLY the 3 tests written in 5.1
    - Verify gallery functionality
    - Command: `pnpm vitest run --no-watch src/lib/blocks/listing/variations/ImageGalleryVariation.svelte.test.ts`

**Acceptance Criteria:**

- The 3 tests written in 5.1 pass
- Gallery displays images with carousel
- Thumbnail navigation works
- Fullscreen mode functional

---

### Task Group 6: Shared Features & Polish

**Dependencies:** Task Groups 1-5

This group completes shared features (headline, Link More), loading/empty states, and final integration.

- [x] **6.0 Complete shared features and polish**

  - [x] **6.1 Write 4 focused tests for shared features**

    - Test headline renders with correct tag (h2 or h3)
    - Test headline hidden when not configured
    - Test loading state displays correctly
    - Test empty state displays when no results
    - Files: `src/lib/blocks/listing/listing.svelte.test.ts` (shared features tests in "Listing Block - Shared Features" describe block)

  - [x] **6.2 Implement headline feature in ListingBlockView**

    - Render `data.headline` when present
    - Use `data.headlineTag` for element tag (default: h2)
    - Follow pattern from GridBlockView
    - Files: `src/lib/blocks/listing/ListingBlockView.svelte`
    - Done when: Headline renders with configurable tag

  - [x] **6.3 Create loading state component**

    - Create skeleton/loading UI for listing items
    - Match the visual structure of the current variation
    - Apply during data fetch
    - Files: `src/lib/blocks/listing/ListingBlockView.svelte`
    - Done when: Loading state displays during fetch

  - [x] **6.4 Create empty state component**

    - Display message when no results returned
    - Style appropriately for the context
    - Files: `src/lib/blocks/listing/ListingBlockView.svelte`
    - Done when: Empty state displays when items.length === 0

  - [x] **6.5 Wire up variation selection in ListingBlockView**

    - Read `data.variation` to select component
    - Use `getVariationComponent()` from variations registry
    - Pass `items`, `linkTitle`, `linkHref` to variation component
    - Handle undefined variation (default to 'default')
    - Files: `src/lib/blocks/listing/ListingBlockView.svelte`
    - Done when: All three variations selectable and rendering

  - [x] **6.6 Add responsive styles to ListingBlockView**

    - CSS custom properties for theming consistency
    - Mobile-first responsive breakpoints
    - Consistent spacing and typography
    - Files: `src/lib/blocks/listing/ListingBlockView.svelte`
    - Done when: Block looks good at all viewport sizes

  - [x] **6.7 Ensure shared features tests pass**
    - Run ONLY the 4 tests written in 6.1
    - Verify all shared features work
    - Command: `pnpm vitest run --no-watch src/lib/blocks/listing/listing.svelte.test.ts`

**Acceptance Criteria:**

- The 4 tests written in 6.1 pass
- Headline renders correctly
- Loading and empty states work
- All variations integrate properly

---

### Task Group 7: Test Review & Integration

**Dependencies:** Task Groups 1-6

This group reviews existing tests, fills critical gaps, and performs final integration testing.

- [x] **7.0 Review tests and finalize**

  - [x] **7.1 Review tests from Task Groups 1-6**

    - Review the 4 tests from Task 1.1 (core infrastructure)
    - Review the 5 tests from Task 2.1 (data fetching)
    - Review the 3 tests from Task 3.1 (Default variation)
    - Review the 3 tests from Task 4.1 (Summary variation)
    - Review the 3 tests from Task 5.1 (Image Gallery)
    - Review the 4 tests from Task 6.1 (shared features)
    - Total existing tests: 33 tests (more than originally estimated)
    - Files: All test files in `src/lib/blocks/listing/`

  - [x] **7.2 Analyze test coverage gaps for listing block**

    - Identified gaps:
      - Integration tests for full data flow (API -> ListingBlockView -> Variation)
      - Pagination component URL generation tests
      - Error handling tests for API failures
      - Empty querystring handling tests
    - Focus ONLY on listing block feature requirements
    - Prioritize end-to-end workflows over unit test gaps
    - Done when: Gap analysis complete

  - [x] **7.3 Write up to 8 additional integration tests**

    - Test full data flow: API -> ListingBlockView -> Variation (2 tests)
    - Test pagination navigation end-to-end (2 tests)
    - Test Pagination component URL generation (3 tests)
    - Test error handling (API failure) (2 tests)
    - Total: 9 new integration tests
    - Files: `src/lib/blocks/listing/listing.integration.svelte.test.ts`
    - Done when: Critical integration paths covered

  - [x] **7.4 Run all listing block tests**

    - Run all tests related to the listing block feature
    - Final total: 42 tests (33 existing + 9 integration)
    - All tests pass
    - Command: `pnpm vitest run --no-watch src/lib/blocks/listing/`
    - Done when: All listing block tests pass

  - [x] **7.5 Manual integration verification**
    - Skipped per instructions - documented what would be tested:
      - Start dev server with `pnpm dev`
      - Create listing blocks in Volto with each variation (default, summary, imageGallery)
      - Verify rendering in Svolto for all three variations
      - Test pagination navigation (prev/next/page numbers)
      - Test responsive behavior at mobile/tablet/desktop breakpoints
      - Verify headline rendering with h2 and h3 tags
      - Test "Link More" functionality
      - Test loading and empty states
    - Done when: Manual testing confirms all features work

**Acceptance Criteria:**

- All listing block tests pass (42 tests)
- Critical integration paths covered
- Manual verification documented
- Feature ready for production

---

## Execution Order

Recommended implementation sequence:

1. **Task Group 1: Core Infrastructure** - Foundation for all other work
2. **Task Group 2: Data Fetching & Pagination** - API integration needed by all variations
3. **Task Group 3: Default Variation** - Simplest variation, establishes patterns
4. **Task Group 4: Summary Variation** - Builds on Default, adds image handling
5. **Task Group 5: Image Gallery Variation** - Most complex, requires carousel library
6. **Task Group 6: Shared Features & Polish** - Completes headline, states, integration
7. **Task Group 7: Test Review & Integration** - Final verification and gap filling

---

## File Structure

After implementation, the listing block should have this structure:

```
src/lib/blocks/listing/
  ListingBlockView.svelte       # Main block component
  api.ts                        # Data fetching utilities
  types.ts                      # TypeScript interfaces
  listing.svelte.test.ts        # Core and shared feature tests
  listing.test.ts               # Data fetching unit tests
  listing.integration.svelte.test.ts   # Integration tests
  variations/
    index.ts                    # Variation registry
    DefaultVariation.svelte     # Default list template
    DefaultVariation.svelte.test.ts    # Default variation tests
    SummaryVariation.svelte     # Summary cards template
    SummaryVariation.svelte.test.ts    # Summary variation tests
    ImageGalleryVariation.svelte # Image gallery template
    ImageGalleryVariation.svelte.test.ts # Gallery variation tests

src/lib/components/
  Pagination.svelte             # Reusable pagination component
```

---

## Notes

- **No visual assets provided** - Follow Volto's listing block patterns and existing Svolto conventions
- **Svelte 5 patterns** - Use `$props()`, `$derived()`, `$effect()` runes throughout
- **Reuse existing code** - Image handling from TeaserBlockView, headline from GridBlockView
- **CSS custom properties** - For theming consistency across variations
- **TypeScript** - All new files should be TypeScript (`.ts`, `.svelte` with `lang="ts"`)
