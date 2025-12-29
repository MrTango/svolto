# Specification: Table Block

## Goal

Implement a Table Block component for Svolto that renders table content from Plone CMS with full feature parity to Volto, including all display options, client-side sorting with locale-aware collation, and accessible keyboard navigation.

## User Stories

- As a content consumer, I want to view tables with proper formatting and styling so that I can easily read and understand tabular data
- As a user browsing on mobile, I want tables to scroll horizontally so that I can view all columns without breaking the page layout
- As a keyboard user, I want to sort table columns using Enter or Space keys so that I can interact with sortable tables without a mouse

## Specific Requirements

**TableBlockView Component**

- Create `src/lib/blocks/slateTable/TableBlockView.svelte` following existing block patterns
- Accept standard block props: `key`, `id`, `data`, `properties`, `path`, `metadata`
- Use Svelte 5 runes syntax (`$props`, `$state`, `$derived`)
- Render semantic HTML table structure (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`)
- Handle empty table data gracefully with no rendering or placeholder

**Table Display Options**

- Support all 8 boolean options from Volto: `hideHeaders`, `sortable`, `fixed`, `compact`, `basic`, `celled`, `inverted`, `striped`
- Apply CSS modifier classes based on options: `table--hide-headers`, `table--sortable`, `table--fixed`, etc.
- `hideHeaders`: Conditionally render `<thead>` only when false
- `fixed`: Apply `table-layout: fixed` CSS property
- `basic`: Minimal styling with reduced borders/backgrounds
- Options are stored in `data.table` object (e.g., `data.table.sortable`)

**Slate Cell Content Rendering**

- Cell values are Slate node arrays stored in `cell.value`
- Reuse `Leaf.svelte` component from `src/lib/blocks/slate/` to render cell content
- Handle empty cells by rendering non-breaking space (`\u00A0`)
- First row cells are headers (type: "header"), remaining are data cells (type: "data")

**Client-Side Sorting**

- Implement sorting state with `$state` rune: `{ column: number | null, direction: 'ascending' | 'descending' | null }`
- Use `Intl.Collator` with locale from content's `language` property (fallback to `navigator.language`)
- Extract plain text from Slate nodes for comparison using recursive text extraction
- Toggle direction on same column click: none -> ascending -> descending -> ascending
- First click on new column sets ascending order
- Only enable sorting when `data.table.sortable` is true

**Locale-Aware Collation**

- Create collator: `new Intl.Collator(locale, { sensitivity: 'base', numeric: true })`
- Correctly handles German umlauts (a=a, o=o, u=u, ss=ss) and other locale-specific characters
- Locale should come from Plone content `properties.language` or site settings
- Fallback chain: content language -> browser language -> 'en'

**Horizontal Scroll Responsive Container**

- Wrap table in a container div with `overflow-x: auto`
- Table maintains minimum content width, container scrolls on narrow viewports
- Add visual scroll indicator shadow on left/right edges when scrollable
- Container class: `table-scroll-container`

**Accessibility Implementation**

- Sortable header cells get `tabindex="0"` for keyboard focus
- Non-sortable headers get `tabindex="-1"`
- Apply `aria-sort` attribute: "ascending", "descending", or "none"
- Handle `keydown` for Enter and Space keys to trigger sort
- Visible focus ring on sortable headers using `:focus-visible`
- Use `scope="col"` on `<th>` elements

**CSS Styling with Custom Properties**

- Define CSS custom properties in `app.css` under `:root` following existing Slate pattern
- Properties for: cell padding, border colors, header background, striped row color, inverted colors, compact padding
- Use Tailwind CSS utilities where appropriate, custom CSS for complex table styling
- Class naming: `.block.slateTable` base, `.table--{option}` modifiers

## Visual Design

No visual assets provided. Implementation should match Volto Table Block behavior and styling patterns. Reference Semantic UI table styles as baseline for visual appearance.

## Existing Code to Leverage

**Block Registration Pattern (`src/lib/blocks/index.ts`)**

- Import and register TableBlockView following existing pattern
- Add `slateTable` key with `id`, `title`, and `view` properties
- Block type string is "slateTable" matching `@type` in Plone data

**Slate Block Structure (`src/lib/blocks/slate/SlateBlockView.svelte`)**

- Pattern for receiving block props with destructuring
- Using `$props()` rune for Svelte 5 compatibility
- Wrapping in div with `class="block {type}"` pattern

**Slate Leaf Component (`src/lib/blocks/slate/Leaf.svelte`)**

- Renders Slate nodes recursively with proper element mapping
- Import and use directly for rendering cell content
- Pass `node` and `parent={null}` props for each cell value

**CSS Custom Properties Pattern (`src/app.css`)**

- Define table variables alongside existing `--slate-*` variables
- Use `@layer components` for table-specific styles
- Follow naming convention: `--table-{property}` (e.g., `--table-cell-padding`)

**Volto TableBlockView Reference (`volto-svolto/.../TableBlockView.jsx`)**

- Reference sorting logic and state management approach
- Data structure: `data.table.rows[].cells[].value` contains Slate nodes
- Use `Node.string()` pattern concept for extracting plain text (implement in Svelte)

## Out of Scope

- Table editing capabilities (editing is done in Volto/Plone)
- First-column-as-headers option (Volto only supports first-row headers)
- Alternative responsive strategies (stacked layout, card view on mobile)
- Server-side sorting or pagination
- Complex nested tables or merged cells
- Column resizing or reordering functionality
- Export to CSV/Excel functionality
- Print-specific styling
- Animation/transitions for sort changes
- Cell-level text alignment options (all cells left-aligned per Volto)
