# HTML Block Spec Initialization

## Original Request

"html block, same features as seven/volto"

## Initial Research Summary

The HTML block in Seven/Volto is a straightforward block that renders raw HTML content. Based on examination of the reference implementation:

### Seven/Volto Implementation Details

**View Component** (`View.jsx`):
- Renders a simple `<div>` with class `block html`
- Uses `dangerouslySetInnerHTML` to render the HTML content
- Data structure: `data.html` contains the raw HTML string

**Edit Component** (for context):
- Uses `react-simple-code-editor` for code editing
- Includes preview mode toggle (code view vs rendered view)
- Has syntax highlighting via PrismJS
- Includes Prettier integration for code formatting
- Clear button to reset content

### Data Structure
```javascript
{
  "@type": "html",
  "html": "<p>Raw HTML content here</p>"
}
```

### Existing Svolto Block Patterns
- Blocks use Svelte 5 with `$props()` for component props
- Standard props: `key`, `id`, `data`, `metadata`, `properties`, `path`, `blocksConfig`
- CSS classes follow pattern: `block {type}` (e.g., `block html`)
- Blocks registered in `src/lib/blocks/index.ts`
