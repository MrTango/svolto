# Spec Requirements: Video Block

## Initial Description

Implement a video block for a SvelteKit-based frontend (Svolto) that renders Plone CMS content. This is similar to other blocks already implemented (image, slate, teaser, grid, etc.). This feature will add video playback capabilities to the Svolto block system, following the same architecture pattern as existing blocks (image, slate, teaser, grid, slateTable, etc.).

## Requirements Discussion

### First Round Questions

**Q1:** I assume the video block should support YouTube, Vimeo, and self-hosted video files (MP4, etc.), similar to Volto's video block. Is that correct, or should we limit to specific providers?
**Answer:** Yes, same as Volto - YouTube, Vimeo, and self-hosted MP4/video files.

**Q2:** I'm thinking the block properties should include: url (video source), preview_image (optional custom poster/thumbnail), and align (for layout positioning). Are there additional properties we need?
**Answer:** Those properties are correct. The align property supports the alignment variants shown in the Volto screenshot.

**Q3:** For alignment options, I assume we should follow Volto's pattern with options like left, center, right, and full-width. Should we support all of these, or a subset?
**Answer:** All four alignment options as shown in the Volto screenshot: float-left (text wraps around right side), center (content area filling), float-right (text wraps around left side), and full-width.

**Q4:** Should the video maintain a specific aspect ratio (16:9 is most common), or should it be configurable per video?
**Answer:** 16:9 default aspect ratio, same as Volto.

**Q5:** For the preview image (poster/thumbnail), should we auto-generate thumbnails from YouTube/Vimeo, or only use explicitly provided preview images?
**Answer:** No auto-generated thumbnails from video services. Only use explicitly provided preview images when specified.

**Q6:** For YouTube embeds, should we support all URL formats (standard watch URLs, short youtu.be links, embed URLs)?
**Answer:** Yes, same YouTube URL formats as Volto (standard, short links, etc.).

**Q7:** Should we implement privacy-enhanced mode for YouTube (youtube-nocookie.com) for GDPR compliance?
**Answer:** Yes, use privacy-enhanced mode (youtube-nocookie.com) for GDPR compliance.

**Q8:** Are there any specific accessibility requirements beyond standard video embed practices (like proper iframe titles)?
**Answer:** Standard video embed practices only - no additional accessibility requirements beyond standard practices.

### Existing Code to Reference

**Similar Features Identified:**

- Feature: Image Block - Path: `/workspace/src/lib/blocks/image/`
- Feature: Teaser Block - Path: `/workspace/src/lib/blocks/teaser/`
- Feature: Block Registry - Path: `/workspace/src/lib/blocks/index.ts`
- Components to potentially reuse: Block registration pattern, alignment CSS classes from existing blocks
- Backend logic to reference: Plone client data fetching pattern in existing blocks

### Follow-up Questions

No follow-up questions were needed. The user provided comprehensive answers and a visual reference showing Volto's video block editor interface.

## Visual Assets

### Files Provided:

- `Screenshot 2025-12-30 at 22-42-58 Edit sample page.png`: Volto's video block editor sidebar showing:
  - "Video" block title
  - "Video URL" input field with a YouTube URL example
  - "Preview Image URL" input field with folder icon
  - "Alignment" section with 4 icon buttons representing the alignment options (float-left, center, float-right, full-width)

### Visual Insights:

- Four alignment options shown as icon buttons in horizontal row
- First icon: Float left (lines with content block on left)
- Second icon: Center aligned (centered horizontal lines)
- Third icon: Float right (lines with content block on right)
- Fourth icon (selected/highlighted): Full width (monitor/screen icon)
- Video URL accepts full YouTube URLs
- Preview Image URL is optional with folder browser capability
- Clean, minimal editor interface consistent with Volto patterns
- Fidelity level: High-fidelity screenshot of actual Volto implementation

## Requirements Summary

### Functional Requirements

- Render video content from YouTube, Vimeo, and self-hosted video files (MP4, WebM, etc.)
- Support four alignment variants: float-left, center, float-right, full-width
- Display optional custom preview/poster image when provided
- Maintain 16:9 aspect ratio by default
- Parse multiple YouTube URL formats (standard watch, short youtu.be, embed URLs)
- Use privacy-enhanced YouTube embeds (youtube-nocookie.com)
- Register block in blocksConfig following existing pattern

### Reusability Opportunities

- Block registration pattern from `/workspace/src/lib/blocks/index.ts`
- Alignment CSS patterns potentially from image or teaser blocks
- ResponsiveImage component pattern for preview images
- Plone client data structure handling from existing blocks

### Scope Boundaries

**In Scope:**

- Video block view component (VideoBlockView.svelte)
- YouTube embed support with privacy-enhanced mode
- Vimeo embed support
- Self-hosted video file playback (HTML5 video element)
- Four alignment options with appropriate CSS
- Optional preview/poster image display
- 16:9 aspect ratio container
- Block registration in blocksConfig
- Standard accessibility attributes (iframe title, etc.)

**Out of Scope:**

- Video block editor component (editing happens in Volto)
- Auto-generated thumbnails from video services
- Video upload functionality
- Custom aspect ratio configuration
- Additional video providers beyond YouTube/Vimeo
- Advanced accessibility features beyond standard practices
- Autoplay or advanced playback controls configuration

### Technical Considerations

- Follow SvelteKit 2 with Svelte 5 patterns
- Use Tailwind CSS 4 for styling
- Implement as view-only component (no editing)
- Parse YouTube URLs to extract video IDs for embed construction
- Parse Vimeo URLs to extract video IDs
- Detect self-hosted videos vs. embeds based on URL pattern
- Use iframe for YouTube/Vimeo, HTML5 video element for self-hosted
- Apply responsive container with aspect-ratio CSS for 16:9
- Alignment classes: float-left with text wrap, center in content area, float-right with text wrap, full-width spanning container
