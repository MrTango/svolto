# Task Breakdown: Teaser Block

## Overview

Total Tasks: 7 Task Groups

This feature creates a fresh teaser block component for Svolto that renders teaser content from Plone CMS, supporting multiple image alignments, responsive images via picture/srcset, content-type specific templates (starting with Event), and Volto-compatible CSS variable naming.

## Task List

### Setup & Foundation

#### Task Group 1: Block Registration and Base Structure

**Dependencies:** None

- [x] 1.0 Complete block registration and base structure
  - [x] 1.1 Write 3-4 focused tests for TeaserBlockView base functionality
    - Test that component renders with minimal valid data
    - Test that teaser wraps content in a link to target href
    - Test that title renders as h2 element
    - Test that component handles missing optional fields gracefully
  - [x] 1.2 Create fresh `TeaserBlockView.svelte` in `src/lib/blocks/teaser/`
    - Accept standard block props: `key`, `id`, `data`, `metadata`, `properties`, `path`
    - Use Svelte 5 `$props()` pattern matching existing blocks
    - Follow TypeScript conventions from `SlateTableBlockView.svelte`
  - [x] 1.3 Implement base teaser structure
    - Wrap entire teaser in `<a>` element linking to `data.href[0]['@id']`
    - Render `head_title` (kicker) when present
    - Render `title` in `<h2>` element
    - Render `description` when `data.hide_description` is not true
    - Handle both `data.overwrite` true (customized) and false (inherited from target)
  - [x] 1.4 Register teaser block in `src/lib/blocks/index.ts`
    - Import TeaserBlockView
    - Add to blocks object with id: `teaser`, title: `Teaser`
    - Follow existing block configuration pattern
  - [x] 1.5 Ensure base structure tests pass
    - Run ONLY the 3-4 tests written in 1.1
    - Verify component renders and links correctly

**Acceptance Criteria:**

- The 3-4 tests written in 1.1 pass
- Teaser block is registered and renders basic content
- Link wraps entire teaser correctly
- Title uses h2 semantic HTML

---

### Core Component Development

#### Task Group 2: Responsive Image Handling

**Dependencies:** Task Group 1

- [x] 2.0 Complete responsive image implementation
  - [x] 2.1 Write 3-4 focused tests for image functionality
    - Test that `<picture>` element renders with srcset
    - Test srcset builds correctly from `image_scales` data
    - Test that teaser renders without image when no image data present
    - Test `loading="lazy"` attribute is applied
  - [x] 2.2 Implement image srcset building logic
    - Extract image data from `data.preview_image` or `data.href[0].image_scales`
    - Build srcset from image scales: `${url}/${value.download} ${value.width}w`
    - Reuse pattern from `ImageBlockView.svelte`
  - [x] 2.3 Create `<picture>` element structure
    - Use `<picture><source srcset /><img ... /></picture>` pattern
    - Include `sizes` attribute: `(max-width: 768px) 100vw, 50vw`
    - Set `loading="lazy"` on img element
    - Use appropriate alt text from data
  - [x] 2.4 Implement graceful handling without images
    - Check for image via `data.preview_image`, target's `hasPreviewImage`, or `image_field`
    - Render teaser content without `.image-wrapper` when no image available
    - Ensure text content expands to fill available width
  - [x] 2.5 Ensure image tests pass
    - Run ONLY the 3-4 tests written in 2.1
    - Verify srcset generation and fallback behavior

**Acceptance Criteria:**

- The 3-4 tests written in 2.1 pass
- Images render with proper srcset for responsive loading
- Teasers without images display correctly
- Lazy loading is applied to all teaser images

---

#### Task Group 3: Alignment Options

**Dependencies:** Task Group 2

- [x] 3.0 Complete alignment implementation
  - [x] 3.1 Write 4-5 focused tests for alignment functionality
    - Test left alignment applies `has--align--left` class
    - Test right alignment applies `has--align--right` class
    - Test center alignment applies `has--align--center` class
    - Test default alignment is left when not specified
    - Test alignment class is applied to block container
  - [x] 3.2 Implement alignment class computation
    - Read alignment from `data.styles.align`
    - Default to `left` when not specified
    - Use `$derived()` pattern from SlateTableBlockView for dynamic classes
  - [x] 3.3 Apply alignment CSS classes
    - Add `.has--align--left`, `.has--align--right`, `.has--align--center` to container
    - Use BEM-style class naming: `.block.teaser`, `.teaser-item`, `.image-wrapper`, `.content`, `.headline`
  - [x] 3.4 Ensure alignment tests pass
    - Run ONLY the 4-5 tests written in 3.1
    - Verify correct classes applied for each alignment option

**Acceptance Criteria:**

- The 4-5 tests written in 3.1 pass
- All three alignment options apply correct CSS classes
- Default alignment falls back to left
- CSS class names follow BEM conventions

---

### Content-Type Templates

#### Task Group 4: Template Registration Mechanism

**Dependencies:** Task Group 1

- [x] 4.0 Complete template registration system
  - [x] 4.1 Write 3-4 focused tests for template registration
    - Test `getTemplateForContentType('Event')` returns EventTeaserTemplate
    - Test `getTemplateForContentType('Document')` returns default template
    - Test `getTemplateForContentType(undefined)` returns default template
    - Test template registry exports correctly
  - [x] 4.2 Create template registry in `src/lib/blocks/teaser/templates/index.ts`
    - Export `getTemplateForContentType(contentType: string)` function
    - Create registry object keyed by Plone content type
    - Return default template when no content-type specific template exists
  - [x] 4.3 Create `DefaultTeaserTemplate.svelte` component
    - Accept teaser data as props
    - Render standard teaser fields (image, head_title, title, description)
    - Follow existing component patterns
  - [x] 4.4 Integrate template lookup in TeaserBlockView
    - Look up template using `data.href[0]['@type']` from target content
    - Dynamically render appropriate template component
    - Pass required data to template
  - [x] 4.5 Ensure template registration tests pass
    - Run ONLY the 3-4 tests written in 4.1
    - Verify template lookup works correctly

**Acceptance Criteria:**

- The 3-4 tests written in 4.1 pass
- Template registry correctly maps content types to templates
- Default template is used for unregistered content types
- TeaserBlockView dynamically selects correct template

---

#### Task Group 5: Event Content-Type Template

**Dependencies:** Task Group 4

- [x] 5.0 Complete Event template implementation
  - [x] 5.1 Write 4-5 focused tests for Event template
    - Test event date displays correctly
    - Test time is hidden when `whole_day` is true
    - Test time displays when `whole_day` is false
    - Test location renders when present
    - Test standard teaser fields still render
  - [x] 5.2 Create `EventTeaserTemplate.svelte` in `src/lib/blocks/teaser/templates/`
    - Accept event data from target content
    - Include all standard teaser fields (image, head_title, title, description)
    - Add event-specific sections
  - [x] 5.3 Implement date/time display logic
    - Display start date from target's `start` field
    - Display end date from target's `end` field
    - Conditionally show time only when `whole_day` is false
    - Use `Intl.DateTimeFormat` for locale-aware formatting
  - [x] 5.4 Implement location display
    - Render location from target's `location` field
    - Only display when location is present and non-empty
  - [x] 5.5 Register Event template in registry
    - Add `Event` key mapping to `EventTeaserTemplate`
    - Add modifier class `.teaser-item.event` for styling
  - [x] 5.6 Ensure Event template tests pass
    - Run ONLY the 4-5 tests written in 5.1
    - Verify date/time conditional logic works

**Acceptance Criteria:**

- The 4-5 tests written in 5.1 pass
- Event dates display with locale-aware formatting
- Time is hidden for whole-day events
- Location displays when present
- Event teaser includes all standard teaser elements

---

### Styling & Responsive Design

#### Task Group 6: CSS and Responsive Styling

**Dependencies:** Task Groups 2, 3

- [x] 6.0 Complete CSS implementation
  - [x] 6.1 Write 3-4 focused tests for CSS and responsive behavior
    - Test CSS custom properties are applied
    - Test mobile breakpoint stacks content vertically
    - Test image aspect ratio respects custom property
    - Test layout works without image
  - [x] 6.2 Implement CSS custom properties (Volto-compatible)
    - `--teaser-images-aspect-ratio`: controls image aspect ratio (default: 16/9)
    - `--teaser-images-object-position`: controls image object-position (default: top left)
    - Apply via inline styles or scoped CSS
  - [x] 6.3 Implement alignment layouts
    - Left alignment: `flex-direction: row` (image left, text right)
    - Right alignment: `flex-direction: row-reverse` (image right, text left)
    - Center/Top alignment: `display: block` or `flex-direction: column` (stacked)
  - [x] 6.4 Implement mobile responsive behavior
    - Stack all alignments vertically on mobile (flex-direction: column)
    - Use Tailwind breakpoint `md:` prefix for responsive classes
    - Remove side margins on image wrapper when stacked
    - Image takes full width when stacked vertically
  - [x] 6.5 Style teaser without image
    - Text content expands to fill available width
    - Maintain visual balance and spacing
  - [x] 6.6 Add BEM modifier classes
    - `.teaser-item.default` for standard teasers
    - `.teaser-item.event` for event teasers
    - Follow Volto's CSS class naming conventions
  - [x] 6.7 Ensure CSS tests pass
    - Run ONLY the 3-4 tests written in 6.1
    - Verify responsive behavior works across breakpoints

**Acceptance Criteria:**

- The 3-4 tests written in 6.1 pass
- CSS custom properties work for theming
- All alignments display correctly on desktop
- Mobile view stacks all layouts vertically
- Teasers without images maintain proper layout

---

### Testing & Verification

#### Task Group 7: Test Review and Gap Analysis

**Dependencies:** Task Groups 1-6

- [x] 7.0 Review existing tests and fill critical gaps only
  - [x] 7.1 Review tests from Task Groups 1-6
    - Review the 3-4 tests from Task 1.1 (base structure)
    - Review the 3-4 tests from Task 2.1 (images)
    - Review the 4-5 tests from Task 3.1 (alignments)
    - Review the 3-4 tests from Task 4.1 (template registration)
    - Review the 4-5 tests from Task 5.1 (Event template)
    - Review the 3-4 tests from Task 6.1 (CSS/responsive)
    - Total existing tests: approximately 20-26 tests
  - [x] 7.2 Analyze test coverage gaps for teaser feature only
    - Identify critical user workflows lacking test coverage
    - Focus ONLY on teaser block feature requirements
    - Prioritize end-to-end workflows over unit test gaps
  - [x] 7.3 Write up to 8 additional strategic tests maximum
    - Integration test: full teaser with all elements rendering
    - Integration test: Event teaser with date/time/location
    - Edge case: malformed data handling
    - Edge case: missing href target data
    - Additional tests as needed for critical gaps (max 8 total)
  - [x] 7.4 Run feature-specific tests only
    - Run ONLY tests related to teaser block feature
    - Expected total: approximately 28-34 tests maximum
    - Do NOT run entire application test suite
    - Verify all critical workflows pass

**Acceptance Criteria:**

- All feature-specific tests pass (approximately 28-34 tests total)
- Critical user workflows for teaser block are covered
- No more than 8 additional tests added to fill gaps
- Testing focused exclusively on teaser block requirements

---

## Execution Order

Recommended implementation sequence:

1. **Task Group 1: Block Registration and Base Structure** - Foundation for all other work
2. **Task Group 2: Responsive Image Handling** - Core visual element
3. **Task Group 3: Alignment Options** - Layout variations (depends on images)
4. **Task Group 4: Template Registration Mechanism** - Extensibility framework (can parallel with 2-3)
5. **Task Group 5: Event Content-Type Template** - First content-type template (depends on 4)
6. **Task Group 6: CSS and Responsive Styling** - Visual polish (depends on 2, 3)
7. **Task Group 7: Test Review and Gap Analysis** - Final verification

### Parallel Execution Opportunities

- Task Groups 2, 3, and 4 can be developed in parallel after Task Group 1 completes
- Task Group 5 must wait for Task Group 4
- Task Group 6 can begin CSS work in parallel with Task Groups 4-5, but responsive testing needs 2-3 complete
- Task Group 7 runs last as final verification

---

## Technical Notes

### File Locations

- Main component: `src/lib/blocks/teaser/TeaserBlockView.svelte`
- Template registry: `src/lib/blocks/teaser/templates/index.ts`
- Default template: `src/lib/blocks/teaser/templates/DefaultTeaserTemplate.svelte`
- Event template: `src/lib/blocks/teaser/templates/EventTeaserTemplate.svelte`
- Block registration: `src/lib/blocks/index.ts`
- Tests: `src/lib/blocks/teaser/TeaserBlockView.svelte.test.ts`

### Reference Files

- Pattern reference: `src/lib/blocks/slateTable/SlateTableBlockView.svelte`
- Image srcset pattern: `src/lib/blocks/image/ImageBlockView.svelte`
- Block props interface: `src/lib/RenderBlocks.svelte`
- Visual mockup: `agent-os/specs/2025-12-24-teaser-block/planning/visuals/Screenshot 2025-12-25 at 00-08-16 Edit sample page.png`

### Tech Stack Constraints

- Svelte 5 with `$props()` and `$derived()` patterns
- TypeScript for type safety
- Tailwind CSS 4 for utility classes and responsive breakpoints
- Vitest for unit testing
- BEM-style class naming for component-specific styles
