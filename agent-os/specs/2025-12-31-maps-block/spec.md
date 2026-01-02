# Specification: Maps Block

## Goal

Implement a Maps Block component for Svolto that renders Google Maps embeds from Plone CMS content, following Volto's Maps block schema and matching the patterns established by the existing video block.

## User Stories

- As a content editor, I want to embed Google Maps on pages so that users can see location information visually
- As a site visitor using assistive technology, I want maps to have proper accessibility features so that I can understand what location is being displayed and skip past the interactive map if needed

## Specific Requirements

**MapsBlockView Component Structure**

- Create `MapsBlockView.svelte` in `/workspace/src/lib/blocks/maps/` directory
- Use Svelte 5 patterns with `$props()` for receiving block data and `$derived()` for computed values
- Accept standard block props: `key`, `id`, `data`, `metadata`, `properties`, `path`, `blocksConfig`
- Data structure follows Volto schema: `{ url, title, align }` where url is the Google Maps embed URL

**Google Maps Iframe Rendering**

- Render Google Maps embed URLs directly in an iframe element
- Set `src` attribute from `data.url` field
- Add `loading="lazy"` attribute for performance optimization
- Add `referrerpolicy="no-referrer-when-downgrade"` for security
- Add `allowfullscreen` attribute for expanded map viewing
- Use `frameborder="0"` or CSS `border: 0` to remove iframe border

**Alignment Support**

- Read alignment from `data.styles?.align` or `data.align`, defaulting to `'full'`
- Apply CSS class pattern `has--align--${alignment}` matching video block convention
- Support alignment values: `full`, `left`, `center`, `right`
- Block container class: `block maps has--align--${alignment}`

**Responsive Wrapper**

- Wrap iframe in `div.maps-wrapper` for aspect ratio control
- Use CSS custom property `--maps-aspect-ratio` defaulting to `16/9`
- Use `aspect-ratio` CSS property on wrapper with 100% width
- Iframe should fill wrapper at 100% width and height

**Accessibility Implementation**

- Add `title` attribute on iframe from `data.title` with fallback to `'Google Maps embed'`
- Add `role="region"` on `.maps-wrapper` to create a landmark region
- Add `aria-label` on wrapper using `data.title` or fallback `'Map location'`
- Implement skip link before iframe: `<a href="#after-map-{id}" class="skip-map-link">Skip map</a>`
- Add target anchor `<span id="after-map-{id}"></span>` after the wrapper
- Style skip link with `sr-only` pattern, visible on keyboard focus

**Noscript Fallback**

- Include `<noscript>` element after the wrapper
- Display text with link: "View [title or 'this location'] on Google Maps"
- Link href should point to `data.url` for direct Google Maps access

**Block Registration**

- Register `maps` block in `/workspace/src/lib/blocks/index.ts`
- Follow existing pattern with `id: 'maps'`, `title: 'Maps'`, `view: MapsBlockView`
- Import MapsBlockView at top of file with other block imports

## Visual Design

No visual assets provided for this specification.

## Existing Code to Leverage

**Video Block Component (`/workspace/src/lib/blocks/video/VideoBlockView.svelte`)**

- Direct structural pattern for iframe embed blocks with wrapper div
- Alignment reading from `data.styles?.align || data.align || 'full'`
- CSS class computation with `$derived()` returning joined class array
- Props destructuring pattern: `let { key, id, data, metadata, properties, path, blocksConfig } = $props()`

**Video Block CSS (`/workspace/src/app.css` lines 365-445)**

- CSS custom properties pattern: `--video-aspect-ratio`, `--video-border-radius`
- Alignment class styles: `.has--align--full`, `.has--align--left`, `.has--align--center`, `.has--align--right`
- Responsive breakpoint at 768px removing floats for mobile
- Wrapper aspect-ratio and positioning pattern

**Block Registry (`/workspace/src/lib/blocks/index.ts`)**

- Registration pattern with `id`, `title`, `view` properties
- Import statement convention at top of file
- Alphabetical ordering of block entries in the blocks object

**Video Block Tests (`/workspace/src/lib/blocks/video/VideoBlockView.svelte.test.ts`)**

- Test structure for iframe attributes, alignment classes, and wrapper container
- Using `@testing-library/svelte` with `render()` and container queries
- Pattern for testing different alignment values and default behaviors

## Out of Scope

- Privacy/consent placeholder pattern (deferred - requires Volto backend customization)
- OpenStreetMap, Mapbox, or other map provider support beyond Google Maps
- Custom markers, pins, or overlays on the map
- Multiple map locations or pin clustering
- Interactive controls beyond Google Maps built-in defaults
- Geocoding or address lookup functionality
- Static map image previews or thumbnails
- Map styling or custom Google Maps themes
- Directions or routing functionality
- Street View integration
