# Spec Requirements: Description Block

## Initial Description

Description Block - Render content description/lead text with proper semantic markup [XS size]

This is a standard Plone block that displays the content's description/lead text. It should:

- Follow Volto's pattern for description blocks
- Use proper semantic markup
- Integrate with the existing block registration system

## Requirements Discussion

### First Round Questions

**Q1:** The standard Volto Description block renders a `<p className="documentDescription">` paragraph containing the description text. I assume we should follow this exact pattern - a simple `<p>` element with the `documentDescription` class. Is that correct, or do you prefer a different semantic element?
**Answer:** Yes, follow Volto's pattern: `<p className="documentDescription">`

**Q2:** Looking at Volto's implementation, the description data comes from `(metadata || properties)['description']`. However, the current RenderBlocks component only passes `key`, `id`, and `data` props to blocks. For the Title block spec, this was noted as a consideration. Should the Description block:

- A) Expect the description in the block's `data` prop (if that's how Plone sends it)?
- B) Receive additional `properties`/`metadata` props from RenderBlocks (following Volto exactly)?
  **Answer:** Follow Seven's implementation pattern. Research revealed that Seven's RenderBlocks passes the following props to blocks:
- `key` - block ID
- `id` - block ID
- `metadata` - metadata object (content data from parent container)
- `properties` - the full content object
- `data` - block-specific data
- `path` - pathname
- `blocksConfig` - blocks configuration

The Description block should receive `properties` and `metadata` props and access description via `(metadata || properties)['description']`

**Q3:** I assume this block should handle empty/missing descriptions gracefully by rendering an empty paragraph or not rendering at all. Which behavior do you prefer: render an empty `<p class="documentDescription"></p>`, or render nothing when there's no description?
**Answer:** Render an empty `<p class="documentDescription"></p>` when there's no description

**Q4:** Should the Description block support any maximum length or truncation behavior, or should it always render the full description text?
**Answer:** Support maximum length/truncation

**Q5:** Is there anything that should be explicitly excluded from this implementation, or any Volto behaviors we should NOT replicate?
**Answer:** No explicit exclusions mentioned

### Existing Code to Reference

**Similar Features Identified:**

- Feature: Seven's RenderBlocks - Path: `/home/maik/develop/svelteplayground/svolto/volto-svolto/seven-svolto/core/packages/layout/blocks/RenderBlocks.tsx`
- Feature: Seven's TitleBlockView - Path: `/home/maik/develop/svelteplayground/svolto/volto-svolto/seven-svolto/core/packages/blocks/Title/TitleBlockView.tsx`
- Feature: Seven's DescriptionBlockView - Path: `/home/maik/develop/svelteplayground/svolto/volto-svolto/seven-svolto/core/packages/volto/src/components/manage/Blocks/Description/View.jsx`
- Feature: Seven's BlockViewProps type - Path: `/home/maik/develop/svelteplayground/svolto/volto-svolto/seven-svolto/core/packages/types/src/blocks/index.d.ts`
- Feature: Existing Svolto blocks - Path: `/home/maik/develop/svelteplayground/svolto/src/lib/blocks/`
- Feature: Current RenderBlocks - Path: `/home/maik/develop/svelteplayground/svolto/src/lib/RenderBlocks.svelte`
- Feature: Title Block spec - Path: `/home/maik/develop/svelteplayground/svolto/agent-os/specs/2025-12-23-title-block/planning/requirements.md`
- Components to potentially reuse: Svelte 5 props pattern (`let { ... } = $props()`)

### Follow-up Questions

No follow-up questions needed - Seven's implementation pattern is clear from the research.

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

Not applicable - this is a simple block following established Seven/Volto patterns.

## Requirements Summary

### Functional Requirements

- Render the content description as a `<p>` paragraph element
- Follow Seven's data access pattern: `(metadata || properties)['description']` with empty string fallback
- Apply `documentDescription` CSS class for Volto compatibility
- Support optional maximum length/truncation of description text
- Always render the `<p>` element (even when description is empty)
- Integrate with existing block registration system in `/home/maik/develop/svelteplayground/svolto/src/lib/blocks/index.ts`

### Props Interface (following Seven's BlockViewProps)

The Description block should accept these props (subset of Seven's BlockViewProps):

- `id: string` - block identifier
- `data: object` - block-specific data
- `metadata?: Content` - metadata object from parent container
- `properties: Content` - the full content object
- `path?: string` - current pathname

Note: The current Svolto RenderBlocks needs to be updated to pass `properties` and `metadata` props to blocks (following Seven's pattern).

### Truncation Requirements

- Support an optional `maxLength` prop or configuration option
- When truncation is enabled:
  - Truncate at word boundaries when possible
  - Add ellipsis (...) to indicate truncation
  - Consider CSS-based truncation (`text-overflow: ellipsis`) as an alternative

### Reusability Opportunities

- Follow Seven's TitleBlockView pattern exactly
- Use established Svelte 5 props destructuring pattern
- Register in blocks/index.ts following existing image/slate block pattern
- RenderBlocks update will benefit all blocks needing content properties

### Scope Boundaries

**In Scope:**

- DescriptionBlockView.svelte component
- `<p>` paragraph element with `documentDescription` class
- Data access via `(metadata || properties)['description']`
- Optional truncation support
- Block registration in index.ts
- TypeScript typing for props

**Out of Scope:**

- Edit mode/interactive behavior
- Built-in style variations beyond CSS class
- Rich text formatting within description (it's plain text)

### Technical Considerations

- Seven Reference: Description block View renders `<p className="documentDescription">{description}</p>`
- Data pattern: `(metadata || properties)['description'] || ''`
- RenderBlocks currently passes only `key`, `id`, and `data` - needs update to pass `properties` and `metadata`
- Follow Svelte 5 runes syntax with `$props()`
- Component should be in `/home/maik/develop/svelteplayground/svolto/src/lib/blocks/description/DescriptionBlockView.svelte`

### Seven's RenderBlocks Props Reference

From `/home/maik/develop/svelteplayground/svolto/volto-svolto/seven-svolto/core/packages/layout/blocks/RenderBlocks.tsx`:

```tsx
<Block
	key={block}
	id={block}
	metadata={metadata}
	properties={content}
	data={blockData}
	path={pathname || ''}
	blocksConfig={blocksConfig}
/>
```

### Seven's DescriptionBlockView Reference

From `/home/maik/develop/svelteplayground/svolto/volto-svolto/seven-svolto/core/packages/volto/src/components/manage/Blocks/Description/View.jsx`:

```jsx
const DescriptionBlockView = ({ properties, metadata }) => {
	return <p className="documentDescription">{(metadata || properties)['description'] || ''}</p>;
};
```
