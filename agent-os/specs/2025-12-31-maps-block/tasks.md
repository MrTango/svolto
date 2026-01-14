# Task Breakdown: Maps Block

## Overview

Total Tasks: 16

This spec implements a Maps Block component for Svolto that renders Google Maps embeds from Plone CMS content, following Volto's Maps block schema and matching patterns from the existing video block.

## Task List

### Frontend Components

#### Task Group 1: MapsBlockView Component

**Dependencies:** None

- [x] 1.0 Complete MapsBlockView component
  - [x] 1.1 Write 6 focused tests for MapsBlockView
    - Test iframe renders with correct src from data.url
    - Test iframe has required attributes (loading="lazy", referrerpolicy, allowfullscreen, title)
    - Test alignment CSS class pattern (has--align--full default, has--align--left/center/right)
    - Test alignment reads from data.styles.align with fallback to data.align
    - Test maps-wrapper container wraps the iframe
    - Test skip link and target anchor render with correct id pattern
  - [x] 1.2 Create `/workspace/src/lib/blocks/maps/` directory structure
    - Create MapsBlockView.svelte file
    - Follow video block directory structure pattern
  - [x] 1.3 Implement MapsBlockView component structure
    - Use Svelte 5 patterns with `$props()` for block props
    - Accept props: `key`, `id`, `data`, `metadata`, `properties`, `path`, `blocksConfig`
    - Use `$derived()` for alignment computation: `data?.styles?.align || data?.align || 'full'`
    - Use `$derived()` for blockClasses returning `block maps has--align--${alignment}`
  - [x] 1.4 Implement Google Maps iframe rendering
    - Set `src` attribute from `data.url`
    - Add `loading="lazy"` for performance
    - Add `referrerpolicy="no-referrer-when-downgrade"` for security
    - Add `allowfullscreen` attribute
    - Add `frameborder="0"` attribute
    - Set `title` from `data.title` with fallback `'Google Maps embed'`
  - [x] 1.5 Implement responsive wrapper
    - Wrap iframe in `div.maps-wrapper`
    - Add `role="region"` for landmark
    - Add `aria-label` from `data.title` with fallback `'Map location'`
    - Iframe should fill wrapper at 100% width and height
  - [x] 1.6 Implement accessibility features
    - Add skip link before wrapper: `<a href="#after-map-{id}" class="skip-map-link">Skip map</a>`
    - Add target anchor after wrapper: `<span id="after-map-{id}"></span>`
    - Add noscript fallback with link to Google Maps
  - [x] 1.7 Ensure MapsBlockView tests pass
    - Run ONLY the 6 tests written in 1.1
    - Verify component renders correctly
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**

- The 6 tests written in 1.1 pass
- Component renders Google Maps iframe with all required attributes
- Alignment classes apply correctly based on data.styles.align or data.align
- Accessibility features (skip link, aria attributes, noscript) are present
- Component follows Svelte 5 patterns matching video block

### CSS Styling

#### Task Group 2: Maps Block CSS

**Dependencies:** Task Group 1

- [x] 2.0 Complete Maps Block CSS styles
  - [x] 2.1 Write 2 focused tests for CSS class application
    - Test that block.maps element receives correct alignment class
    - Test that maps-wrapper element is present inside block.maps
  - [x] 2.2 Add Maps Block base styles to `/workspace/src/app.css`
    - Add CSS custom property `--maps-aspect-ratio: 16/9`
    - Add `.block.maps` base styling (margin, border-radius, overflow)
    - Add `.block.maps .maps-wrapper` with aspect-ratio and width: 100%
    - Add `.block.maps .maps-wrapper iframe` with width: 100%, height: 100%, border: 0
  - [x] 2.3 Add Maps Block alignment styles
    - `.block.maps.has--align--full` - width: 100%, float: none
    - `.block.maps.has--align--left` - float: left, width: 50%, margin-right
    - `.block.maps.has--align--center` - float: none, max-width: 640px, auto margins
    - `.block.maps.has--align--right` - float: right, width: 50%, margin-left
  - [x] 2.4 Add Maps Block mobile responsive styles
    - At 768px breakpoint, remove floats for left/right alignment
    - Stack full-width on mobile for all alignments
    - Center alignment max-width: 100% on mobile
  - [x] 2.5 Add skip link accessibility styles
    - `.skip-map-link` with sr-only pattern (visually hidden)
    - Focus state: visible, positioned appropriately
    - Match existing skip link patterns in codebase
  - [x] 2.6 Ensure CSS tests pass
    - Run ONLY the 2 tests written in 2.1
    - Verify CSS classes are applied correctly
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**

- The 2 tests written in 2.1 pass
- Maps block maintains 16:9 aspect ratio via CSS custom property
- All four alignment options render correctly
- Mobile responsive behavior removes floats at 768px breakpoint
- Skip link is visually hidden but accessible on keyboard focus

### Block Registration

#### Task Group 3: Block Registry Integration

**Dependencies:** Task Group 1

- [x] 3.0 Complete block registration
  - [x] 3.1 Write 1 focused test for block registration
    - Test that maps block is registered and exports correctly from blocks index
  - [x] 3.2 Add MapsBlockView import to `/workspace/src/lib/blocks/index.ts`
    - Import statement at top: `import MapsBlockView from './maps/MapsBlockView.svelte';`
    - Maintain alphabetical ordering of imports
  - [x] 3.3 Register maps block in blocks object
    - Add entry with `id: 'maps'`, `title: 'Maps'`, `view: MapsBlockView`
    - Insert in alphabetical order (after listing, before slate)
  - [x] 3.4 Ensure registration test passes
    - Run ONLY the test written in 3.1
    - Verify block is registered correctly
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**

- The 1 test written in 3.1 passes
- MapsBlockView is imported correctly
- Maps block is registered with correct id, title, and view
- Block registry maintains alphabetical ordering

### Testing

#### Task Group 4: Test Review and Gap Analysis

**Dependencies:** Task Groups 1-3

- [x] 4.0 Review existing tests and fill critical gaps only
  - [x] 4.1 Review tests from Task Groups 1-3
    - Review the 6 tests written for MapsBlockView (Task 1.1)
    - Review the 2 tests written for CSS (Task 2.1)
    - Review the 1 test written for registration (Task 3.1)
    - Total existing tests: 9 tests
  - [x] 4.2 Analyze test coverage gaps for Maps Block feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to this spec's feature requirements
    - Do NOT assess entire application test coverage
    - Prioritize edge cases: missing URL, missing title, noscript content
  - [x] 4.3 Write up to 5 additional strategic tests maximum
    - Test noscript fallback content with link to Google Maps
    - Test default title fallback when data.title is missing
    - Test default aria-label fallback when data.title is missing
    - Test block container renders even with empty data
    - Test iframe attributes for security (referrerpolicy)
  - [x] 4.4 Run feature-specific tests only
    - Run ONLY tests related to Maps Block (tests from 1.1, 2.1, 3.1, and 4.3)
    - Expected total: approximately 14 tests maximum
    - Do NOT run the entire application test suite
    - Verify all critical workflows pass

**Acceptance Criteria:**

- All feature-specific tests pass (approximately 14 tests total)
- Critical user workflows for Maps Block are covered
- No more than 5 additional tests added when filling in testing gaps
- Testing focused exclusively on Maps Block feature requirements

## Execution Order

Recommended implementation sequence:

1. **Frontend Components (Task Group 1)** - Create MapsBlockView component with all functionality
2. **CSS Styling (Task Group 2)** - Add responsive styles and alignment support (can run in parallel with Group 3)
3. **Block Registration (Task Group 3)** - Register block in index (can run in parallel with Group 2)
4. **Test Review and Gap Analysis (Task Group 4)** - Fill any critical test coverage gaps

## Reference Files

| Purpose | File Path |
|---------|-----------|
| Video Block (pattern reference) | `/workspace/src/lib/blocks/video/VideoBlockView.svelte` |
| Video Block Tests (pattern reference) | `/workspace/src/lib/blocks/video/VideoBlockView.svelte.test.ts` |
| Block Registry | `/workspace/src/lib/blocks/index.ts` |
| CSS Styles | `/workspace/src/app.css` (lines 365-445 for video block CSS pattern) |

## Technical Notes

- Use Svelte 5 patterns: `$props()` for props, `$derived()` for computed values
- Follow video block's iframe embed pattern for consistency
- CSS custom property pattern: `--maps-aspect-ratio: 16/9`
- Block class pattern: `block maps has--align--${alignment}`
- Wrapper class: `maps-wrapper` (similar to `video-wrapper`)
- Mobile breakpoint: 768px (consistent with video block)
- Data structure from Plone: `{ url, title, align }` following Volto's Maps block schema
