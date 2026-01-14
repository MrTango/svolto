# Task Breakdown: HTML Block

## Overview

Total Tasks: 8

This feature implements an HTML block component for Svolto that renders raw HTML content from Plone with styling variations support (alignment, custom CSS classes).

## Task List

### Frontend Component

#### Task Group 1: HTML Block Component

**Dependencies:** None

- [x] 1.0 Complete HTML block component
  - [x] 1.1 Write 4-6 focused tests for HtmlBlockView component
    - Test HTML content renders correctly using `{@html}` directive
    - Test empty state handling (empty string, undefined, whitespace-only returns nothing)
    - Test alignment class is applied correctly (`has--align--left`, `has--align--center`, `has--align--right`)
    - Test default alignment is `left` when `data.styles.align` is not specified
    - Test custom CSS class from `data.styles.customCss` is appended to class list
    - Use Vitest with `@testing-library/svelte` following ImageBlockView.svelte.test.ts pattern
  - [x] 1.2 Create HtmlBlockView.svelte component
    - Create directory: `src/lib/blocks/html/`
    - Create file: `src/lib/blocks/html/HtmlBlockView.svelte`
    - Use Svelte 5 `$props()` pattern: `let { key, id, data, metadata, properties, path, blocksConfig } = $props();`
    - Reference: VideoBlockView.svelte for props pattern
  - [x] 1.3 Implement empty state handling
    - Create `$derived()` for `hasContent` checking if `data.html` is non-empty and non-whitespace
    - Use conditional rendering: only render wrapper div when hasContent is true
    - Reference: DescriptionBlockView.svelte for simple conditional pattern
  - [x] 1.4 Implement HTML content rendering
    - Use Svelte `{@html data.html}` directive inside wrapper div
    - No sanitization needed (handled by Volto)
  - [x] 1.5 Implement alignment support
    - Create `$derived()` for alignment: `data?.styles?.align || 'left'`
    - Apply `has--align--{alignment}` class pattern
    - Reference: VideoBlockView.svelte alignment implementation
  - [x] 1.6 Implement dynamic CSS class building
    - Create `$derived()` function for blockClasses following TeaserBlockView pattern
    - Build classes array: `['block', 'html']`
    - Add alignment class: `has--align--${alignment}`
    - Append `data?.styles?.customCss` when present
    - Return joined class string
  - [x] 1.7 Ensure HTML block component tests pass
    - Run ONLY the 4-6 tests written in 1.1
    - Command: `pnpm test:unit -- --run src/lib/blocks/html/`
    - Verify all component behaviors work correctly

**Acceptance Criteria:**

- Component renders HTML content using `{@html}` directive
- Empty/whitespace content renders nothing
- Alignment classes applied correctly with `left` as default
- Custom CSS class support works
- All 4-6 tests pass

### Block Registration

#### Task Group 2: Block Registry Integration

**Dependencies:** Task Group 1

- [x] 2.0 Complete block registration
  - [x] 2.1 Write 1-2 focused tests for block registration
    - Test HTML block is registered in blocks object
    - Test registration has correct id, title, and view component
    - Reference: `src/lib/blocks/index.test.ts` pattern
  - [x] 2.2 Register HtmlBlockView in block registry
    - Add import: `import HtmlBlockView from './html/HtmlBlockView.svelte';`
    - Add to blocks object:
      ```typescript
      html: {
        id: 'html',
        title: 'HTML',
        view: HtmlBlockView
      }
      ```
    - Maintain alphabetical ordering of imports and block entries
  - [x] 2.3 Ensure block registration tests pass
    - Run ONLY the 1-2 tests written in 2.1
    - Command: `pnpm test:unit -- --run src/lib/blocks/index.test.ts`
    - Verify block is properly exported and accessible

**Acceptance Criteria:**

- HtmlBlockView is imported and registered in index.ts
- Block has id: `html`, title: `HTML`
- Registration follows existing pattern
- All 1-2 tests pass

### Testing

#### Task Group 3: Test Review and Integration Verification

**Dependencies:** Task Groups 1-2

- [x] 3.0 Review and verify complete implementation
  - [x] 3.1 Review tests from Task Groups 1-2
    - Review the 4-6 tests written for HtmlBlockView (Task 1.1)
    - Review the 1-2 tests written for block registration (Task 2.1)
    - Total existing tests: approximately 5-8 tests
  - [x] 3.2 Analyze test coverage gaps for HTML block feature
    - Identify any critical behaviors lacking test coverage
    - Focus ONLY on HTML block feature requirements from spec
    - Prioritize integration with RenderBlocks if needed
  - [x] 3.3 Write up to 2 additional tests if critical gaps identified
    - Add maximum of 2 new tests to fill identified gaps
    - Consider edge cases only if business-critical (e.g., malformed alignment value)
    - Skip non-critical edge cases per testing standards
  - [x] 3.4 Run all HTML block feature tests
    - Run all tests related to HTML block feature
    - Command: `pnpm test:unit -- --run src/lib/blocks/html/ src/lib/blocks/index.test.ts`
    - Expected total: approximately 5-10 tests maximum
    - Verify all critical workflows pass

**Acceptance Criteria:**

- All feature-specific tests pass (approximately 5-10 tests total)
- Critical user workflows for HTML block are covered
- No more than 2 additional tests added when filling gaps
- Testing focused exclusively on HTML block feature requirements

## Execution Order

Recommended implementation sequence:

1. Frontend Component (Task Group 1) - Create and test the HtmlBlockView component
2. Block Registration (Task Group 2) - Register the component in the block system
3. Test Review (Task Group 3) - Final verification and gap analysis

## Reference Files

| File | Purpose |
|------|---------|
| `src/lib/blocks/video/VideoBlockView.svelte` | Alignment handling pattern |
| `src/lib/blocks/teaser/TeaserBlockView.svelte` | Dynamic CSS class building |
| `src/lib/blocks/description/DescriptionBlockView.svelte` | Simple block pattern |
| `src/lib/blocks/index.ts` | Block registration pattern |
| `src/lib/blocks/image/ImageBlockView.svelte.test.ts` | Test file pattern |
| `src/lib/blocks/index.test.ts` | Registry test pattern |

## Technical Notes

- Use Svelte 5 runes: `$props()` and `$derived()`
- CSS class pattern: `block html has--align--{alignment} {customCss}`
- No sanitization required - Volto handles this during editing
- Trust all content from Plone backend as pre-sanitized
