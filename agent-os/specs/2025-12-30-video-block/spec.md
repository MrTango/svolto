# Specification: Video Block

## Goal

Implement a video block component for the Svolto frontend that renders YouTube, Vimeo, and self-hosted video content from Plone CMS with four alignment variants and privacy-enhanced YouTube embeds.

## User Stories

- As a content viewer, I want to watch embedded videos on the page so that I can consume multimedia content without leaving the site
- As a site visitor, I want videos to display responsively so that I can view them properly on any device

## Specific Requirements

**Video Source Detection**

- Parse video URL to determine source type: YouTube, Vimeo, or self-hosted file
- YouTube detection: match `youtube.com/watch`, `youtu.be/`, `youtube.com/embed/` patterns
- Vimeo detection: match `vimeo.com/` patterns
- Self-hosted: any other URL (typically `.mp4`, `.webm`, `.ogg` file extensions)
- Extract video ID from YouTube/Vimeo URLs for embed construction

**YouTube Embed Rendering**

- Convert detected YouTube URLs to privacy-enhanced embed format: `youtube-nocookie.com/embed/{videoId}`
- Support all YouTube URL formats: `youtube.com/watch?v=ID`, `youtu.be/ID`, `youtube.com/embed/ID`
- Render as iframe with `allowfullscreen` attribute
- Set iframe `title` attribute to "YouTube video player" for accessibility

**Vimeo Embed Rendering**

- Convert Vimeo URLs to embed format: `player.vimeo.com/video/{videoId}`
- Extract video ID from URLs like `vimeo.com/123456789`
- Render as iframe with `allowfullscreen` attribute
- Set iframe `title` attribute to "Vimeo video player" for accessibility

**Self-Hosted Video Rendering**

- Render using native HTML5 `<video>` element
- Include `controls` attribute for playback controls
- Support poster image via `poster` attribute when `preview_image` is provided
- Support common formats: MP4, WebM, Ogg

**Alignment Variants**

- Support four alignment options from `data.align` property: `left`, `center`, `right`, `full`
- `left` (float-left): video floats left, surrounding content wraps on right, width ~50%
- `center`: video centered in content area, no float, reasonable max-width
- `right` (float-right): video floats right, surrounding content wraps on left, width ~50%
- `full`: video spans full container width, no float
- Apply CSS class pattern: `has--align--{alignment}` for styling hooks

**Aspect Ratio Container**

- Maintain 16:9 aspect ratio using CSS `aspect-ratio: 16/9`
- Apply to wrapper div that contains iframe or video element
- Ensure iframe/video fills container: `width: 100%; height: 100%`
- Add CSS custom property `--video-aspect-ratio: 16/9` for theming flexibility

**Preview Image (Poster)**

- Display optional preview/poster image when `data.preview_image` is provided
- For iframes: show as background-image on container until user interaction (optional enhancement)
- For HTML5 video: use `poster` attribute directly
- Do not auto-fetch thumbnails from YouTube/Vimeo APIs

**Responsive Behavior**

- On mobile (max-width 768px): remove floats, stack video full-width
- Maintain aspect ratio at all viewport sizes
- Float-left and float-right become full-width stacked on mobile
- Center and full alignments remain full-width on mobile

## Visual Design

**`planning/visuals/Screenshot 2025-12-30 at 22-42-58 Edit sample page.png`**

- Video block editor sidebar showing "Video" title in teal header
- "Video URL" text input field accepting full YouTube URLs
- "Preview Image URL" optional field with folder browser icon
- "Alignment" section with 4 icon buttons in horizontal row
- First icon: float-left (text lines with content block on left side)
- Second icon: center (centered horizontal lines)
- Third icon: float-right (text lines with content block on right side)
- Fourth icon: full-width (monitor/screen icon, shown as selected/highlighted)

## Existing Code to Leverage

**Block Registry Pattern (`/workspace/src/lib/blocks/index.ts`)**

- Follow existing block registration structure with `id`, `title`, `view` properties
- Import VideoBlockView and add to blocks object with key `video`
- Match pattern of other block registrations (image, slate, teaser, etc.)

**Alignment CSS Pattern (`/workspace/src/lib/blocks/teaser/TeaserBlockView.svelte`)**

- Use `has--align--{alignment}` CSS class pattern for alignment modifiers
- Read alignment from `data?.styles?.align` or `data?.align` depending on Plone data structure
- Apply mobile-responsive stacking at 768px breakpoint
- Reference flex/float patterns for left/right/center/full variants

**Component Props Pattern**

- Accept standard block props: `key`, `id`, `data`, `metadata`, `properties`, `path`, `blocksConfig`
- Use `$props()` for prop destructuring (Svelte 5 pattern)
- Use `$derived()` for computed values (alignment, video type detection, etc.)

**CSS Custom Properties Pattern (`/workspace/src/app.css`)**

- Define video block custom properties in `:root` for theming (e.g., `--video-aspect-ratio`)
- Add component styles to `@layer components` section
- Follow existing naming conventions: `--video-{property-name}`

**Teaser Block Aspect Ratio Reference**

- Teaser uses `--teaser-images-aspect-ratio: 16/9` CSS custom property
- Apply similar approach for video: `aspect-ratio: var(--video-aspect-ratio, 16/9)`
- Use `object-fit: cover` pattern if needed for poster images

## Out of Scope

- Video block editor component (editing happens in Volto/Plone backend)
- Auto-generated thumbnails from YouTube/Vimeo APIs
- Video file upload functionality
- Custom aspect ratio configuration (always 16:9)
- Additional video providers beyond YouTube, Vimeo, and self-hosted
- Autoplay, loop, or muted configuration options
- Advanced playback controls customization
- Click-to-play overlay with custom thumbnail (simple native controls only)
- Lazy loading of video iframes
- Video captions/subtitles handling
