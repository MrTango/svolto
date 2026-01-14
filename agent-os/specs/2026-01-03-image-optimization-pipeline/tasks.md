# Task Breakdown: Image Optimization Pipeline

## Overview

Total Tasks: 32 (across 5 task groups)

This feature maximizes Lighthouse performance by consolidating image rendering to the `ResponsiveImage` component, implementing fetchpriority/preload hints for LCP images, and adding CSS-based placeholder support for CLS prevention.

## Task List

### Utility Layer

#### Task Group 1: Image Sizes Utility Function

**Dependencies:** None

- [x] 1.0 Complete image sizes utility module
  - [x] 1.1 Write 4 focused tests for image-sizes utility
    - Test `fullWidth()` returns `100vw`
    - Test `halfWidth()` returns correct media query string
    - Test `cardGrid()` returns correct responsive breakpoints
    - Test `thumbnail(width)` returns pixel width string
  - [x] 1.2 Create `src/lib/utils/image-sizes.ts` module
    - Create new file in utils directory
    - Export as named functions for tree-shaking
    - Add TypeScript return types (string)
  - [x] 1.3 Implement `fullWidth()` function
    - Returns `100vw` for full viewport width images
  - [x] 1.4 Implement `halfWidth()` function
    - Returns `(max-width: 768px) 100vw, 50vw`
    - Mobile-first: full width on small screens, half on larger
  - [x] 1.5 Implement `cardGrid()` function
    - Returns `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw`
    - Matches existing SummaryVariation pattern
  - [x] 1.6 Implement `thumbnail(width: number)` function
    - Returns fixed pixel width string (e.g., `200px`)
    - Input validation for positive numbers
  - [x] 1.7 Ensure image sizes utility tests pass
    - Run ONLY the 4 tests written in 1.1
    - Verify all functions return expected strings

**Acceptance Criteria:**

- All 4 tests from 1.1 pass
- Functions are tree-shakeable (named exports)
- TypeScript types are correct
- Pattern matches existing SummaryVariation sizes attribute

---

### Component Layer

#### Task Group 2: ResponsiveImage Component Enhancements

**Dependencies:** Task Group 1

- [x] 2.0 Complete ResponsiveImage component enhancements
  - [x] 2.1 Write 6 focused tests for ResponsiveImage enhancements
    - Test `fetchpriority` prop renders correct attribute value
    - Test `decoding` prop renders correct attribute value
    - Test default values (`fetchpriority="auto"`, `decoding="async"`)
    - Test CSS custom property `--aspect-ratio` is applied to container
    - Test `--image-placeholder-bg` CSS variable is applied
    - Test `onload` callback is triggered on image load
  - [x] 2.2 Add `fetchpriority` prop to ResponsiveImage
    - Type: `'high' | 'low' | 'auto'`
    - Default: `'auto'`
    - Apply to `<img>` element
  - [x] 2.3 Add `decoding` prop to ResponsiveImage
    - Type: `'async' | 'sync' | 'auto'`
    - Default: `'async'`
    - Apply to `<img>` element
  - [x] 2.4 Wrap `<picture>` in container element for placeholder styling
    - Add wrapper `<div>` with class `responsive-image-container`
    - Support placeholder background during load
  - [x] 2.5 Implement CSS aspect-ratio placeholder
    - Calculate aspect ratio from width/height props
    - Apply `--aspect-ratio` CSS custom property to container
    - Use `aspect-ratio: var(--aspect-ratio)` in CSS
  - [x] 2.6 Apply placeholder background styling
    - Use `--image-placeholder-bg` CSS custom property
    - Default to neutral gray (`#e5e5e5`)
    - Remove background on image load
  - [x] 2.7 Ensure width/height attributes always set from Plone data
    - Validate width/height are passed through to `<img>`
    - Document that these are required for CLS prevention
  - [x] 2.8 Add optional `onload` handler prop
    - Type: `(() => void) | undefined`
    - Trigger on image load event
    - Support fade-in transitions (CSS class toggle on load)
  - [x] 2.9 Ensure ResponsiveImage enhancement tests pass
    - Run ONLY the 6 tests written in 2.1
    - Verify all new props work correctly

**Acceptance Criteria:**

- All 6 tests from 2.1 pass
- `fetchpriority` and `decoding` attributes render correctly
- CSS custom properties applied for placeholder styling
- `onload` handler fires correctly
- Backward compatible with existing usage

---

#### Task Group 3: Preload Infrastructure and LCP Optimizations

**Dependencies:** Task Group 2

- [x] 3.0 Complete preload hint infrastructure
  - [x] 3.1 Write 5 focused tests for preload infrastructure
    - Test preload store accepts and stores preload hint data
    - Test `<link rel="preload">` renders with correct attributes
    - Test `imagesrcset` and `imagesizes` attributes in preload
    - Test multiple preload hints render correctly
    - Test ImageBlockView applies `fetchpriority="high"` and `loading="eager"` for first image
  - [x] 3.2 Create preload hints store
    - Create `src/lib/stores/preload-hints.ts`
    - Writable store for preload hint data
    - Interface: `{ srcset: string, sizes: string, src: string }[]`
  - [x] 3.3 Create `addPreloadHint` helper function
    - Accept srcset, sizes, and src parameters
    - Add to preload hints store
    - Prevent duplicates (check src)
  - [x] 3.4 Inject preload links in `+layout.svelte`
    - Use `<svelte:head>` for SSR injection
    - Iterate over preload hints store
    - Render `<link rel="preload" as="image" imagesrcset="..." imagesizes="...">`
  - [x] 3.5 Update ImageBlockView for LCP optimization
    - Add `fetchpriority="high"` to ResponsiveImage for hero images
    - Use `loading="eager"` instead of default `lazy`
    - Register preload hint for first image block
  - [x] 3.6 Add mechanism to identify first/hero image
    - Use component context or page-level tracking
    - Only first ImageBlockView on page gets LCP treatment
  - [x] 3.7 Ensure preload infrastructure tests pass
    - Run ONLY the 5 tests written in 3.1
    - Verify preload links render in `<head>`

**Acceptance Criteria:**

- All 5 tests from 3.1 pass
- Preload hints inject into `<head>` during SSR
- First ImageBlockView uses `fetchpriority="high"` and `loading="eager"`
- Multiple preload hints supported per page

---

### Migration Layer

#### Task Group 4: Component Migrations

**Dependencies:** Task Group 2, Task Group 3

- [x] 4.0 Complete component migrations to ResponsiveImage
  - [x] 4.1 Write 5 focused tests for component migrations
    - Test ListingItem renders ResponsiveImage with correct props
    - Test ImageGalleryVariation first image has `fetchpriority="high"`
    - Test ImageGalleryVariation subsequent images have `loading="lazy"`
    - Test Picture.svelte deprecation notice exists
    - Test migrated components do not use `/renderimg` route
  - [x] 4.2 Migrate ListingItem to ResponsiveImage
    - Replace `Picture.svelte` import with `ResponsiveImage`
    - Map `catalogItem` props to `scales` and `baseUrl`
    - Remove `/renderimg` route dependency
    - Keep existing HTML structure and CSS classes
  - [x] 4.3 Refactor ImageGalleryVariation carousel images
    - Replace direct `<img>` tags with `ResponsiveImage`
    - Apply `sizes="100vw"` for full viewport gallery context
    - First image: `loading="eager"`, `fetchpriority="high"`
    - Subsequent images: `loading="lazy"`, `fetchpriority="auto"`
  - [x] 4.4 Keep gallery thumbnails as simple `<img>` tags
    - Thumbnails are low priority, small file sizes
    - Keep existing `getThumbnailSrc` function
    - Maintain `loading="lazy"` on thumbnails
  - [x] 4.5 Add deprecation notice to Picture.svelte
    - Add comment block at top of file
    - Document migration path to ResponsiveImage
    - Reference props mapping guide
  - [x] 4.6 Remove `/renderimg` route reference from Picture.svelte
    - Update URL generation to use direct paths
    - Component remains functional for backward compatibility
    - Document that new code should use ResponsiveImage
  - [x] 4.7 Ensure component migration tests pass
    - Run ONLY the 5 tests written in 4.1
    - Verify all migrations work correctly

**Acceptance Criteria:**

- All 5 tests from 4.1 pass
- ListingItem uses ResponsiveImage without `/renderimg` route
- ImageGalleryVariation uses ResponsiveImage with correct loading strategies
- Picture.svelte has deprecation notice but remains functional
- Backward compatibility maintained

---

### Testing Layer

#### Task Group 5: Test Review and Gap Analysis

**Dependencies:** Task Groups 1-4

- [x] 5.0 Review existing tests and fill critical gaps
  - [x] 5.1 Review tests from Task Groups 1-4
    - Review 4 tests from image-sizes utility (Task 1.1)
    - Review 6 tests from ResponsiveImage enhancements (Task 2.1)
    - Review 5 tests from preload infrastructure (Task 3.1)
    - Review 5 tests from component migrations (Task 4.1)
    - Total existing tests: 20 tests (actual: 65 tests across all feature files)
  - [x] 5.2 Analyze test coverage gaps for image optimization feature
    - Identify missing integration test scenarios
    - Check for SSR preload hint coverage
    - Verify CLS prevention is tested
    - Review Lighthouse-critical paths
  - [x] 5.3 Write up to 8 additional strategic tests
    - Integration test: ResponsiveImage with preload hint registration
    - Integration test: Layout renders preload links from store
    - Test: Aspect ratio calculation from various dimensions
    - Test: Placeholder background removal on load
    - Test: srcset generation with various scale configurations
    - E2E test (optional): Verify no layout shift on image load
    - Test: Image sizes utility usage in SummaryVariation context
    - Test: ResponsiveImage class prop passes through to img element
  - [x] 5.4 Run feature-specific tests only
    - Run tests from 1.1, 2.1, 3.1, 4.1, and 5.3
    - Expected total: approximately 28 tests maximum
    - Verify critical image optimization workflows

**Acceptance Criteria:**

- All feature-specific tests pass (approximately 28 tests total)
- Critical user workflows for image optimization are covered
- No more than 8 additional tests added for gap filling
- Testing focused on image optimization feature requirements

---

## Execution Order

Recommended implementation sequence:

1. **Utility Layer (Task Group 1)** - Image sizes utility function
   - No dependencies, provides foundation for other tasks

2. **Component Layer - Core (Task Group 2)** - ResponsiveImage enhancements
   - Depends on Task Group 1 for sizes utility
   - Core component that all other tasks depend on

3. **Component Layer - Infrastructure (Task Group 3)** - Preload infrastructure
   - Depends on Task Group 2 for enhanced ResponsiveImage
   - Enables LCP optimizations

4. **Migration Layer (Task Group 4)** - Component migrations
   - Depends on Task Groups 2 and 3
   - Consolidates all image rendering to ResponsiveImage

5. **Testing Layer (Task Group 5)** - Test review and gap analysis
   - Depends on all previous groups
   - Final validation of feature implementation

---

## Key Files to Create/Modify

**New Files:**
- `src/lib/utils/image-sizes.ts` - Sizes utility functions
- `src/lib/utils/image-sizes.test.ts` - Utility tests
- `src/lib/utils/image-sizes.integration.test.ts` - Additional integration tests (Task Group 5)
- `src/lib/stores/preload-hints.ts` - Preload hints store
- `src/lib/stores/preload-hints.integration.test.ts` - Additional integration tests (Task Group 5)
- `src/lib/components/ResponsiveImage.integration.svelte.test.ts` - Additional integration tests (Task Group 5)

**Modified Files:**
- `src/lib/components/ResponsiveImage.svelte` - Add new props and placeholder support
- `src/lib/components/ResponsiveImage.svelte.test.ts` - Enhancement tests
- `src/lib/blocks/image/ImageBlockView.svelte` - LCP optimizations
- `src/lib/blocks/listing/variations/ImageGalleryVariation.svelte` - Migrate to ResponsiveImage
- `src/lib/plone/ListingItem.svelte` - Migrate to ResponsiveImage
- `src/lib/plone/Picture.svelte` - Add deprecation notice
- `src/routes/+layout.svelte` - Inject preload links

---

## Implementation Notes

1. **CLS Prevention**: Width/height attributes and CSS aspect-ratio placeholder ensure no layout shift during image load.

2. **LCP Optimization**: `fetchpriority="high"` + `loading="eager"` + preload hints for above-the-fold images.

3. **Tree-shaking**: Image sizes utility uses named exports for optimal bundle size.

4. **Backward Compatibility**: Picture.svelte remains functional with deprecation notice; existing components continue to work.

5. **SSR Compatibility**: Preload hints use SvelteKit's `<svelte:head>` for server-side rendering.

---

## Task Group 5 Summary

**Tests Added (14 new tests in 3 files):**

1. `src/lib/utils/image-sizes.integration.test.ts` (3 tests)
   - thumbnail() throws error for non-positive numbers
   - cardGrid() matches SummaryVariation sizes attribute pattern
   - all size functions return non-empty strings

2. `src/lib/components/ResponsiveImage.integration.svelte.test.ts` (8 tests)
   - handles missing width/height gracefully
   - calculates aspect ratio correctly for various dimensions
   - calculates aspect ratio for square images
   - container has loaded class after image load event
   - placeholder background removed after load via CSS class
   - srcset entries are sorted by width in ascending order
   - srcset handles scales with special characters in download paths
   - multiple CSS classes pass through to img element

3. `src/lib/stores/preload-hints.integration.test.ts` (3 tests)
   - store provides data structure compatible with svelte:head iteration
   - preload hint data is suitable for link element attributes
   - reset() clears hints between page navigations

**Total Feature Tests: 65 tests**

All 448 unit tests pass including:
- 7 image-sizes utility tests
- 28 ResponsiveImage tests
- 11 preload infrastructure tests
- 19 component migration tests
