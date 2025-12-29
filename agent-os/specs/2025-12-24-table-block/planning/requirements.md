# Spec Requirements: Table Block

## Initial Description

Table Block - a block component for rendering tables from Plone content.

Render tables with header rows/columns, cell alignment, and responsive behavior.

This feature is part of the Standard Plone Blocks coverage initiative (item #4 in the product roadmap). It will enable Svolto to render table content created in the Plone CMS backend.

Size Estimate: S (Small)

## Requirements Discussion

### First Round Questions

**Q1:** The Volto Table Block supports several display options: `hideHeaders`, `sortable`, `fixed` (fixed-width cells), `compact`, `basic` (reduced styling), `celled` (cell borders), `inverted` (inverted colors), and `striped` (alternating row colors). Should we support all of these options for full Plone compatibility, or focus on a subset initially?
**Answer:** Yes, support ALL options (hideHeaders, sortable, fixed, compact, basic, celled, inverted, striped)

**Q2:** Table cells in Volto contain Slate editor content (rich text with formatting, links, etc.). Should we reuse the existing Slate rendering components from `src/lib/blocks/slate/` to render cell content?
**Answer:** Yes, reuse existing Slate rendering components from src/lib/blocks/slate/

**Q3:** The Volto Table Block supports interactive column sorting (ascending/descending) when `sortable` is enabled. Should we implement client-side JavaScript sorting?
**Answer:** Yes, client-side JavaScript sorting. IMPORTANT: Must support German umlauts (a, o, u, ss) with correct collation order

**Q4:** Tables can be problematic on mobile devices. Which responsive approach do you prefer: horizontal scroll container, stacked layout on mobile, or CSS custom properties for theme customization?
**Answer:** Horizontal scroll container

**Q5:** The roadmap mentions "header rows/columns" but the Volto implementation only treats the first row as headers. Should we also support a first-column-as-headers option?
**Answer:** Same as Volto (first-row-only headers)

**Q6:** Should we use CSS classes following the existing block patterns and support theming via CSS custom properties, rather than using Semantic UI React's Table component that Volto uses?
**Answer:** Yes, CSS classes with CSS custom properties for theming

**Q7:** For sortable tables, should we implement proper ARIA attributes (`aria-sort`) and keyboard support (Enter/Space to toggle sort)?
**Answer:** Yes, implement ARIA attributes (aria-sort) and keyboard support

**Q8:** Is there anything specific to explicitly exclude from this implementation?
**Answer:** Not specified

### Existing Code to Reference

**Similar Features Identified:**

- Feature: Slate Block - Path: `src/lib/blocks/slate/` - Rich text rendering components to reuse for table cell content
- Feature: Block Registration - Path: `src/lib/blocks/index.ts` - Pattern for registering new blocks
- Feature: RenderBlocks - Path: `src/lib/RenderBlocks.svelte` - How blocks receive props and render
- Feature: Volto Table Block Reference - Path: `/workspace/volto-svolto/frontend/core/packages/volto-slate/src/blocks/Table/` - Reference implementation showing data structure and features

### Follow-up Questions

**Follow-up 1:** You mentioned that sorting must support German umlauts with correct collation order. Should we use JavaScript's `Intl.Collator` with configurable locale based on the site's language setting, or hardcode to German locale?
**Answer:** Use configurable locale (based on site's language setting), not hardcoded to German. The Intl.Collator approach with the example sorting behavior is confirmed as correct.

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

N/A - No visuals to analyze. Implementation should follow the existing Volto Table Block behavior as reference.

## Requirements Summary

### Functional Requirements

- Render table blocks from Plone CMS content with full feature parity to Volto
- Support all table display options:
  - `hideHeaders` - Option to hide the header row
  - `sortable` - Enable interactive column sorting
  - `fixed` - Fixed-width table cells
  - `compact` - Compact table styling
  - `basic` - Reduced/minimal styling
  - `celled` - Cell borders/dividers
  - `inverted` - Inverted color scheme
  - `striped` - Alternating row colors
- Render cell content using existing Slate components (rich text support)
- Client-side sorting with locale-aware collation using `Intl.Collator`
  - Locale should be configurable based on site's language setting
  - Must correctly handle German umlauts and other locale-specific characters
- First row treated as header row (matching Volto behavior)
- Horizontal scroll container for responsive behavior on mobile devices

### Accessibility Requirements

- Proper semantic HTML table structure (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`)
- ARIA attributes for sortable columns (`aria-sort` with values: none, ascending, descending)
- Keyboard support for sortable headers (Enter and Space keys to toggle sort)
- Visible focus indicators on interactive elements
- Proper `tabIndex` handling for sortable header cells

### Reusability Opportunities

- Slate rendering components from `src/lib/blocks/slate/` for cell content
- Block registration pattern from `src/lib/blocks/index.ts`
- CSS custom property patterns for theming consistency

### Scope Boundaries

**In Scope:**

- TableBlockView.svelte component for rendering tables
- All 8 table display options (hideHeaders, sortable, fixed, compact, basic, celled, inverted, striped)
- Client-side sorting with locale-aware collation
- Horizontal scroll responsive container
- Integration with existing Slate components for cell content
- CSS styling with custom properties for theming
- Accessibility features (ARIA, keyboard navigation)
- Block registration in blocksConfig

**Out of Scope:**

- Table editing capabilities (editing happens in Volto)
- First-column-as-headers option (not in Volto)
- Alternative responsive strategies (stacked layout, etc.)
- Server-side sorting
- Complex nested tables

### Technical Considerations

- Data structure follows Volto's table block format:
  ```
  {
    "@type": "table",
    "table": {
      "rows": [
        {
          "key": "uuid",
          "cells": [
            { "key": "uuid", "type": "data|header", "value": [slate nodes] }
          ]
        }
      ],
      "hideHeaders": boolean,
      "sortable": boolean,
      "fixed": boolean,
      "compact": boolean,
      "basic": boolean,
      "celled": boolean,
      "inverted": boolean,
      "striped": boolean
    }
  }
  ```
- Cell values are Slate node arrays - must use existing Slate rendering pipeline
- Sorting must extract plain text from Slate nodes for comparison
- Use `Intl.Collator` with site's locale for proper international sorting
- Follow existing block component patterns (props: key, id, data, properties, path, metadata)
- Use Svelte 5 runes syntax ($props, $state, etc.)
- CSS classes should follow pattern: `block table` with modifier classes for options
