# Specification: Image Optimization Pipeline

## Goal

Maximize Lighthouse performance score by consolidating all image rendering to the `ResponsiveImage` component, implementing fetchpriority/preload hints for LCP images, and adding CSS-based placeholder support for CLS prevention, all within the read-only constraint (no Volto/backend changes).

## User Stories

- As a site visitor, I want images to load quickly and without layout shift so that the page feels fast and stable
- As a developer, I want a single, well-documented image component to use throughout the codebase so that image rendering is consistent and maintainable

## Specific Requirements

**ResponsiveImage Component Enhancements**

- Add `fetchpriority` prop with values `'high'` | `'low'` | `'auto'` (default: `'auto'`)
- Add `decoding` prop with values `'async'` | `'sync'` | `'auto'` (default: `'async'`)
- Implement CSS aspect-ratio placeholder using `--aspect-ratio` CSS custom property
- Apply neutral background color via `--image-placeholder-bg` CSS custom property during load
- Ensure width/height attributes are always set from Plone's image_scales data
- Wrap the component in a container element to support placeholder styling
- Add optional `onload` handler to support fade-in transitions

**Sizes Utility Function**

- Create `src/lib/utils/image-sizes.ts` with common responsive image patterns
- Implement `fullWidth()` returning `100vw`
- Implement `halfWidth()` returning `(max-width: 768px) 100vw, 50vw`
- Implement `cardGrid()` returning `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw`
- Implement `thumbnail(width: number)` returning fixed pixel width string
- Export as named functions for tree-shaking

**LCP Image Optimizations**

- Add `fetchpriority="high"` attribute support to ResponsiveImage component
- Implement SSR-injected `<link rel="preload">` for critical above-the-fold images
- Use SvelteKit's `<svelte:head>` for SSR preload hint injection
- Include `imagesrcset` and `imagesizes` attributes in preload links
- First ImageBlockView image on a page should use `loading="eager"` + `fetchpriority="high"`

**ListingItem Migration**

- Replace `Picture.svelte` import with `ResponsiveImage` component
- Adapt `catalogItem` prop structure to ResponsiveImage's `scales` and `baseUrl` props
- Remove dependency on `/renderimg` route path prefix
- Maintain backward compatibility with existing ListingItem usage

**ImageGalleryVariation Refactor**

- Replace direct `<img>` tags in main carousel with `ResponsiveImage` component
- Apply appropriate `sizes` attribute for gallery context (full viewport width)
- Maintain `loading="eager"` for first image, `loading="lazy"` for subsequent images
- Add `fetchpriority="high"` to first visible gallery image
- Keep thumbnail images as simple `<img>` tags (low priority, small size)

**Picture.svelte Deprecation**

- Add deprecation comment at top of `Picture.svelte` file
- Document migration path to `ResponsiveImage` in deprecation notice
- Remove `/renderimg` route reference from component (use direct URLs)
- Component remains functional for backward compatibility during transition

**Preload Hint Infrastructure**

- Create mechanism to pass preload data from components to layout via context or stores
- Use Svelte's `$page.data` or a dedicated store for preload hints
- Inject `<link rel="preload" as="image">` in `+layout.svelte` `<svelte:head>`
- Support multiple preload hints per page (hero + first teaser)

## Visual Design

No visual assets provided.

## Existing Code to Leverage

**ResponsiveImage Component (`/workspace/src/lib/components/ResponsiveImage.svelte`)**

- Already implements srcset generation from Plone's image_scales
- Has Props interface with scales, baseUrl, alt, src, sizes, width, height, loading, class
- Uses `<picture>` element with `<source srcset>` pattern
- Extend this component with fetchpriority, decoding, and placeholder props

**ImageBlockView (`/workspace/src/lib/blocks/image/ImageBlockView.svelte`)**

- Good reference for extracting image_data from Plone's image_scales structure
- Uses normalizeUrl helper for stripping internal hostnames
- Pattern for deriving baseUrl from data.url
- Apply LCP optimizations (fetchpriority="high") to this block

**SummaryVariation (`/workspace/src/lib/blocks/listing/variations/SummaryVariation.svelte`)**

- Excellent example of ResponsiveImage usage in a grid context
- Uses `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"` - this pattern should be extracted to sizes utility
- Has helper functions: getImageData, getImageScales, getImageBaseUrl, getImageSrc
- Pattern can be replicated in ImageGalleryVariation refactor

**Listing Types (`/workspace/src/lib/blocks/listing/types.ts`)**

- TypeScript interfaces for ImageScale, ImageData, ImageScales
- Reuse these types in sizes utility function and ResponsiveImage enhancements
- Consistent type definitions for Plone image structure

**TeaserBlockView (`/workspace/src/lib/blocks/teaser/TeaserBlockView.svelte`)**

- Complex example with CSS custom properties for aspect-ratio
- Shows pattern for handling preview_image vs image_field sources
- Demonstrates imageBaseUrl derivation with base_path support

## Out of Scope

- Backend image format changes (WebP/AVIF generation)
- Volto editing interface modifications
- Image CDN or external optimization services
- Complex LQIP techniques (blur hash, dominant color extraction)
- SVG-specific handling or optimization
- Image upload or editing functionality
- Image cropping or transformation on the frontend
- Service worker caching strategies
- Third-party image optimization libraries
- Intersection Observer-based lazy loading (use native browser loading="lazy")
