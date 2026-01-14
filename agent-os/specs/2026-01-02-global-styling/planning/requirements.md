# Spec Requirements: Global Styling

## Initial Description

Global styling for general layout styles, like main content, header, nav

## Requirements Discussion

### First Round Questions

**Q1:** Container Width Strategy - I assume you want a three-tier container width system (layout 1440px, default 940px, narrow 620px) like Volto Light Theme. Is that correct?
**Answer:** YES - adopt three-tier container width system (layout 1440px, default 940px, narrow 620px) like Volto Light Theme

**Q2:** Header Structure - Should the header have complete regions for logo, navigation, and utility tools? Should this use Svelte 5 patterns for modularity?
**Answer:** YES - complete header with regions for logo, nav, utility tools. Use btca and Svelte 5 patterns for modularity

**Q3:** CSS Custom Properties - Should we implement a unified design token system following Volto Light Theme patterns?
**Answer:** YES - unified design token system following Volto Light Theme patterns

**Q4:** Header/Footer Background - What styling approach for header and footer backgrounds?
**Answer:** Same as Volto - gradient backgrounds

**Q5:** Responsive Breakpoints - Should we use mobile-first approach with standard breakpoints?
**Answer:** YES - mobile-first with standard breakpoints (768px tablet, 1024px desktop, 1440px large screens)

**Q6:** Main Content Structure - Should we replace the current card wrapper with a clean container structure?
**Answer:** YES - replace card wrapper with clean container structure

**Q7:** Breadcrumbs Placement - Where should breadcrumbs be positioned?
**Answer:** YES - below header, above main content following Seven UI patterns

**Q8:** Additional Global vs Scoped Styles
**Answer:** Allow global styles to directly style layout (not just scoped styles). Use scoped styles only for individual smaller components.

### Existing Code to Reference

**Similar Features Identified:**

- Feature: Navigation Mega Menu - Path: `/workspace/src/lib/plone/navigation/`
  - Modular Svelte 5 component structure (MegaNav, MobileNav, Navigation.svelte)
  - CSS custom properties pattern in `nav-variables.css`
  - Well-organized design tokens for colors, spacing, typography
  - Dark mode and high contrast mode support patterns
- Feature: Current Layout - Path: `/workspace/src/routes/+layout.svelte`
  - Current layout structure to refactor (header, main wrapper)
  - Existing container constraint (max-width: 1127px)
- Feature: App CSS - Path: `/workspace/src/app.css`
  - Existing design tokens for blocks (slate, teaser, video, maps, tables)
  - CSS custom properties organization pattern
  - Tailwind CSS integration with @layer base/components
- Feature: Breadcrumbs - Path: `/workspace/src/lib/plone/breadcrumbs.svelte`
  - Basic breadcrumbs component to integrate into layout

### Follow-up Questions

No follow-up questions needed - user provided comprehensive answers.

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

N/A - No visual files found in `/workspace/agent-os/specs/2026-01-02-global-styling/planning/visuals/`

## Requirements Summary

### Functional Requirements

- Implement three-tier container width system:
  - Layout container: 1440px max-width (full-width elements)
  - Default container: 940px max-width (standard content)
  - Narrow container: 620px max-width (text-focused content)
- Create modular header component with regions for:
  - Logo area
  - Main navigation (integrate existing mega menu)
  - Utility tools area (search, language switcher, etc.)
- Implement footer component with gradient background
- Position breadcrumbs below header, above main content
- Replace current card-style main wrapper with clean container structure
- Apply gradient backgrounds to header and footer (Volto Light Theme style)

### Reusability Opportunities

- **Navigation components:** Existing `/workspace/src/lib/plone/navigation/` components should be integrated into header
- **CSS custom properties pattern:** Follow the established pattern in `nav-variables.css` for design tokens
- **Breadcrumbs component:** Integrate existing `/workspace/src/lib/plone/breadcrumbs.svelte`
- **Block design tokens:** Extend existing token patterns in `app.css` for layout tokens

### Design Token System

The following CSS custom properties should be established:

**Container Widths:**
- `--layout-container-width: 1440px`
- `--default-container-width: 940px`
- `--narrow-container-width: 620px`

**Breakpoints (mobile-first):**
- `--breakpoint-tablet: 768px`
- `--breakpoint-desktop: 1024px`
- `--breakpoint-large: 1440px`

**Layout Spacing:**
- Container padding/margins
- Header/footer heights
- Section spacing

**Header/Footer Gradients:**
- Background gradient colors (Volto Light Theme style)
- Text colors for header/footer regions

### Scope Boundaries

**In Scope:**

- Three-tier container width system with CSS classes
- Header component with logo, nav, utility regions
- Footer component with gradient background
- Breadcrumbs integration and positioning
- Global layout CSS custom properties (design tokens)
- Responsive breakpoint implementation (768px, 1024px, 1440px)
- Refactoring main layout to remove card wrapper
- Global styles for layout (not scoped)
- Modular Svelte 5 patterns for header/footer

**Out of Scope:**

- Individual block styling (already exists)
- Navigation mega menu implementation (already complete)
- Footer content/widgets configuration
- Skip links accessibility feature (separate roadmap item)
- Language switcher functionality (separate roadmap item)
- Theme switching (light/dark mode - separate roadmap item)

### Technical Considerations

- **Svelte 5 Patterns:** Use slots, snippets, and props patterns for modular header/footer components
- **Global vs Scoped Styles:**
  - Global styles in `app.css` for layout structure
  - Scoped styles only for individual smaller components
- **CSS Framework:** Tailwind CSS 4 with @layer directives
- **Design Tokens:** CSS custom properties following Volto Light Theme patterns
- **Existing Integration:** Must work with existing navigation mega menu components
- **Mobile-First:** All responsive styles should use min-width media queries
- **Gradient Backgrounds:** Header and footer should have gradient backgrounds matching Volto Light Theme aesthetic

### Implementation Notes

**Container Classes Pattern:**
```css
.container-layout { max-width: var(--layout-container-width); }
.container-default { max-width: var(--default-container-width); }
.container-narrow { max-width: var(--narrow-container-width); }
```

**Header Structure Pattern:**
```html
<header class="site-header">
  <div class="header-logo"><!-- Logo slot --></div>
  <div class="header-nav"><!-- Navigation slot --></div>
  <div class="header-utility"><!-- Utility tools slot --></div>
</header>
```

**Layout Structure Pattern:**
```html
<div class="site-wrapper">
  <header class="site-header">...</header>
  <nav class="breadcrumbs-wrapper">...</nav>
  <main class="main-content container-default">...</main>
  <footer class="site-footer">...</footer>
</div>
```
