# Spec Requirements: Navigation Mega Menu

## Initial Description

Navigation showing top 3 levels as a mega menu, similar to Volto Light Theme. This feature aligns with roadmap item #28: "Main Navigation Enhancement - Multi-level navigation with mega menu support and mobile responsive behavior."

The goal is to implement a mega menu navigation component that displays the top 3 levels of the site hierarchy, following patterns established by the Volto Light Theme.

## Requirements Discussion

### First Round Questions

**Q1:** Should the mega menu open on hover or click?
**Answer:** Click to open (not hover)

**Q2:** What layout should the mega menu panel use for displaying Level 2 and Level 3 items?
**Answer:** Level 2 as column headers with Level 3 items below - see images in visuals folder

**Q3:** Should the mega menu be full viewport width or constrained?
**Answer:** Full viewport width

**Q4:** What mobile behavior is expected?
**Answer:** Hamburger menu with accordion drill-down - see visuals

**Q5:** Are there specific accessibility requirements?
**Answer:** Yes, full keyboard support needed (WCAG compliant)

**Q6:** Should navigation items support enhanced features (icons, descriptions, images)?
**Answer:** Plain text links, but with classes and custom properties for styling

**Q7:** How should Level 1 items with no children behave?
**Answer:** Navigate directly if no children

**Q8:** Are there any features explicitly excluded from scope?
**Answer:** Not specified

### Existing Code to Reference

**Similar Features Identified:**

- Feature: Context Navigation - Path: `src/lib/plone/contextnav.svelte`
  - Recursive tree structure with nested items
  - Basic accessibility with aria-label
  - Uses `contextnavitem.svelte` for recursive rendering

- Feature: Context Nav Item - Path: `src/lib/plone/contextnavitem.svelte`
  - Recursive `<svelte:self>` pattern for nested items
  - TypeScript interface for nav item structure

- Feature: Current Navigation - Path: `src/lib/plone/navigation.svelte`
  - Basic flat list implementation
  - NavItem interface definition
  - Will be replaced/enhanced by this spec

### Follow-up Questions

None required - visuals provide sufficient clarity.

## Visual Assets

### Files Provided:

- `nav.png`: Desktop mega menu view showing full-width panel with multi-column layout
- `nav-mobile.png`: Mobile navigation showing hamburger menu with accordion-style drill-down

### Visual Analysis: Desktop (nav.png)

**Header Bar:**
- Logo positioned left (FCMH branding)
- Level 1 navigation items displayed horizontally on the right
- Items: "Forschung", "Angebote", "Stories", "Uber uns"
- Active item ("Forschung") has a dark underline indicator
- Clean, minimal styling with teal/cyan brand color for text

**Mega Menu Panel:**
- Full viewport width with solid teal/cyan background (#0097a7 or similar)
- Panel title repeats the selected Level 1 item ("Forschung") at top-left
- Close button (X icon) positioned at top-right corner
- Content organized in multi-column grid layout

**Level 2 Structure (Column Headers):**
- "Exzellenzstrategie" (left column)
- "Campus-Schwerpunkte" (center column)
- "Weitere Profilbereiche" (right column)
- "Forschungsschwerpunkte" (below left column, second row)
- Each Level 2 item has a subtle underline separator
- Bold/semibold white text for Level 2 headers

**Level 3 Items:**
- Listed vertically below each Level 2 header
- Regular weight white text
- No bullets or special indicators
- Plain text links with standard hover states implied

**Layout Grid:**
- Approximately 3-4 columns at desktop width
- Variable number of items per column
- Some columns have more items (Campus-Schwerpunkte has many)
- Content appears to flow in columns, not rows

**Spacing:**
- Generous padding around the panel
- Clear separation between column groups
- Consistent vertical spacing between Level 3 items

### Visual Analysis: Mobile (nav-mobile.png)

**Header:**
- Same logo positioning (left)
- Language switcher visible (EN | DE)
- Hamburger menu icon transformed to X (close) when open

**Mobile Menu Panel:**
- Full screen overlay with same teal/cyan background
- Search icon visible at top
- "Startseite" (Home) link at top with separator line

**Navigation Items:**
- Vertical list of Level 1 items
- Each item has right-pointing chevron (>) indicating expandable content
- Items: "Forschung", "Angebote", "Stories", "Uber uns"
- Each item has separator line below
- Chevron suggests accordion drill-down behavior

**Footer Links:**
- Utility links at bottom: "Ausloggen | Ubersicht | Kontakt"
- Different styling (underlined) for these utility links
- Separated from main navigation

**Fidelity Level:** High-fidelity mockup - these appear to be production screenshots from an existing implementation, likely the Volto Light Theme reference mentioned in the spec.

### Visual Insights:

- Design follows a clean, modern aesthetic with strong brand color usage
- Typography uses sans-serif font family, likely system fonts
- Color scheme: teal/cyan primary (#0097a7 approximate), white text on colored backgrounds
- Desktop uses multi-column mega menu panel with clear visual hierarchy
- Mobile uses full-screen overlay with accordion pattern
- Close button (X) is consistent across both desktop and mobile views
- No icons on navigation items - pure text-based navigation
- Level 2 items serve as non-clickable category headers (implied by layout)
- Accessibility consideration: clear visual states and sufficient contrast

## Requirements Summary

### Functional Requirements

- Multi-level navigation displaying top 3 levels of site hierarchy
- Click-to-open behavior for mega menu (not hover)
- Level 1: Horizontal navigation bar with clickable items
- Level 2: Column headers within mega menu panel
- Level 3: Clickable links listed under Level 2 headers
- Level 1 items without children should navigate directly (no panel)
- Close button to dismiss mega menu panel
- Active/current item indicator (underline on Level 1)
- Full viewport width mega menu panel

### Mobile Requirements

- Hamburger menu trigger icon
- Full-screen navigation overlay when open
- Accordion drill-down pattern for nested items
- Touch-friendly tap targets
- Smooth transitions for expand/collapse

### Accessibility Requirements (WCAG Compliant)

- Full keyboard navigation support
- Focus management when opening/closing menu
- Escape key to close mega menu
- Arrow key navigation within menu
- ARIA attributes (aria-expanded, aria-haspopup, aria-controls)
- Focus trap within open mega menu
- Visible focus indicators
- Screen reader announcements for state changes

### Styling Requirements

- CSS custom properties for theming flexibility
- Classes available for custom styling hooks
- Consistent with Svolto's design token system
- Support for light/dark variations via custom properties
- Responsive breakpoint handling (mobile vs desktop)

### Reusability Opportunities

- Recursive item rendering pattern from `contextnavitem.svelte`
- TypeScript interfaces from existing navigation components
- Similar nested data structure handling

### Scope Boundaries

**In Scope:**
- Desktop mega menu with multi-column layout
- Mobile hamburger menu with accordion drill-down
- 3-level navigation depth (Level 1, 2, 3)
- Click-to-open interaction
- WCAG-compliant keyboard navigation
- CSS custom properties for theming
- Active item indicator
- Close button functionality

**Out of Scope:**
- Hover-to-open behavior
- Icons or images in navigation items
- Descriptions or subtitles for items
- Search integration within navigation
- Navigation beyond 3 levels
- Language switcher (separate feature)
- Sticky/fixed header behavior (separate concern)

### Technical Considerations

- Integrate with existing Plone navigation API via @plone/client
- Follow Svolto's component architecture patterns
- Use Svelte 5 with TypeScript
- CSS custom properties for theming (not Tailwind-only)
- Server-side rendering compatible
- Responsive design with appropriate breakpoints
- Transition animations for open/close states
- Event handling for click-outside to close
- Consider portal/teleport for proper stacking context
