# Specification: Grid Block

## Goal

Implement a Grid Block component for Svolto that renders Plone/Volto grid blocks with 1-4 equal-width columns, supporting responsive flexbox layout with natural wrapping and recursive nested block rendering.

## User Stories

- As a content editor, I want to display content in a multi-column grid layout so that I can create visually organized page sections
- As a site visitor, I want the grid to responsively adapt to my screen size so that content remains readable on any device

## Specific Requirements

**Grid Container Component**

- Create `GridBlockView.svelte` at `/workspace/src/lib/blocks/grid/GridBlockView.svelte`
- Accept standard block props: `key`, `id`, `data`, `metadata`, `properties`, `path`
- Return empty/null when `data.blocks_layout` is undefined (guard clause)
- Apply CSS classes based on column count: `one`, `two`, `three`, `four`
- Use Svelte 5 runes syntax (`$props()`, `$derived()`) following existing block patterns

**Headline Support**

- Render optional `data.headline` field as `<h2 class="headline">` above the grid
- Only render headline when truthy value exists
- Heading level is fixed at h2 (not configurable)

**Column Rendering**

- Read column IDs from `data.blocks_layout.items` array
- Each column contains its own `blocks` and `blocks_layout` structure
- Render columns as flex items with equal width based on column count
- Use `RenderBlocks.svelte` recursively for rendering nested blocks within each column

**Flexbox Layout Implementation**

- Use CSS flexbox (not CSS Grid) for the column layout
- Apply `flex-wrap: wrap` to enable natural column wrapping
- Set `min-width` constraints on columns to control wrapping behavior
- Mobile-first approach with no fixed breakpoints

**Block Registration**

- Register in `/workspace/src/lib/blocks/index.ts` with id `gridBlock`
- Follow existing pattern: `{ id: 'gridBlock', title: 'Grid', view: GridBlockView }`
- The block type in Plone data is `gridBlock`

**Nested Block Support**

- Pass `blocksConfig` and `metadata` down to nested RenderBlocks
- Support only currently implemented blocks: `slate`, `image`, `teaser`
- Prevent nested grids by not including `gridBlock` in nested blocksConfig

## Specific Requirements

**CSS Custom Properties**

- Define `--grid-gap` for spacing between columns (default: `1rem`)
- Define `--grid-column-min-width` for minimum column width before wrapping (default: `250px`)
- Follow TeaserBlockView pattern for scoped CSS with custom properties
- Properties should be overridable by parent containers for theming

**Responsive Behavior**

- 4-column grid may become 2x2 on medium screens, 1x4 on narrow screens
- 3-column grid may become 2+1 or 1x3 based on available space
- No explicit media queries for breakpoints; rely on flex-wrap and min-width
- Columns should expand equally to fill available space

## Existing Code to Leverage

**RenderBlocks.svelte**

- Located at `/workspace/src/lib/RenderBlocks.svelte`
- Iterates over `content.blocks_layout.items` and renders block components
- Call recursively for each column, passing column data as `content` prop
- Pass `blocksConfig`, `pathname`, and `metadata` props through

**Block Registry Pattern**

- Located at `/workspace/src/lib/blocks/index.ts`
- Standard registration format with `id`, `title`, `view` properties
- Import GridBlockView and add to blocks object

**TeaserBlockView CSS Pattern**

- Located at `/workspace/src/lib/blocks/teaser/TeaserBlockView.svelte`
- Shows CSS custom properties definition in scoped style block
- Demonstrates flex layout with alignment classes
- Reference for BEM-style class naming (`block teaser`, `teaser-item`)

**Volto Grid Block Reference**

- Located at `/workspace/volto-svolto/seven-svolto/core/packages/volto/src/components/manage/Blocks/Grid/View.jsx`
- Shows column count class logic (`one`, `two`, `three`, `four`)
- Demonstrates headline rendering pattern
- Shows data structure: `data.blocks_layout.items` for columns

## Out of Scope

- Nested grids (grid block inside another grid block's column)
- Variable-width columns (e.g., 2/3 + 1/3 split layouts)
- Listing block support (not yet implemented in Svolto)
- Configurable heading levels (h2 only, not h3/h4/etc.)
- Fixed breakpoint responsive behavior (no media queries)
- Style variations or themes beyond base implementation
- Edit mode or block editing UI (view-only component)
- Server-side rendering considerations beyond SvelteKit defaults
- Accessibility enhancements beyond semantic HTML structure
- Animation or transition effects for responsive layout changes
