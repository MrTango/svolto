# Task Breakdown: Grid Block Implementation

## Overview

Total Tasks: 17 sub-tasks across 4 task groups

This implementation creates a Grid Block component for Svolto that renders Plone/Volto grid blocks with 1-4 equal-width columns, supporting responsive flexbox layout with natural wrapping and recursive nested block rendering.

## Task List

### Component Setup

#### Task Group 1: GridBlockView Component Foundation

**Dependencies:** None

- [x] 1.0 Complete GridBlockView component setup
  - [x] 1.1 Write 4-6 focused tests for GridBlockView functionality
    - Test grid renders with valid `data.blocks_layout` structure
    - Test grid returns empty/null when `data.blocks_layout` is undefined
    - Test headline renders as h2 when `data.headline` is truthy
    - Test headline does not render when `data.headline` is falsy
    - Test column count class is applied correctly (`one`, `two`, `three`, `four`)
    - Test nested blocks are rendered via RenderBlocks recursion
  - [x] 1.2 Create directory structure at `/workspace/src/lib/blocks/grid/`
    - Create the grid folder under `/workspace/src/lib/blocks/`
  - [x] 1.3 Create `GridBlockView.svelte` component with Svelte 5 runes
    - Use `$props()` for: `key`, `id`, `data`, `metadata`, `properties`, `path`
    - Use `$derived()` for computed values (column count class, headline display)
    - Follow pattern from TeaserBlockView.svelte and SlateBlockView.svelte
  - [x] 1.4 Implement guard clause for undefined `blocks_layout`
    - Return early/empty when `data.blocks_layout` is undefined
    - Match Volto reference: `if (data.blocks_layout === undefined) return null`
  - [x] 1.5 Ensure GridBlockView component tests pass
    - Run ONLY the 4-6 tests written in 1.1
    - Verify guard clause and basic rendering work
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**

- The 4-6 tests written in 1.1 pass
- Component created with proper Svelte 5 runes syntax
- Guard clause prevents rendering when blocks_layout is undefined
- Directory structure follows existing block patterns

### Core Implementation

#### Task Group 2: Grid Layout and Nested Blocks

**Dependencies:** Task Group 1

- [x] 2.0 Complete grid layout implementation
  - [x] 2.1 Write 4-6 focused tests for grid layout and nested block rendering
    - Test 1-column grid applies class `one`
    - Test 2-column grid applies class `two`
    - Test 3-column grid applies class `three`
    - Test 4-column grid applies class `four`
    - Test RenderBlocks receives correct props for each column
    - Test nested blocksConfig excludes `gridBlock` (prevents nested grids)
  - [x] 2.2 Implement column count class logic
    - Read column count from `data.blocks_layout.items.length`
    - Apply BEM-style classes: `block grid one|two|three|four`
    - Use `$derived()` to compute class string dynamically
  - [x] 2.3 Implement optional headline rendering
    - Render `<h2 class="headline">{data.headline}</h2>` when truthy
    - Use Svelte `{#if data.headline}` conditional
    - Position headline above the grid container
  - [x] 2.4 Implement column iteration and nested RenderBlocks
    - Iterate over `data.blocks_layout.items` array (column IDs)
    - For each column ID, access column data from `data.blocks[columnId]`
    - Import and use RenderBlocks component recursively
    - Pass column data as `content` prop to RenderBlocks
  - [x] 2.5 Configure nested blocksConfig to prevent nested grids
    - Create filtered blocksConfig excluding `gridBlock`
    - Support only: `slate`, `image`, `teaser` as nested blocks
    - Pass filtered config to nested RenderBlocks instances
  - [x] 2.6 Pass required props to nested RenderBlocks
    - Props: `content` (column data), `blocksConfig` (filtered), `pathname` (path), `metadata`
    - Follow existing RenderBlocks interface from `/workspace/src/lib/RenderBlocks.svelte`
  - [x] 2.7 Ensure grid layout tests pass
    - Run ONLY the 4-6 tests written in 2.1
    - Verify column classes and nested rendering work
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**

- The 4-6 tests written in 2.1 pass
- Correct column count classes applied based on items array length
- Headline renders conditionally above grid
- Nested blocks render via recursive RenderBlocks calls
- Nested grids are prevented via blocksConfig filtering

### Styling

#### Task Group 3: Flexbox CSS and Responsive Layout

**Dependencies:** Task Group 2

- [x] 3.0 Complete CSS styling implementation
  - [x] 3.1 Write 2-4 focused tests for responsive layout behavior
    - Test grid container has correct flexbox properties
    - Test columns have min-width constraint applied
    - Test CSS custom properties are defined and overridable
    - Test flex-wrap enables natural column wrapping
  - [x] 3.2 Implement CSS custom properties for theming
    - Define `--grid-gap: 1rem` for column spacing
    - Define `--grid-column-min-width: 250px` for wrapping threshold
    - Follow TeaserBlockView pattern for scoped CSS custom properties
    - Ensure properties are overridable by parent containers
  - [x] 3.3 Implement flexbox grid container styles
    - Apply `display: flex` to grid container
    - Apply `flex-wrap: wrap` for natural column wrapping
    - Apply `gap: var(--grid-gap)` for column spacing
    - Use scoped `<style>` block following existing patterns
  - [x] 3.4 Implement column flex item styles
    - Calculate `flex-basis` based on column count (e.g., `calc(25% - gap)` for 4 cols)
    - Apply `min-width: var(--grid-column-min-width)` for wrap threshold
    - Apply `flex-grow: 1` so columns expand to fill available space
    - Ensure equal-width columns within the available space
  - [x] 3.5 Ensure CSS styling tests pass
    - Run ONLY the 2-4 tests written in 3.1
    - Verify flexbox properties render correctly
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**

- The 2-4 tests written in 3.1 pass
- CSS custom properties defined for gap and min-width
- Flexbox layout with wrap behavior implemented
- Columns expand equally and wrap naturally based on min-width
- No fixed media query breakpoints (mobile-first elastic design)

### Integration

#### Task Group 4: Block Registration and Integration Testing

**Dependencies:** Task Group 3

- [x] 4.0 Complete block registration and integration
  - [x] 4.1 Import GridBlockView in `/workspace/src/lib/blocks/index.ts`
    - Add import statement: `import GridBlockView from './grid/GridBlockView.svelte'`
    - Follow existing import pattern from other blocks
  - [x] 4.2 Register gridBlock in blocks object
    - Add: `gridBlock: { id: 'gridBlock', title: 'Grid', view: GridBlockView }`
    - Block type key is `gridBlock` (matches Plone data `@type`)
    - Follow existing registration pattern
  - [x] 4.3 Run feature-specific tests only
    - Run ONLY tests related to Grid Block (tests from 1.1, 2.1, 3.1)
    - Expected total: approximately 10-16 tests
    - Verify all critical grid functionality works
    - Do NOT run the entire application test suite
  - [x] 4.4 Verify grid block renders in development environment
    - Start dev server with `pnpm dev`
    - Test with Plone backend containing grid block content
    - Verify nested slate, image, and teaser blocks render within grid columns

**Acceptance Criteria:**

- GridBlockView properly exported from blocks index
- Block registered with correct `gridBlock` id
- All feature-specific tests pass (approximately 10-16 tests)
- Grid block renders correctly with real Plone content
- Nested blocks render correctly within grid columns

## Execution Order

Recommended implementation sequence:

1. **Task Group 1: Component Setup** - Create the basic component structure with guard clause
2. **Task Group 2: Core Implementation** - Add column logic, headline, and nested block rendering
3. **Task Group 3: Styling** - Apply flexbox CSS and responsive behavior
4. **Task Group 4: Integration** - Register block and verify end-to-end functionality

## Technical Notes

### Data Structure Reference

Grid block data from Plone follows this structure:

```typescript
{
  "@type": "gridBlock",
  "headline": "Optional Grid Headline",  // optional
  "blocks": {
    "column-uuid-1": {
      "blocks": { ... },
      "blocks_layout": { "items": [...] }
    },
    "column-uuid-2": {
      "blocks": { ... },
      "blocks_layout": { "items": [...] }
    }
  },
  "blocks_layout": {
    "items": ["column-uuid-1", "column-uuid-2"]  // column IDs
  }
}
```

### File Locations

| File                    | Path                                                          |
| ----------------------- | ------------------------------------------------------------- |
| GridBlockView component | `/workspace/src/lib/blocks/grid/GridBlockView.svelte`         |
| Block registry          | `/workspace/src/lib/blocks/index.ts`                          |
| RenderBlocks (reuse)    | `/workspace/src/lib/RenderBlocks.svelte`                      |
| Test file               | `/workspace/src/lib/blocks/grid/GridBlockView.svelte.test.ts` |

### CSS Class Naming

Following BEM-style patterns from existing blocks:

- Container: `block grid` + column count class (`one`, `two`, `three`, `four`)
- Headline: `headline`
- Column wrapper: `grid-column`

### Props Interface

```typescript
// GridBlockView props (following existing block patterns)
{
  key: string;        // Block key/identifier
  id: string;         // Block ID
  data: {             // Block data from Plone
    headline?: string;
    blocks: Record<string, BlockData>;
    blocks_layout: { items: string[] };
  };
  metadata?: object;  // Content metadata
  properties?: object; // Parent content properties
  path?: string;      // Current path/pathname
  blocksConfig?: object; // Block configuration registry (added in Task Group 2)
}
```
