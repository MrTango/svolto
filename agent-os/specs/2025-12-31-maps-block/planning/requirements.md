# Spec Requirements: Maps Block

## Initial Description

Implement a Maps Block for Svolto that renders embedded maps (Google Maps) from Plone CMS content. The block should follow Volto's Maps block schema and match the patterns established by existing blocks in the codebase, particularly the video block.

## Requirements Discussion

### First Round Questions

**Q1:** Map Provider: The standard Volto maps block embeds Google Maps via iframe URLs. I assume we should support Google Maps embed URLs as the primary (and perhaps only) provider, matching Volto's default behavior. Is that correct, or should we also support OpenStreetMap, Mapbox, or other providers?
**Answer:** Yes - Google Maps embed URLs as primary provider (matching Volto's default behavior)

**Q2:** Data Structure: Based on my research of Volto's Maps block schema, it provides three fields: `url` (the embed URL), `title` (alt text for accessibility), and `align` (alignment options). I assume we should follow this exact same data structure from the Plone backend. Is that correct, or is there a custom maps add-on you're using that provides additional fields?
**Answer:** Yes - Follow Volto's Maps block schema with `url`, `title`, and `align` fields

**Q3:** Alignment Options: Following the pattern from your existing video block, I assume the maps block should support the same alignment options (full-width and standard alignment). Should we use the same CSS class pattern (`has--align--${alignment}`) for consistency with other blocks?
**Answer:** Yes - Use same alignment options and CSS class pattern (`has--align--${alignment}`) as video block

**Q4:** Responsive Behavior: I assume the map embed should maintain a 16:9 aspect ratio (similar to your video block's responsive wrapper) and be fully responsive across all screen sizes. Is that correct, or do you need a different aspect ratio (4:3, 1:1, etc.) or a fixed height option?
**Answer:** Yes - 16:9 aspect ratio with responsive wrapper like video block

**Q5:** Accessibility: Per project standards, I assume the iframe should include a proper `title` attribute from the block data for screen reader accessibility, and we should use `loading="lazy"` for performance. Are there any other accessibility considerations you need?
**Answer:** User is open to suggestions for improving a11y

**Q6:** Privacy/Consent: Google Maps embeds can have privacy implications. Should the maps block render immediately, or do you need a cookie consent placeholder pattern (similar to YouTube's nocookie domain used in your video block)?
**Answer:** Initially requested configurable placeholder pattern, but deferred - requires Volto backend customization, will be implemented later

**Q7:** Is there anything specific you want to EXCLUDE from this implementation? For example: custom markers, multiple pins, interactive controls, or integration with specific geocoding services?
**Answer:** No specific exclusions mentioned

### Existing Code to Reference

**Similar Features Identified:**
- Feature: Video Block - Path: `/workspace/src/lib/blocks/video/VideoBlockView.svelte`
  - Very similar structure with iframe embeds, responsive wrapper, and alignment handling
  - Uses `has--align--${alignment}` CSS class pattern
  - Has responsive wrapper div for maintaining aspect ratio
- Feature: Video Block Utils - Path: `/workspace/src/lib/blocks/video/utils.ts`
  - Pattern for URL detection and embed URL building (may be referenced but maps is simpler)
- Feature: Block Registry - Path: `/workspace/src/lib/blocks/index.ts`
  - Shows how to register new blocks with id, title, and view component
- Feature: Video Block CSS - Path: `/workspace/src/app.css` (lines 365-445)
  - CSS custom properties pattern (`--video-aspect-ratio`, `--video-border-radius`)
  - Alignment classes (`.has--align--full`, `.has--align--left`, `.has--align--center`, `.has--align--right`)
  - Mobile responsive breakpoints

### Follow-up Questions

**Follow-up 1:** Regarding the configurable consent placeholder, should this be per-block or global? What should the placeholder display?
**Answer:** Skip the consent placeholder pattern for now - it requires Volto backend customization, so it will be implemented later.

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

N/A - No visual files were provided for this specification.

## Requirements Summary

### Functional Requirements

- Render Google Maps embeds from iframe URLs provided by Plone backend
- Support `url` field containing the Google Maps embed URL
- Support `title` field for accessibility (iframe title attribute)
- Support `align` field for block alignment (full-width and standard alignment)
- Maintain 16:9 aspect ratio with responsive wrapper
- Load maps lazily for performance optimization

### Accessibility Requirements (Enhanced)

Based on best practices for embedded map accessibility:

1. **ARIA Labels for Map Container**
   - Add `role="region"` to the map wrapper div to identify it as a landmark region
   - Add `aria-label` attribute with descriptive text (e.g., "Interactive map showing [location]")
   - Use the `title` field from block data as the basis for ARIA labels

2. **Iframe Title Attribute**
   - Use `title` attribute on iframe populated from block data for screen reader announcement
   - If no title provided, use a sensible default like "Google Maps embed"
   - The title should describe the map location when available

3. **Alternative Text Content**
   - Provide a `<noscript>` fallback with static text describing the map location
   - Include a direct link to view the map on Google Maps within the noscript block
   - Format: "View [location name] on Google Maps" with link to the embed URL

4. **Keyboard Navigation Considerations**
   - Ensure iframe can receive keyboard focus with `tabindex="0"`
   - The embedded Google Maps iframe handles internal keyboard navigation
   - Consider adding visible focus indicator styling on the wrapper when iframe is focused

5. **Screen Reader Friendly Location Descriptions**
   - The `title` attribute serves as the primary screen reader announcement
   - ARIA label on container provides context before user enters the iframe
   - Screen readers will announce "region, [aria-label]" when navigating by landmarks

6. **Skip Link / Bypass Mechanism**
   - Wrap the map in a container that allows keyboard users to easily tab past it
   - Google Maps iframes are complex interactive regions - users should be able to skip them
   - Add a visually hidden "Skip map" link before the iframe that jumps to content after the block
   - This link becomes visible on keyboard focus (sr-only focus:not-sr-only pattern)

7. **Additional Performance and Accessibility Attributes**
   - Add `loading="lazy"` to defer loading of off-screen maps
   - Add `referrerpolicy="no-referrer-when-downgrade"` for security
   - Add `allowfullscreen` for users who want to expand the map

### Reusability Opportunities

- Follow video block's responsive wrapper pattern for aspect ratio maintenance
- Reuse `has--align--${alignment}` CSS class pattern for consistent alignment
- Follow same block registration pattern in `/workspace/src/lib/blocks/index.ts`
- CSS for `.video-wrapper` pattern can be adapted for `.maps-wrapper`
- Use same CSS custom properties pattern (`--maps-aspect-ratio`, `--maps-border-radius`)

### Scope Boundaries

**In Scope:**
- MapsBlockView.svelte component rendering Google Maps embeds
- Block registration in blocks index
- Responsive 16:9 aspect ratio wrapper
- Alignment support (full, left, center, right)
- Enhanced accessibility attributes (role, aria-label, title, skip link)
- Loading lazy and referrer policy attributes
- Noscript fallback with location description and link
- CSS custom properties for theming consistency
- Unit tests for the maps block component

**Out of Scope:**
- Privacy/consent placeholder pattern (deferred - requires backend customization)
- OpenStreetMap, Mapbox, or other map provider support
- Custom markers or multiple pins
- Interactive controls beyond Google Maps defaults
- Geocoding or address lookup functionality
- Static map image previews

### Technical Considerations

- Block data structure matches Volto's Maps block schema: `{ url, title, align }`
- Use iframe element with `src` from `data.url`
- Follow Svelte 5 component patterns with `$props()` and `$derived()`
- CSS class pattern: `block maps has--align--${alignment}`
- Wrapper div class: `maps-wrapper` (similar to `video-wrapper`)
- TypeScript for type safety on component props
- CSS custom properties in `/workspace/src/app.css`:
  - `--maps-aspect-ratio: 16/9`
  - `--maps-border-radius: 0`
- Mobile responsive: Remove floats and use full-width below 768px breakpoint

### Component Structure

```svelte
<!-- MapsBlockView.svelte structure -->
<div class="block maps has--align--{alignment}">
  <!-- Skip link for keyboard users -->
  <a href="#after-map-{id}" class="skip-map-link">Skip map</a>

  <div class="maps-wrapper" role="region" aria-label="{title || 'Map location'}">
    <iframe
      src="{url}"
      title="{title || 'Google Maps embed'}"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
    ></iframe>
  </div>

  <noscript>
    <p>View <a href="{url}">{title || 'this location'}</a> on Google Maps</p>
  </noscript>

  <span id="after-map-{id}"></span>
</div>
```
