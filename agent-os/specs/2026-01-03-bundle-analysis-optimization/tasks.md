# Task Breakdown: Bundle Analysis and Optimization

## Overview

Total Tasks: 26

This spec focuses on adding bundle visualization tooling and optimizing JavaScript/CSS bundle sizes through dynamic imports and CSS optimization. The work is organized into sequential phases: tooling setup, baseline measurement, optimization implementation, and verification.

## Task List

### Tooling & Measurement Layer

#### Task Group 1: Bundle Analysis Tooling Setup

**Dependencies:** None

- [x] 1.0 Complete bundle analysis tooling setup
  - [x] 1.1 Install vite-bundle-analyzer as dev dependency
    - Run `pnpm add -D vite-bundle-analyzer`
    - Verify package added to package.json devDependencies
  - [x] 1.2 Create `pnpm analyze` script in package.json
    - Add script: `"analyze": "ANALYZE=true vite build"`
    - Script should trigger analyzer during build
  - [x] 1.3 Configure vite-bundle-analyzer in vite.config.ts
    - Import the analyzer plugin
    - Add conditional plugin activation based on ANALYZE env variable
    - Configure output to show chunk sizes, dependencies, and module composition
    - Preserve existing tailwindcss and sveltekit plugin configuration
  - [x] 1.4 Verify analyzer generates reports
    - Run `pnpm analyze` and confirm HTML report is generated
    - Confirm report opens in browser showing bundle visualization

**Acceptance Criteria:**

- vite-bundle-analyzer installed as dev dependency
- `pnpm analyze` script exists and runs successfully
- Analyzer plugin conditionally enabled only during analysis builds
- Bundle visualization report generated and viewable

#### Task Group 2: Baseline Measurement and Documentation

**Dependencies:** Task Group 1

- [x] 2.0 Complete baseline measurement
  - [x] 2.1 Run initial bundle analysis
    - Execute `pnpm analyze` to generate baseline report
    - Capture screenshot or save report for reference
  - [x] 2.2 Document baseline bundle sizes
    - Record client-side JavaScript chunk sizes (currently ~142KB/46KB gzip)
    - Record CSS output size (currently ~60.9KB)
    - Note the largest chunks and their primary contributors
  - [x] 2.3 Create baseline documentation file
    - Create `planning/baseline-measurements.md` in spec directory
    - Include chunk breakdown: name, size (raw), size (gzip)
    - Document top 5 largest modules/dependencies
    - Include current block registry import pattern observations
  - [x] 2.4 Identify optimization candidates
    - List blocks that import heavy dependencies (Slate, Embla Carousel)
    - Note GridBlockView cascading imports concern
    - Document ImageGalleryVariation (14KB source) as lazy load candidate
    - Review listing variations for dynamic import potential

**Acceptance Criteria:**

- Baseline bundle sizes documented with specific numbers
- Top contributors to bundle size identified
- Optimization candidates prioritized by potential impact
- Documentation saved to `planning/baseline-measurements.md`

### Dynamic Import Layer

#### Task Group 3: Listing Variations Dynamic Imports

**Dependencies:** Task Group 2

- [x] 3.0 Complete listing variations dynamic imports
  - [x] 3.1 Write 2-4 focused tests for variation loading
    - Test that DefaultVariation loads synchronously (common case)
    - Test that ImageGalleryVariation loads dynamically
    - Test fallback to DefaultVariation for unknown variations
  - [x] 3.2 Modify `src/lib/blocks/listing/variations/index.ts`
    - Keep DefaultVariation and SummaryVariation as synchronous imports (common, lightweight)
    - Convert ImageGalleryVariation to dynamic import
    - Update variationRegistry to support both sync and async components
  - [x] 3.3 Update `getVariationComponent()` function
    - Return promise-based component loading for heavy variations
    - Maintain sync return for common variations (default, summary)
    - Preserve fallback behavior to DefaultVariation
  - [x] 3.4 Update ListingBlockView.svelte
    - Handle async variation component loading
    - Use existing loading state pattern if available
    - Ensure SSR compatibility with dynamic imports
  - [x] 3.5 Run variation-specific tests
    - Execute tests from 3.1 to verify functionality
    - Verify ImageGalleryVariation renders correctly after lazy load

**Acceptance Criteria:**

- Tests from 3.1 pass
- ImageGalleryVariation loads dynamically (separate chunk)
- DefaultVariation and SummaryVariation load synchronously
- Fallback behavior preserved for unknown variations
- SSR still works correctly

#### Task Group 4: Block Registry Optimization

**Dependencies:** Task Group 3 (completed - can use similar pattern)

- [x] 4.0 Complete block registry optimization
  - [x] 4.1 Write 2-4 focused tests for block loading
    - Test that common blocks (slate, title, description) load immediately
    - Test that heavy blocks load dynamically
    - Test RenderBlocks.svelte handles async block components
  - [x] 4.2 Analyze block usage patterns
    - Identify common blocks that should load eagerly: slate, title, description, introduction
    - Identify heavy blocks for lazy loading: gridBlock, listing, video, maps, slateTable
    - Document decision rationale based on bundle analysis from Task Group 2
  - [x] 4.3 Refactor `src/lib/blocks/index.ts` for hybrid loading
    - Keep synchronous imports for common blocks: slate, title, description, introduction, image, teaser
    - Convert to dynamic imports for heavy blocks: gridBlock, listing, video, maps, slateTable, html, toc
    - Maintain the `blocksConfig[blockType]?.view` lookup pattern
    - Export type definitions for lazy-loadable block views
  - [x] 4.4 Update RenderBlocks.svelte for async components
    - Handle both sync and async component references
    - Use Svelte's `{#await}` block pattern if needed
    - Maintain SSR compatibility
    - Preserve existing block rendering logic and error handling
  - [x] 4.5 Run block registry tests
    - Execute tests from 4.1
    - Verify all block types render correctly
    - Confirm common blocks load without delay

**Acceptance Criteria:**

- Tests from 4.1 pass
- Common blocks (slate, title, description) load synchronously
- Heavy blocks create separate chunks via dynamic imports
- RenderBlocks.svelte handles both sync and async components
- Volto-like registry API pattern preserved

### CSS Optimization Layer

#### Task Group 5: CSS Optimization

**Dependencies:** Task Group 2

- [x] 5.0 Complete CSS optimization
  - [x] 5.1 Verify Tailwind CSS 4 content detection
    - Review `@tailwindcss/vite` plugin configuration
    - Confirm content detection scans all .svelte, .ts, .js files in src/
    - Check that no explicit content paths are needed with Tailwind CSS 4
  - [x] 5.2 Audit `src/app.css` for unused styles
    - Review 827 lines for styles not matching any components
    - Identify component styles that may be dead code
    - Note styles in `@layer base` and `@layer components` sections
  - [x] 5.3 Remove confirmed unused styles from app.css
    - Remove styles for non-existent components
    - Remove duplicate or redundant CSS rules
    - Preserve all styles used by current components
    - Document removed styles and rationale
  - [x] 5.4 Run build and verify CSS output
    - Execute `pnpm build` to generate production CSS
    - Compare CSS output size to baseline (60.9KB target for reduction)
    - Verify no visual regressions in styled components

**Acceptance Criteria:**

- Tailwind CSS content detection confirmed working
- Unused styles identified and removed from app.css
- CSS output size reduced from baseline
- No visual regressions in component styles
- Build completes successfully

### Verification Layer

#### Task Group 6: Final Measurement and Verification

**Dependencies:** Task Groups 3, 4, 5

- [x] 6.0 Complete final measurement and verification
  - [x] 6.1 Run final bundle analysis
    - Execute `pnpm analyze` to generate post-optimization report
    - Compare to baseline measurements from Task Group 2
  - [x] 6.2 Document optimization results
    - Record new client-side JavaScript chunk sizes
    - Record new CSS output size
    - Calculate percentage improvements from baseline
    - Note new chunk structure (lazy-loaded blocks/variations)
  - [x] 6.3 Run full test suite for regression check
    - Execute `pnpm test:unit -- --run` to run all unit tests
    - Verify no regressions in existing functionality
    - Confirm SSR still works with `pnpm build && pnpm preview`
  - [x] 6.4 Create final optimization report
    - Update `planning/baseline-measurements.md` with final results
    - Add "After Optimization" section with measurements
    - Document which optimizations had the most impact
    - Note any recommendations for future optimization

**Acceptance Criteria:**

- Bundle sizes reduced from baseline measurements
- All existing tests pass
- SSR functionality preserved
- Final measurements documented with comparison to baseline
- Optimization impact quantified

## Execution Order

Recommended implementation sequence:

1. **Tooling Setup** (Task Group 1) - Required first to enable visibility into bundles
2. **Baseline Measurement** (Task Group 2) - Document current state before changes
3. **CSS Optimization** (Task Group 5) - Can proceed in parallel with dynamic imports, low risk
4. **Listing Variations** (Task Group 3) - Smaller scope, validate dynamic import pattern
5. **Block Registry** (Task Group 4) - Apply learned patterns to full block system
6. **Final Verification** (Task Group 6) - Measure and document all improvements

## Technical Notes

### SSR Compatibility

- Dynamic imports must work with SvelteKit's server-side rendering
- Use Vite's `import()` syntax which supports automatic code splitting
- Test both server and client rendering after changes

### Preserving API Patterns

- Block registry must maintain `blocksConfig[blockType]?.view` lookup
- Variation registry must preserve `getVariationComponent()` fallback behavior
- Changes should be transparent to existing component consumers

### Files to Modify

- `/workspace/vite.config.ts` - Add analyzer plugin
- `/workspace/package.json` - Add analyze script and dependency
- `/workspace/src/lib/blocks/index.ts` - Hybrid import pattern
- `/workspace/src/lib/blocks/listing/variations/index.ts` - Dynamic variation imports
- `/workspace/src/lib/blocks/listing/ListingBlockView.svelte` - Async variation handling
- `/workspace/src/lib/RenderBlocks.svelte` - Async block component handling
- `/workspace/src/app.css` - Remove unused styles

## Task Group 5 Implementation Notes

### 5.1 Tailwind CSS 4 Content Detection
The `@tailwindcss/vite` plugin is configured in `vite.config.ts` and automatically scans all files in the project for Tailwind class usage. No explicit content paths are needed with Tailwind CSS 4 as it uses intelligent automatic content detection.

### 5.2 CSS Audit Findings
Audited all 827 lines of `src/app.css`:
- All container classes (`container-layout`, `container-default`, `container-narrow`) are actively used
- All site layout classes (`site-wrapper`, `site-header`, `site-footer`, etc.) are actively used
- All slate block classes are actively used by slate components
- All table, teaser, video, and maps block styles are actively used
- Header context overrides for nav and lang-link are needed for WCAG AA compliance

**Unused styles identified:**
- `.full-width` utility class (lines 95-99) - not referenced in any component

### 5.3 Removed Styles
Removed the unused `.full-width` utility class (5 lines):
```css
/* Full-width utility - breaks out of container constraints */
.full-width {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}
```
This class was never used in any component. The file went from 827 lines to 821 lines.

### 5.4 Build Verification
- Build completed successfully
- CSS output size: 42,248 bytes (down from 42,301 bytes baseline)
- All 474 unit tests pass
- No visual regressions (all component styles preserved)

## Task Group 6 Implementation Notes

### 6.1 Final Bundle Analysis
Ran `CI=true pnpm analyze` to generate post-optimization report. Key findings:
- Total client-side JS: 282.27 KB (42 chunks)
- Main chunk (nodes/0): 34.76 KB (down from 142.49 KB)
- CSS split across 12 files with main chunk at 42.71 KB

### 6.2 Optimization Results Summary

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Main chunk JS | 142.49 KB | 34.76 KB | **-75.6%** |
| Main chunk gzip | 45.98 KB | 11.10 KB | **-75.9%** |
| Initial CSS | 61.38 KB | 42.71 KB | **-30.4%** |
| JS chunks | ~21 | 42 | Code splitting working |
| CSS chunks | 1 | 12 | Component CSS splitting |

### 6.3 Test Suite Results
- All 474 unit tests pass
- SSR build completes successfully
- Dynamic imports work with SvelteKit SSR

### 6.4 Most Impactful Optimizations
1. **Block Registry Hybrid Loading** - 75.6% main chunk reduction
2. **CSS Code Splitting** - 30.4% initial CSS reduction
3. **Variation Dynamic Imports** - Deferred ~10-15 KB for gallery carousel
