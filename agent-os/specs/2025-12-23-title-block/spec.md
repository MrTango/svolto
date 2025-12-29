# Specification: Title Block

## Goal

Create a view-only Title Block component that renders the content title as an H1 heading element, following Volto's established patterns for data access and CSS class naming.

## User Stories

- As a content viewer, I want to see the page title prominently displayed as the main heading so that I can immediately understand what the content is about
- As a developer, I want the Title Block to integrate seamlessly with the existing block system so that it renders automatically when present in Plone content

## Specific Requirements

**TitleBlockView Component**

- Create component at `/home/maik/develop/svelteplayground/svolto/src/lib/blocks/title/TitleBlockView.svelte`
- Use Svelte 5 runes syntax with `$props()` for prop destructuring
- Accept standard block props: `key`, `id`, `data`, and spread `...others`
- Component must accept `properties` prop to access content title (following Volto pattern)
- Use TypeScript with `lang="ts"` in script tag

**Title Rendering**

- Render an `<h1>` HTML element for the title text
- Apply `documentFirstHeading` CSS class to the H1 element for Volto compatibility
- Follow Volto's data access pattern: `(metadata || properties)?.title || ''`
- Display empty string if title is undefined or null (no error, just empty heading)

**Data Access Pattern**

- RenderBlocks currently passes `key`, `id`, and `data` props to blocks
- RenderBlocks has access to full `content` object which contains `title` property
- Title Block needs access to content properties - RenderBlocks must pass `properties={content}` to block components
- Title should be accessed from `properties.title` following Volto convention

**Block Registration**

- Register the Title Block in `/home/maik/develop/svelteplayground/svolto/src/lib/blocks/index.ts`
- Use block type key `title` matching Plone's block type identifier
- Follow existing registration pattern with `id`, `title`, and `view` properties

**RenderBlocks Integration**

- Update RenderBlocks.svelte to pass `properties={content}` to BlockComponent
- This enables Title Block (and future blocks) to access content-level properties
- Maintains backward compatibility as existing blocks use spread `...others`

## Visual Design

No visual mockups provided. Follow Volto's minimal design: plain H1 heading with `documentFirstHeading` class for CSS styling hooks.

## Existing Code to Leverage

**ImageBlockView.svelte**

- Demonstrates Svelte 5 props destructuring pattern: `let { key, id, data, ...others } = $props()`
- Shows TypeScript usage with `lang="ts"` script attribute
- Use as template for component structure and props interface

**SlateBlockView.svelte**

- Another example of view-only block component pattern
- Shows div wrapper with `block slate` class naming convention
- Demonstrates accessing block data from `data` prop

**Block Registration (index.ts)**

- Follow exact pattern for registering new blocks
- Import component, add to blocks object with `id`, `title`, and `view` properties
- Block key must match Plone's `@type` value for the block

**RenderBlocks.svelte**

- Currently passes `key={block} id={block} data={blockData}` to blocks
- Has access to `content` object which contains the title
- Needs modification to pass `properties={content}` for Title Block compatibility

## Out of Scope

- Configurable heading levels (h2-h6) - always renders as H1
- Edit mode or any interactive behavior
- Built-in style variations (centered, underlined, decorative elements)
- Heading-level-specific CSS classes like `title-h1`
- Custom styling beyond the `documentFirstHeading` class
- Metadata prop handling (only properties is needed for current implementation)
- Server-side rendering considerations
- Accessibility attributes beyond semantic H1 usage
- Animation or transition effects
- Block-level configuration options in the data prop
