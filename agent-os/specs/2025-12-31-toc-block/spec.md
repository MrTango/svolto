# Specification: TOC Block

## Goal

Implement a Table of Contents (TOC) block for Svolto that scans page content for headings and renders clickable anchor links, supporting both a vertical list and horizontal menu variation.

## User Stories

- As a content reader, I want to see a table of contents generated from page headings so that I can quickly navigate to specific sections
- As a content editor, I want to choose between list and horizontal menu displays so that the TOC matches the page design

## Specific Requirements

**Heading Extraction from Slate Blocks**

- Scan all slate blocks on the page via the `properties` prop passed to the block component
- Extract heading elements (h2-h6) from slate block `data.value` arrays
- Build hierarchical TOC entries with level, title text, and unique anchor ID
- Filter headings based on configurable `levels` array (e.g., `['h2', 'h3']`)
- Skip headings with empty or whitespace-only text content

**Anchor ID Generation for Slate Headings**

- Modify slate heading components (H2-H6) to generate `id` attributes
- Use slug generation from heading text content (lowercase, hyphen-separated)
- Handle unicode/diacritics by normalizing before slugging
- Ensure uniqueness by prefixing with block ID (format: `{blockId}-{slug}`)
- Pass block ID context through Leaf component to heading components

**Default (List) Variation**

- Render vertical nested list using semantic `<ul>` or `<ol>` elements based on `ordered` config
- Support hierarchical nesting (sub-entries as nested lists)
- Each entry is an anchor link (`<a href="#anchor-id">`) to the corresponding heading
- Apply `scroll-behavior: smooth` via CSS for smooth scrolling
- CSS class: `toc-default`

**Horizontal Menu Variation**

- Render horizontal menu using `<ul>` with flexbox layout
- Flatten hierarchy (no nested items, all entries at same visual level)
- Support `sticky` option using CSS `position: sticky` with `top: 0`
- CSS class: `toc-horizontal`
- No responsive dropdown menu (out of scope)

**Configuration Options**

- `title` (string): Optional title displayed above the TOC
- `hide_title` (boolean): Whether to hide the title even if provided
- `levels` (string[]): Which heading levels to include, defaults to all (h2-h6)
- `ordered` (boolean): Use numbered list vs bullet list (default variation only)
- `sticky` (boolean): Enable sticky positioning (horizontal variation only)
- `variation` (string): Either `default` or `horizontalMenu`

**Block Registration and Structure**

- Register TOC block in `/workspace/src/lib/blocks/index.ts` with id `toc`
- Follow established block pattern: `TocBlockView.svelte` as main component
- Use variation registry pattern from listing block for selecting variation component
- Accept standard block props: `key`, `id`, `data`, `metadata`, `properties`, `path`, `blocksConfig`

**Accessibility**

- Wrap TOC in `<nav>` element with `aria-label` set to title (or "Table of Contents" default)
- Use semantic list elements (`<ul>`, `<ol>`, `<li>`)
- Anchor links must have visible focus states
- Heading IDs enable direct URL fragment navigation

## Visual Design

No visual assets provided. Follow existing Svolto block styling patterns with CSS custom properties for theming.

## Existing Code to Leverage

**Listing Block Variation Pattern (`/workspace/src/lib/blocks/listing/variations/index.ts`)**

- Use same pattern for variation registry with `getVariationComponent()` function
- Export variation components and types from variations folder
- Default to `DefaultVariation` when variation name is invalid or missing

**Slate Block Structure (`/workspace/src/lib/blocks/slate/SlateBlockView.svelte`)**

- Understand slate data structure: `data.value` contains array of nodes
- Each node has `type` property (e.g., `h2`, `h3`) and `children` array
- Leaf component recursively renders nodes; heading components receive `node` and `children` props

**Slate Heading Components (`/workspace/src/lib/blocks/slate/H2.svelte` etc.)**

- Current pattern: receive `children`, `node`, `parent` props via `$props()`
- Need to add `id` attribute to heading element
- Text content available via children render or by traversing node.children for text nodes

**RenderBlocks Props (`/workspace/src/lib/RenderBlocks.svelte`)**

- Block receives `properties` containing full page content with `blocks` and `blocks_layout`
- Use `properties.blocks` to iterate and find slate blocks for heading extraction
- Use `properties.blocks_layout.items` to maintain block order

**Listing Block CSS Pattern (`/workspace/src/lib/blocks/listing/ListingBlockView.svelte`)**

- Use CSS custom properties for theming (e.g., `--toc-link-color`)
- Mobile-first responsive design with media query breakpoints
- Component-scoped `<style>` blocks

## Out of Scope

- `override_toc` feature allowing custom TOC text per block
- `tocEntry` callback system for non-slate blocks to provide TOC entries
- Responsive dropdown menu for horizontal variation when items overflow
- Keyboard navigation within dropdown menus
- Complex ARIA patterns beyond basic nav/list semantics
- Edit mode / sidebar configuration UI (view-only implementation)
- Extracting headings from non-slate blocks (gridBlock, slateTable, etc.)
- Active/highlighted state for current section during scroll
- Scroll spy functionality to track user position
- Custom anchor text different from heading text
