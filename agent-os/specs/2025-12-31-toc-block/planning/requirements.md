# Spec Requirements: TOC Block

## Initial Description

The user wants a TOC (Table of Contents) block with the same features as Seven/Volto. This spec is for implementing a TOC block in Svolto that matches the core functionality of the existing Volto/Seven TOC block implementation.

## Requirements Discussion

### First Round Questions

**Q1:** I assume we will implement both variations (Default list and Horizontal Menu) to match Volto feature parity. Is that correct, or should we start with just the default list variation?
**Answer:** YES - implement both variations (Default list and Horizontal Menu)

**Q2:** For smooth scrolling behavior, I'm thinking we can use the native CSS `scroll-behavior: smooth` or a lightweight solution. Should we avoid external dependencies like `react-anchor-link-smooth-scroll` and use native browser capabilities instead?
**Answer:** YES - use native CSS `scroll-behavior: smooth`

**Q3:** I assume the TOC block only needs to work with the existing slate block for now (which contains headings). Is that correct, or should we design a generic `tocEntry` callback system that other blocks could implement in the future?
**Answer:** YES - only work with existing slate block for now

**Q4:** For sticky positioning in the horizontal menu variation, I'm thinking we should use CSS `position: sticky` rather than JavaScript scroll event listeners for better performance. Does that align with your preferences?
**Answer:** YES - use CSS `position: sticky`

**Q5:** The Volto implementation uses Semantic UI components (`List`, `Menu`, `Dropdown`). I assume we should use native HTML elements styled with our existing CSS approach (Tailwind/custom CSS). Is that correct?
**Answer:** YES - native HTML elements with minimal custom styles plus CSS properties (Tailwind)

**Q6:** For the anchor slug generation, I'm assuming we should add `id` attributes to heading elements in the slate block components (H2.svelte, H3.svelte, etc.) during render. Is modifying the slate heading components in scope for this spec, or should that be a separate concern?
**Answer:** (Answered in follow-up)

**Q7:** Is there anything specific that should be explicitly excluded from the TOC block scope?
**Answer:** (Answered in follow-up)

### Existing Code to Reference

No similar existing features identified for reference. Create fresh components following established block patterns in `/workspace/src/lib/blocks/`.

### Follow-up Questions

**Follow-up 1:** For the TOC to work, heading elements need `id` attributes so anchor links can jump to them. Currently, the slate heading components (H2.svelte, H3.svelte, etc.) don't generate IDs. Should modifying these components to add anchor IDs be included in this TOC block spec, or should that be handled as a separate prerequisite task?
**Answer:** YES - add the IDs to heading components (H2.svelte, H3.svelte, etc.) as part of this spec

**Follow-up 2:** Are there any features from the Volto TOC block that we should explicitly NOT implement?
**Answer:** KEEP IT SIMPLE - exclude advanced features like `override_toc` feature, responsive dropdown menu for horizontal variation overflow, and keyboard navigation within dropdown

**Follow-up 3:** Should we look at any particular navigation or list components in the Svolto codebase for styling consistency?
**Answer:** FRESH - create fresh components following established block patterns, don't reference existing navigation patterns

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

N/A - No visual files to analyze.

## Requirements Summary

### Functional Requirements

- Generate a table of contents from page headings (h2-h6) found in slate blocks
- Scan all blocks on the page to find slate blocks containing heading elements
- Extract heading text and level to build hierarchical TOC entries
- Render clickable anchor links that scroll to the corresponding heading
- Support configurable heading level filtering (which levels to include)
- Support optional title above the TOC with hide option
- Implement two display variations:
  - **Default (List)**: Vertical nested list with ordered/unordered option
  - **Horizontal Menu**: Horizontal menu bar with sticky positioning option
- Add `id` attributes to slate heading components (H2.svelte, H3.svelte, H4.svelte, H5.svelte, H6.svelte) for anchor targeting
- Use `github-slugger` or equivalent for generating URL-safe anchor slugs from heading text

### Technical Approach

- Use native CSS `scroll-behavior: smooth` for smooth scrolling (no external dependencies)
- Use CSS `position: sticky` for sticky horizontal menu (no JavaScript scroll listeners)
- Use native HTML elements (`<nav>`, `<ul>`/`<ol>`, `<li>`, `<a>`) with Tailwind CSS styling
- Follow established Svolto block patterns from `/workspace/src/lib/blocks/`
- Slate heading components receive the block ID to generate unique anchor IDs

### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `title` | string | Optional title displayed above the TOC |
| `hide_title` | boolean | Whether to hide the title |
| `levels` | string[] | Which heading levels to include (e.g., ['h2', 'h3']) |
| `ordered` | boolean | Use numbered list vs bullet list (default variation) |
| `sticky` | boolean | Enable sticky positioning (horizontal variation) |

### Reusability Opportunities

- Slug generation utility can be reused for other anchor-linking needs
- Heading ID generation pattern in slate components can benefit other features

### Scope Boundaries

**In Scope:**

- TOC block component with two variations (default list, horizontal menu)
- Heading extraction logic from slate blocks
- Anchor link generation with smooth scrolling
- Adding `id` attributes to slate heading components (H2-H6)
- Configuration options: title, hide_title, levels, ordered, sticky
- Proper semantic HTML with accessibility (nav element, aria-label)
- Hierarchical nesting of TOC entries based on heading levels

**Out of Scope:**

- `override_toc` feature (custom TOC text per block)
- `tocEntry` callback system for non-slate blocks
- Responsive dropdown menu for horizontal variation overflow
- Keyboard navigation within dropdown menus
- Complex ARIA patterns beyond basic nav/list semantics
- Edit mode / sidebar configuration UI (view-only implementation)

### Technical Considerations

- Slug generation must handle unicode/diacritics (normalize before slugging)
- Heading IDs must be unique within the page (use block ID as prefix)
- TOC must re-render when page content changes (reactive to content prop)
- Horizontal menu sticky behavior uses CSS only for performance
- Follow Svelte 5 patterns with runes syntax ($props, $derived, etc.)

### Files to Create/Modify

**New files:**
- `/workspace/src/lib/blocks/toc/TocBlockView.svelte` - Main TOC block component
- `/workspace/src/lib/blocks/toc/variations/DefaultVariation.svelte` - List variation
- `/workspace/src/lib/blocks/toc/variations/HorizontalVariation.svelte` - Horizontal menu variation
- `/workspace/src/lib/blocks/toc/utils.ts` - Slug generation and heading extraction utilities

**Modified files:**
- `/workspace/src/lib/blocks/index.ts` - Register TOC block
- `/workspace/src/lib/blocks/slate/H2.svelte` - Add id attribute
- `/workspace/src/lib/blocks/slate/H3.svelte` - Add id attribute
- `/workspace/src/lib/blocks/slate/H4.svelte` - Add id attribute
- `/workspace/src/lib/blocks/slate/H5.svelte` - Add id attribute
- `/workspace/src/lib/blocks/slate/H6.svelte` - Add id attribute

### Reference Implementation

The Volto TOC block implementation can be found at:
- `/workspace/volto-svolto/frontend/core/packages/volto/src/components/manage/Blocks/ToC/View.jsx`
- `/workspace/volto-svolto/frontend/core/packages/volto/src/components/manage/Blocks/ToC/variations/DefaultTocRenderer.jsx`
- `/workspace/volto-svolto/frontend/core/packages/volto/src/components/manage/Blocks/ToC/variations/HorizontalMenu.jsx`
