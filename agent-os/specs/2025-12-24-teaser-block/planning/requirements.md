# Spec Requirements: Teaser Block

## Initial Description

Create/improve a teaser block component for Svolto (SvelteKit frontend for Plone CMS).

Context:
- Svolto is a SvelteKit-based frontend for rendering Plone CMS content
- It serves as a Svelte alternative to Volto (React-based Plone frontend)
- The project renders Volto Blocks content from a Plone backend with plone.restapi enabled
- Current teaser block exists at: `src/lib/blocks/teaser/TeaserBlockView.svelte`
- Blocks follow Volto's architecture pattern with configuration objects

## Requirements Discussion

### First Round Questions

**Q1:** Should we start fresh with a new implementation or build upon the existing teaser block?
**Answer:** Start fresh, replace the existing teaser block entirely.

**Q2:** What elements should the teaser include?
**Answer:** The teaser should include all elements: image, title (h2), description, head_title, all wrapped in a link to the target content.

**Q3:** What image alignment options should be supported?
**Answer:** Support all 3 image alignments: left, right, and center/top. On mobile, these should stack responsively.

**Q4:** Should we follow Volto's CSS variable naming conventions?
**Answer:** Yes, follow Volto's CSS variable names for compatibility with existing Volto themes and styling.

**Q5:** How should responsive images be handled?
**Answer:** Use `<picture>` element with `srcset` and `sizes` attribute for responsive images.

**Q6:** Should teasers work without images?
**Answer:** Yes, teasers without images should work and display properly.

**Q7:** Should there be support for content-type specific templates?
**Answer:** Yes, implement a registration mechanism for content-type specific templates. The first template to implement is for Events.

**Q8:** What should the Event template include?
**Answer:** The Event template should display:
- Start date and time
- End date and time
- Only show time if it is NOT a whole day event
- Location
- Plus all standard teaser fields (image, title, description)

### Existing Code to Reference

**Similar Features Identified:**
- Current teaser block: `src/lib/blocks/teaser/TeaserBlockView.svelte`
- Block registry pattern: `src/lib/blocks/index.ts`
- Block rendering: `src/lib/RenderBlocks.svelte`

### Follow-up Questions

No follow-up questions were needed.

## Visual Assets

### Files Provided:

- `Screenshot 2025-12-25 at 00-08-16 Edit sample page.png`: Shows Volto editor interface with teaser block configuration panel. The screenshot displays:
  - A teaser block in edit mode showing two images side by side (Plone logo and partial "Fo" text)
  - Right sidebar showing "Teaser" block configuration with:
    - Target field set to "Images"
    - "Customize teaser content" checkbox (unchecked)
    - Explanation text about customizing title, description, and image
    - STYLING section with Alignment options showing 3 icons (left, right, center/top)
  - Title "Images" and description "Site images" below the teaser preview

### Visual Insights:

- Shows the 3 alignment options available in Volto teaser block (icons for left-aligned, right-aligned, and center/top layouts)
- Demonstrates the target content linking mechanism
- Shows option to customize or inherit teaser content from target
- Confirms the standard teaser elements: image, title, description
- High-fidelity screenshot from actual Volto interface - serves as reference implementation

## Requirements Summary

### Functional Requirements

- Fresh implementation replacing existing teaser block
- Display teaser elements: image, title (h2), description, head_title
- Wrap entire teaser in a link to target content
- Support 3 image alignment modes:
  - Left (image on left, text on right)
  - Right (image on right, text on left)
  - Center/Top (image above text)
- Responsive behavior: stack vertically on mobile devices
- Handle teasers without images gracefully
- Content-type specific template registration mechanism
- Event content-type template with:
  - Start date and time
  - End date and time
  - Time display only for non-whole-day events
  - Location field
  - Standard teaser fields (image, title, description)

### Technical Requirements

- Use `<picture>` element with `srcset` and `sizes` for responsive images
- Follow Volto CSS variable naming conventions for theme compatibility
- Implement template registration system for content-type variations
- Follow existing block architecture pattern from `src/lib/blocks/index.ts`

### Reusability Opportunities

- Block registration pattern from `src/lib/blocks/index.ts`
- Rendering approach from `RenderBlocks.svelte`
- Potential reuse of image handling patterns if they exist elsewhere

### Scope Boundaries

**In Scope:**
- Complete teaser block component with all alignment options
- Responsive image support via picture/srcset
- Mobile-responsive layout behavior
- Teasers with and without images
- Content-type template registration mechanism
- Event content-type template implementation
- Volto-compatible CSS variable naming

**Out of Scope:**
- Editor/editing interface (Volto handles editing)
- Other content-type templates beyond Event (future enhancement)
- Custom image cropping or manipulation
- Teaser grid/listing components

### Technical Considerations

- Must integrate with existing block registry in `src/lib/blocks/index.ts`
- CSS variables should match Volto naming for cross-compatibility
- Plone REST API provides image scales via `@@images` endpoint
- Event data comes from Plone Event content type with standard date fields
- Responsive breakpoints should align with project's Tailwind CSS configuration
