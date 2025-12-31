# Spec Requirements: Listing Block

## Initial Description

Implement the Listing Block for Svolto - a SvelteKit-based frontend for rendering Plone CMS content. The listing block renders content listings with multiple layout variations (Default, Summary, Image Gallery) and supports server-side data fetching with pagination.

## Requirements Discussion

### First Round Questions

**Q1:** I assume we should implement all 3 Volto listing variations (Default, Summary, Image Gallery). Is that correct, or should we start with a subset?
**Answer:** Yes, implement all 3 Volto variations (Default, Summary, Image Gallery)

**Q2:** For data fetching, I'm thinking of using @tanstack/svelte-query with the @plone/client's getQuerystringSearch function for server-side rendering. Should we use this approach or implement a different pattern?
**Answer:** Server-side (SvelteKit backend) with hydration. User wants to verify what the REST API gives us on information.

**Q3:** Should pagination be server-side (fetching only current page) or client-side (loading all results and paginating in browser)?
**Answer:** Server-side pagination

**Q4:** Are there specific content types that should be prioritized for testing, or should we test with all available content types?
**Answer:** No specific priority - need at least page, event, news item, but should work with all content types in a generic way

**Q5:** I assume we should support the headline configuration like Volto (optional headline with configurable heading level h2/h3). Is that correct?
**Answer:** Yes, same as Volto (optional headline with configurable heading level)

**Q6:** Should we include the "Link More" feature (a link at the bottom to view more results)?
**Answer:** Yes, include it

**Q7:** Are there any specific features from Volto's listing block that we should explicitly exclude or defer to a later phase?
**Answer:** Exclude advanced query builder UI and faceted filtering for now

### Existing Code to Reference

**Similar Features Identified:**

- Feature: TeaserBlockView - Path: `/workspace/src/lib/blocks/teaser/TeaserBlockView.svelte`
  - Demonstrates content item rendering with image handling, content type detection, and responsive layouts
  - Uses template pattern for different content types
- Feature: GridBlockView - Path: `/workspace/src/lib/blocks/grid/GridBlockView.svelte`
  - Shows headline support with configurable display
  - Demonstrates rendering nested block content
- Feature: Block Registry - Path: `/workspace/src/lib/blocks/index.ts`
  - Shows block registration pattern to follow
- Feature: API Client - Path: `/workspace/src/lib/api.ts`
  - Plone client initialization pattern
- Feature: Layout Data Fetching - Path: `/workspace/src/routes/+layout.js`
  - Shows SvelteKit load function pattern for server-side data fetching

### Follow-up Questions

None required - research findings provide sufficient technical clarity.

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

Not applicable.

## REST API Research Findings

### @querystring-search Endpoint

The @plone/client provides the following methods for querying content:

**Query Schema:**

```typescript
query: {
  i: string,  // index name (e.g., 'portal_type', 'path', 'review_state')
  o: string,  // operation (e.g., 'plone.app.querystring.operation.selection.any')
  v: string | string[]  // value(s)
}

querystringSearchDataSchema: {
  b_start: string (optional),  // batch start index
  b_size: string (optional),   // batch size (page size)
  limit: string (optional),    // maximum results
  sort_on: string (optional),  // sort field
  sort_order: string (optional), // 'ascending' or 'descending'
  fullobjects: boolean (optional), // return full objects vs metadata
  query: Query[]  // array of query criteria
}
```

**Response Structure** (from Volto withQuerystringResults.jsx):

- `items`: Array of content items
- `total`: Total number of results
- `batching`: Object with `prev` and `next` URLs for pagination

**Metadata vs Full Objects:**

- Default: `metadata_fields: '_all'` - returns all metadata fields (faster)
- Optional: `fullobjects: 1` - returns full content objects (used by some variations)

### Volto Listing Block Architecture

**View Component** (`View.jsx`):

- Wraps ListingBody with CSS classes based on variation
- Applies `withBlockExtensions` HOC for variation support

**ListingBody Component** (`ListingBody.jsx`):

- Wrapped by `withQuerystringResults` HOC for data fetching
- Renders headline with configurable tag (h2, h3)
- Selects template based on variation
- Handles pagination UI with Semantic UI Pagination component
- Shows loading/no results states

**Data Flow** (`withQuerystringResults.jsx`):

- Determines if query exists or if folder contents should be listed
- Dispatches `getQueryStringResults` action with adapted query
- Calculates pagination from `b_size` and total results
- Handles special case for Image Gallery (fetches all children without query)

### Variation Templates

**1. Default Template** (`DefaultTemplate.jsx`):

- Simple list of items with title and description
- No images
- Supports "Link More" footer

**2. Summary Template** (`SummaryTemplate.jsx`):

- Items with preview image, title, and description
- Uses `PreviewImage` component for images
- Supports "Link More" footer

**3. Image Gallery Template** (`ImageGallery.jsx`):

- Uses `react-image-gallery` library
- Filters items to only show image content types
- Displays large images with thumbnails
- Supports fullscreen, autoplay, navigation controls

### Configuration Schema (`schema.js`):

**Properties:**

- `headline`: Optional text field
- `headlineTag`: Heading level (h2, h3)
- `querystring`: Query builder widget
- `linkTitle`: "Link More" button text
- `linkHref`: "Link More" destination (object browser)

## Requirements Summary

### Functional Requirements

- Render content listings based on querystring configuration from Plone
- Support 3 variation templates:
  - **Default**: Title + description list
  - **Summary**: Image + title + description cards
  - **Image Gallery**: Full image gallery with navigation
- Optional headline with configurable heading level (h2, h3)
- "Link More" footer link with configurable text and destination
- Server-side pagination with page controls
- Loading states during data fetch
- Empty/no results state handling
- Generic support for all content types (Page, Event, News Item, etc.)

### Reusability Opportunities

- Reuse image handling patterns from TeaserBlockView (`/workspace/src/lib/blocks/teaser/TeaserBlockView.svelte`)
- Follow headline pattern from GridBlockView (`/workspace/src/lib/blocks/grid/GridBlockView.svelte`)
- Use @plone/client's `getQuerystringSearch` for API calls
- Consider @tanstack/svelte-query for caching and state management (already in tech stack)
- Image Gallery may need a Svelte-native carousel library (not react-image-gallery)

### Scope Boundaries

**In Scope:**

- All 3 listing variations (Default, Summary, Image Gallery)
- Server-side data fetching with @plone/client
- Server-side pagination
- Headline with configurable heading level
- "Link More" feature
- Support for all content types generically
- Loading and empty states
- Responsive design

**Out of Scope:**

- Advanced query builder UI (queries come pre-configured from Plone/Volto)
- Faceted filtering/search
- Edit mode (rendering only - editing stays in Volto)
- Custom variation registration API (future enhancement)

### Technical Considerations

- **Data Fetching**: Use SvelteKit's `load` function for SSR with @plone/client's `getQuerystringSearch`
- **Hydration**: Server-rendered content should hydrate on client for pagination interactions
- **Pagination**: Implement URL-based pagination (query param) for shareable links and SEO
- **Image Gallery**: Need to evaluate Svelte-native alternatives to react-image-gallery:
  - Options: svelte-carousel, embla-carousel-svelte, or custom implementation
- **Block Registration**: Follow existing pattern in `/workspace/src/lib/blocks/index.ts`
- **CSS**: Use CSS custom properties for theming, scoped styles per component
- **Content Type Detection**: Use `@type` field from API response for type-specific rendering
