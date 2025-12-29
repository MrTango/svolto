# Task Breakdown: Description Block

## Overview

Total Tasks: 12

This feature creates a DescriptionBlockView component that renders content description/lead text following Seven/Volto patterns. The implementation is straightforward with two main work areas: the component itself and a minor update to RenderBlocks.

## Task List

### Component Layer

#### Task Group 1: DescriptionBlockView Component

**Dependencies:** None

- [x] 1.0 Complete DescriptionBlockView component
  - [x] 1.1 Write 2-4 focused tests for DescriptionBlockView
    - Test rendering description from `properties.description`
    - Test rendering description from `metadata.description` (takes precedence)
    - Test rendering empty paragraph when no description
    - Test truncation with `maxLength` configuration
  - [x] 1.2 Create directory structure
    - Create `/home/maik/develop/svelteplayground/svolto/src/lib/blocks/description/` directory
  - [x] 1.3 Create DescriptionBlockView.svelte component
    - File: `/home/maik/develop/svelteplayground/svolto/src/lib/blocks/description/DescriptionBlockView.svelte`
    - Use Svelte 5 runes syntax with `$props()` for props destructuring
    - Accept props: `id`, `data`, `metadata`, `properties`, `path`
    - Follow TitleBlockView pattern: `let { id, data, metadata, properties, path, ...others } = $props()`
  - [x] 1.4 Implement description data access
    - Access via `(metadata || properties)?.description || ''` pattern
    - Primary source: `metadata?.description`
    - Fallback source: `properties?.description`
    - Final fallback: empty string `''`
  - [x] 1.5 Implement truncation logic
    - Read `maxLength` from `data.maxLength`
    - When set and description exceeds limit, truncate at word boundary
    - Append ellipsis (`...`) to truncated text
    - Fall back to character limit if no word boundary found
  - [x] 1.6 Render output element
    - Render `<p>` element with `documentDescription` CSS class
    - Always render the element even when description is empty
    - Output: `<p class="documentDescription">{description}</p>`
  - [x] 1.7 Ensure component tests pass
    - Run ONLY the 2-4 tests written in 1.1
    - Verify component renders correctly in all scenarios

**Acceptance Criteria:**

- The 2-4 tests written in 1.1 pass
- Component renders `<p class="documentDescription">` element
- Description accessed via `(metadata || properties)?.description || ''`
- Truncation works correctly when `data.maxLength` is set
- Empty descriptions render empty paragraph element

### Integration Layer

#### Task Group 2: Block Registration and RenderBlocks Update

**Dependencies:** Task Group 1

- [x] 2.0 Complete block registration and RenderBlocks integration
  - [x] 2.1 Write 2-3 focused tests for integration
    - Test DescriptionBlockView renders via RenderBlocks
    - Test `metadata` prop is passed to block components
    - Test `path` prop is passed to block components
  - [x] 2.2 Register DescriptionBlockView in blocks index
    - File: `/home/maik/develop/svelteplayground/svolto/src/lib/blocks/index.ts`
    - Add import: `import DescriptionBlockView from './description/DescriptionBlockView.svelte'`
    - Add registration: `description: { id: 'description', title: 'Description', view: DescriptionBlockView }`
  - [x] 2.3 Update RenderBlocks to pass additional props
    - File: `/home/maik/develop/svelteplayground/svolto/src/lib/RenderBlocks.svelte`
    - Add `metadata` prop to component signature (optional prop)
    - Pass `metadata={metadata}` to BlockComponent
    - Pass `path={pathname}` to BlockComponent
    - Updated invocation: `<BlockComponent key={block} id={block} data={blockData} metadata={metadata} properties={content} path={pathname} />`
  - [x] 2.4 Ensure integration tests pass
    - Run ONLY the 2-3 tests written in 2.1
    - Verify block renders correctly through RenderBlocks

**Acceptance Criteria:**

- The 2-3 tests written in 2.1 pass
- DescriptionBlockView registered in blocks index
- RenderBlocks passes `metadata` and `path` props to all block components
- Description block renders correctly when invoked through RenderBlocks

### Testing

#### Task Group 3: Test Review and Gap Analysis

**Dependencies:** Task Groups 1-2

- [x] 3.0 Review existing tests and fill critical gaps only
  - [x] 3.1 Review tests from Task Groups 1-2
    - Review the 2-4 tests written for DescriptionBlockView (Task 1.1)
    - Review the 2-3 tests written for integration (Task 2.1)
    - Total existing tests: approximately 4-7 tests
  - [x] 3.2 Analyze test coverage gaps for this feature only
    - Identify critical workflows lacking coverage
    - Focus on metadata vs properties fallback behavior
    - Focus on truncation edge cases (word boundary, no word boundary)
  - [x] 3.3 Write up to 5 additional strategic tests if needed
    - Add maximum of 5 new tests to fill identified critical gaps
    - Focus on integration with existing content structures
    - Do NOT write comprehensive coverage for all scenarios
  - [x] 3.4 Run feature-specific tests only
    - Run ONLY tests related to Description Block feature
    - Expected total: approximately 4-12 tests maximum
    - Verify critical workflows pass

**Acceptance Criteria:**

- All feature-specific tests pass (approximately 4-12 tests total)
- Critical user workflows for Description Block are covered
- No more than 5 additional tests added when filling in testing gaps
- Testing focused exclusively on Description Block feature requirements

## Execution Order

Recommended implementation sequence:

1. Component Layer (Task Group 1) - Create DescriptionBlockView component
2. Integration Layer (Task Group 2) - Register block and update RenderBlocks
3. Test Review (Task Group 3) - Review and fill critical test gaps

## Files to Create/Modify

**New Files:**

- `/home/maik/develop/svelteplayground/svolto/src/lib/blocks/description/DescriptionBlockView.svelte`

**Modified Files:**

- `/home/maik/develop/svelteplayground/svolto/src/lib/blocks/index.ts`
- `/home/maik/develop/svelteplayground/svolto/src/lib/RenderBlocks.svelte`

## Reference Files

- TitleBlockView pattern: `/home/maik/develop/svelteplayground/svolto/src/lib/blocks/title/TitleBlockView.svelte`
- Block registration: `/home/maik/develop/svelteplayground/svolto/src/lib/blocks/index.ts`
- RenderBlocks: `/home/maik/develop/svelteplayground/svolto/src/lib/RenderBlocks.svelte`
