# Specification: Teaser Block

## Goal

Create a fresh teaser block component for Svolto that renders teaser content from Plone CMS, supporting multiple image alignments, responsive images via picture/srcset, content-type specific templates (starting with Event), and Volto-compatible CSS variable naming.

## User Stories

- As a content viewer, I want to see teasers with images, titles, and descriptions that link to target content so that I can navigate to related pages
- As a site administrator, I want teasers to automatically display Event-specific information (dates, times, location) when the target is an Event content type

## Specific Requirements

**Complete Teaser Structure**

- Render all teaser elements: image (optional), head_title (kicker), title (h2), and description
- Wrap entire teaser in a link (`<a>`) to the target content URL from `data.href[0]['@id']`
- Handle both customized content (when `data.overwrite` is true) and inherited content from target
- Support `data.hide_description` flag to optionally hide description
- Use semantic HTML with proper heading hierarchy (h2 for title)

**Image Alignment Options**

- Support three alignment modes via `data.styles.align`: `left`, `right`, `center`
- Left alignment: image on left, text content on right (flex-direction: row)
- Right alignment: image on right, text content on left (flex-direction: row-reverse)
- Center/Top alignment: image above text content (display: block, stacked layout)
- Apply alignment via CSS class `has--align--{left|right|center}` on block container
- Default to `left` alignment when not specified
- when teaser item has class contained, so it's rendered inside another block like grid block, it should be flex-direction: column;

**Responsive Image Handling**

- Use `<picture>` element with `<source srcset>` for responsive images
- Build srcset from `data.image_scales` or target content's `image_scales` data
- Include `sizes` attribute for browser optimization (e.g., `(max-width: 768px) 100vw, 50vw`)
- Set `loading="lazy"` on all teaser images
- Apply `aspect-ratio` via CSS custom property `--teaser-images-aspect-ratio` (default 16/9)
- Use `object-fit: cover` and `object-position` via `--teaser-images-object-position`

**Mobile Responsive Behavior**

- Stack all alignments vertically on mobile (flex-direction: column)
- Use Tailwind breakpoint for mobile detection (max-width: 768px or `md:` prefix)
- Remove side margins on image wrapper when stacked
- Image takes full width when stacked vertically

**Content-Type Template Registration Mechanism**

- Create a template registry in `src/lib/blocks/teaser/templates/index.ts`
- Register templates keyed by Plone content type (e.g., `Event`, `Document`, `News Item`)
- Look up template using `data.href[0]['@type']` from target content
- Fall back to default template when no content-type specific template exists
- Export a `getTemplateForContentType(contentType: string)` function

**Event Content-Type Template**

- Create `EventTeaserTemplate.svelte` in `src/lib/blocks/teaser/templates/`
- Display start date from target's `start` field
- Display end date from target's `end` field
- Only show time component when `whole_day` is false
- Display location from target's `location` field
- Format dates using `Intl.DateTimeFormat` for locale-aware display
- Include all standard teaser fields (image, head_title, title, description)

**CSS Custom Properties (Volto-Compatible)**

- `--teaser-images-aspect-ratio`: controls image aspect ratio (default: 16/9)
- `--teaser-images-object-position`: controls image object-position (default: top left)
- Use BEM-style class naming: `.block.teaser`, `.teaser-item`, `.image-wrapper`, `.content`, `.headline`
- Add modifier classes: `.teaser-item.default`, `.teaser-item.event`

**Graceful Handling Without Images**

- Render teaser content without image wrapper when no image is available
- Check for image via `data.preview_image`, target's `hasPreviewImage`, or `image_field`
- Ensure layout remains functional and visually balanced without image
- Text content should expand to fill available width when no image present

## Visual Design

**`planning/visuals/Screenshot 2025-12-25 at 00-08-16 Edit sample page.png`**

- Shows three alignment option icons in STYLING section: left-aligned, right-aligned, center/top
- Teaser preview shows image with title "Images" and description "Site images" below
- Target field shows content item selection ("Images" in this example)
- "Customize teaser content" checkbox controls whether to override target content fields
- Demonstrates the image-on-left layout variant with title/description on right

## Existing Code to Leverage

**Block Registration Pattern (`src/lib/blocks/index.ts`)**

- Follow the existing block configuration object structure with `id`, `title`, `view` properties
- Add teaser block to the exported `blocks` object
- Import TeaserBlockView and register with id `teaser`

**Image Handling Pattern (`src/lib/blocks/image/ImageBlockView.svelte`)**

- Reuse the srcset building pattern: iterate `image_scales` and build `${url}/${value.download} ${value.width}w`
- Use same `<picture><source srcset /><img ... /></picture>` structure
- Apply `loading="lazy"` attribute consistently

**RenderBlocks Props Pattern (`src/lib/RenderBlocks.svelte`)**

- Accept standard block props: `key`, `id`, `data`, `metadata`, `properties`, `path`
- Access block styling via `data.styles.align` for alignment
- Use `properties` for content context when needed

**SlateTableBlockView Architecture (`src/lib/blocks/slateTable/SlateTableBlockView.svelte`)**

- Reference the `$derived()` pattern for computed values
- Use similar CSS class computation pattern with modifier classes
- Follow the TypeScript typing conventions for props

**Volto Teaser Reference (`volto-svolto/frontend/core/packages/volto/src/components/manage/Blocks/Teaser/`)**

- Body.jsx shows content-type template lookup via `config.getComponent({ name: 'Teaser', dependencies: [hasType] })`
- DefaultBody.jsx shows full teaser structure with image-wrapper, content, headline, h2 title, description
- schema.js confirms alignment options: `['left', 'right', 'center']`
- teaser.less provides CSS variable names and class naming conventions to follow

## Out of Scope

- Editor/editing interface (Volto handles all content editing)
- Content-type templates beyond Event (future enhancement for News Item, Document, etc.)
- Custom image cropping, resizing, or manipulation
- Teaser grid or listing container components
- Teaser variations beyond the default template pattern
- Animation or transition effects on hover
- Dark mode styling variations
- Print stylesheet considerations
- RTL (right-to-left) language support
- Teaser block schema or configuration panel
