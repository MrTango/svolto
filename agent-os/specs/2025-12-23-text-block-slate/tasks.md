# Task Breakdown: Text Block (Slate)

## Overview

Total Tasks: 32 sub-tasks across 5 task groups

This breakdown follows the BTCA (Branch, Test, Code, Assert) approach for Svelte component development, aligned with the Seven pattern. Tasks are organized by functional area with dependencies clearly indicated.

## Task List

### Foundation Layer

#### Task Group 1: Core Infrastructure & Paragraph Element

**Dependencies:** None

- [x] 1.0 Complete core infrastructure and paragraph element
  - [x] 1.1 Write 3-4 focused tests for Paragraph and default element handling
    - Test paragraph renders with correct `<p>` element
    - Test `slate-paragraph` CSS class is applied
    - Test paragraph serves as fallback for unknown node types
    - Test nested children render correctly within paragraph
  - [x] 1.2 Create P.svelte component following existing pattern
    - Props: `children`, `node`, `parent` via `$props()`
    - Use `<p class="slate-paragraph">` semantic element
    - Use `{@render children?.()}` for child content
    - Follow H2.svelte pattern exactly
  - [x] 1.3 Update Leaf.svelte NodeTypes registry
    - Add `p` node type mapping to P component
    - Change fallback from `text` to `p` for paragraph default
    - Update NodeTypes type definition to include new types
  - [x] 1.4 Add CSS custom properties for paragraph styling
    - Add to `app.css` in `@layer components`
    - Define `--slate-paragraph-margin`, `--slate-paragraph-line-height`
    - Apply styling to `.slate-paragraph` class
  - [x] 1.5 Ensure foundation layer tests pass
    - Run ONLY tests from 1.1
    - Verify P.svelte renders correctly
    - Verify fallback behavior works

**Acceptance Criteria:**

- The 3-4 tests written in 1.1 pass
- Paragraph component renders with semantic `<p>` element
- Unknown node types fall back to paragraph rendering
- CSS custom properties are defined and applied

---

### Heading Elements

#### Task Group 2: Complete Heading Components (H4, H5, H6)

**Dependencies:** Task Group 1

- [x] 2.0 Complete heading element components
  - [x] 2.1 Write 3-4 focused tests for heading components
    - Test H4, H5, H6 render with correct heading elements
    - Test `slate-h*` CSS classes are applied to each heading level
    - Test nested children (inline formatting) render within headings
  - [x] 2.2 Create H4.svelte component
    - Props: `children`, `node`, `parent` via `$props()`
    - Use `<h4 class="slate-h4">` semantic element
    - Follow H2.svelte/H3.svelte pattern exactly
  - [x] 2.3 Create H5.svelte component
    - Same pattern as H4.svelte with `<h5 class="slate-h5">`
  - [x] 2.4 Create H6.svelte component
    - Same pattern as H4.svelte with `<h6 class="slate-h6">`
  - [x] 2.5 Update Leaf.svelte NodeTypes registry
    - Add `h4`, `h5`, `h6` node type mappings
    - Update NodeTypes type definition
  - [x] 2.6 Add CSS classes to existing H2.svelte and H3.svelte
    - Add `class="slate-h2"` to H2.svelte
    - Add `class="slate-h3"` to H3.svelte
  - [x] 2.7 Add CSS custom properties for heading styling
    - Define `--slate-heading-color`, `--slate-heading-font-weight`
    - Add base styles for h4, h5, h6 in `app.css` `@layer base`
    - Apply `.slate-h*` styles in `@layer components`
  - [x] 2.8 Ensure heading component tests pass
    - Run ONLY tests from 2.1
    - Verify all heading levels render correctly

**Acceptance Criteria:**

- The 3-4 tests written in 2.1 pass
- H4, H5, H6 components render with correct semantic elements
- All headings have consistent CSS class naming (`slate-h2` through `slate-h6`)
- CSS custom properties allow theming of headings

---

### Inline Formatting Elements

#### Task Group 3: Inline Text Formatting Components

**Dependencies:** Task Group 1

- [x] 3.0 Complete inline text formatting components
  - [x] 3.1 Write 4-6 focused tests for inline formatting
    - Test Underline renders `<u>` element with `slate-underline` class
    - Test Strikethrough renders `<s>` element with `slate-strikethrough` class
    - Test Sub renders `<sub>` element with `slate-sub` class
    - Test Sup renders `<sup>` element with `slate-sup` class
    - Test Code renders `<code>` element with `slate-code` class
    - Test nested inline formatting (e.g., bold within italic)
  - [x] 3.2 Create Underline.svelte component
    - Props: `children`, `node`, `parent` via `$props()`
    - Use `<u class="slate-underline">` semantic element
    - Follow Strong.svelte pattern
  - [x] 3.3 Create Strikethrough.svelte component
    - Use `<s class="slate-strikethrough">` semantic element
    - Same pattern as Underline.svelte
  - [x] 3.4 Create Sub.svelte component
    - Use `<sub class="slate-sub">` semantic element
  - [x] 3.5 Create Sup.svelte component
    - Use `<sup class="slate-sup">` semantic element
  - [x] 3.6 Create Code.svelte component
    - Use `<code class="slate-code">` semantic element
    - Apply monospace font styling
  - [x] 3.7 Update Leaf.svelte NodeTypes registry
    - Add `underline`, `strikethrough`, `sub`, `sup`, `code` mappings
    - Update NodeTypes type definition
  - [x] 3.8 Add CSS classes to existing Strong.svelte and Em.svelte
    - Add `class="slate-strong"` to Strong.svelte
    - Add `class="slate-em"` to Em.svelte
  - [x] 3.9 Add CSS custom properties for inline formatting
    - Define `--slate-code-bg`, `--slate-code-font-family`
    - Add `.slate-code` styles with background and monospace font
    - Add `.slate-*` styles for other inline elements as needed
  - [x] 3.10 Ensure inline formatting tests pass
    - Run ONLY tests from 3.1
    - Verify all inline elements render correctly

**Acceptance Criteria:**

- The 4-6 tests written in 3.1 pass
- All inline formatting components use semantic HTML elements
- Code element has monospace font styling
- CSS custom properties enable theming of inline elements

---

### Block-Level Elements

#### Task Group 4: Blockquote and Enhanced Link Components

**Dependencies:** Task Groups 1, 2

- [x] 4.0 Complete blockquote and enhanced link handling
  - [x] 4.1 Write 4-5 focused tests for blockquote and links
    - Test Blockquote renders `<blockquote>` with `slate-blockquote` class
    - Test Blockquote has left border styling applied
    - Test internal links resolve `resolveuid` URLs correctly
    - Test external links render with full URL
    - Test email links render with `mailto:` protocol
  - [x] 4.2 Create Blockquote.svelte component
    - Props: `children`, `node`, `parent` via `$props()`
    - Use `<blockquote class="slate-blockquote">` semantic element
    - Support nested content (paragraphs, formatting)
  - [x] 4.3 Update Leaf.svelte NodeTypes registry for blockquote
    - Add `blockquote` node type mapping
  - [x] 4.4 Extend Link.svelte for all link types
    - Handle internal links: detect and resolve `resolveuid` patterns
    - Handle external links: use URL directly
    - Handle email links: ensure `mailto:` protocol is preserved
    - Add `class="slate-link"` for styling hooks
    - Extract URL from `parent.data.url` or appropriate node property
  - [x] 4.5 Add CSS custom properties for blockquote and links
    - Define `--slate-blockquote-border-color`, `--slate-blockquote-border-width`
    - Define `--slate-blockquote-padding`, `--slate-blockquote-margin`
    - Add `.slate-blockquote` styles with left border
    - Add `.slate-link` styles (can use existing link base styles)
  - [x] 4.6 Ensure blockquote and link tests pass
    - Run ONLY tests from 4.1
    - Verify blockquote renders with proper styling
    - Verify all link types work correctly

**Acceptance Criteria:**

- The 4-5 tests written in 4.1 pass
- Blockquote renders with semantic HTML and left border styling
- Internal links resolve resolveuid patterns to proper paths
- External and email links work correctly
- CSS custom properties enable theming

---

### Integration & Refinement

#### Task Group 5: List Enhancement, Cleanup, and Integration

**Dependencies:** Task Groups 1-4

- [x] 5.0 Complete list enhancement and final integration
  - [x] 5.1 Write 4-6 focused tests for lists and integration
    - Test nested list structures (ul within ul, ol within ol)
    - Test mixed list nesting (ul within ol and vice versa)
    - Test `slate-ol`, `slate-ul`, `slate-li` CSS classes are applied
    - Test complete Slate block with multiple element types renders correctly
    - Test SlateBlockView handles all registered node types
  - [x] 5.2 Update Ol.svelte for CSS custom properties
    - Replace Tailwind classes with CSS custom property-based styling
    - Add `class="slate-ol"` for styling hooks
    - Ensure nested list support works correctly
  - [x] 5.3 Update Ul.svelte for CSS custom properties
    - Replace Tailwind classes with CSS custom property-based styling
    - Add `class="slate-ul"` for styling hooks
  - [x] 5.4 Update Li.svelte with styling class
    - Add `class="slate-li"` for styling hooks
  - [x] 5.5 Clean up SlateBlockView.svelte
    - Remove `console.log(data)` statement
    - Verify proper rendering of all node types
    - Ensure proper handling of root-level nodes
  - [x] 5.6 Add CSS custom properties for lists
    - Define `--slate-list-margin`, `--slate-list-padding`
    - Define `--slate-list-item-margin`
    - Add `.slate-ol`, `.slate-ul`, `.slate-li` styles
    - Ensure proper indentation for nested lists
  - [x] 5.7 Add all Slate CSS to app.css @layer components
    - Consolidate all `--slate-*` custom property definitions
    - Add `.slate` block wrapper styles if needed
    - Ensure custom properties have sensible defaults
  - [x] 5.8 Ensure integration tests pass
    - Run ONLY tests from 5.1
    - Verify complete Slate rendering works end-to-end

**Acceptance Criteria:**

- The 4-6 tests written in 5.1 pass
- Lists support proper nesting at multiple levels
- All components use consistent CSS class naming pattern
- console.log removed from SlateBlockView.svelte
- CSS custom properties consolidated in app.css

---

### Testing

#### Task Group 6: Test Review & Gap Analysis

**Dependencies:** Task Groups 1-5

- [x] 6.0 Review existing tests and fill critical gaps only
  - [x] 6.1 Review tests from Task Groups 1-5
    - Review tests written in 1.1 (3-4 tests: paragraph/defaults)
    - Review tests written in 2.1 (3-4 tests: headings)
    - Review tests written in 3.1 (4-6 tests: inline formatting)
    - Review tests written in 4.1 (4-5 tests: blockquote/links)
    - Review tests written in 5.1 (4-6 tests: lists/integration)
    - Total existing tests: approximately 18-25 tests
  - [x] 6.2 Analyze test coverage gaps for Slate block feature only
    - Identify critical rendering workflows lacking coverage
    - Focus ONLY on gaps related to this spec's feature requirements
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end Slate rendering over isolated unit tests
  - [x] 6.3 Write up to 8 additional strategic tests if needed
    - Focus on integration points between components
    - Test complex nested structures (e.g., formatted text in blockquote in list)
    - Test edge cases only if business-critical (empty nodes, missing data)
    - Do NOT write exhaustive coverage for all scenarios
  - [x] 6.4 Run all Slate block feature tests
    - Run ONLY tests related to this spec's feature
    - Expected total: approximately 26-33 tests maximum
    - Do NOT run the entire application test suite
    - Verify all critical Slate rendering workflows pass

**Acceptance Criteria:**

- All feature-specific tests pass (approximately 26-33 tests total)
- Critical Slate rendering workflows are covered
- No more than 8 additional tests added when filling gaps
- Testing focused exclusively on Slate block feature requirements

---

## Execution Order

Recommended implementation sequence:

1. **Foundation Layer (Task Group 1)** - Core infrastructure, paragraph as default
2. **Heading Elements (Task Group 2)** - Complete h4-h6, add CSS classes to existing h2-h3
3. **Inline Formatting (Task Group 3)** - All inline elements, CSS classes for existing
4. **Block-Level Elements (Task Group 4)** - Blockquote, enhanced links
5. **Integration & Refinement (Task Group 5)** - Lists enhancement, cleanup, CSS consolidation
6. **Test Review (Task Group 6)** - Gap analysis and strategic test additions

## Component Summary

### New Components to Create

| Component     | File                 | HTML Element   | CSS Class           |
| ------------- | -------------------- | -------------- | ------------------- |
| Paragraph     | P.svelte             | `<p>`          | slate-paragraph     |
| Heading 4     | H4.svelte            | `<h4>`         | slate-h4            |
| Heading 5     | H5.svelte            | `<h5>`         | slate-h5            |
| Heading 6     | H6.svelte            | `<h6>`         | slate-h6            |
| Underline     | Underline.svelte     | `<u>`          | slate-underline     |
| Strikethrough | Strikethrough.svelte | `<s>`          | slate-strikethrough |
| Subscript     | Sub.svelte           | `<sub>`        | slate-sub           |
| Superscript   | Sup.svelte           | `<sup>`        | slate-sup           |
| Inline Code   | Code.svelte          | `<code>`       | slate-code          |
| Blockquote    | Blockquote.svelte    | `<blockquote>` | slate-blockquote    |

### Existing Components to Modify

| Component             | Changes                                                             |
| --------------------- | ------------------------------------------------------------------- |
| H2.svelte             | Add `class="slate-h2"`                                              |
| H3.svelte             | Add `class="slate-h3"`                                              |
| Strong.svelte         | Add `class="slate-strong"`                                          |
| Em.svelte             | Add `class="slate-em"`                                              |
| Ol.svelte             | Replace Tailwind with CSS custom properties, add `class="slate-ol"` |
| Ul.svelte             | Replace Tailwind with CSS custom properties, add `class="slate-ul"` |
| Li.svelte             | Add `class="slate-li"`                                              |
| Link.svelte           | Add all link type handling, add `class="slate-link"`                |
| Leaf.svelte           | Add all new node type mappings, update type definitions             |
| SlateBlockView.svelte | Remove console.log                                                  |

### CSS Custom Properties to Define

```css
/* Headings */
--slate-heading-color
--slate-heading-font-weight

/* Paragraph */
--slate-paragraph-margin
--slate-paragraph-line-height

/* Inline Code */
--slate-code-bg
--slate-code-font-family

/* Blockquote */
--slate-blockquote-border-color
--slate-blockquote-border-width
--slate-blockquote-padding
--slate-blockquote-margin

/* Lists */
--slate-list-margin
--slate-list-padding
--slate-list-item-margin
```

## Notes

- All new components follow the established pattern: `$props()` with `children`, `node`, `parent`
- Use `{@render children?.()}` for child content rendering in all components
- Follow Svelte 5 conventions throughout
- CSS custom properties use `--slate-*` prefix for theming
- Testing follows BTCA workflow: Branch (create component), Test (write tests first), Code (implement), Assert (verify tests pass)
