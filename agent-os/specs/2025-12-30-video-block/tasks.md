# Task Breakdown: Video Block

## Overview

Total Tasks: 25

This task breakdown covers the implementation of a video block component for the Svolto frontend that renders YouTube, Vimeo, and self-hosted video content from Plone CMS with four alignment variants and privacy-enhanced YouTube embeds.

## Task List

### Video Block Core Implementation

#### Task Group 1: URL Parsing Utilities

**Dependencies:** None

- [x] 1.0 Complete URL parsing utilities
  - [x] 1.1 Write 4-6 focused tests for URL parsing functionality
    - Test YouTube URL detection (standard watch, short youtu.be, embed formats)
    - Test YouTube video ID extraction
    - Test Vimeo URL detection and ID extraction
    - Test self-hosted video detection (MP4, WebM, Ogg extensions)
    - Skip exhaustive edge cases
  - [x] 1.2 Create video URL utility functions
    - Create `src/lib/blocks/video/utils.ts`
    - Implement `detectVideoSource(url)` returning `'youtube' | 'vimeo' | 'self-hosted'`
    - Implement `extractYouTubeId(url)` for all YouTube URL formats
    - Implement `extractVimeoId(url)` for Vimeo URLs
    - Implement `buildYouTubeEmbedUrl(videoId)` using youtube-nocookie.com
    - Implement `buildVimeoEmbedUrl(videoId)` using player.vimeo.com
  - [x] 1.3 Ensure URL parsing tests pass
    - Run ONLY the 4-6 tests written in 1.1
    - Verify all URL patterns are correctly detected
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**

- The 4-6 tests written in 1.1 pass
- YouTube URLs (`youtube.com/watch?v=`, `youtu.be/`, `youtube.com/embed/`) are detected and IDs extracted
- Vimeo URLs (`vimeo.com/123456789`) are detected and IDs extracted
- Self-hosted URLs (`.mp4`, `.webm`, `.ogg`) are detected
- Privacy-enhanced YouTube embed URLs are correctly generated

### Video Block Component

#### Task Group 2: Video Block View Component

**Dependencies:** Task Group 1

- [x] 2.0 Complete video block view component
  - [x] 2.1 Write 4-6 focused tests for VideoBlockView component
    - Test YouTube video renders as iframe with correct embed URL
    - Test Vimeo video renders as iframe with correct embed URL
    - Test self-hosted video renders as HTML5 video element with controls
    - Test preview image appears as poster for self-hosted video
    - Skip exhaustive alignment and style testing
  - [x] 2.2 Create VideoBlockView.svelte component
    - Create `src/lib/blocks/video/VideoBlockView.svelte`
    - Accept standard block props: `key`, `id`, `data`, `metadata`, `properties`, `path`, `blocksConfig`
    - Use `$props()` for prop destructuring (Svelte 5 pattern)
    - Import URL utility functions from `./utils.ts`
  - [x] 2.3 Implement video source detection and rendering logic
    - Use `$derived()` to detect video source type from `data.url`
    - Use `$derived()` to compute embed URL or video source
    - Conditional rendering: iframe for YouTube/Vimeo, video element for self-hosted
  - [x] 2.4 Implement YouTube iframe rendering
    - Render `<iframe>` with privacy-enhanced embed URL
    - Set `allowfullscreen` attribute
    - Set `title="YouTube video player"` for accessibility
    - Set `frameborder="0"` and appropriate allow policies
  - [x] 2.5 Implement Vimeo iframe rendering
    - Render `<iframe>` with Vimeo player embed URL
    - Set `allowfullscreen` attribute
    - Set `title="Vimeo video player"` for accessibility
    - Set `frameborder="0"` and appropriate allow policies
  - [x] 2.6 Implement self-hosted video rendering
    - Render `<video>` element with `controls` attribute
    - Set `poster` attribute when `data.preview_image` is provided
    - Support common formats: MP4, WebM, Ogg via `src` attribute
  - [x] 2.7 Ensure video block component tests pass
    - Run ONLY the 4-6 tests written in 2.1
    - Verify all three video types render correctly
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**

- The 4-6 tests written in 2.1 pass
- YouTube videos render as iframes with youtube-nocookie.com URLs
- Vimeo videos render as iframes with player.vimeo.com URLs
- Self-hosted videos render as HTML5 video elements with controls
- Accessibility attributes (iframe titles) are correctly set

### Block Registration

#### Task Group 3: Block Registry Integration

**Dependencies:** Task Group 2

- [x] 3.0 Complete block registry integration
  - [x] 3.1 Register video block in blocks config
    - Update `src/lib/blocks/index.ts`
    - Import VideoBlockView from `./video/VideoBlockView.svelte`
    - Add video block entry with `id: 'video'`, `title: 'Video'`, `view: VideoBlockView`
    - Follow existing block registration pattern
  - [x] 3.2 Verify block renders in application
    - Manually test with Plone backend containing video block content
    - Confirm video block is recognized and rendered

**Acceptance Criteria:**

- Video block is registered in `src/lib/blocks/index.ts`
- RenderBlocks.svelte correctly renders video blocks
- Block follows existing registry pattern

### Styling Layer

#### Task Group 4: Alignment and Responsive Styling

**Dependencies:** Task Group 3

- [x] 4.0 Complete alignment and responsive styling
  - [x] 4.1 Write 2-4 focused tests for alignment CSS classes
    - Test `has--align--left` class is applied for left alignment
    - Test `has--align--center` class is applied for center alignment
    - Test `has--align--right` class is applied for right alignment
    - Test `has--align--full` class is applied for full-width alignment
  - [x] 4.2 Implement alignment class logic in component
    - Read alignment from `data?.styles?.align` or `data?.align`
    - Default to `'full'` if no alignment specified
    - Use `$derived()` to compute CSS class string
    - Apply class pattern: `has--align--{alignment}`
  - [x] 4.3 Add aspect ratio container styling
    - Wrap video/iframe in container div with `video-wrapper` class
    - Apply `aspect-ratio: var(--video-aspect-ratio, 16/9)`
    - Ensure iframe/video fills container: `width: 100%; height: 100%`
  - [x] 4.4 Implement alignment variant styles
    - `left`: float left, width ~50%, surrounding content wraps on right
    - `center`: centered in content area, no float, reasonable max-width
    - `right`: float right, width ~50%, surrounding content wraps on left
    - `full`: spans full container width, no float
  - [x] 4.5 Implement mobile responsive behavior
    - At max-width 768px: remove floats, stack video full-width
    - Maintain aspect ratio at all viewport sizes
    - Float-left and float-right become full-width stacked on mobile
  - [x] 4.6 Ensure alignment tests pass
    - Run ONLY the 2-4 tests written in 4.1
    - Verify alignment classes are correctly applied
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**

- The 2-4 tests written in 4.1 pass
- All four alignment variants work correctly
- 16:9 aspect ratio is maintained
- Mobile responsive behavior stacks videos full-width

### CSS Custom Properties

#### Task Group 5: Global CSS Integration

**Dependencies:** Task Group 4

- [x] 5.0 Complete global CSS integration
  - [x] 5.1 Add video block CSS custom properties to app.css
    - Add to `:root` section in `@layer components`
    - Define `--video-aspect-ratio: 16/9`
    - Define `--video-border-radius` (optional, for theming)
    - Follow existing naming pattern from teaser/table blocks
  - [x] 5.2 Add video block component styles to app.css
    - Add `.block.video` base styles
    - Add `.video-wrapper` aspect ratio container styles
    - Add alignment modifier styles (`.has--align--left`, etc.)
    - Add responsive styles in `@media (max-width: 768px)` query
  - [x] 5.3 Verify CSS custom properties work
    - Test that `--video-aspect-ratio` can be overridden
    - Confirm styles integrate with existing design system

**Acceptance Criteria:**

- CSS custom properties are defined in app.css
- Video block styles follow existing patterns
- Theming flexibility via CSS custom properties

### Testing

#### Task Group 6: Test Review and Gap Analysis

**Dependencies:** Task Groups 1-5

- [x] 6.0 Review existing tests and fill critical gaps only
  - [x] 6.1 Review tests from Task Groups 1-5
    - Review the 4-6 tests written for URL parsing (Task 1.1)
    - Review the 4-6 tests written for VideoBlockView (Task 2.1)
    - Review the 2-4 tests written for alignment (Task 4.1)
    - Total existing tests: approximately 10-16 tests
  - [x] 6.2 Analyze test coverage gaps for video block feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to video block requirements
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end workflows over unit test gaps
  - [x] 6.3 Write up to 6 additional strategic tests maximum
    - Add maximum of 6 new tests to fill identified critical gaps
    - Consider: preview image rendering, edge case URLs, iframe attributes
    - Do NOT write comprehensive coverage for all scenarios
    - Skip performance tests and accessibility tests unless business-critical
  - [x] 6.4 Run video block feature tests only
    - Run ONLY tests related to video block feature
    - Expected total: approximately 16-22 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**

- All video block tests pass (approximately 16-22 tests total)
- Critical user workflows for video block are covered
- No more than 6 additional tests added when filling gaps
- Testing focused exclusively on video block requirements

## Execution Order

Recommended implementation sequence:

1. **URL Parsing Utilities (Task Group 1)** - Foundation for video source detection
2. **Video Block View Component (Task Group 2)** - Core rendering logic
3. **Block Registry Integration (Task Group 3)** - Connect to application
4. **Alignment and Responsive Styling (Task Group 4)** - Layout variants
5. **Global CSS Integration (Task Group 5)** - Design system alignment
6. **Test Review and Gap Analysis (Task Group 6)** - Quality assurance

## Technical Notes

### File Structure

```
src/lib/blocks/video/
  VideoBlockView.svelte      # Main component
  utils.ts                   # URL parsing utilities
  VideoBlockView.svelte.test.ts  # Component tests
  utils.test.ts              # Utility function tests
```

### Data Structure Reference

Expected Plone video block data structure:

```typescript
{
  "@type": "video",
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "preview_image": "/path/to/preview.jpg",  // optional
  "styles": {
    "align": "full"  // or "left", "center", "right"
  }
}
```

### Visual Reference

- `planning/visuals/Screenshot 2025-12-30 at 22-42-58 Edit sample page.png` - Volto video block editor interface showing alignment options
