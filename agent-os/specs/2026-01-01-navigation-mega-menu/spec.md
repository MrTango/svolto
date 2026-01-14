# Specification: Navigation Mega Menu

## Goal

Implement a multi-level navigation component displaying the top 3 levels of site hierarchy as a mega menu on desktop and accordion drill-down on mobile, following Volto Light Theme patterns with full WCAG-compliant keyboard accessibility.

## User Stories

- As a site visitor, I want to navigate the site hierarchy through an intuitive mega menu so that I can quickly find content in nested sections
- As a keyboard user, I want to navigate the menu using standard keyboard controls so that I can access all navigation items without a mouse

## Specific Requirements

**Click-to-Open Mega Menu**

- Level 1 items with children open a full-width mega menu panel on click (not hover)
- Level 1 items without children navigate directly to the target URL
- Only one mega menu panel can be open at a time
- Clicking outside the menu or pressing Escape closes the open panel
- **Clicking any navigation link inside the mega menu panel closes the panel** (navigates and closes)
- Active/current Level 1 item displays an underline indicator

**Two-Click Navigation Pattern for Level 1 Items with Children**

- First click on a Level 1 nav bar item (that has children) opens the mega menu panel - it does NOT navigate
- Inside the opened mega menu panel, the Level 1 item title is repeated as a clickable headline at the top-left
- Second click on this headline (inside the panel) navigates to the Level 1 page itself
- This pattern ensures users can both explore child content and access the parent section landing page
- The headline link in the panel serves as the primary navigation path to the Level 1 page

**Desktop Mega Menu Panel Layout**

- Full viewport width with solid brand-colored background
- Panel header shows the selected Level 1 item title as a **clickable link** (navigates to Level 1 page) and a close button (X icon)
- Level 2 items displayed as column headers with underline separator (clickable links)
- Level 3 items listed vertically below their parent Level 2 header (clickable links)
- Multi-column grid layout (3-4 columns based on content)
- Level 2 headers are visually distinct (bold/semibold) from Level 3 links
- Content flows by columns, not rows
- **All navigation links (Level 1 headline, Level 2 headers, Level 3 items) close the panel when clicked**

**Mobile Hamburger Menu**

- Hamburger icon in header toggles full-screen navigation overlay
- Icon transforms to X when menu is open
- Accordion drill-down pattern for nested items with chevron indicators
- Home link (Startseite) displayed at top with separator
- Touch-friendly tap targets (minimum 44x44px)
- Smooth expand/collapse transitions for accordion behavior
- **Clicking any navigation link closes the mobile menu overlay** (navigates and closes)

**Keyboard Navigation (WCAG Compliance)**

- Tab key moves focus between Level 1 items in the nav bar
- Enter/Space on Level 1 item opens mega menu or navigates (if no children)
- When mega menu opens, first focusable element is the Level 1 headline link (allows immediate navigation to Level 1 page)
- Arrow keys navigate within open mega menu (Left/Right between columns, Up/Down within columns)
- Escape key closes open mega menu and returns focus to trigger
- Focus trap within open mega menu panel
- Visible focus indicators on all interactive elements
- ARIA attributes: aria-expanded, aria-haspopup, aria-controls, aria-current

**CSS Architecture and Theming**

- CSS custom properties for all colors, spacing, and typography for theme flexibility
- BEM-style class names for styling hooks (e.g., `nav-mega`, `nav-mega__panel`, `nav-mega__item`)
- Mobile-first responsive design with desktop breakpoint at 1024px
- Support light/dark variations through custom properties
- Sufficient color contrast ratios (4.5:1 minimum)

**Data Integration**

- Consume navigation data from Plone API via @plone/client getNavigation endpoint
- Fetch 3 levels of navigation depth (depth parameter)
- Handle items with and without children appropriately
- Server-side fetch navigation data in +layout.server.js for SSR

## Visual Design

**`planning/visuals/nav.png`**

- Header bar: logo left, Level 1 items horizontal on right with teal/cyan brand color
- Active item has dark underline indicator below
- Mega menu panel: full viewport width, solid teal background (#0097a7 approximate)
- Panel header: Level 1 title repeated top-left as **clickable link** to navigate to Level 1 page, X close button top-right
- Level 2 headers: bold white text with subtle underline separator
- Level 3 items: regular weight white text, no bullets, listed vertically under headers
- Multi-column grid with generous padding and clear column separation

**`planning/visuals/nav-mobile.png`**

- Header: logo left, hamburger icon transforms to X when open
- Full-screen overlay with same teal background color
- Search icon visible at top of panel (out of scope for this spec)
- Home link at top with separator line below
- Level 1 items as vertical list with right-pointing chevrons
- Each item has separator line, chevrons indicate expandable content
- Utility links at bottom with different styling (underlined)

## Existing Code to Leverage

**Context Navigation Pattern (`src/lib/plone/contextnav.svelte` and `contextnavitem.svelte`)**

- Recursive `<svelte:self>` pattern for rendering nested navigation items
- TypeScript interface for navigation item structure (href, title, items)
- ARIA label usage on nav element
- Separate child component for recursive item rendering

**Current Navigation Component (`src/lib/plone/navigation.svelte`)**

- Basic NavItem interface definition with href and title properties
- Simple flat list structure that will be replaced by this mega menu
- Pattern for receiving navigation array as prop

**Breadcrumbs Component (`src/lib/plone/breadcrumbs.svelte`)**

- BreadcrumbItem interface pattern for typed navigation data
- Simple list-based rendering approach

**API Client Pattern (`src/lib/api.ts`)**

- Plone client initialization from @plone/client
- Factory function pattern for creating client instances
- Environment variable configuration for API path

**Layout Server Load Pattern (`src/routes/+layout.server.js`)**

- Server-side data fetching with error handling and fallbacks
- Pattern for augmenting page data with additional API fetches
- Spread pattern for returning combined data to layout

## Out of Scope

- Hover-to-open behavior (explicitly click-only per requirements)
- Icons or images within navigation items
- Descriptions or subtitles for navigation items
- Search integration within navigation panel
- Navigation beyond 3 levels depth
- Language switcher functionality
- Sticky/fixed header behavior
- Utility links at bottom of mobile menu
- Logo component (assumed to exist separately)
- Animation/transition refinements beyond basic expand/collapse
