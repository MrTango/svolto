# Specification: Listing Block

## Goal

Implement a Listing Block for Svolto that renders content listings from Plone with three variation templates (Default, Summary, Image Gallery), supporting server-side data fetching with pagination, optional headlines, and "Link More" functionality.

## User Stories

- As a content editor, I want listing blocks to render content queries from Plone so that site visitors can browse collections of related content items
- As a site visitor, I want to navigate through paginated listing results so that I can find specific content without overwhelming page loads

## Specific Requirements

**Block Registration**

- Register `listing` block type in `/workspace/src/lib/blocks/index.ts` following existing pattern
- Export `ListingBlockView.svelte` as the view component
- Block type identifier: `listing`

**Server-Side Data Fetching**

- Use SvelteKit's reactive approach: block component fetches data using `@plone/client`'s `getQuerystringSearch` method
- Pass query configuration from `data.querystring` to the API
- Support `b_start` and `b_size` parameters for pagination
- Handle API response structure: `{ items, total, batching }`
- Implement loading state during fetch operations

**Variation Templates**

- Support three variations selected via `data.variation` field:
  - `default`: Title and description list (no images)
  - `summary`: Image, title, and description cards
  - `imageGallery`: Full-screen capable image gallery
- Create separate component files for each variation in `src/lib/blocks/listing/variations/`
- Use a variation registry pattern similar to teaser templates

**Default Variation Template**

- Render items as simple list with title as link and description text
- No image rendering in this variation
- Support "Link More" footer when configured

**Summary Variation Template**

- Render items as cards with preview image, title, and description
- Reuse image handling patterns from TeaserBlockView (ResponsiveImage component, image_scales)
- Support horizontal or vertical card layouts via CSS

**Image Gallery Variation**

- Display images in a gallery layout with navigation
- Use a Svelte-native carousel/gallery library (e.g., embla-carousel-svelte)
- Filter items to show only Image content types
- Support thumbnail navigation and fullscreen mode

**Headline Support**

- Render optional headline from `data.headline` field
- Support configurable heading level via `data.headlineTag` (h2 or h3, default h2)
- Follow pattern from GridBlockView

**Link More Feature**

- Render optional footer link from `data.linkTitle` and `data.linkHref`
- `linkHref` contains Plone content reference array (similar to teaser href)
- Extract path from `linkHref[0]['@id']` for link destination

**Pagination**

- Implement URL query parameter-based pagination (`?page=N`)
- Calculate total pages from `total` results and `b_size` (batch size)
- Default batch size: 10 items (or from `data.b_size`)
- Render pagination controls with prev/next and page numbers
- Create reusable `Pagination.svelte` component in `src/lib/components/`

## Visual Design

No visual assets provided. Follow Volto's listing block visual patterns and existing Svolto styling conventions.

## Existing Code to Leverage

**TeaserBlockView (`/workspace/src/lib/blocks/teaser/TeaserBlockView.svelte`)**

- Image handling with `hasImage`, `imageData`, `imageScales`, `imageBaseUrl` derived values
- Content type detection via `target['@type']`
- Path extraction from `@id` field using `hrefPath` pattern
- Template registry pattern for content-type-specific rendering

**GridBlockView (`/workspace/src/lib/blocks/grid/GridBlockView.svelte`)**

- Headline rendering with `showHeadline` derived and conditional h2 element
- CSS custom properties pattern for theming

**ResponsiveImage Component (`/workspace/src/lib/components/ResponsiveImage.svelte`)**

- Reuse directly for rendering item preview images in Summary variation
- Accepts `scales`, `baseUrl`, `alt`, `src`, `sizes`, `width`, `height` props

**Block Registry (`/workspace/src/lib/blocks/index.ts`)**

- Follow exact registration pattern: `{ id, title, view }` object structure
- Import and add ListingBlockView to the blocks object

**API Client (`/workspace/src/lib/api.ts`)**

- Use exported `client` instance
- Call `client.getQuerystringSearch()` with query parameters

## Out of Scope

- Query builder UI (queries come pre-configured from Plone/Volto editor)
- Faceted filtering or search interface
- Edit mode functionality (Svolto is render-only)
- Custom variation registration API
- Infinite scroll pagination
- Client-side caching with @tanstack/svelte-query (use simple fetch)
- Content type specific templates beyond generic rendering
- Sorting UI controls (sort order comes from query configuration)
- Ajax/partial page updates (use full page navigation for pagination)
- Preview/draft content mode
