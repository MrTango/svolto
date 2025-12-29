# Specification: Responsive Image Component

## Goal

Create a reusable responsive image component that consolidates image rendering logic currently duplicated across ImageBlockView and TeaserBlockView/templates, providing a consistent way to handle Plone's image_scales data format with srcset generation.

## User Stories

- As a developer, I want a single reusable image component so that I can render responsive images consistently across different blocks without code duplication
- As an end user, I want images to load efficiently at the appropriate resolution for my device so that pages load faster and look sharp

## Specific Requirements

**Component File Location and Naming**

- Create component at `src/lib/components/ResponsiveImage.svelte`
- Create new `components` directory under `src/lib/` for shared UI components
- Follow Svelte 5 patterns with `$props()` for prop definitions
- Use TypeScript for type safety with a Props interface

**Props Interface Design**

- Accept `scales` object containing Plone image_scales data structure
- Accept `baseUrl` string for constructing full image URLs
- Accept `alt` string for accessibility (required)
- Accept optional `sizes` string for responsive sizing hints (default: `100vw`)
- Accept optional `width` and `height` numbers for CLS prevention
- Accept optional `loading` attribute (`lazy` | `eager`, default: `lazy`)
- Accept optional `class` string for custom styling

**Srcset Generation Logic**

- Extract srcset building logic from TeaserBlockView (lines 100-113)
- Iterate over scales object entries to build srcset string
- Format each entry as `{baseUrl}/{download} {width}w`
- Join entries with comma separator
- Handle empty or missing scales gracefully

**Picture Element Structure**

- Use semantic `picture` element with `source` and `img` children
- Apply srcset to `source` element
- Apply sizes attribute to `source` element for browser optimization
- Use `img` as fallback with direct `src` pointing to original/largest scale
- Always include width/height attributes on `img` for layout stability

**Accessibility Requirements**

- Require `alt` prop (do not default to empty string)
- Support empty string alt for decorative images (explicit decision by consumer)
- Ensure screen readers receive meaningful descriptions

**Integration with ImageBlockView**

- Refactor ImageBlockView to use ResponsiveImage component
- Pass `data.image_scales.image[0].scales` as scales prop
- Construct baseUrl from `data.url`
- Pass `data.alt` as alt prop
- Preserve existing CSS classes on wrapper element

**Integration with Teaser Templates**

- Refactor DefaultTeaserTemplate to use ResponsiveImage component
- Refactor EventTeaserTemplate to use ResponsiveImage component
- Replace inline picture/source/img markup with ResponsiveImage
- Keep `.image-wrapper` div in templates for layout styling
- Pass pre-computed props from TeaserBlockView (srcset building stays in parent)

## Visual Design

No visual mockups provided. The component renders standard HTML picture/source/img elements without custom visual styling.

## Existing Code to Leverage

**TeaserBlockView.svelte srcset building (lines 100-113)**

- Contains reusable pattern for building srcset from Plone image_scales
- Iterates over scales object entries
- Constructs URL paths with baseUrl and download paths
- Should be extracted into the new component or a utility function

**DefaultTeaserTemplate.svelte picture markup (lines 39-52)**

- Shows the target HTML structure: picture > source (srcset, sizes) > img
- Demonstrates sizes attribute usage: `(max-width: 768px) 100vw, 50vw`
- Shows required img attributes: src, alt, width, height, loading, class

**ImageBlockView.svelte srcset building (lines 4-10)**

- Similar pattern to TeaserBlockView but simpler data structure
- Uses `data.url` as base URL instead of computed baseUrl
- Demonstrates the variation in data structure between blocks

**TeaserBlockView.svelte image data extraction (lines 72-86)**

- Shows how to handle both `preview_image` and `image_scales` sources
- Demonstrates fallback pattern for getting image data
- This logic stays in TeaserBlockView, only rendering moves to ResponsiveImage

**Svelte 5 Props Pattern (from existing components)**

- Use `let { ...props }: Props = $props()` pattern
- Define Props interface with JSDoc comments for each property
- Use `$derived()` for computed values

## Out of Scope

- Image cropping or transformation logic
- Placeholder/skeleton loading states
- Error handling for broken images (404 fallback images)
- Art direction with multiple source elements for different aspect ratios
- WebP/AVIF format negotiation (Plone backend handles this)
- Image lazy loading intersection observer (native loading="lazy" is sufficient)
- Blur-up or progressive loading effects
- Image zoom or lightbox functionality
- Editing or uploading images
- Server-side image optimization or processing
