# Task Breakdown: Navigation Mega Menu

## Overview

Total Tasks: 38

This implementation covers a multi-level navigation component displaying the top 3 levels of site hierarchy as a mega menu on desktop and accordion drill-down on mobile, with full WCAG-compliant keyboard accessibility.

**Spec Update (2026-01-02):** Added Two-Click Navigation Pattern for Level 1 items with children - the panel headline must be a clickable link to navigate to the Level 1 page.

**Spec Update (2026-01-02 #2):** Clicking any navigation link inside the mega menu panel or mobile overlay should close the menu.

## Task List

### Data Layer

#### Task Group 1: Navigation Data Integration

**Dependencies:** None

- [x] 1.0 Complete navigation data layer
  - [x] 1.1 Write 3-4 focused tests for navigation data fetching
    - Test getNavigation API call with depth parameter
    - Test navigation data structure transformation
    - Test fallback behavior when API fails
  - [x] 1.2 Define TypeScript interfaces for navigation data
    - Create `NavItem` interface with href, title, items (recursive)
    - Create `NavigationData` interface for API response
    - Define `NavLevel` type for level identification (1, 2, 3)
    - Place interfaces in `src/lib/plone/navigation/types.ts`
  - [x] 1.3 Create navigation data fetching utility
    - Add `fetchNavigation` function using @plone/client getNavigation
    - Configure depth parameter to fetch 3 levels
    - Handle API errors with appropriate fallbacks
    - Place in `src/lib/plone/navigation/api.ts`
  - [x] 1.4 Integrate navigation fetch into +layout.server.js
    - Add navigation fetch alongside existing content fetch
    - Pass navigation data to layout via return object
    - Follow existing pattern from listing block data fetching
  - [x] 1.5 Ensure navigation data layer tests pass
    - Run ONLY the 3-4 tests written in 1.1
    - Verify API integration works correctly

**Acceptance Criteria:**

- Navigation data fetched with 3 levels of depth
- TypeScript interfaces properly defined
- Server-side data available in layout
- The 3-4 tests written in 1.1 pass

---

### Desktop Navigation Components

#### Task Group 2: Desktop Mega Menu Core Components

**Dependencies:** Task Group 1

- [x] 2.0 Complete desktop mega menu components
  - [x] 2.1 Write 4-6 focused tests for desktop mega menu
    - Test Level 1 item click opens panel
    - Test Level 1 item without children navigates directly
    - Test only one panel open at a time
    - Test close button closes panel
    - Test Escape key closes panel
  - [x] 2.2 Create MegaNav.svelte main container component
    - Props: navigation (NavItem[]), currentPath (string)
    - State: openPanelId (string | null) using Svelte 5 $state
    - Render Level 1 items horizontally
    - Manage which panel is currently open
    - Use BEM class naming: `nav-mega`, `nav-mega__bar`
    - Place in `src/lib/plone/navigation/MegaNav.svelte`
  - [x] 2.3 Create MegaNavItem.svelte for Level 1 items
    - Props: item (NavItem), isActive (boolean), isOpen (boolean), onClick (function)
    - Handle click: open panel if has children, navigate if no children
    - Apply active state underline indicator for current page
    - ARIA attributes: aria-expanded, aria-haspopup, aria-controls
    - Use BEM class naming: `nav-mega__item`, `nav-mega__item--active`
  - [x] 2.4 Create MegaNavPanel.svelte for dropdown panel
    - Props: item (NavItem), onClose (function)
    - Full viewport width panel with brand background
    - Panel header with title and close button (X icon)
    - Multi-column grid layout for Level 2/3 content
    - ARIA attributes: role="menu", aria-labelledby
    - Use BEM class naming: `nav-mega__panel`, `nav-mega__panel-header`
  - [x] 2.5 Create MegaNavColumn.svelte for Level 2 sections
    - Props: item (NavItem) containing Level 2 header and Level 3 children
    - Render Level 2 as bold header with underline separator
    - List Level 3 items vertically below header
    - Use BEM class naming: `nav-mega__column`, `nav-mega__l2-header`, `nav-mega__l3-item`
  - [x] 2.6 Implement click-outside detection to close panel
    - Create reusable clickOutside action or use svelte:window
    - Close open panel when clicking outside menu area
    - Ensure panel stays open when clicking within it
  - [x] 2.7 Ensure desktop mega menu tests pass
    - Run ONLY the 4-6 tests written in 2.1
    - Verify click interactions work correctly

**Acceptance Criteria:**

- Level 1 items render horizontally
- Click opens/closes panels correctly
- Only one panel open at a time
- Close button and click-outside work
- The 4-6 tests written in 2.1 pass

---

### Mobile Navigation Components

#### Task Group 3: Mobile Hamburger Menu

**Dependencies:** Task Group 1

- [x] 3.0 Complete mobile navigation components
  - [x] 3.1 Write 4-6 focused tests for mobile navigation
    - Test hamburger icon toggles overlay
    - Test icon transforms to X when open
    - Test accordion expand/collapse for items with children
    - Test direct navigation for items without children
    - Test overlay closes on navigation
  - [x] 3.2 Create MobileNav.svelte main container component
    - Props: navigation (NavItem[]), currentPath (string)
    - State: isOpen (boolean), expandedItems (Set<string>) using Svelte 5 $state
    - Render hamburger trigger in header area
    - Full-screen overlay when open
    - Use BEM class naming: `nav-mobile`, `nav-mobile__overlay`
    - Place in `src/lib/plone/navigation/MobileNav.svelte`
  - [x] 3.3 Create MobileNavTrigger.svelte hamburger button
    - Props: isOpen (boolean), onClick (function)
    - Hamburger icon transforms to X when open
    - Touch-friendly tap target (minimum 44x44px)
    - ARIA attributes: aria-expanded, aria-label
    - Use BEM class naming: `nav-mobile__trigger`
  - [x] 3.4 Create MobileNavItem.svelte for accordion items
    - Props: item (NavItem), level (number), isExpanded (boolean), onToggle (function)
    - Display title with chevron indicator (> or v based on state)
    - Handle click: expand accordion if has children, navigate if no children
    - Smooth expand/collapse transitions
    - ARIA attributes: aria-expanded for expandable items
    - Use BEM class naming: `nav-mobile__item`, `nav-mobile__chevron`
  - [x] 3.5 Create MobileNavList.svelte for nested item rendering
    - Props: items (NavItem[]), level (number), expandedItems (Set), onToggle (function)
    - Recursive rendering for nested levels
    - Separator lines between items
    - Indentation based on level
    - Use BEM class naming: `nav-mobile__list`, `nav-mobile__separator`
  - [x] 3.6 Add Home link at top of mobile menu
    - "Startseite" / Home link always visible at top
    - Separator line below home link
    - Direct navigation to root path
  - [x] 3.7 Ensure mobile navigation tests pass
    - Run ONLY the 4-6 tests written in 3.1
    - Verify accordion interactions work correctly

**Acceptance Criteria:**

- Hamburger icon toggles overlay
- Icon transforms between hamburger and X
- Accordion drill-down works for nested items
- Home link appears at top with separator
- The 4-6 tests written in 3.1 pass

---

### Keyboard Accessibility

#### Task Group 4: WCAG Keyboard Navigation

**Dependencies:** Task Groups 2, 3

- [x] 4.0 Complete keyboard accessibility
  - [x] 4.1 Write 4-6 focused tests for keyboard navigation
    - Test Tab moves focus between Level 1 items
    - Test Enter/Space opens panel or navigates
    - Test Arrow keys navigate within open panel
    - Test Escape closes panel and returns focus to trigger
    - Test focus trap within open panel
  - [x] 4.2 Implement Tab navigation for Level 1 items
    - Natural tab order through Level 1 navigation bar
    - Visible focus indicators on all items
    - Focus ring styling with sufficient contrast
  - [x] 4.3 Implement Enter/Space activation
    - Enter or Space on Level 1 opens panel (if has children)
    - Enter or Space navigates directly (if no children)
    - Prevent default scroll behavior for Space key
  - [x] 4.4 Implement Arrow key navigation within panel
    - Left/Right arrow keys move between columns
    - Up/Down arrow keys move within columns
    - Wrap at boundaries or stop at edges
    - Track currently focused item index
  - [x] 4.5 Implement Escape key handling
    - Escape closes open mega menu panel
    - Return focus to the triggering Level 1 item
    - Works from any focusable element within panel
  - [x] 4.6 Implement focus trap within open panel
    - Tab cycles through panel content only when panel is open
    - Prevent focus from escaping to page content behind overlay
    - Include close button in focus cycle
  - [x] 4.7 Add comprehensive ARIA attributes
    - aria-expanded on Level 1 items with children
    - aria-haspopup="true" on Level 1 items with children
    - aria-controls linking trigger to panel ID
    - aria-current="page" on active navigation item
    - role="menu" on panel, role="menuitem" on items
  - [x] 4.8 Ensure keyboard accessibility tests pass
    - Run ONLY the 4-6 tests written in 4.1
    - Verify all keyboard interactions work correctly

**Acceptance Criteria:**

- Full keyboard navigation support
- Escape closes menu and restores focus
- Focus trapped within open panel
- All ARIA attributes properly applied
- The 4-6 tests written in 4.1 pass

---

### Styling Layer

#### Task Group 5: CSS Architecture and Theming

**Dependencies:** Task Groups 2, 3

- [x] 5.0 Complete styling implementation
  - [x] 5.1 Write 2-4 focused tests for responsive behavior
    - Test desktop layout renders at 1024px+
    - Test mobile layout renders below 1024px
    - Test mega menu panel spans full viewport width
  - [x] 5.2 Create CSS custom properties for theming
    - Define color variables: --nav-bg, --nav-text, --nav-panel-bg, --nav-active-indicator
    - Define spacing variables: --nav-padding, --nav-gap, --nav-column-gap
    - Define typography variables: --nav-font-size, --nav-l2-font-weight
    - Support light/dark variations through property overrides
    - Place in `src/lib/plone/navigation/nav-variables.css`
  - [x] 5.3 Style desktop mega menu (MegaNav components)
    - Level 1 bar: horizontal layout, right-aligned
    - Active item: dark underline indicator below
    - Panel: full viewport width, solid teal background (#0097a7)
    - Panel header: title left, close button right
    - Multi-column grid: 3-4 columns, content flows by columns
    - Level 2 headers: bold/semibold white text with underline separator
    - Level 3 items: regular weight white text, vertical list
    - Sufficient color contrast (4.5:1 minimum for text)
  - [x] 5.4 Style mobile navigation (MobileNav components)
    - Full-screen overlay with same teal background
    - Hamburger/X icon in header position
    - Vertical list with separator lines
    - Chevron indicators for expandable items
    - Touch-friendly tap targets (minimum 44x44px)
    - Accordion expand/collapse animations
  - [x] 5.5 Implement responsive breakpoints
    - Mobile-first approach: mobile styles as default
    - Desktop breakpoint at 1024px (lg breakpoint)
    - Hide mobile nav on desktop, hide desktop nav on mobile
    - Use Tailwind responsive utilities where appropriate
  - [x] 5.6 Add focus indicator styles
    - Visible focus ring on all interactive elements
    - Consistent focus styling across components
    - Sufficient contrast for focus indicators
  - [x] 5.7 Ensure styling tests pass
    - Run ONLY the 2-4 tests written in 5.1
    - Visually verify against mockups (nav.png, nav-mobile.png)

**Acceptance Criteria:**

- CSS custom properties enable theme customization
- Desktop matches nav.png visual design
- Mobile matches nav-mobile.png visual design
- Responsive breakpoint switching works
- The 2-4 tests written in 5.1 pass

---

### Integration

#### Task Group 6: Layout Integration

**Dependencies:** Task Groups 1-5

- [x] 6.0 Complete layout integration
  - [x] 6.1 Write 2-3 focused integration tests
    - Test navigation renders in layout
    - Test navigation receives data from server load
    - Test current path highlighting works
  - [x] 6.2 Create unified Navigation.svelte wrapper component
    - Import and conditionally render MegaNav (desktop) and MobileNav (mobile)
    - Pass navigation data and currentPath props
    - Handle responsive switching via CSS (not JS)
    - Replace existing `src/lib/plone/navigation.svelte`
  - [x] 6.3 Update +layout.svelte to include navigation
    - Import Navigation component
    - Pass navigation data from load function
    - Pass current path for active state
    - Position in header area of layout
  - [x] 6.4 Export navigation components from index
    - Create `src/lib/plone/navigation/index.ts`
    - Export Navigation, MegaNav, MobileNav for external use
    - Export types for TypeScript consumers
  - [x] 6.5 Ensure integration tests pass
    - Run ONLY the 2-3 tests written in 6.1
    - Verify end-to-end navigation flow works

**Acceptance Criteria:**

- Navigation integrated into site layout
- Desktop and mobile views switch responsively
- Current page indicated in navigation
- The 2-3 tests written in 6.1 pass

---

### Testing

#### Task Group 7: Test Review and Gap Analysis

**Dependencies:** Task Groups 1-6

- [x] 7.0 Review existing tests and fill critical gaps only
  - [x] 7.1 Review tests from Task Groups 1-6
    - Review the 3-4 tests written for data layer (Task 1.1)
    - Review the 4-6 tests written for desktop mega menu (Task 2.1)
    - Review the 4-6 tests written for mobile navigation (Task 3.1)
    - Review the 4-6 tests written for keyboard accessibility (Task 4.1)
    - Review the 2-4 tests written for styling (Task 5.1)
    - Review the 2-3 tests written for integration (Task 6.1)
    - Total existing tests: approximately 19-29 tests
  - [x] 7.2 Analyze test coverage gaps for navigation feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to mega menu functionality
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end workflows over unit test gaps
  - [x] 7.3 Write up to 5 additional strategic tests maximum
    - Add maximum of 5 new tests to fill identified critical gaps
    - Focus on integration points (e.g., navigation + routing)
    - Consider e2e test for complete navigation flow
    - Do NOT write comprehensive coverage for all scenarios
  - [x] 7.4 Run navigation feature tests only
    - Run ONLY tests related to navigation mega menu feature
    - Expected total: approximately 24-34 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**

- All navigation feature tests pass (approximately 24-34 tests total)
- Critical user workflows for navigation are covered
- No more than 5 additional tests added when filling gaps
- Testing focused exclusively on mega menu feature requirements

---

### Spec Update Tasks

#### Task Group 8: Two-Click Navigation Pattern (Spec Update 2026-01-02)

**Dependencies:** Task Groups 2, 4

- [x] 8.0 Implement Two-Click Navigation Pattern for Level 1 items with children
  - [x] 8.1 Update MegaNavPanel headline to be a clickable link
    - Change `<h2>` panel title from plain text to `<a>` anchor element
    - Link href should point to the Level 1 item's URL (item.href)
    - Maintain visual styling as headline (font-size, font-weight)
    - Keep semantic heading role via aria-level or heading structure
  - [x] 8.2 Ensure headline link receives focus first when panel opens
    - Update focus trap to set initial focus on headline link
    - Keyboard users can immediately press Enter to navigate to Level 1 page
    - Tab from headline should move to first Level 2/3 item, then close button
  - [x] 8.3 Write test for Two-Click Navigation Pattern
    - Test click on Level 1 item opens panel (does not navigate)
    - Test headline link in panel is clickable and navigates to Level 1 URL
    - Test focus moves to headline link when panel opens
  - [x] 8.4 Update mobile accordion to support similar pattern
    - When Level 1 item is expanded, show item title as link at top of children
    - Allow users to navigate to Level 1 page from within expanded accordion
    - Maintain accordion expand/collapse for chevron tap

**Acceptance Criteria:**

- Panel headline is a clickable link that navigates to Level 1 page
- First click opens mega menu, second click (on headline) navigates
- Keyboard focus moves to headline link when panel opens
- Mobile accordion provides path to Level 1 page when expanded
- Tests verify the two-click navigation pattern works correctly

---

#### Task Group 9: Close Menu on Navigation Link Click (Spec Update 2026-01-02 #2)

**Dependencies:** Task Groups 2, 3, 8

- [x] 9.0 Implement close-on-navigation behavior for all menu links
  - [x] 9.1 Desktop: Close mega menu panel when any link is clicked
    - Add click handler to Level 1 headline link in MegaNavPanel to close panel
    - Add click handler to Level 2 header links in MegaNavColumn to close panel
    - Add click handler to Level 3 item links in MegaNavColumn to close panel
    - Use onClose callback prop passed from parent MegaNav component
  - [x] 9.2 Mobile: Close mobile overlay when any link is clicked
    - Add click handler to home link to close overlay
    - Add click handler to parent links (from Task 8.4) to close overlay
    - Add click handler to all navigation item links to close overlay
    - Pass onClose callback through MobileNavList and MobileNavItem components
  - [x] 9.3 Write tests for close-on-navigation behavior
    - Test: clicking Level 1 headline link closes desktop panel
    - Test: clicking Level 2 header link closes desktop panel
    - Test: clicking Level 3 item link closes desktop panel
    - Test: clicking any link in mobile overlay closes the overlay
  - [x] 9.4 Ensure navigation still works correctly after menu closes
    - Verify SvelteKit navigation occurs after menu close
    - No race conditions between close animation and navigation
    - Page content updates correctly after navigation

**Acceptance Criteria:**

- All links inside desktop mega menu panel close the panel when clicked
- All links inside mobile overlay close the overlay when clicked
- Navigation to target page occurs correctly
- Tests verify close-on-navigation behavior works for all link types

---

## Execution Order

Recommended implementation sequence:

1. **Data Layer** (Task Group 1) - Foundation for all components
2. **Desktop Mega Menu** (Task Group 2) - Core desktop functionality
3. **Mobile Navigation** (Task Group 3) - Can parallel with Task Group 2
4. **Keyboard Accessibility** (Task Group 4) - After components exist
5. **CSS Architecture** (Task Group 5) - Can parallel with Task Groups 2-4
6. **Layout Integration** (Task Group 6) - After all components ready
7. **Test Review** (Task Group 7) - Final validation
8. **Two-Click Navigation Pattern** (Task Group 8) - Spec update implementation
9. **Close Menu on Navigation** (Task Group 9) - Spec update implementation

**Parallelization Opportunities:**
- Task Groups 2 and 3 can be developed in parallel (both depend only on Task Group 1)
- Task Group 5 styling can begin once component structures are defined
- Task Group 4 keyboard accessibility can be added incrementally during component development

## File Structure

```
src/lib/plone/navigation/
  index.ts              # Exports
  types.ts              # TypeScript interfaces
  api.ts                # Navigation data fetching
  nav-variables.css     # CSS custom properties
  Navigation.svelte     # Unified wrapper (replaces old navigation.svelte)
  MegaNav.svelte        # Desktop mega menu container
  MegaNavItem.svelte    # Desktop Level 1 item
  MegaNavPanel.svelte   # Desktop dropdown panel
  MegaNavColumn.svelte  # Desktop Level 2/3 column
  MobileNav.svelte      # Mobile navigation container
  MobileNavTrigger.svelte  # Hamburger button
  MobileNavItem.svelte  # Mobile accordion item
  MobileNavList.svelte  # Mobile nested list
  __tests__/
    navigation.test.ts  # All navigation tests
```

## Visual Reference

- Desktop mega menu design: `planning/visuals/nav.png`
- Mobile navigation design: `planning/visuals/nav-mobile.png`

## Technical Notes

- Use Svelte 5 runes ($state, $derived, $effect) for state management
- Follow existing recursive pattern from `contextnavitem.svelte`
- CSS custom properties enable theme flexibility per spec requirements
- BEM class naming provides styling hooks for customization
- Mobile-first responsive approach with 1024px desktop breakpoint
- Server-side navigation fetch ensures SSR compatibility
