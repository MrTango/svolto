# Spec Requirements: Slate Node Type - del

## Initial Description

Implement slate nodeType: del

This is about implementing a new node type "del" (strikethrough/deletion) for the Slate rich text editor rendering in the Svolto project.

## Requirements Discussion

### First Round Questions

**Q1:** HTML Element Mapping - Should the `del` node type render as:
(a) `<s>` element (reuse existing Strikethrough.svelte), or
(b) `<del>` element (follow Seven's approach where both `s` and `del` render as `<del>`)
**Answer:** Option (b) - Follow Seven's approach where both `s` and `del` render as `<del>`

**Q2:** CSS Class Naming - Should we use `slate-del` class following the existing pattern (e.g., `slate-strong`, `slate-strikethrough`)?
**Answer:** Yes, use `slate-del` following the existing pattern

**Q3:** Custom Styling - Should we add any custom CSS for the `<del>` element, or use browser defaults?
**Answer:** Browser default for now (no custom CSS)

**Q4:** Accessibility - Do we need any additional ARIA attributes or accessibility considerations beyond the native `<del>` semantics?
**Answer:** Native HTML `<del>` semantics is sufficient for now

**Q5:** Unit Tests - Should we add unit tests following the existing pattern in `slate.svelte.test.ts`?
**Answer:** Yes, add unit tests following the existing pattern

**Q6:** Out of Scope - Is there anything explicitly out of scope (e.g., NOT implementing `ins` node type for inserted text)?
**Answer:** Only implementing `del` node type, NOT implementing `ins` node type

### Existing Code to Reference

**Similar Features Identified:**
- Feature: Strikethrough component - Path: `/workspace/src/lib/blocks/slate/Strikethrough.svelte`
- Feature: Strong component (pattern example) - Path: `/workspace/src/lib/blocks/slate/Strong.svelte`
- Feature: Leaf component (node type registry) - Path: `/workspace/src/lib/blocks/slate/Leaf.svelte`
- Feature: Slate unit tests - Path: `/workspace/src/lib/blocks/slate/slate.svelte.test.ts`

Components to potentially reuse: The same component structure as `Strikethrough.svelte` and `Strong.svelte`
Backend logic to reference: Node type registration pattern in `Leaf.svelte` (NodeTypes object)

## Visual Assets

### Files Provided:

No visual assets provided.

## Requirements Summary

### Functional Requirements

- Create a new `Del.svelte` component that renders `<del>` HTML element
- Add `slate-del` CSS class to the element for styling consistency
- Register the `del` node type in `Leaf.svelte`'s NodeTypes object
- Use browser default styling (no custom CSS)
- Follow the existing component pattern (accepts `children`, `node`, `parent` props)

### Reusability Opportunities

- Follow exact same pattern as `Strikethrough.svelte` component
- Reuse component structure from `Strong.svelte`
- Add to NodeTypes registry in `Leaf.svelte` following existing pattern

### Scope Boundaries

**In Scope:**
- New `Del.svelte` component
- Registration in `Leaf.svelte` NodeTypes
- Unit tests following existing pattern
- CSS class `slate-del` on the element

**Out of Scope:**
- `ins` (inserted text) node type - explicitly excluded
- Custom CSS styling beyond browser defaults
- Additional accessibility attributes beyond native `<del>` semantics
- Modifying existing `Strikethrough.svelte` component

### Technical Considerations

- The `del` node type is distinct from `strikethrough` (which uses `<s>` element)
- Seven's approach is to render both as `<del>`, but we are adding `del` as a separate node type
- Component should accept same props as other inline elements: `children`, `node`, `parent`
- Integration point: `Leaf.svelte` NodeTypes registry
- Test file location: `/workspace/src/lib/blocks/slate/slate.svelte.test.ts`
