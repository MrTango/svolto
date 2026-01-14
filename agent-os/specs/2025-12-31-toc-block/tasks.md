# Task Breakdown: TOC Block

## Overview

Total Tasks: 5 Task Groups with approximately 25 sub-tasks

This spec implements a Table of Contents (TOC) block for Svolto that scans page content for headings and renders clickable anchor links, supporting both a vertical list (default) and horizontal menu variation.

## Task List

### Foundation Layer

#### Task Group 1: Utility Functions and Types

**Dependencies:** None

- [x] 1.0 Complete utility functions and type definitions
  - [x] 1.1 Write 3-4 focused tests for TOC utilities
    - Test slug generation from plain text (lowercase, hyphen-separated)
    - Test slug generation with unicode/diacritics normalization
    - Test heading extraction from slate block data structure
    - Test unique ID generation with block ID prefix
  - [x] 1.2 Create `/workspace/src/lib/blocks/toc/types.ts`
    - Define `TocEntry` interface (level, title, id, children)
    - Define `TocBlockData` interface (title, hide_title, levels, ordered, sticky, variation)
    - Define `TocVariationProps` interface (entries, ordered)
    - Export all types
  - [x] 1.3 Create `/workspace/src/lib/blocks/toc/utils.ts`
    - Implement `generateSlug(text: string): string` function
      - Lowercase conversion
      - Replace spaces with hyphens
      - Remove special characters
      - Handle unicode/diacritics via normalization
    - Implement `generateAnchorId(blockId: string, text: string): string` function
      - Format: `{blockId}-{slug}`
    - Implement `extractTextFromSlateNode(node): string` function
      - Recursively traverse node.children for text nodes
      - Concatenate all text content
    - Implement `extractHeadingsFromBlocks(blocks, blocksLayout, levels): TocEntry[]` function
      - Iterate blocks in layout order
      - Filter slate blocks by `@type === 'slate'`
      - Extract h2-h6 nodes from `data.value` arrays
      - Filter by configured levels array
      - Skip empty/whitespace-only headings
      - Build TocEntry objects with level, title, and anchor ID
  - [x] 1.4 Ensure utility tests pass
    - Run ONLY the 3-4 tests written in 1.1
    - Verify slug generation handles edge cases
    - Verify heading extraction works with sample slate data

**Acceptance Criteria:**

- The 3-4 tests written in 1.1 pass
- Slug generation produces URL-safe anchor IDs
- Heading extraction correctly parses slate block structure
- Types are properly exported and documented

---

### Slate Integration Layer

#### Task Group 2: Slate Heading Component Modifications

**Dependencies:** Task Group 1

- [x] 2.0 Complete slate heading component modifications
  - [x] 2.1 Write 2-3 focused tests for heading ID generation
    - Test H2 component renders with generated id attribute
    - Test heading ID is generated from node text content
    - Test heading ID includes block ID prefix for uniqueness
  - [x] 2.2 Modify `/workspace/src/lib/blocks/slate/Leaf.svelte`
    - Pass `blockId` prop to heading components (H2-H6)
    - Accept `blockId` from parent SlateBlockView
  - [x] 2.3 Modify `/workspace/src/lib/blocks/slate/SlateBlockView.svelte`
    - Pass block `id` to Leaf component as `blockId` prop
  - [x] 2.4 Modify `/workspace/src/lib/blocks/slate/H2.svelte`
    - Import `generateAnchorId` and `extractTextFromSlateNode` from toc utils
    - Accept `blockId` prop
    - Derive anchor ID from blockId and node text content
    - Add `id={anchorId}` attribute to `<h2>` element
  - [x] 2.5 Modify `/workspace/src/lib/blocks/slate/H3.svelte`
    - Same changes as H2 for `<h3>` element
  - [x] 2.6 Modify `/workspace/src/lib/blocks/slate/H4.svelte`
    - Same changes as H2 for `<h4>` element
  - [x] 2.7 Modify `/workspace/src/lib/blocks/slate/H5.svelte`
    - Same changes as H2 for `<h5>` element
  - [x] 2.8 Modify `/workspace/src/lib/blocks/slate/H6.svelte`
    - Same changes as H2 for `<h6>` element
  - [x] 2.9 Ensure slate heading tests pass
    - Run ONLY the 2-3 tests written in 2.1
    - Verify headings render with id attributes
    - Verify ID format matches TOC anchor links

**Acceptance Criteria:**

- The 2-3 tests written in 2.1 pass
- All heading components (H2-H6) generate unique id attributes
- IDs match the format expected by TOC anchor links
- Existing slate block rendering is not broken

---

### TOC Block Components

#### Task Group 3: TOC Block and Variations

**Dependencies:** Task Groups 1, 2

- [x] 3.0 Complete TOC block components
  - [x] 3.1 Write 3-4 focused tests for TOC block components
    - Test TocBlockView renders with extracted headings
    - Test DefaultVariation renders nested list structure
    - Test HorizontalVariation renders flat horizontal menu
    - Test variation selection based on data.variation prop
  - [x] 3.2 Create `/workspace/src/lib/blocks/toc/variations/index.ts`
    - Follow pattern from listing block variations
    - Create `variationRegistry` mapping variation names to components
    - Implement `getVariationComponent(variation: string)` function
    - Export DefaultVariation, HorizontalVariation
    - Export VariationProps type
  - [x] 3.3 Create `/workspace/src/lib/blocks/toc/variations/DefaultVariation.svelte`
    - Accept props: `entries`, `ordered`
    - Render `<ul>` or `<ol>` based on `ordered` prop
    - Implement recursive rendering for nested hierarchy
    - Render `<li>` with `<a href="#anchor-id">` for each entry
    - Add CSS class `toc-default`
    - Style with component-scoped CSS
  - [x] 3.4 Create `/workspace/src/lib/blocks/toc/variations/HorizontalVariation.svelte`
    - Accept props: `entries`, `sticky`
    - Flatten hierarchy (ignore nesting, all entries at same level)
    - Render horizontal `<ul>` with flexbox layout
    - Apply `position: sticky; top: 0` when `sticky` is true
    - Add CSS class `toc-horizontal`
    - Style with component-scoped CSS
  - [x] 3.5 Create `/workspace/src/lib/blocks/toc/TocBlockView.svelte`
    - Accept standard block props: `key`, `id`, `data`, `metadata`, `properties`, `path`, `blocksConfig`
    - Extract headings from `properties.blocks` using utility function
    - Filter by `data.levels` configuration (default: all h2-h6)
    - Render optional title (`data.title`) with hide option (`data.hide_title`)
    - Wrap in `<nav>` element with `aria-label`
    - Select variation component using `getVariationComponent(data.variation)`
    - Pass `entries`, `ordered`, `sticky` to variation component
    - Add `scroll-behavior: smooth` to component styles
    - Add CSS custom properties for theming
  - [x] 3.6 Ensure TOC block tests pass
    - Run ONLY the 3-4 tests written in 3.1
    - Verify heading extraction and rendering
    - Verify variation selection works correctly

**Acceptance Criteria:**

- The 3-4 tests written in 3.1 pass
- TocBlockView correctly extracts and displays headings
- DefaultVariation renders hierarchical nested lists
- HorizontalVariation renders flat horizontal menu
- Anchor links navigate to correct headings

---

### Block Registration

#### Task Group 4: Block Registration and Integration

**Dependencies:** Task Group 3

- [x] 4.0 Complete block registration
  - [x] 4.1 Write 1-2 focused tests for block integration
    - Test TOC block is registered in blocksConfig
    - Test TOC block renders when included in page blocks
  - [x] 4.2 Modify `/workspace/src/lib/blocks/index.ts`
    - Import TocBlockView from `./toc/TocBlockView.svelte`
    - Add `toc` entry to blocks object:
      ```typescript
      toc: {
        id: 'toc',
        title: 'Table of Contents',
        view: TocBlockView
      }
      ```
  - [x] 4.3 Ensure integration tests pass
    - Run ONLY the 1-2 tests written in 4.1
    - Verify block renders in page context

**Acceptance Criteria:**

- The 1-2 tests written in 4.1 pass
- TOC block is registered and discoverable
- Block renders correctly when used in page content

---

### Testing

#### Task Group 5: Test Review and Gap Analysis

**Dependencies:** Task Groups 1-4

- [x] 5.0 Review existing tests and fill critical gaps only
  - [x] 5.1 Review tests from Task Groups 1-4
    - Review the 3-4 tests from utility functions (Task 1.1)
    - Review the 2-3 tests from slate heading modifications (Task 2.1)
    - Review the 3-4 tests from TOC block components (Task 3.1)
    - Review the 1-2 tests from block registration (Task 4.1)
    - Total existing tests: approximately 9-13 tests
  - [x] 5.2 Analyze test coverage gaps for TOC block feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to this spec's feature requirements
    - Prioritize end-to-end workflows over unit test gaps
  - [x] 5.3 Write up to 5 additional strategic tests if necessary
    - Add maximum of 5 new tests to fill identified critical gaps
    - Consider tests for:
      - Accessibility (nav element, aria-label rendering)
      - Empty state (no headings found)
      - Configuration options (levels filtering, title hiding)
      - Smooth scroll behavior
    - Do NOT write comprehensive coverage for all scenarios
  - [x] 5.4 Run feature-specific tests only
    - Run ONLY tests related to TOC block feature
    - Expected total: approximately 14-18 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**

- All feature-specific tests pass (approximately 14-18 tests total)
- Critical user workflows for TOC block are covered
- No more than 5 additional tests added when filling gaps
- Testing focused exclusively on TOC block feature requirements

---

## Execution Order

Recommended implementation sequence:

1. **Task Group 1: Utility Functions and Types** - Foundation for all other work
2. **Task Group 2: Slate Heading Component Modifications** - Required for anchor navigation to work
3. **Task Group 3: TOC Block and Variations** - Main feature implementation
4. **Task Group 4: Block Registration** - Integration into Svolto block system
5. **Task Group 5: Test Review and Gap Analysis** - Final quality assurance

## File Summary

### New Files to Create

| File | Description |
|------|-------------|
| `/workspace/src/lib/blocks/toc/types.ts` | TypeScript interfaces for TOC block |
| `/workspace/src/lib/blocks/toc/utils.ts` | Slug generation and heading extraction utilities |
| `/workspace/src/lib/blocks/toc/utils.test.ts` | Tests for utility functions |
| `/workspace/src/lib/blocks/toc/TocBlockView.svelte` | Main TOC block component |
| `/workspace/src/lib/blocks/toc/TocBlockView.svelte.test.ts` | Tests for TOC block component |
| `/workspace/src/lib/blocks/toc/variations/index.ts` | Variation registry |
| `/workspace/src/lib/blocks/toc/variations/DefaultVariation.svelte` | List variation component |
| `/workspace/src/lib/blocks/toc/variations/HorizontalVariation.svelte` | Horizontal menu variation |

### Existing Files to Modify

| File | Changes |
|------|---------|
| `/workspace/src/lib/blocks/index.ts` | Register TOC block |
| `/workspace/src/lib/blocks/slate/SlateBlockView.svelte` | Pass blockId to Leaf |
| `/workspace/src/lib/blocks/slate/Leaf.svelte` | Accept and pass blockId to heading components |
| `/workspace/src/lib/blocks/slate/H2.svelte` | Add id attribute generation |
| `/workspace/src/lib/blocks/slate/H3.svelte` | Add id attribute generation |
| `/workspace/src/lib/blocks/slate/H4.svelte` | Add id attribute generation |
| `/workspace/src/lib/blocks/slate/H5.svelte` | Add id attribute generation |
| `/workspace/src/lib/blocks/slate/H6.svelte` | Add id attribute generation |

## Technical Notes

### Slug Generation

- Use string normalization to handle unicode/diacritics
- Convert to lowercase, replace spaces with hyphens
- Remove non-alphanumeric characters except hyphens
- Format: `{blockId}-{slug}` for uniqueness

### Heading Extraction

- Access page content via `properties.blocks` and `properties.blocks_layout`
- Filter for `@type === 'slate'` blocks
- Parse `data.value` array for heading nodes (type: h2, h3, h4, h5, h6)
- Build hierarchical TocEntry structure based on heading levels

### Accessibility Requirements

- Wrap TOC in `<nav>` element
- Set `aria-label` to title or "Table of Contents"
- Use semantic `<ul>`, `<ol>`, `<li>` elements
- Ensure visible focus states on anchor links

### CSS Patterns

- Use CSS custom properties for theming (e.g., `--toc-link-color`)
- Apply `scroll-behavior: smooth` at component level
- Mobile-first responsive design
- Component-scoped styles in `<style>` blocks
