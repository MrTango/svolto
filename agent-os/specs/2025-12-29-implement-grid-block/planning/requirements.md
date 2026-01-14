# Spec Requirements: Grid Block

## Initial Description

Implement the Grid Block for Svolto - a SvelteKit-based frontend for rendering Plone CMS content (Volto Blocks). The grid block is a container block that holds other blocks in a responsive grid layout, matching the Volto/Plone grid block functionality.

## Requirements Discussion

### First Round Questions

**Q1:** I assume we should support the standard Volto grid configuration of 1-4 columns with equal-width columns. Is that correct, or should we also support variable-width columns (e.g., 2/3 + 1/3 split)?
**Answer:** Same as Volto (1-4 columns with equal-width columns)

**Q2:** For responsive behavior, I'm thinking mobile-first approach where columns stack vertically on smaller screens (matching Volto's `stackable` behavior). Should the stacking happen at a specific breakpoint (e.g., 768px), or should we support multiple configurable breakpoints?
**Answer:** Mobile first, elastic layout, no fixed breakpoints

**Q3:** The Volto Grid block supports an optional `headline` field rendered as an `<h2>` above the grid. Should we include this, and should the heading level be configurable (h2, h3, etc.)?
**Answer:** Yes, include headline but stick with h2

**Q4:** I assume all currently implemented blocks (slate, image, teaser, title, description, introduction, slateTable) should be supported as nested blocks within grid columns. Are there any blocks we should explicitly exclude or any additional container behavior needed?
**Answer:** Supported nested blocks: text/slate, image, listing, teaser (for now)

**Q5:** For styling, should we use CSS Grid or Flexbox for the layout? CSS Grid would be more modern and align with Tailwind CSS 4, but Flexbox might better match Volto's Semantic UI approach.
**Answer:** Flexbox

**Q6:** I noticed the existing blocks use scoped CSS with CSS custom properties. Should the Grid block follow this same pattern, exposing variables like `--grid-gap`, `--grid-column-min-width` for theming?
**Answer:** Yes, follow the existing pattern with scoped CSS and CSS custom properties

**Q7:** Is there anything specific you want to exclude from this implementation? For example: asymmetric column layouts, nested grids (grid within grid), or style variations?
**Answer:** Not answered in first round (addressed in follow-ups)

### Existing Code to Reference

**Similar Features Identified:**

- Feature: RenderBlocks - Path: `/workspace/src/lib/RenderBlocks.svelte`

  - Main block rendering loop that iterates over `blocks_layout.items` and renders appropriate block components
  - Will need to be reused/called recursively for nested blocks within grid columns

- Feature: Block Registry - Path: `/workspace/src/lib/blocks/index.ts`

  - Block type registry with `{id, title, view}` configuration pattern
  - Grid block will be registered here following the same pattern

- Feature: TeaserBlockView - Path: `/workspace/src/lib/blocks/teaser/TeaserBlockView.svelte`

  - Example of scoped CSS with CSS custom properties
  - Shows responsive flex layout patterns with alignment classes
  - Good reference for mobile-first responsive behavior

- Feature: Volto Grid Block Reference - Path: `/workspace/volto-svolto/seven-svolto/core/packages/volto/src/components/manage/Blocks/Grid/View.jsx`
  - Reference React implementation showing:
    - Column count classes (`one`, `two`, `three`, `four`)
    - Headline rendering as `<h2>`
    - Recursive RenderBlocks usage for nested content
    - Data structure: `data.blocks_layout.items` for columns

### Follow-up Questions

**Follow-up 1:** You mentioned "elastic layout, no fixed breakpoints" for responsive behavior. To clarify: should columns remain side-by-side and simply shrink proportionally until content becomes unreadable, at which point they stack? Or should we use CSS `flex-wrap` so columns naturally wrap when there isn't enough space (e.g., a 4-column grid might become 2x2 on medium screens, then 1x4 on mobile)?
**Answer:** Use `flex-wrap` together with `min-max` for the content of the columns (so columns naturally wrap when there isn't enough space)

**Follow-up 2:** Should we support nested grids (a grid block inside another grid block's column)? The Volto implementation supports this, but it adds complexity.
**Answer:** No - do not support nested grids (grid inside grid)

**Follow-up 3:** You mentioned "listing" as a supported nested block, but I don't see a Listing block implemented in Svolto yet (it's item #9 on the roadmap). Should we include listing in the allowed block types for future compatibility, or exclude it until the Listing block is built?
**Answer:** Exclude it for now - only include blocks that are already implemented

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

N/A - No visual files were uploaded to the visuals folder.

## Requirements Summary

### Functional Requirements

- Render a grid container block that can hold other blocks in columns
- Support 1-4 equal-width columns (matching Volto's grid templates)
- Include optional headline field rendered as `<h2 class="headline">` above the grid
- Recursively render nested blocks within each column using the existing RenderBlocks pattern
- Support the following nested block types (currently implemented blocks only):
  - `slate` (text/rich text)
  - `image`
  - `teaser`
- Read column configuration from `data.blocks_layout.items` (Volto data structure)
- Apply CSS classes based on column count: `one`, `two`, `three`, `four`

### Technical Requirements

- Use Flexbox for layout (not CSS Grid)
- Mobile-first, elastic responsive design with no fixed breakpoints
- Use `flex-wrap` with `min-width` constraints so columns naturally wrap when space is insufficient
- Follow existing scoped CSS pattern with CSS custom properties for theming (e.g., `--grid-gap`, `--grid-column-min-width`)
- Register block in `/workspace/src/lib/blocks/index.ts` with `{id: 'gridBlock', title: 'Grid', view: GridBlockView}`
- Create component at `/workspace/src/lib/blocks/grid/GridBlockView.svelte`

### Reusability Opportunities

- Reuse `RenderBlocks.svelte` for rendering nested blocks within columns
- Follow the same component structure as existing blocks (TeaserBlockView, ImageBlockView)
- CSS custom property pattern from TeaserBlockView for theming hooks

### Scope Boundaries

**In Scope:**

- 1-4 equal-width column layouts
- Optional headline (h2 only)
- Flexbox-based responsive layout with natural wrapping
- CSS custom properties for gap and column min-width
- Nested blocks: slate, image, teaser
- Block registration and integration with existing RenderBlocks system

**Out of Scope:**

- Nested grids (grid block inside grid block) - explicitly excluded
- Variable-width columns (e.g., 2/3 + 1/3 splits)
- Listing block support (until Listing block is implemented)
- Configurable heading levels (h2 only)
- Fixed breakpoint responsive behavior
- Style variations beyond the base implementation

### Technical Considerations

- The Volto Grid block data structure uses `data.blocks_layout.items` as an array of column IDs, with each column containing its own `blocks` and `blocks_layout`
- The grid block is a "container" block that must pass `blocksConfig` and `metadata` down to nested blocks
- Svelte 5 runes syntax (`$props()`, `$derived()`) should be used following existing block patterns
- The block should handle the case where `data.blocks_layout` is undefined (return null/empty)
