# Specification: Description Block

## Goal

Create a DescriptionBlockView component that renders the content description/lead text as a `<p>` paragraph element with the `documentDescription` CSS class, following Seven/Volto patterns for data access and supporting optional text truncation.

## User Stories

- As a content consumer, I want to see the page description/lead text rendered with proper semantic markup so that I understand the content context
- As a developer, I want the Description block to follow established Seven patterns so that the codebase remains consistent and maintainable

## Specific Requirements

**DescriptionBlockView Component**

- Create `DescriptionBlockView.svelte` in `/home/maik/develop/svelteplayground/svolto/src/lib/blocks/description/`
- Use Svelte 5 runes syntax with `$props()` for props destructuring
- Render a `<p>` element with `documentDescription` CSS class
- Access description via `(metadata || properties)['description']` pattern with empty string fallback
- Always render the `<p>` element even when description is empty
- Accept props: `id`, `data`, `metadata`, `properties`, `path` (following Seven's BlockViewProps)

**Data Access Pattern**

- Primary data source: `metadata?.description` (for nested/container contexts)
- Fallback data source: `properties?.description` (for direct content rendering)
- Final fallback: empty string `''`
- This matches Seven's pattern: `(metadata || properties)['description'] || ''`

**Truncation Support**

- Support optional `maxLength` configuration via block data (`data.maxLength`)
- When `maxLength` is set and description exceeds it, truncate at word boundary
- Append ellipsis (`...`) to truncated text
- If no word boundary found within limit, truncate at character limit

**CSS Class Application**

- Apply `documentDescription` class to the `<p>` element for Volto CSS compatibility
- No additional styling within the component; rely on external CSS

**Block Registration**

- Register the block in `/home/maik/develop/svelteplayground/svolto/src/lib/blocks/index.ts`
- Follow existing pattern: `{ id: 'description', title: 'Description', view: DescriptionBlockView }`
- Import using: `import DescriptionBlockView from "./description/DescriptionBlockView.svelte"`

**RenderBlocks Enhancement**

- Update RenderBlocks to pass `metadata` prop to block components (following Seven's pattern)
- Current implementation already passes `properties={content}`, which is correct
- Add `metadata` prop support for container/nested block scenarios
- Pass `path={pathname}` to align with Seven's interface

## Visual Design

No visual assets provided. The component renders as a simple paragraph element styled by external CSS.

## Existing Code to Leverage

**TitleBlockView.svelte (`/home/maik/develop/svelteplayground/svolto/src/lib/blocks/title/TitleBlockView.svelte`)**

- Uses identical props pattern: `let { key, id, data, properties, ...others } = $props()`
- Accesses content property via `properties?.title`
- Same output structure needed: single semantic element with Volto-compatible class
- Replicate this pattern exactly for DescriptionBlockView

**RenderBlocks.svelte (`/home/maik/develop/svelteplayground/svolto/src/lib/RenderBlocks.svelte`)**

- Already passes `properties={content}` to block components
- Needs minor update to also pass `metadata` and `path` props
- Current component invocation: `<BlockComponent key={block} id={block} data={blockData} properties={content} />`

**blocks/index.ts (`/home/maik/develop/svelteplayground/svolto/src/lib/blocks/index.ts`)**

- Follow existing registration pattern with `id`, `title`, `view` properties
- Import pattern consistent with ImageBlockView and TitleBlockView

**Seven's DescriptionBlockView (Reference)**

- Pattern: `<p className="documentDescription">{(metadata || properties)['description'] || ''}</p>`
- Simple, focused component with single responsibility

## Out of Scope

- Edit mode or interactive editing behavior
- Rich text formatting within description (plain text only)
- Multiple style variations or themes
- Server-side rendering considerations beyond SvelteKit defaults
- Accessibility enhancements beyond semantic HTML (aria labels, etc.)
- Unit tests (per project standards, defer testing to dedicated phase)
- CSS styling definitions (external CSS handles styling)
- Integration with @plone/registry configuration system
- Internationalization or translation support
- Description fallback to other content fields
