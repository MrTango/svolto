# Spec Requirements: Image Optimization Pipeline

## Initial Description

Image Optimization Pipeline, verify with the code, what is still to be done. Focus on read only optimizations, we will not change Volto (editing side).

## Requirements Discussion

### First Round Questions

**Q1:** I assume we should consolidate all image rendering to use the `ResponsiveImage` component (deprecating `Picture.svelte` and removing the unused `/renderimg` route reference). Is that correct, or do you want to keep both approaches?
**Answer:** YES - deprecate Picture.svelte

**Q2:** I'm thinking we should add placeholder/blur-up support using CSS aspect-ratio with a solid color background (since we have width/height from Plone). Do you want more sophisticated LQIP (Low Quality Image Placeholder) techniques, or is the simple CSS-based approach sufficient?
**Answer:** YES - simple CSS aspect-ratio with solid color background is sufficient

**Q3:** For above-the-fold images (hero, first teaser in a page), should we add `fetchpriority="high"` and consider SSR-injected `<link rel="preload">` hints, or is the current `loading="eager"` approach sufficient?
**Answer:** YES - add fetchpriority="high" and SSR-injected preload hints

**Q4:** Regarding modern image formats: Plone typically serves JPEG. Should we investigate if your Plone backend provides WebP/AVIF scales, or should we assume JPEG-only and optimize around that constraint?
**Answer:** JPEG only - Plone backend doesn't provide WebP/AVIF

**Q5:** I assume the `sizes` attribute should be properly calculated based on the layout context (container width, grid columns). Should we create a utility function or conventions for common patterns (full-width, half-width, card grid)?
**Answer:** YES - create utility function for common patterns

**Q6:** For the ImageGalleryVariation carousel, I notice it doesn't use ResponsiveImage. Should we refactor it to use ResponsiveImage for consistency and srcset benefits, or leave it optimized for the gallery use case?
**Answer:** YES - refactor to use ResponsiveImage

**Q7:** Is there anything specific about image handling you want to explicitly exclude from this optimization work (e.g., SVG handling, image editing previews, specific block types)?
**Answer:** Lighthouse score is the main priority - aim for as high as possible without changes to Volto (editing side)

### Existing Code to Reference

**Similar Features Identified:**

- Component: `ResponsiveImage` - Path: `/workspace/src/lib/components/ResponsiveImage.svelte` (primary component to extend)
- Component: `Picture.svelte` - Path: `/workspace/src/lib/plone/Picture.svelte` (to be deprecated)
- Block: `ImageBlockView` - Path: `/workspace/src/lib/blocks/image/ImageBlockView.svelte` (uses ResponsiveImage)
- Block: `TeaserBlockView` - Path: `/workspace/src/lib/blocks/teaser/TeaserBlockView.svelte` (uses ResponsiveImage with custom sizes)
- Template: `DefaultTeaserTemplate` - Path: `/workspace/src/lib/blocks/teaser/templates/DefaultTeaserTemplate.svelte` (uses ResponsiveImage)
- Variation: `SummaryVariation` - Path: `/workspace/src/lib/blocks/listing/variations/SummaryVariation.svelte` (uses ResponsiveImage with grid sizes)
- Variation: `ImageGalleryVariation` - Path: `/workspace/src/lib/blocks/listing/variations/ImageGalleryVariation.svelte` (needs refactor to use ResponsiveImage)
- Types: `ImageScale`, `ImageData` - Path: `/workspace/src/lib/blocks/listing/types.ts` (TypeScript interfaces for image data)
- Component: `ListingItem` - Path: `/workspace/src/lib/plone/ListingItem.svelte` (uses deprecated Picture.svelte)

### Follow-up Questions

No follow-up questions needed. User answers were comprehensive.

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

N/A

## Requirements Summary

### Functional Requirements

**1. Component Consolidation**
- Deprecate `Picture.svelte` component
- Remove unused `/renderimg` route reference from Picture.svelte
- Migrate all image rendering to use `ResponsiveImage` component
- Update `ListingItem.svelte` to use ResponsiveImage instead of Picture

**2. ResponsiveImage Component Enhancements**
- Add `fetchpriority` prop (values: `'high'` | `'low'` | `'auto'`)
- Add CSS-based placeholder support using aspect-ratio and solid background color
- Add `decoding` prop support (`'async'` | `'sync'` | `'auto'`)
- Ensure proper width/height attributes are always set for CLS prevention

**3. Sizes Utility Function**
- Create utility function for common `sizes` attribute patterns:
  - Full-width: `100vw`
  - Half-width with mobile breakpoint: `(max-width: 768px) 100vw, 50vw`
  - Card grid (1/2/3 columns): `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw`
  - Thumbnail: fixed pixel width
- Allow easy customization via CSS custom properties or props

**4. Above-the-Fold Optimizations**
- Add `fetchpriority="high"` for LCP candidate images
- Implement SSR-injected `<link rel="preload">` hints for critical images
- First image in ImageBlockView should be eager + high priority
- First teaser image on a page should be prioritized

**5. ImageGalleryVariation Refactor**
- Replace direct `<img>` tags with ResponsiveImage component
- Maintain first-image eager loading behavior
- Apply appropriate sizes for gallery context

**6. Placeholder/Loading States**
- Use CSS aspect-ratio based on width/height from Plone
- Apply neutral background color during load (CSS custom property for theming)
- Smooth fade-in transition when image loads (optional enhancement)

### Reusability Opportunities

- `ResponsiveImage` component is already well-structured and reusable
- Sizes utility function can be shared across all image-rendering components
- TypeScript interfaces (`ImageScale`, `ImageData`) already defined in `/workspace/src/lib/blocks/listing/types.ts`
- Image handling patterns in TeaserBlockView and SummaryVariation can serve as reference implementations

### Scope Boundaries

**In Scope:**
- ResponsiveImage component enhancements (fetchpriority, placeholder, decoding)
- Sizes utility function creation
- SSR preload hints for critical images
- Deprecation of Picture.svelte
- Migration of ListingItem.svelte to ResponsiveImage
- ImageGalleryVariation refactor to use ResponsiveImage
- Lighthouse performance optimization focus

**Out of Scope:**
- Volto/editing side changes
- Backend image format changes (WebP/AVIF)
- Image upload or editing functionality
- SVG-specific handling
- Image CDN or external optimization services
- Complex LQIP techniques (blur hash, dominant color extraction)

### Technical Considerations

- **Format Constraint:** JPEG only - Plone backend doesn't provide WebP/AVIF scales
- **Plone Image Scales:** Backend provides multiple scales (mini, preview, large, etc.) with width descriptors
- **SSR Context:** SvelteKit SSR enables `<link rel="preload">` injection in `<head>`
- **CLS Prevention:** Always provide width/height attributes from Plone's image_scales data
- **Lazy Loading:** Native browser `loading="lazy"` for below-fold images
- **Priority Hints:** `fetchpriority="high"` for LCP images, `fetchpriority="low"` for thumbnails

### Performance Targets

- Primary goal: Maximize Lighthouse performance score
- Key metrics to improve:
  - LCP (Largest Contentful Paint) - via preload hints and fetchpriority
  - CLS (Cumulative Layout Shift) - via width/height and aspect-ratio
  - Image transfer size - via proper srcset/sizes selection

### Implementation Notes

**Current ResponsiveImage Structure:**
```svelte
<picture>
  <source srcset={srcset()} {sizes} />
  <img {src} {alt} {width} {height} {loading} class={className} />
</picture>
```

**Target ResponsiveImage Structure:**
```svelte
<picture class="responsive-image" style="--aspect-ratio: {width}/{height}">
  <source srcset={srcset()} {sizes} />
  <img
    {src}
    {alt}
    {width}
    {height}
    {loading}
    fetchpriority={priority}
    decoding={decoding}
    class={className}
    onload={handleLoad}
  />
</picture>
```

**Preload Hint Pattern (SSR):**
```html
<link
  rel="preload"
  as="image"
  href="{src}"
  imagesrcset="{srcset}"
  imagesizes="{sizes}"
/>
```
