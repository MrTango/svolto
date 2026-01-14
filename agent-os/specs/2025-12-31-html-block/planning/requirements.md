# Spec Requirements: HTML Block

## Initial Description

HTML block, same features as Seven/Volto. The HTML block renders raw HTML content from Plone, using a simple data structure where `data.html` contains the raw HTML string.

## Requirements Discussion

### First Round Questions

**Q1:** HTML Sanitization - Should we implement sanitization on the Svolto side or rely on Volto/Plone to provide pre-sanitized content?
**Answer:** Not our problem for now - relying on Volto for editing/sanitization.

**Q2:** CSS Class Compatibility - Should we match Volto's class names (e.g., `block html`) for styling compatibility, or use Svolto's own naming scheme?
**Answer:** Priority is Svolto's own naming scheme (not Volto's class names).

**Q3:** Script Tag Handling - How should we handle `<script>` tags if present in the HTML content?
**Answer:** Volto is sanitizing this already - no need to handle on our end.

**Q4:** Empty State - How should the block behave when `data.html` is empty or undefined?
**Answer:** Invisible block (render nothing when empty).

**Q5:** Styling Support - Should the HTML block support Volto's styling variations (alignment, custom CSS classes)?
**Answer:** Yes, should support styling variations (alignment, custom CSS classes).

**Q6:** Exclusions - Anything that should explicitly NOT be part of this implementation?
**Answer:** Not mentioned (assume standard exclusions - no Edit component).

### Existing Code to Reference

No similar existing features identified for reference. However, other Svolto blocks in `src/lib/blocks/` follow established patterns that should be referenced for consistency.

### Follow-up Questions

No follow-up questions needed - all requirements are clear.

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

Not applicable.

## Requirements Summary

### Functional Requirements

- Render raw HTML content from `data.html` property
- Use Svelte's `{@html}` directive to render the HTML content
- Support empty state by rendering nothing when `data.html` is empty, undefined, or whitespace-only
- Support styling variations including:
  - Alignment options (left, center, right)
  - Custom CSS classes from block data
- Trust that content is pre-sanitized by Volto (no client-side sanitization needed)

### Technical Considerations

- Follow Svolto's CSS class naming conventions (not Volto's `block html` pattern)
- Use Svelte 5 with `$props()` for component props
- Standard block props: `key`, `id`, `data`, `metadata`, `properties`, `path`, `blocksConfig`
- Register block in `src/lib/blocks/index.ts`
- No script tag handling required (Volto sanitizes these)
- View component only (no Edit component - editing happens in Volto)

### Scope Boundaries

**In Scope:**

- View component for rendering HTML content
- Empty state handling (render nothing)
- Styling variation support (alignment, custom CSS classes)
- Block registration in blocks config
- Unit tests for the component

**Out of Scope:**

- Edit component (editing happens in Volto)
- HTML sanitization (handled by Volto)
- Script tag handling (sanitized by Volto)
- Preview mode toggle
- Code syntax highlighting
- Code formatting/prettifying

### Data Structure

```javascript
{
  "@type": "html",
  "html": "<p>Raw HTML content here</p>",
  "styles": {
    "align": "left" | "center" | "right",  // optional
    "customCss": "custom-class-name"        // optional
  }
}
```
