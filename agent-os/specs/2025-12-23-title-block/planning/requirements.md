# Spec Requirements: Title Block

## Initial Description

Title Block - Render content title with configurable heading level and styling hooks [XS size]

This is a standard Plone block that displays the content's title. It should support:

- Configurable heading level (h1-h6)
- Styling hooks for theming
- Integration with the existing block registration system

## Requirements Discussion

### First Round Questions

**Q1:** The standard Volto Title block renders a fixed `<h1>` with the class `documentFirstHeading`. I assume we want to follow this convention by default (h1), but also allow a configurable heading level (h1-h6) for cases where the title block might be used in different contexts. Is that correct, or should it always be h1?
**Answer:** Title is only H1, as in Volto (no configurable heading levels)

**Q2:** I'm thinking the title data should come from the content object's `title` property (following Volto's pattern of `(metadata || properties)['title']`). Currently, blocks receive `key`, `id`, and `data` props. Should the Title block also receive the parent `content` object to access the title, or should it expect the title in the block's `data` prop?
**Answer:** If Volto gets it from data, then we do the same (follow Volto's pattern exactly)

**Q3:** For CSS styling hooks, I assume we should follow the existing pattern of adding a `block title` class (similar to how ImageBlock uses `block image` and SlateBlock uses `block slate`), plus Volto's `documentFirstHeading` class for compatibility. Should we also add a heading-level-specific class like `title-h1`, `title-h2`, etc.?
**Answer:** Stick with `documentFirstHeading` class, not classes like `title-h1`

**Q4:** I assume this block should be purely presentational with no interactive behavior (no edit mode, just view). Is that correct, or are there any interactive features needed?
**Answer:** Yes, purely presentational (no interactive behavior)

**Q5:** Should the Title block support any style variations (e.g., centered, underlined, with decorative element)? Or should styling be handled purely through CSS/theming hooks?
**Answer:** Pure CSS for styling (no built-in style variations)

**Q6:** Is there anything that should be explicitly excluded from this implementation? For example, should we NOT support certain heading levels, or NOT include any specific Volto behaviors?
**Answer:** No explicit exclusions mentioned

### Existing Code to Reference

**Similar Features Identified:**

- Feature: Existing block components - Path: `/home/maik/develop/svelteplayground/svolto/src/lib/blocks/`
- Feature: Image block (simple view-only block) - Path: `/home/maik/develop/svelteplayground/svolto/src/lib/blocks/image/ImageBlockView.svelte`
- Feature: Slate block - Path: `/home/maik/develop/svelteplayground/svolto/src/lib/blocks/slate/SlateBlockView.svelte`
- Feature: Block registration - Path: `/home/maik/develop/svelteplayground/svolto/src/lib/blocks/index.ts`
- Feature: RenderBlocks component - Path: `/home/maik/develop/svelteplayground/svolto/src/lib/RenderBlocks.svelte`
- Components to potentially reuse: Svelte 5 props pattern (`let { key, id, data, ...others } = $props()`)

### Follow-up Questions

No follow-up questions needed - requirements are clear.

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

Not applicable - this is a simple block following established Volto patterns.

## Requirements Summary

### Functional Requirements

- Render the content title as an `<h1>` heading element
- Follow Volto's data access pattern: `(metadata || properties)['title']` with empty string fallback
- Apply `documentFirstHeading` CSS class for Volto compatibility
- Integrate with existing block registration system in `/home/maik/develop/svelteplayground/svolto/src/lib/blocks/index.ts`
- Accept standard block props: `key`, `id`, `data` (and potentially `properties`/`metadata` following Volto pattern)

### Reusability Opportunities

- Follow existing block component pattern from ImageBlockView.svelte
- Use established Svelte 5 props destructuring pattern
- Register in blocks/index.ts following existing image/slate block pattern

### Scope Boundaries

**In Scope:**

- TitleBlockView.svelte component
- Fixed H1 heading element
- `documentFirstHeading` CSS class
- Block registration in index.ts
- TypeScript typing for props

**Out of Scope:**

- Configurable heading levels (h2-h6)
- Edit mode/interactive behavior
- Built-in style variations
- Heading-level-specific CSS classes

### Technical Considerations

- Volto Reference: Title block View component renders `<h1 className="documentFirstHeading">{title}</h1>`
- Data pattern: `(metadata || properties)['title'] || ''`
- Must work with RenderBlocks component which passes `key`, `id`, and `data` props
- RenderBlocks also has access to full `content` object - may need to pass `properties`/`metadata` to match Volto pattern
- Follow Svelte 5 runes syntax with `$props()`
- Component should be in `/home/maik/develop/svelteplayground/svolto/src/lib/blocks/title/TitleBlockView.svelte`
