# Task Breakdown: Global Styling

## Overview

Total Tasks: 30
Estimated Task Groups: 6

This spec implements a unified global styling system with three-tier container widths, modular header/footer components, breadcrumbs integration, and a comprehensive design token system following Volto Light Theme patterns.

## Task List

### Foundation Layer

#### Task Group 1: Design Tokens and CSS Custom Properties

**Dependencies:** None

- [ ] 1.0 Complete design tokens foundation
  - [ ] 1.1 Write 3-4 focused tests for design token application
    - Test that container width variables are defined and accessible
    - Test that layout spacing variables are properly applied
    - Test responsive padding scales correctly at breakpoints
  - [ ] 1.2 Create layout variables CSS file
    - **File:** `/workspace/src/lib/styles/layout-variables.css`
    - Define `--layout-container-width: 1440px`
    - Define `--default-container-width: 940px`
    - Define `--narrow-container-width: 620px`
    - Define spacing variables: `--header-height`, `--footer-padding`, `--section-spacing`
    - Follow organization pattern from `nav-variables.css`
  - [ ] 1.3 Define gradient color tokens
    - **File:** `/workspace/src/lib/styles/layout-variables.css`
    - Add `--header-gradient-start`, `--header-gradient-end`
    - Add `--footer-gradient-start`, `--footer-gradient-end`
    - Use Volto Light Theme teal gradient palette
  - [ ] 1.4 Define responsive spacing tokens
    - **File:** `/workspace/src/lib/styles/layout-variables.css`
    - Mobile padding: `--container-padding-mobile: 16px`
    - Tablet padding: `--container-padding-tablet: 24px`
    - Desktop padding: `--container-padding-desktop: 32px`
  - [ ] 1.5 Import layout variables in app.css
    - **File:** `/workspace/src/app.css`
    - Add `@import './lib/styles/layout-variables.css';` after tailwindcss import
  - [ ] 1.6 Ensure design token tests pass
    - Run ONLY the 3-4 tests written in 1.1
    - Verify variables are accessible in computed styles

**Acceptance Criteria:**

- All layout CSS custom properties are defined in `:root`
- Variables follow naming convention from `nav-variables.css`
- Variables are importable and accessible in components
- Tests confirm token accessibility

---

#### Task Group 2: Container Utility Classes

**Dependencies:** Task Group 1

- [ ] 2.0 Complete container utility classes
  - [ ] 2.1 Write 3-4 focused tests for container classes
    - Test `.container-layout` applies correct max-width
    - Test `.container-default` applies correct max-width
    - Test `.container-narrow` applies correct max-width
    - Test containers are horizontally centered
  - [ ] 2.2 Create container classes in app.css @layer components
    - **File:** `/workspace/src/app.css`
    - Add `.container-layout` with `max-width: var(--layout-container-width)`
    - Add `.container-default` with `max-width: var(--default-container-width)`
    - Add `.container-narrow` with `max-width: var(--narrow-container-width)`
    - All containers: `margin: 0 auto; width: 100%;`
  - [ ] 2.3 Add responsive padding to containers
    - **File:** `/workspace/src/app.css`
    - Mobile (base): `padding-inline: var(--container-padding-mobile)`
    - Tablet `@media (min-width: 768px)`: `padding-inline: var(--container-padding-tablet)`
    - Desktop `@media (min-width: 1024px)`: `padding-inline: var(--container-padding-desktop)`
  - [ ] 2.4 Add full-width utility class
    - **File:** `/workspace/src/app.css`
    - Create `.full-width` class for blocks that need to break out of container
    - Use `width: 100vw; margin-left: calc(-50vw + 50%);`
  - [ ] 2.5 Ensure container class tests pass
    - Run ONLY the 3-4 tests written in 2.1
    - Verify max-width and centering behavior

**Acceptance Criteria:**

- Three container classes available globally
- Containers are centered with responsive padding
- Full-width utility enables breaking out of containers
- Tests confirm container behavior

---

### Component Layer

#### Task Group 3: Header Component

**Dependencies:** Task Group 2

- [ ] 3.0 Complete header component
  - [ ] 3.1 Write 3-4 focused tests for SiteHeader component
    - Test header renders with correct CSS classes
    - Test Navigation component is integrated
    - Test header regions (logo, nav, utility) are present
  - [ ] 3.2 Create SiteHeader.svelte component
    - **File:** `/workspace/src/lib/components/SiteHeader.svelte`
    - Use Svelte 5 `$props()` pattern for configuration
    - Define interface with `navigation`, `currentPath`, and optional snippet props
    - Apply `.site-header` CSS identifier
  - [ ] 3.3 Implement header regions structure
    - **File:** `/workspace/src/lib/components/SiteHeader.svelte`
    - Create `.header-logo` region (left)
    - Create `.header-nav` region (center/main)
    - Create `.header-utility` region (right)
    - Use CSS Grid or Flexbox for layout
  - [ ] 3.4 Integrate Navigation component
    - **File:** `/workspace/src/lib/components/SiteHeader.svelte`
    - Import `Navigation` from `$lib/plone/navigation`
    - Render Navigation in `.header-nav` region
    - Pass `navigation` and `currentPath` props
  - [ ] 3.5 Apply header gradient background styles
    - **File:** `/workspace/src/app.css`
    - Add `.site-header` styles in `@layer components`
    - Apply gradient: `linear-gradient(to right, var(--header-gradient-start), var(--header-gradient-end))`
    - Full viewport width with inner container constraint
  - [ ] 3.6 Add header responsive behavior
    - **File:** `/workspace/src/app.css`
    - Mobile: Stack regions vertically if needed
    - Desktop (min-width: 1024px): Horizontal layout
    - Ensure header spans full viewport width
  - [ ] 3.7 Create component barrel export
    - **File:** `/workspace/src/lib/components/index.ts`
    - Export `SiteHeader` component
  - [ ] 3.8 Ensure header component tests pass
    - Run ONLY the 3-4 tests written in 3.1
    - Verify component renders and integrates Navigation

**Acceptance Criteria:**

- SiteHeader component renders three regions
- Navigation component properly integrated
- Gradient background applied per Volto Light Theme
- Full viewport width with constrained inner content
- CSS identifiers: `.site-header`, `.header-logo`, `.header-nav`, `.header-utility`

---

#### Task Group 4: Footer Component

**Dependencies:** Task Group 2

- [ ] 4.0 Complete footer component
  - [ ] 4.1 Write 2-3 focused tests for SiteFooter component
    - Test footer renders with correct CSS classes
    - Test footer content region is present
  - [ ] 4.2 Create SiteFooter.svelte component
    - **File:** `/workspace/src/lib/components/SiteFooter.svelte`
    - Use Svelte 5 `$props()` pattern
    - Accept snippet for custom footer content
    - Apply `.site-footer` CSS identifier
  - [ ] 4.3 Implement footer structure
    - **File:** `/workspace/src/lib/components/SiteFooter.svelte`
    - Create `.footer-content` inner container
    - Apply `container-layout` for content constraint
    - Provide default content if no snippet provided
  - [ ] 4.4 Apply footer gradient background styles
    - **File:** `/workspace/src/app.css`
    - Add `.site-footer` styles in `@layer components`
    - Apply gradient background (Volto Light Theme style)
    - Full viewport width with inner container constraint
  - [ ] 4.5 Add footer to component exports
    - **File:** `/workspace/src/lib/components/index.ts`
    - Export `SiteFooter` component
  - [ ] 4.6 Ensure footer component tests pass
    - Run ONLY the 2-3 tests written in 4.1
    - Verify component renders correctly

**Acceptance Criteria:**

- SiteFooter component renders with proper structure
- Gradient background applied per Volto Light Theme
- Full viewport width with constrained inner content
- CSS identifiers: `.site-footer`, `.footer-content`

---

### Integration Layer

#### Task Group 5: Layout Structure Updates

**Dependencies:** Task Groups 3, 4

- [ ] 5.0 Complete layout structure refactoring
  - [ ] 5.1 Write 3-4 focused tests for layout integration
    - Test page renders with header, main, footer structure
    - Test breadcrumbs appear below header
    - Test main content has container-default applied
  - [ ] 5.2 Update breadcrumbs component to Svelte 5
    - **File:** `/workspace/src/lib/plone/breadcrumbs.svelte`
    - Convert `export let` to `$props()` pattern
    - Add `.breadcrumbs` CSS identifier to ul element
  - [ ] 5.3 Create breadcrumbs wrapper styles
    - **File:** `/workspace/src/app.css`
    - Add `.breadcrumbs-wrapper` styles in `@layer components`
    - Apply `container-default` width constraint
    - Add vertical spacing (margin/padding) above and below
  - [ ] 5.4 Update root layout with new structure
    - **File:** `/workspace/src/routes/+layout.svelte`
    - Replace inline header with `SiteHeader` component
    - Add `.breadcrumbs-wrapper` around breadcrumbs
    - Add `SiteFooter` component at bottom
    - Create `.site-wrapper` to wrap entire layout
  - [ ] 5.5 Refactor main content structure
    - **File:** `/workspace/src/routes/+layout.svelte`
    - Remove current `.layout-wrapper` scoped styles
    - Apply `.main-content` class to `<main>` element
    - Use `container-default` for main content area
    - Remove old max-width: 1127px constraint
  - [ ] 5.6 Add main content styles to app.css
    - **File:** `/workspace/src/app.css`
    - Add `.main-content` styles in `@layer components`
    - Apply proper vertical spacing between sections
    - Ensure blocks can opt-out with `.full-width`
  - [ ] 5.7 Add site wrapper styles
    - **File:** `/workspace/src/app.css`
    - Add `.site-wrapper` for min-height and flex layout
    - Ensure footer sticks to bottom on short pages
    - Use `min-height: 100vh` with flex column layout
  - [ ] 5.8 Ensure layout integration tests pass
    - Run ONLY the 3-4 tests written in 5.1
    - Verify complete layout renders correctly

**Acceptance Criteria:**

- Root layout uses new SiteHeader and SiteFooter components
- Breadcrumbs positioned between header and main content
- Main content uses container-default width
- Old card wrapper styles removed
- Site wrapper ensures proper page structure
- Proper vertical spacing throughout

---

### Verification Layer

#### Task Group 6: Test Review and Gap Analysis

**Dependencies:** Task Groups 1-5

- [ ] 6.0 Review existing tests and fill critical gaps only
  - [ ] 6.1 Review tests from Task Groups 1-5
    - Review the 3-4 tests written for design tokens (Task 1.1)
    - Review the 3-4 tests written for container classes (Task 2.1)
    - Review the 3-4 tests written for header component (Task 3.1)
    - Review the 2-3 tests written for footer component (Task 4.1)
    - Review the 3-4 tests written for layout integration (Task 5.1)
    - Total existing tests: approximately 15-19 tests
  - [ ] 6.2 Analyze test coverage gaps for global styling feature
    - Identify critical layout workflows lacking coverage
    - Focus ONLY on this spec's feature requirements
    - Prioritize responsive behavior testing
    - Check header/footer integration at different breakpoints
  - [ ] 6.3 Write up to 8 additional strategic tests if needed
    - Test responsive container padding at each breakpoint
    - Test header layout at mobile vs desktop breakpoints
    - Test breadcrumbs visibility and positioning
    - Test footer sticky behavior on short content pages
    - Do NOT write exhaustive edge case tests
  - [ ] 6.4 Run feature-specific tests only
    - Run ONLY tests related to global styling feature
    - Expected total: approximately 20-27 tests maximum
    - Do NOT run the entire application test suite
    - Verify all critical layout behaviors pass
  - [ ] 6.5 Visual verification across breakpoints
    - Manually verify layout at 375px (mobile)
    - Manually verify layout at 768px (tablet)
    - Manually verify layout at 1024px (desktop)
    - Manually verify layout at 1440px+ (large screens)

**Acceptance Criteria:**

- All feature-specific tests pass (approximately 20-27 tests total)
- Critical layout workflows for this feature are covered
- No more than 8 additional tests added when filling gaps
- Layout verified visually at all responsive breakpoints

---

## Execution Order

Recommended implementation sequence:

1. **Task Group 1: Design Tokens** - Foundation layer establishing CSS custom properties
2. **Task Group 2: Container Classes** - Utility classes built on design tokens
3. **Task Group 3: Header Component** - Uses container classes, includes Navigation
4. **Task Group 4: Footer Component** - Uses container classes (can run parallel with Group 3)
5. **Task Group 5: Layout Structure** - Integrates all components into root layout
6. **Task Group 6: Test Review** - Final verification and gap analysis

## File Summary

### Files to Create

- `/workspace/src/lib/styles/layout-variables.css` - Design tokens
- `/workspace/src/lib/components/SiteHeader.svelte` - Header component
- `/workspace/src/lib/components/SiteFooter.svelte` - Footer component
- `/workspace/src/lib/components/index.ts` - Component exports

### Files to Modify

- `/workspace/src/app.css` - Add imports and component styles
- `/workspace/src/routes/+layout.svelte` - Refactor layout structure
- `/workspace/src/lib/plone/breadcrumbs.svelte` - Update to Svelte 5 props

## CSS Identifiers Reference

| Element | CSS Class | Description |
|---------|-----------|-------------|
| Site wrapper | `.site-wrapper` | Root layout container |
| Header | `.site-header` | Main header element |
| Header logo | `.header-logo` | Logo region in header |
| Header navigation | `.header-nav` | Navigation region in header |
| Header utility | `.header-utility` | Utility tools region in header |
| Breadcrumbs wrapper | `.breadcrumbs-wrapper` | Container around breadcrumbs |
| Main content | `.main-content` | Main content area |
| Footer | `.site-footer` | Main footer element |
| Footer content | `.footer-content` | Inner footer container |
| Layout container | `.container-layout` | 1440px max-width container |
| Default container | `.container-default` | 940px max-width container |
| Narrow container | `.container-narrow` | 620px max-width container |
| Full width | `.full-width` | Break out of container |

## Design Tokens Reference

```css
/* Container Widths */
--layout-container-width: 1440px;
--default-container-width: 940px;
--narrow-container-width: 620px;

/* Responsive Padding */
--container-padding-mobile: 16px;
--container-padding-tablet: 24px;
--container-padding-desktop: 32px;

/* Layout Spacing */
--header-height: auto;
--footer-padding: 2rem;
--section-spacing: 2rem;

/* Header Gradient */
--header-gradient-start: #0097a7;
--header-gradient-end: #00838f;

/* Footer Gradient */
--footer-gradient-start: #0097a7;
--footer-gradient-end: #00838f;
```
