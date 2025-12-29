# Spec Requirements: Introduction Block

## Initial Description

Introduction Block - Styled introductory text sections for page headers (XS effort)

A block component for rendering styled introductory/lead text that appears more prominent than the Description block, typically used at the top of pages to provide context or summary.

## Requirements Discussion

### First Round Questions

**Q1:** What is the primary purpose of the Introduction block and how does it differ from the existing Description block?
**Answer:** Styled introductory/lead text with more prominent styling than Description block. Text is usually a bit wider than normal text block.

**Q2:** Should the Introduction block pull text from a content field (like Description does from `metadata.description`) or store text directly in the block data?
**Answer:** Text entered directly in the block (stored in block data), no content field.

**Q3:** Does the Introduction block need rich text support (Slate editor) or is it plain text only?
**Answer:** Full Slate support needed, same as text block - including headings and lists.

**Q4:** Should the Introduction block support theming through CSS custom properties?
**Answer:** Yes, define CSS custom properties like `--introduction-font-size`, `--introduction-font-weight`, `--introduction-color`.

**Q5:** What HTML element should wrap the Introduction content?
**Answer:** Use `<div>` tag.

**Q6:** Is this view-only (no edit component needed)?
**Answer:** View component only - no edit components for any blocks.

**Q7:** What Slate features should be supported?
**Answer:** All features available in Volto text block, including headings and lists.

### Existing Code to Reference

**Similar Features Identified:**

- Feature: DescriptionBlockView - Path: `src/lib/blocks/description/DescriptionBlockView.svelte`

  - Simple block structure with props destructuring
  - Uses CSS class for styling (`documentDescription`)
  - Reads from metadata/properties

- Feature: SlateBlockView - Path: `src/lib/blocks/slate/SlateBlockView.svelte`

  - Full Slate rendering implementation
  - Uses `data.value` for content
  - Iterates over `editor.children` with `Leaf` component
  - Pattern to follow for rich text rendering

- Feature: TitleBlockView - Path: `src/lib/blocks/title/TitleBlockView.svelte`
  - Minimal block structure example
  - Shows props pattern with `key, id, data, properties`

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

N/A

## Requirements Summary

### Functional Requirements

- Render introductory/lead text with prominent styling
- Support full Slate rich text content (same as text block)
- Support all Slate features: headings (H2, H3), lists (Ol, Ul), links, emphasis (Strong, Em)
- Read content from `data.value` (Slate format, stored in block data)
- Apply wider width than standard text blocks
- Use CSS custom properties for themability

### Technical Requirements

- Create `IntroductionBlockView.svelte` component
- Register block in `src/lib/blocks/index.ts` with id `introduction`
- Wrap content in `<div>` with appropriate class
- Reuse existing `Leaf.svelte` component for Slate rendering (same pattern as SlateBlockView)
- Define CSS custom properties:
  - `--introduction-font-size`
  - `--introduction-font-weight`
  - `--introduction-color`

### Reusability Opportunities

- Reuse `Leaf.svelte` component from slate block for rendering Slate content
- Follow same props pattern as existing blocks: `{ key, id, data, ...others }`
- Follow SlateBlockView pattern for iterating over Slate children
- Use existing Slate element components (H2, H3, Link, Strong, Em, Ol, Ul, Li)

### Scope Boundaries

**In Scope:**

- View component for Introduction block
- Slate rich text rendering with all features
- CSS custom properties for theming
- Block registration in config

**Out of Scope:**

- Edit component (view only per project scope)
- Custom Slate elements (reuse existing)
- Backend/API changes
- New Slate features beyond what text block supports

### Technical Considerations

- Component should follow Svelte 5 patterns with `$props()`
- Use existing Slate infrastructure (`Leaf.svelte` and element components)
- CSS should use Tailwind CSS 4 conventions where applicable
- Block data structure: `{ value: SlateNode[] }` (same as slate block)
