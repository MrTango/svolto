# Image Optimization Pipeline

## Initial Description

Implement responsive images with srcset, lazy loading, and blur placeholders for the Svolto frontend.

## Context from Roadmap

From `agent-os/product/roadmap.md` item #33:
> Image Optimization Pipeline - Implement responsive images with srcset, lazy loading, and blur placeholders `M`

## Current State

The project already has:
- `ResponsiveImage.svelte` component in `src/lib/components/` - generates srcset from Plone image_scales
- `Picture.svelte` component in `src/lib/plone/` - older implementation with renderimg path
- `ImageBlockView.svelte` - uses ResponsiveImage for rendering image blocks
- `TeaserBlockView.svelte` - handles images in teaser blocks with srcset support
- `ImageGalleryVariation.svelte` - gallery component with eager/lazy loading

Current capabilities:
- Basic srcset generation from Plone image_scales
- Lazy loading via `loading="lazy"` attribute
- Width/height attributes for CLS prevention

Missing/unclear:
- Blur placeholders (LQIP - Low Quality Image Placeholders)
- Modern format support (WebP, AVIF)
- Proper `sizes` attribute configuration
- Server-side image proxy/optimization
- Consolidated approach across all image-rendering components
