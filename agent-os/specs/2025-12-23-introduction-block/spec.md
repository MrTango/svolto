# Specification: Introduction Block

## Goal

Create a view component for rendering styled introductory/lead text with prominent styling and full Slate rich text support, displayed wider than standard text blocks.

## User Stories

- As a content editor, I want to add an Introduction block to pages so that I can create visually prominent lead text that draws readers into the content.
- As a frontend developer, I want to theme the Introduction block using CSS custom properties so that I can customize its appearance across different site designs.

## Specific Requirements

**IntroductionBlockView Component**

- Create `IntroductionBlockView.svelte` in `src/lib/blocks/introduction/` directory
- Use Svelte 5 `$props()` pattern: `let { key, id, data, ...others } = $props()`
- Wrap content in a `<div>` element with class `introduction-block`
- Read content from `data.value` which contains Slate node array

**Slate Rich Text Rendering**

- Reuse existing `Leaf.svelte` component from `src/lib/blocks/slate/`
- Follow SlateBlockView pattern: create editor object with `{ children: data.value || [] }`
- Iterate over `editor.children` and render each node via `Leaf` component
- All existing Slate elements supported: H2-H6, P, Ol, Ul, Li, Link, Strong, Em, Code, Blockquote, Underline, Strikethrough, Sub, Sup

**CSS Custom Properties for Theming**

- Define custom properties in `:root` within `@layer components` in `app.css`
- `--introduction-font-size`: Controls base font size (default: larger than body text)
- `--introduction-font-weight`: Controls text weight (default: inherit)
- `--introduction-color`: Controls text color (default: inherit)
- `--introduction-max-width`: Controls content width (default: wider than standard blocks)

**CSS Styling**

- Create `.introduction-block` class in `app.css` under `@layer components`
- Apply CSS custom properties to the block
- Ensure prominent visual appearance with larger font size
- Apply wider max-width than standard text blocks

**Block Registration**

- Import `IntroductionBlockView` in `src/lib/blocks/index.ts`
- Add registration object with `id: 'introduction'`, `title: 'Introduction'`, `view: IntroductionBlockView`

## Visual Design

No visual assets provided.

## Existing Code to Leverage

**SlateBlockView.svelte (`src/lib/blocks/slate/SlateBlockView.svelte`)**

- Use identical rendering pattern: create editor object from `data.value`
- Copy iteration pattern: `{#each editor.children as node}` with `<Leaf {node} parent={null} />`
- Same import structure for `Leaf` component

**Leaf.svelte (`src/lib/blocks/slate/Leaf.svelte`)**

- Reuse directly without modification
- Contains all Slate node type mappings (H2, H3, P, Ol, Ul, etc.)
- Handles recursive rendering of nested nodes

**Block Registry (`src/lib/blocks/index.ts`)**

- Follow existing pattern for block configuration objects
- Import component and add to blocks object with id, title, view properties

**app.css CSS Custom Properties Pattern**

- Follow existing `:root` custom property definitions in `@layer components`
- Use naming convention `--introduction-*` consistent with `--slate-*` pattern
- Define sensible default values with fallbacks

## Out of Scope

- Edit component (this is view-only per project scope)
- New Slate element components (reuse all existing)
- Backend or API changes
- Custom inline styles or style props on the component
- Responsive breakpoint variations (use CSS custom properties for customization)
- Animation or transition effects
- Integration with Plone content fields (uses block data only)
- Unit tests for this component
- Storybook or component documentation
- Accessibility enhancements beyond semantic HTML
