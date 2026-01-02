# Specification: Global Styling

## Goal

Implement a unified global styling system with three-tier container widths, modular header/footer components, and a comprehensive design token system following Volto Light Theme patterns.

## User Stories

- As a site visitor, I want a consistent, responsive layout across all pages so that content is readable and navigation is accessible on any device
- As a developer, I want reusable container classes and design tokens so that I can build consistent page layouts without duplicating CSS

## Specific Requirements

**Three-Tier Container Width System**

- Define `--layout-container-width: 1440px` for full-width layout elements
- Define `--default-container-width: 940px` for standard content sections
- Define `--narrow-container-width: 620px` for text-focused content like articles
- Create `.container-layout`, `.container-default`, and `.container-narrow` utility classes
- All containers should be horizontally centered with `margin: 0 auto`
- Apply consistent horizontal padding (16px mobile, 24px tablet, 32px desktop)

**Modular Header Component**

- Create `SiteHeader.svelte` component with three regions: logo, navigation, utility
- Use Svelte 5 `$props()` pattern for accepting slot content or child snippets
- Integrate existing `Navigation` component from `/workspace/src/lib/plone/navigation/`
- Apply gradient background matching Volto Light Theme aesthetic
- Header should span full viewport width with inner content constrained to layout container
- Provide CSS identifiers `.site-header`, `.header-logo`, `.header-nav`, `.header-utility`

**Footer Component**

- Create `SiteFooter.svelte` component with gradient background
- Follow same modular pattern as header with configurable regions
- Apply Volto Light Theme gradient background styling
- Footer should span full viewport width with inner content constrained to layout container
- Provide CSS identifiers `.site-footer`, `.footer-content`

**Breadcrumbs Integration**

- Position breadcrumbs below header, above main content
- Wrap existing `breadcrumbs.svelte` in `.breadcrumbs-wrapper` container
- Apply `container-default` width constraint to breadcrumbs
- Add appropriate vertical spacing (padding/margin) above and below

**Main Content Structure**

- Remove current card wrapper styling from `+layout.svelte`
- Apply `.main-content` class with `container-default` width by default
- Allow blocks to opt-out via `.full-width` class when needed
- Ensure proper vertical spacing between header, breadcrumbs, main, and footer

**Design Token System**

- Add layout tokens to `:root` in `app.css` following existing pattern
- Define container width variables (`--layout-container-width`, `--default-container-width`, `--narrow-container-width`)
- Define layout spacing variables (`--header-height`, `--footer-padding`, `--section-spacing`)
- Define gradient colors (`--header-gradient-start`, `--header-gradient-end`, `--footer-gradient-start`, `--footer-gradient-end`)
- Follow the organization pattern established in `nav-variables.css`

**Responsive Breakpoints**

- Mobile-first approach using min-width media queries
- Tablet breakpoint: `@media (min-width: 768px)`
- Desktop breakpoint: `@media (min-width: 1024px)`
- Large screen breakpoint: `@media (min-width: 1440px)`
- Container padding scales across breakpoints (16px/24px/32px)

**Global Layout Styles**

- Layout structure styles go in `app.css` using Tailwind `@layer base` and `@layer components`
- Use global styles for site-wide layout elements (header, footer, containers)
- Scoped styles only for individual smaller components
- Maintain Tailwind CSS 4 integration with `@import 'tailwindcss'`

## Visual Design

No visual assets provided for this specification.

## Existing Code to Leverage

**Navigation Components (`/workspace/src/lib/plone/navigation/`)**

- Well-structured modular components using Svelte 5 `$props()` pattern
- CSS custom properties pattern in `nav-variables.css` for theming
- Mobile/desktop responsive pattern with 1024px breakpoint
- Integrate `Navigation.svelte` directly into new `SiteHeader` component

**Current Layout (`/workspace/src/routes/+layout.svelte`)**

- Existing header and main structure to refactor
- Current 1127px max-width constraint to replace with new container system
- Svelte 5 `$props()` and `{@render children()}` patterns to maintain

**App CSS (`/workspace/src/app.css`)**

- Established `:root` CSS custom properties pattern for design tokens
- Tailwind CSS 4 integration with `@layer base` and `@layer components`
- Block-specific token organization to follow for layout tokens
- Import pattern for external CSS files (e.g., `nav-variables.css`)

**Breadcrumbs Component (`/workspace/src/lib/plone/breadcrumbs.svelte`)**

- Basic breadcrumbs implementation ready for integration
- Uses Svelte 4 `export let` syntax - may need update to Svelte 5 `$props()`
- Add wrapper and styling without modifying core functionality

## Out of Scope

- Individual block styling (already exists in app.css)
- Navigation mega menu implementation (already complete in `/workspace/src/lib/plone/navigation/`)
- Footer content/widgets configuration or CMS integration
- Skip links accessibility feature (separate roadmap item)
- Language switcher functionality (separate roadmap item)
- Search functionality in header utility area
- Theme switching (light/dark mode toggle)
- Logo/branding asset management
- Print styles
- Animation/transition effects beyond basic hover states
