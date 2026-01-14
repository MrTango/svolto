# Specification: HTML Block

## Goal

Implement an HTML block component for Svolto that renders raw HTML content from Plone, supporting styling variations (alignment, custom CSS classes) while relying on Volto for content sanitization.

## User Stories

- As a content editor, I want to embed raw HTML content in my Plone pages so that I can include custom markup without being limited by structured blocks
- As a frontend developer, I want the HTML block to follow Svolto's established patterns so that it integrates seamlessly with the existing block system

## Specific Requirements

**HTML Content Rendering**

- Use Svelte's `{@html}` directive to render the raw HTML string from `data.html`
- No client-side sanitization required (Volto handles this during editing)
- Trust all content from the Plone backend as pre-sanitized

**Empty State Handling**

- Render nothing (invisible block) when `data.html` is empty, undefined, or whitespace-only
- Use a simple conditional check before rendering the block wrapper
- No placeholder or "empty content" message should be displayed

**Alignment Support**

- Read alignment from `data.styles?.align` property
- Support three alignment values: `left`, `center`, `right`
- Apply alignment using CSS class pattern `has--align--{alignment}` (matching VideoBlockView and TeaserBlockView patterns)
- Default alignment should be `left` when not specified

**Custom CSS Class Support**

- Read custom CSS class from `data.styles?.customCss` property
- Append custom class to the block's class list when provided
- Custom class should be applied alongside standard block classes

**Component Structure**

- Create component at `src/lib/blocks/html/HtmlBlockView.svelte`
- Use Svelte 5 `$props()` for component props: `key`, `id`, `data`, `metadata`, `properties`, `path`, `blocksConfig`
- Use `$derived()` for computed values (alignment, blockClasses, hasContent)
- Wrap rendered HTML in a `<div>` with appropriate CSS classes

**CSS Class Naming**

- Use Svolto's naming scheme: `block html` as base classes
- Add alignment modifier: `has--align--{alignment}`
- Append custom CSS class from `data.styles?.customCss` when present
- Build class string dynamically using a computed function (following TeaserBlockView pattern)

**Block Registration**

- Register in `src/lib/blocks/index.ts` with id: `html`, title: `HTML`
- Import as `HtmlBlockView` from `./html/HtmlBlockView.svelte`
- Follow existing registration pattern from other blocks

**Unit Testing**

- Create test file at `src/lib/blocks/html/HtmlBlockView.test.ts`
- Test core behavior: renders HTML content, handles empty state, applies alignment classes
- Use Vitest with Svelte testing utilities
- Follow project testing standards (test behavior, not implementation)

## Visual Design

No visual assets provided.

## Existing Code to Leverage

**VideoBlockView.svelte (`/workspace/src/lib/blocks/video/VideoBlockView.svelte`)**

- Demonstrates alignment handling pattern: reading from `data?.styles?.align` with default value
- Shows dynamic CSS class building with `$derived()` returning a function
- Pattern: `has--align--${alignment}` class modifier

**TeaserBlockView.svelte (`/workspace/src/lib/blocks/teaser/TeaserBlockView.svelte`)**

- Comprehensive example of `$derived()` for building block classes dynamically
- Shows pattern for combining multiple CSS classes: `['block', 'teaser'].push(...).join(' ')`
- Demonstrates handling of alignment with `data?.styles?.align || 'left'` default

**Block Registry (`/workspace/src/lib/blocks/index.ts`)**

- Shows registration pattern: import component, add to blocks object with `id`, `title`, `view`
- Naming convention: `{BlockType}BlockView` for component names
- Directory structure: `src/lib/blocks/{blocktype}/`

**DescriptionBlockView.svelte (`/workspace/src/lib/blocks/description/DescriptionBlockView.svelte`)**

- Simple block example with minimal logic
- Shows pattern for empty state handling with conditional rendering

**SlateBlockView.svelte (`/workspace/src/lib/blocks/slate/SlateBlockView.svelte`)**

- Shows CSS class pattern: `class="block slate"`
- Demonstrates accessing `data.value` with fallback to empty array

## Out of Scope

- Edit component (editing happens in Volto)
- HTML sanitization or XSS protection (handled by Volto)
- Script tag handling or filtering (sanitized by Volto)
- Preview mode toggle between raw HTML and rendered output
- Code syntax highlighting for HTML content
- Code formatting or prettifying functionality
- Server-side rendering considerations specific to HTML content
- Accessibility linting or validation of embedded HTML
- Caching of rendered HTML content
- Support for external stylesheet references within HTML content
