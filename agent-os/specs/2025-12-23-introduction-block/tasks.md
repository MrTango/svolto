# Task Breakdown: Introduction Block

## Overview

Total Tasks: 8

This is an XS effort feature that creates a view component for rendering styled introductory/lead text with full Slate rich text support. The component reuses existing Slate infrastructure.

**Note:** Unit tests are explicitly out of scope per spec requirements.

## Task List

### Frontend Components

#### Task Group 1: Introduction Block Component

**Dependencies:** None

- [x] 1.0 Complete Introduction block component
  - [x] 1.1 Create directory structure
    - Create `src/lib/blocks/introduction/` directory
  - [x] 1.2 Create `IntroductionBlockView.svelte` component
    - Use Svelte 5 `$props()` pattern: `let { key, id, data, ...others } = $props()`
    - Import `Leaf` from `../slate/Leaf.svelte`
    - Create editor object: `const editor = { children: data.value || [] }`
    - Wrap content in `<div class="introduction-block">`
    - Iterate with `{#each editor.children as node}` pattern
    - Render with `<Leaf {node} parent={null} />`
    - Follow exact pattern from `src/lib/blocks/slate/SlateBlockView.svelte`
  - [x] 1.3 Verify component compiles without errors
    - Run `pnpm check` to verify TypeScript/Svelte compilation

**Acceptance Criteria:**

- Component file exists at `src/lib/blocks/introduction/IntroductionBlockView.svelte`
- Component follows Svelte 5 patterns with `$props()`
- Component reuses existing `Leaf.svelte` for Slate rendering
- Component applies `introduction-block` CSS class
- TypeScript/Svelte compilation succeeds

---

### Styling Layer

#### Task Group 2: CSS Custom Properties and Styles

**Dependencies:** Task Group 1

- [x] 2.0 Complete CSS styling for Introduction block
  - [x] 2.1 Add CSS custom properties to `:root` in `src/app.css`
    - Add properties within existing `@layer components` block, inside `:root` section
    - Add `--introduction-font-size` (default: `var(--text-xl)` for larger than body text)
    - Add `--introduction-font-weight` (default: `inherit`)
    - Add `--introduction-color` (default: `inherit`)
    - Add `--introduction-max-width` (default: wider than standard blocks, e.g., `48rem`)
    - Place after existing Slate custom properties (after line 70)
  - [x] 2.2 Create `.introduction-block` class in `src/app.css`
    - Add class within `@layer components` block (after Slate styles)
    - Apply `font-size: var(--introduction-font-size)`
    - Apply `font-weight: var(--introduction-font-weight)`
    - Apply `color: var(--introduction-color)`
    - Apply `max-width: var(--introduction-max-width)`
    - Add appropriate margin for visual separation (e.g., `margin-bottom: 1.5rem`)

**Acceptance Criteria:**

- CSS custom properties defined in `:root` within `@layer components`
- `.introduction-block` class styled in components layer
- Introduction block has larger font size than standard text
- Introduction block has wider max-width than standard text blocks
- Styles follow existing Tailwind CSS 4 and custom property patterns

---

### Configuration Layer

#### Task Group 3: Block Registration

**Dependencies:** Task Group 1

- [x] 3.0 Complete block registration
  - [x] 3.1 Import `IntroductionBlockView` in `src/lib/blocks/index.ts`
    - Add import statement after existing imports (alphabetical order after `ImageBlockView`)
    - Use: `import IntroductionBlockView from './introduction/IntroductionBlockView.svelte';`
  - [x] 3.2 Add block configuration to `blocks` object
    - Add `introduction` entry (alphabetical order after `image`)
    - Set `id: 'introduction'`
    - Set `title: 'Introduction'`
    - Set `view: IntroductionBlockView`

**Acceptance Criteria:**

- `IntroductionBlockView` imported in block registry
- Block registered with id `introduction`, title `Introduction`
- Import and registration follow alphabetical ordering convention
- Export statement remains unchanged

---

### Verification

#### Task Group 4: Build and Integration Verification

**Dependencies:** Task Groups 1, 2, and 3

- [x] 4.0 Complete build and integration verification
  - [x] 4.1 Run code quality checks
    - Run `pnpm check` to verify TypeScript/Svelte compilation
    - Run `pnpm lint` to verify code formatting
    - Fix any issues identified
  - [x] 4.2 Run existing test suite to ensure no regressions
    - Run `pnpm test:unit -- --run` to execute existing unit tests
    - Verify all existing tests pass (no regressions introduced)
  - [x] 4.3 Verify production build succeeds
    - Run `pnpm build` to confirm production build completes without errors
  - [x] 4.4 Manual verification (optional)
    - If Plone backend is available with Introduction block content, verify block renders correctly
    - Verify Slate content (headings, lists, links, emphasis) renders within Introduction block
    - Verify styling appears prominent (larger font, wider width)

**Acceptance Criteria:**

- TypeScript/Svelte compilation succeeds
- Code formatting passes lint check
- All existing unit tests pass (no regressions)
- Production build completes without errors

## Execution Order

Recommended implementation sequence:

1. **Task Group 1: Introduction Block Component** - Create the core Svelte component
2. **Task Group 2: CSS Styling** - Add CSS custom properties and styles (can run in parallel with Group 3)
3. **Task Group 3: Block Registration** - Register block in configuration (can run in parallel with Group 2)
4. **Task Group 4: Verification** - Final build and integration verification

## Files to Create/Modify

### New Files

- `src/lib/blocks/introduction/IntroductionBlockView.svelte`

### Modified Files

- `src/lib/blocks/index.ts` - Add import and block registration
- `src/app.css` - Add CSS custom properties and `.introduction-block` styles

## Reference Code Patterns

### SlateBlockView.svelte Pattern (to follow)

```svelte
<script lang="ts">
	import Leaf from './Leaf.svelte';

	let { key, id, data, ...others } = $props();
	const editor = { children: data.value || [] };
</script>

<div class="block slate">
	{#each editor.children as node}
		<Leaf {node} parent={null} />
	{/each}
</div>
```

### Block Registration Pattern (to follow)

```typescript
import IntroductionBlockView from './introduction/IntroductionBlockView.svelte';

const blocks = {
	// ... existing blocks
	introduction: {
		id: 'introduction',
		title: 'Introduction',
		view: IntroductionBlockView
	}
	// ... existing blocks
};
```

### CSS Custom Properties Pattern (to follow)

```css
:root {
	/* Introduction Block */
	--introduction-font-size: var(--text-xl);
	--introduction-font-weight: inherit;
	--introduction-color: inherit;
	--introduction-max-width: 48rem;
}

/* Introduction Block */
.introduction-block {
	font-size: var(--introduction-font-size);
	font-weight: var(--introduction-font-weight);
	color: var(--introduction-color);
	max-width: var(--introduction-max-width);
	margin-bottom: 1.5rem;
}
```

## Notes

- **No unit tests required**: The spec explicitly lists "Unit tests for this component" as out of scope
- **XS effort feature**: This is a minimal implementation that reuses existing Slate infrastructure
- **View-only**: No edit component needed per project scope
- **Reuses existing code**: Leverages `Leaf.svelte` and all existing Slate element components (H2-H6, P, Ol, Ul, Li, Link, Strong, Em, Code, Blockquote, Underline, Strikethrough, Sub, Sup)
- **CSS follows existing patterns**: Custom properties follow the `--slate-*` naming convention pattern established in `app.css`
