# Tasks: Title Block Implementation

## Task Group 1: Create TitleBlockView Component

- [x] Create the directory structure `/src/lib/blocks/title/`
- [x] Create `TitleBlockView.svelte` component with:
  - Svelte 5 runes syntax using `$props()`
  - TypeScript with `lang="ts"` in script tag
  - Props: `key`, `id`, `data`, `properties`, and spread `...others`
  - Render `<h1>` with `documentFirstHeading` class
  - Access title from `properties.title` following Volto pattern

## Task Group 2: Register Title Block

- [x] Import `TitleBlockView` in `/src/lib/blocks/index.ts`
- [x] Add `title` block configuration to the blocks object with:
  - `id: 'title'`
  - `title: 'Title'`
  - `view: TitleBlockView`

## Task Group 3: Update RenderBlocks Integration

- [x] Update `RenderBlocks.svelte` to pass `properties={content}` to BlockComponent
- [x] Ensure backward compatibility with existing blocks

## Task Group 4: Testing and Verification

- [x] Verify Title Block renders correctly with test content
- [x] Verify existing blocks (image, slate, teaser) still work correctly
- [x] Run `pnpm check` to verify TypeScript types
- [x] Run `pnpm lint` to verify code formatting
