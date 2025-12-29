# Task Breakdown: Rename Table Block to slateTable

## Overview

This task list covers renaming the existing "table" block implementation to "slateTable" to align with the updated spec naming convention. The implementation is complete and functional; this is a rename/refactor operation only.

Total Tasks: 14

## Current State

The Table Block is fully implemented at:
- Component: `src/lib/blocks/table/TableBlockView.svelte`
- Tests: `src/lib/blocks/table/TableBlockView.svelte.test.ts`
- Registration: `src/lib/blocks/index.ts` (key: `table`)
- CSS: `src/app.css` (classes: `.block.table`, `.table--*` modifiers)

## Target State

After completion:
- Component: `src/lib/blocks/slateTable/SlateTableBlockView.svelte`
- Tests: `src/lib/blocks/slateTable/SlateTableBlockView.svelte.test.ts`
- Registration: `src/lib/blocks/index.ts` (key: `slateTable`)
- CSS: `src/app.css` (classes: `.block.slateTable`, `.slateTable--*` modifiers)

## Task List

### File System Operations

#### Task Group 1: Rename Directory and Files

**Dependencies:** None

- [x] 1.0 Complete file rename operations
  - [x] 1.1 Rename directory `src/lib/blocks/table/` to `src/lib/blocks/slateTable/`
  - [x] 1.2 Rename component file `TableBlockView.svelte` to `SlateTableBlockView.svelte`
  - [x] 1.3 Rename test file `TableBlockView.svelte.test.ts` to `SlateTableBlockView.svelte.test.ts`
  - [x] 1.4 Verify file structure is correct
    - Directory: `src/lib/blocks/slateTable/`
    - Component: `src/lib/blocks/slateTable/SlateTableBlockView.svelte`
    - Test: `src/lib/blocks/slateTable/SlateTableBlockView.svelte.test.ts`

**Acceptance Criteria:**
- Directory renamed from `table` to `slateTable`
- Component file renamed to `SlateTableBlockView.svelte`
- Test file renamed to `SlateTableBlockView.svelte.test.ts`
- No orphan files remain in old location

---

### Component Updates

#### Task Group 2: Update Component and CSS Classes

**Dependencies:** Task Group 1

- [x] 2.0 Complete component class updates
  - [x] 2.1 Update `SlateTableBlockView.svelte` wrapper div class
    - Change: `<div class="block table">` to `<div class="block slateTable">`
  - [x] 2.2 Update CSS modifier class prefixes in `tableClasses` computed function
    - Change all `table--*` references to `slateTable--*`:
      - `table--hide-headers` to `slateTable--hide-headers`
      - `table--sortable` to `slateTable--sortable`
      - `table--fixed` to `slateTable--fixed`
      - `table--compact` to `slateTable--compact`
      - `table--basic` to `slateTable--basic`
      - `table--celled` to `slateTable--celled`
      - `table--inverted` to `slateTable--inverted`
      - `table--striped` to `slateTable--striped`
  - [x] 2.3 Verify component renders correctly after changes
    - Run: `pnpm build` to check for compilation errors

**Acceptance Criteria:**
- Block wrapper uses class `block slateTable`
- All modifier classes use `slateTable--` prefix
- Component compiles without errors

---

### Block Registration

#### Task Group 3: Update Block Registry

**Dependencies:** Task Group 1

- [x] 3.0 Complete block registration updates
  - [x] 3.1 Update import statement in `src/lib/blocks/index.ts`
    - Change: `import TableBlockView from './table/TableBlockView.svelte';`
    - To: `import SlateTableBlockView from './slateTable/SlateTableBlockView.svelte';`
  - [x] 3.2 Update block registration key and properties
    - Change key from `table` to `slateTable`
    - Update `id` from `'table'` to `'slateTable'`
    - Update `title` from `'Table'` to `'Slate Table'`
    - Update `view` from `TableBlockView` to `SlateTableBlockView`
  - [x] 3.3 Verify block registration compiles correctly

**Acceptance Criteria:**
- Import path updated to new location
- Block key is `slateTable`
- Block id is `slateTable`
- Block view references `SlateTableBlockView`

---

### CSS Updates

#### Task Group 4: Update CSS Styles in app.css

**Dependencies:** None (can run in parallel with Task Groups 2-3)

- [x] 4.0 Complete CSS class updates
  - [x] 4.1 Update CSS custom property comment (optional, for clarity)
    - Change: `/* Table Block Custom Properties */`
    - To: `/* Slate Table Block Custom Properties */`
  - [x] 4.2 Update base table styles selector
    - Change: `.block.table table` to `.block.slateTable table`
    - Change: `.block.table th,` to `.block.slateTable th,`
    - Change: `.block.table td` to `.block.slateTable td`
    - Change: `.block.table th` to `.block.slateTable th`
    - Change: `.block.table thead th` to `.block.slateTable thead th`
  - [x] 4.3 Update all modifier class selectors
    - Change all `.block.table table.table--*` to `.block.slateTable table.slateTable--*`
    - This affects selectors for: fixed, compact, basic, celled, inverted, striped, sortable
  - [x] 4.4 Update combined modifier selectors
    - `.block.table table.table--inverted.table--striped` to `.block.slateTable table.slateTable--inverted.slateTable--striped`
    - `.block.table table.table--inverted.table--sortable` to `.block.slateTable table.slateTable--inverted.slateTable--sortable`
  - [x] 4.5 Update aria-sort selectors
    - Change: `.block.table table.table--sortable th[aria-sort='ascending']::after`
    - To: `.block.slateTable table.slateTable--sortable th[aria-sort='ascending']::after`
    - Same for `descending` selector

**Acceptance Criteria:**
- All `.block.table` selectors changed to `.block.slateTable`
- All `.table--*` modifier classes changed to `.slateTable--*`
- CSS compiles without errors
- No orphan `.block.table` selectors remain

---

### Test Updates

#### Task Group 5: Update Test File

**Dependencies:** Task Groups 1, 2, 3

- [x] 5.0 Complete test file updates
  - [x] 5.1 Update import statements in test file
    - Change: `import TableBlockView from './TableBlockView.svelte';`
    - To: `import SlateTableBlockView from './SlateTableBlockView.svelte';`
    - Change: `import { extractPlainText } from './TableBlockView.svelte';`
    - To: `import { extractPlainText } from './SlateTableBlockView.svelte';`
  - [x] 5.2 Update all render calls to use new component name
    - Change: `render(TableBlockView, { ... })`
    - To: `render(SlateTableBlockView, { ... })`
  - [x] 5.3 Update CSS class assertions
    - Change: `container.querySelector('.block.table')` to `container.querySelector('.block.slateTable')`
    - Change all `toHaveClass('table--*')` assertions to `toHaveClass('slateTable--*')`
  - [x] 5.4 Update block registration test
    - Change: `'@type': 'table'` to `'@type': 'slateTable'`
  - [x] 5.5 Update describe block names (optional, for clarity)
    - Change: `'Table Block - *'` to `'Slate Table Block - *'`

**Acceptance Criteria:**
- All imports reference new file names
- All render calls use `SlateTableBlockView`
- All CSS class assertions use `slateTable` prefix
- Block type in RenderBlocks test is `slateTable`

---

### Verification

#### Task Group 6: Run Tests and Verify

**Dependencies:** Task Groups 1-5

- [x] 6.0 Verify all changes work correctly
  - [x] 6.1 Run unit tests for the slate table block
    - Command: `pnpm test:unit -- --run src/lib/blocks/slateTable/`
    - Expected: All tests pass
  - [x] 6.2 Run full test suite to check for regressions
    - Command: `pnpm test:unit -- --run`
    - Expected: All tests pass
  - [x] 6.3 Run build to verify no compilation errors
    - Command: `pnpm build`
    - Expected: Build succeeds
  - [x] 6.4 Run linting to ensure code style compliance
    - Command: `pnpm lint`
    - Expected: No formatting issues

**Acceptance Criteria:**
- All slate table block tests pass
- No regressions in other tests
- Build completes successfully
- Code passes linting

---

## Execution Order

Recommended implementation sequence:

1. **Task Group 1**: Rename Directory and Files (must be first)
2. **Task Group 4**: Update CSS Styles (can run in parallel after files exist)
3. **Task Group 2**: Update Component Classes (after files renamed)
4. **Task Group 3**: Update Block Registry (after files renamed)
5. **Task Group 5**: Update Test File (after component and registry updated)
6. **Task Group 6**: Run Tests and Verify (must be last)

---

## Files Modified

Summary of all files that will be modified:

| Original Path | New Path / Action |
|--------------|-------------------|
| `src/lib/blocks/table/` | Rename to `src/lib/blocks/slateTable/` |
| `src/lib/blocks/table/TableBlockView.svelte` | Rename to `src/lib/blocks/slateTable/SlateTableBlockView.svelte` + update classes |
| `src/lib/blocks/table/TableBlockView.svelte.test.ts` | Rename to `src/lib/blocks/slateTable/SlateTableBlockView.svelte.test.ts` + update imports/assertions |
| `src/lib/blocks/index.ts` | Update import and registration |
| `src/app.css` | Update all table CSS selectors |

---

## Notes

- The `--table-*` CSS custom properties can remain unchanged as they are internal implementation details and not part of the public class API
- The `.table-scroll-container` class is a utility class and does not need to be renamed (it's not block-specific)
- The `extractPlainText` utility function export does not need renaming
- All functionality should remain identical after the rename; this is purely a naming convention change
