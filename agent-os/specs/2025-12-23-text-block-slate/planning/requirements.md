# Spec Requirements: Text Block (Slate)

## Initial Description

Text Block (Slate) - Complete Slate rich text block implementation for Svolto.

Extend the existing partial Slate block renderer to support all standard Slate elements used by Plone/Volto, including inline styles, block quotes, code blocks, headings, and nested structures.

## Requirements Discussion

### First Round Questions

**Q1:** For heading elements, I assume we need h2-h6 support (reserving h1 for page titles as is common). Is that correct, or do you need h1 support within Slate blocks as well?
**Answer:** Headings h2-h6 only - no h1 (that's handled by a separate title block).

**Q2:** For links, should we handle all three Volto link types: internal links (resolveuid), external URLs, and email (mailto:)? I'm assuming all three are needed.
**Answer:** Yes, full link handling including internal, external, and email links.

**Q3:** For code elements, I assume we only need inline code styling (not fenced code blocks with syntax highlighting). Is that correct?
**Answer:** Inline code only - no fenced code blocks needed.

**Q4:** Should paragraphs be the default/fallback element type when no specific element is specified?
**Answer:** Yes, paragraphs as the default element.

**Q5:** For styling, should we use CSS/SCSS with custom properties to allow theming, matching the existing codebase patterns?
**Answer:** Yes, CSS/SCSS with custom properties for theming.

**Q6:** Do you need subscript (sub) and superscript (sup) elements, or just the core inline styles (bold, italic, underline, strikethrough)?
**Answer:** Include sub/sup elements.

**Q7:** For blockquotes, do you have a preferred styling approach (simple left border, indented with background, or minimal)?
**Answer:** Simple left border style (classic approach).

**Q8:** Is there anything that should explicitly be excluded from this implementation?
**Answer:** No fenced code blocks. No h1 headings (separate block handles that).

### Existing Code to Reference

**Similar Features Identified:**

- Feature: Existing Slate block implementation - Path: `src/lib/blocks/slate/`
- Components to potentially reuse: `SlateBlockView.svelte`, `Leaf.svelte`, existing element components (H2, H3, Link, Strong, Em, Ol, Ul, Li)
- Backend logic to reference: Uses `slate` package for `Node` and `Text` utilities

### Follow-up Questions

**Follow-up 1:** For CSS custom properties, should we use block-prefixed naming (e.g., `--slate-heading-color`, `--slate-blockquote-border`) or generic semantic names (e.g., `--heading-color`, `--blockquote-border`)?
**Answer:** Block-prefixed (e.g., `--slate-heading-color`, `--slate-blockquote-border`)

**Follow-up 2:** For internal links with resolveuid, should we use SvelteKit's `goto()` for navigation, or simply use standard `<a href>` and let SvelteKit handle it naturally?
**Answer:** Simply use standard `<a href>` and let SvelteKit handle it naturally

**Follow-up 3:** Confirming blockquote styling: simple left border (classic approach)?
**Answer:** Yes, simple left border style

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

N/A - No visual files found in the visuals folder.

## Requirements Summary

### Functional Requirements

- Render all standard Slate rich text elements from Plone/Volto content
- Support heading elements: h2, h3, h4, h5, h6 (no h1)
- Support paragraph elements as the default/fallback type
- Support inline text formatting: bold, italic, underline, strikethrough
- Support subscript (sub) and superscript (sup) elements
- Support inline code styling (no fenced code blocks)
- Support blockquotes with simple left border styling
- Support ordered lists (ol) and unordered lists (ul) with list items (li)
- Support all link types: internal links, external URLs, and email (mailto:) links
- Internal links use standard `<a href>` elements (SvelteKit handles routing naturally)
- Handle nested Slate structures properly (e.g., formatted text within list items)

### Reusability Opportunities

- Extend existing `SlateBlockView.svelte` component
- Extend existing `Leaf.svelte` component for inline formatting
- Reuse/extend existing element components: H2, H3, Link, Strong, Em, Ol, Ul, Li
- Continue using `slate` package utilities (Node, Text)
- Follow established component patterns in `src/lib/blocks/slate/`

### Scope Boundaries

**In Scope:**

- All standard Slate text elements (headings h2-h6, paragraphs, lists, blockquotes)
- Inline formatting (bold, italic, underline, strikethrough, sub, sup, inline code)
- All link types (internal, external, email)
- CSS/SCSS styling with block-prefixed custom properties
- Nested element support

**Out of Scope:**

- H1 headings (handled by separate title block)
- Fenced code blocks with syntax highlighting
- Tables (if not part of standard Volto Slate)
- Embedded media within Slate (separate block types)
- WYSIWYG editing functionality (render-only)

### Technical Considerations

- Use existing `slate` package for Node and Text utilities
- CSS custom properties with `--slate-*` prefix for theming
- Standard `<a href>` for all link types (no special routing handling needed)
- Follow SvelteKit/Svelte 5 patterns with `$props()`
- Maintain compatibility with existing RenderBlocks system
- Block components registered in `src/lib/blocks/index.ts`
