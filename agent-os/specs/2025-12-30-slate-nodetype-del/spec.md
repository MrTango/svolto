# Specification: Slate Node Type - del

## Goal

Implement a new Slate node type `del` that renders deleted/strikethrough text using the semantic `<del>` HTML element, following Seven's approach where `del` is treated as a distinct node type from `strikethrough`.

## User Stories

- As a content editor, I want deleted text to render with proper `<del>` semantics so that screen readers and browsers correctly interpret the content as deleted text.
- As a developer, I want the `del` node type to follow the existing Slate component patterns so that the codebase remains consistent and maintainable.

## Specific Requirements

**Create Del.svelte Component**

- Create new file at `/workspace/src/lib/blocks/slate/Del.svelte`
- Follow exact same structure as `Strikethrough.svelte` and `Strong.svelte`
- Accept three props: `children`, `node`, `parent` using Svelte 5 `$props()` syntax
- Render `<del>` HTML element (not `<s>`)
- Include `slate-del` CSS class on the element
- Use `{@render children?.()}` for child content

**Register del in Leaf.svelte NodeTypes**

- Import `Del` component in `/workspace/src/lib/blocks/slate/Leaf.svelte`
- Add `del: { view: Del }` entry to the `NodeTypes` object
- Place in the inline elements section alongside `strikethrough`, `sub`, `sup`, `code`

**Styling Approach**

- Use browser default styling for `<del>` element (typically strikethrough)
- No custom CSS rules required
- The `slate-del` class exists solely for external styling hooks per project conventions

**Accessibility Considerations**

- Native `<del>` HTML semantics provide sufficient accessibility
- No additional ARIA attributes required
- Screen readers will announce content as deleted text

## Visual Design

No visual assets provided.

## Existing Code to Leverage

**Strikethrough.svelte - Primary Pattern**

- Located at `/workspace/src/lib/blocks/slate/Strikethrough.svelte`
- Uses identical component structure with `<s>` element
- Copy this pattern but substitute `<del>` element and `slate-del` class

**Strong.svelte / Em.svelte - Inline Element Pattern**

- Located at `/workspace/src/lib/blocks/slate/Strong.svelte`
- Simple inline components with consistent prop interface
- 8 lines of code each - follow this minimal structure

**Leaf.svelte - Registration Pattern**

- Located at `/workspace/src/lib/blocks/slate/Leaf.svelte`
- Lines 26-49 contain the `NodeTypes` registry object
- Import pattern on lines 1-22 shows how to add new component imports
- Add `del` entry following the same pattern as `strikethrough` on line 43

**slate.svelte.test.ts - Test Pattern**

- Located at `/workspace/src/lib/blocks/slate/slate.svelte.test.ts`
- Lines 204-226 show the Strikethrough test pattern
- Follow same structure: test data with `type: 'del'`, verify `del.slate-del` selector

## Out of Scope

- `ins` (inserted text) node type - explicitly excluded from this implementation
- Custom CSS styling beyond browser defaults for the `<del>` element
- Additional ARIA attributes or accessibility enhancements
- Modifying the existing `Strikethrough.svelte` component
- Changing Seven's approach where `s` and `del` both render as `<del>` - we keep them separate
- Server-side rendering considerations beyond standard SvelteKit behavior
- Migration or backward compatibility with older content
- Documentation or changelog updates
- Performance optimizations for the component
- TypeScript type definitions beyond what exists in the codebase
