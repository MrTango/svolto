# Specification: Text Block (Slate)

## Goal

Extend the existing partial Slate block renderer to support all standard Slate rich text elements used by Plone/Volto, providing complete rendering of headings, paragraphs, inline formatting, lists, blockquotes, links, and nested structures with themeable CSS custom properties.

## User Stories

- As a content editor, I want rich text content created in Plone/Volto to render correctly in Svolto so that my formatted content displays as intended.
- As a frontend developer, I want to customize Slate block styling using CSS custom properties so that I can theme the text block without modifying component code.

## Specific Requirements

**Heading Elements (h2-h6)**

- Support h2, h3, h4, h5, h6 elements (no h1 - handled by separate title block)
- Create new components: H4.svelte, H5.svelte, H6.svelte following existing H2/H3 pattern
- Add heading mappings to the NodeTypes registry in Leaf.svelte
- Apply CSS classes for styling hooks (e.g., `slate-h2`, `slate-h3`, etc.)

**Paragraph Elements**

- Paragraphs serve as the default/fallback element type when no specific type is specified
- Create P.svelte component following the existing component pattern
- Update NodeTypes to use paragraph as the fallback instead of text/span
- Apply `slate-paragraph` class for external styling

**Inline Text Formatting**

- Support bold (strong), italic (em), underline, strikethrough inline styles
- Create Underline.svelte and Strikethrough.svelte components
- Add new node type mappings: `underline`, `strikethrough` (or `s`/`del`)
- Use semantic HTML elements: `<u>` for underline, `<s>` or `<del>` for strikethrough

**Subscript and Superscript**

- Create Sub.svelte and Sup.svelte components
- Add `sub` and `sup` node type mappings to NodeTypes registry
- Use semantic HTML elements: `<sub>` and `<sup>`

**Inline Code**

- Create Code.svelte component for inline code styling
- Use `<code>` semantic HTML element
- Apply `slate-code` class with monospace font styling
- No syntax highlighting required (inline code only, not fenced blocks)

**Blockquote Element**

- Create Blockquote.svelte component
- Use `<blockquote>` semantic HTML element
- Apply simple left border styling (classic approach) via CSS
- CSS custom property: `--slate-blockquote-border-color`, `--slate-blockquote-border-width`

**Link Handling**

- Extend existing Link.svelte to handle all three link types
- Internal links: resolve `resolveuid` URLs to proper paths using data from parent node
- External links: render as standard `<a href>` with external URL
- Email links: handle `mailto:` protocol
- Use standard `<a href>` elements - let SvelteKit handle routing naturally
- Apply `slate-link` class for styling hooks

**List Elements**

- Extend existing Ol.svelte and Ul.svelte components
- Ensure proper nesting support for multi-level lists
- Migrate from Tailwind utility classes to CSS custom properties for consistency
- Apply `slate-ol`, `slate-ul`, `slate-li` classes

**CSS Custom Properties**

- Use block-prefixed naming convention: `--slate-*`
- Define custom properties for all themeable values (colors, spacing, borders, fonts)
- Examples: `--slate-heading-color`, `--slate-blockquote-border`, `--slate-code-bg`
- Add custom property definitions to component styles or global stylesheet
- Maintain compatibility with existing Tailwind setup (can use both approaches)

## Visual Design

No visual assets provided. Implementation should follow standard semantic HTML rendering with sensible defaults that align with the existing base styles in `app.css`.

## Existing Code to Leverage

**SlateBlockView.svelte**

- Entry point for Slate block rendering
- Iterates over `data.value` children nodes
- Passes nodes to Leaf.svelte for recursive rendering
- Remove console.log before finalizing

**Leaf.svelte**

- Core recursive renderer that maps node types to components
- Contains NodeTypes registry for component lookup
- Follow this pattern when adding new element types
- Update type definitions to include all new node types

**Existing Element Components (H2, H3, Link, Strong, Em, Ol, Ul, Li, Text)**

- Follow established pattern: `$props()` with children, node, parent
- Use `{@render children?.()}` for child content rendering
- Apply CSS classes for styling hooks on each component
- Extend Link.svelte for full URL handling logic

**app.css Base Styles**

- Base heading sizes already defined (h2: text-xl, h3: text-lg)
- Link styling with blue color and underline defined
- Use @layer components for Slate-specific styles
- Follow existing custom property patterns (e.g., `--color-blue-600`)

## Out of Scope

- H1 headings (handled by separate title block)
- Fenced code blocks with syntax highlighting
- Tables within Slate content
- Embedded media or images within Slate blocks (separate block types)
- WYSIWYG editing functionality (render-only implementation)
- Custom block-level elements beyond standard Volto Slate
- Image captions or figure elements within Slate
- Footnotes or annotations
- Mathematical equations or LaTeX rendering
- Custom text alignment or direction (RTL) beyond browser defaults
