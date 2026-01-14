# Specification: Bundle Analysis and Optimization

## Goal

Add bundle visualization tooling and optimize JavaScript/CSS bundle sizes through dynamic imports for heavy components and Tailwind CSS purging to improve page load performance.

## User Stories

- As a developer, I want to visualize what's in my bundles so that I can identify optimization opportunities
- As a user, I want faster page loads so that I have a better browsing experience

## Specific Requirements

**Bundle Visualization Tooling**

- Add `vite-bundle-analyzer` as a dev dependency
- Create `pnpm analyze` script in package.json to generate bundle analysis reports
- Configure the analyzer plugin in vite.config.ts to run only during analysis builds
- Output should show chunk sizes, dependencies, and module composition

**Dynamic Imports for Listing Variations**

- Convert listing variation imports in `src/lib/blocks/listing/variations/index.ts` to use dynamic imports
- ImageGalleryVariation (14KB source) is the primary candidate for lazy loading
- Modify `getVariationComponent()` to return a promise or lazy-loaded component
- Update `ListingBlockView.svelte` to handle async variation loading with the existing loading state

**Dynamic Imports for Heavy Block Components**

- Identify blocks that pull in heavy dependencies (Slate library at 78KB server bundle)
- Consider lazy loading for GridBlockView (renders nested blocks, cascading imports)
- Maintain SSR compatibility - dynamic imports must work with SvelteKit's server rendering
- Use Vite's `import()` syntax which supports automatic code splitting

**CSS Optimization with Tailwind**

- Verify Tailwind CSS 4's built-in content detection is scanning all template files
- Review `src/app.css` (827 lines) for unused component styles that could be removed
- Ensure `@tailwindcss/vite` plugin is properly configured for CSS tree-shaking
- Current CSS output is 60.9KB - target meaningful reduction through unused style removal

**Block Registry Optimization**

- Current `src/lib/blocks/index.ts` imports all 13 block components synchronously
- Convert to a pattern that supports lazy loading while maintaining the Volto-like registry API
- Preserve the `blocksConfig[blockType]?.view` lookup pattern used in RenderBlocks.svelte
- Consider a hybrid approach: eagerly load common blocks (slate, title), lazy load heavy ones

**Performance Measurement**

- Document baseline bundle sizes before optimization (node 0 chunk: 142KB/46KB gzip)
- Run build analysis after each optimization to measure impact
- Focus on client-side JavaScript bundles as they affect user experience most

## Visual Design

No visual assets provided - this is a tooling and optimization spec without UI components.

## Existing Code to Leverage

**Block Registry Pattern (`src/lib/blocks/index.ts`)**

- Currently imports all 13 block view components synchronously at module load
- Exports a `blocks` object with `id`, `title`, and `view` component for each block type
- Convert to dynamic imports while preserving the existing API shape

**Variation Registry Pattern (`src/lib/blocks/listing/variations/index.ts`)**

- Uses `variationRegistry` Record mapping names to components
- `getVariationComponent()` function returns component based on variation name
- Has fallback to DefaultVariation when variation not found - preserve this behavior

**RenderBlocks.svelte Component**

- Iterates over `content.blocks_layout.items` and renders appropriate block components
- Looks up components via `blocksConfig[blockType]?.view`
- Any lazy loading solution must integrate with this lookup pattern

**Vite Configuration (`vite.config.ts`)**

- Uses `@tailwindcss/vite` plugin for CSS processing
- Has existing test workspace configuration
- Add analyzer plugin here, conditionally enabled via environment variable or script

**Tailwind CSS Setup (`src/app.css`)**

- Imports Tailwind with `@import 'tailwindcss'`
- Uses `@layer base` and `@layer components` for custom styles
- Contains extensive component styles (header, footer, navigation, blocks) that may have unused rules

## Out of Scope

- Complex lazy loading with custom loading spinners or skeleton states beyond existing patterns
- Service worker implementation or advanced caching strategies
- Image optimization (covered by separate spec: 2026-01-03-image-optimization-pipeline)
- Replacing or removing third-party dependencies (Slate, Immer, Embla Carousel)
- Specific numeric bundle size targets or performance benchmarks
- Server-side bundle optimization (focus is client-side JavaScript)
- Changes to the Plone backend API or data fetching patterns
- Automated CI/CD integration for bundle size monitoring
- Migration away from current CSS architecture or Tailwind CSS
- React interop bundle optimization (svelte-preprocess-react, react, react-dom)
