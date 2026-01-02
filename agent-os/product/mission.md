# Product Mission

## Pitch

Svolto is a lightweight, high-performance SvelteKit frontend for Plone CMS that helps Plone users render content with exceptional speed and developer experience. By focusing exclusively on the presentation layer and leveraging Svelte's reactive simplicity, Svolto delivers smaller bundles and faster page loads while maintaining full compatibility with Volto's editing capabilities.

## Users

### Primary Customers

- **Plone Site Owners**: Organizations with existing Plone installations seeking improved frontend performance without migrating away from Plone
- **Plone Developers**: Developers who prefer Svelte's mental model over React and want a modern, maintainable frontend codebase
- **Web Agencies**: Teams building Plone-powered websites who want faster development cycles and better runtime performance

### User Personas

**Technical Lead** (30-50)

- **Role:** Senior Developer / Technical Architect at a Plone agency
- **Context:** Manages multiple Plone projects, evaluates frontend technologies
- **Pain Points:** Volto's React complexity, large bundle sizes, slow initial page loads, difficulty onboarding junior developers
- **Goals:** Faster sites, simpler codebase, easier theming, reduced time-to-delivery

**Plone Developer** (25-40)

- **Role:** Full-stack developer working with Plone CMS
- **Context:** Builds and maintains Plone websites for clients
- **Pain Points:** React's learning curve, Volto's abstraction layers, difficulty customizing themes without deep React knowledge
- **Goals:** Build custom themes quickly, understand the codebase easily, minimize boilerplate

**Site Owner** (35-55)

- **Role:** IT Manager or Product Owner at an organization using Plone
- **Context:** Needs to justify technology choices, cares about performance metrics and maintainability
- **Pain Points:** Slow page loads affecting SEO and user experience, high development costs for frontend changes
- **Goals:** Fast, accessible websites that rank well and are cost-effective to maintain

## The Problem

### Frontend Performance and Complexity

Plone's React-based Volto frontend delivers powerful editing capabilities but comes with significant bundle sizes and runtime overhead. For sites where editing happens infrequently but viewing happens constantly, this tradeoff penalizes the majority use case.

**Our Solution:** Svolto focuses exclusively on the presentation layer, rendering Plone content with Svelte's compiled, minimal-runtime approach. Editing remains in Volto where its rich capabilities shine, while visitors experience a fast, lightweight frontend.

### Developer Experience Gap

React's component model and Volto's architecture require significant expertise to customize effectively. Developers must understand JSX, hooks, Redux patterns, and Volto-specific conventions to build custom themes.

**Our Solution:** Svelte's intuitive syntax and reactive model lower the barrier to entry. Svolto's theming system prioritizes configuration over component overrides, enabling customization through design tokens and slot-based composition rather than deep component surgery.

## Differentiators

### Performance-First Architecture

Unlike Volto, which ships the full React runtime and editing capabilities to every visitor, Svolto delivers only what's needed for viewing. Svelte compiles components to efficient vanilla JavaScript with no virtual DOM overhead.

This results in smaller bundle sizes, faster Time-to-Interactive, and improved Core Web Vitals scores.

### Simplified Developer Experience

Unlike React's explicit state management and effect hooks, Svelte uses intuitive reactive declarations that feel like enhanced HTML. Developers familiar with HTML, CSS, and JavaScript can be productive immediately.

This results in faster onboarding, reduced development time, and more maintainable codebases.

### Configuration-Driven Theming

Unlike Volto's pattern of copying and modifying components, Svolto emphasizes a theming system based on design tokens, CSS custom properties, and composable slots.

This results in fewer component overrides, easier theme updates, and reduced merge conflicts when upgrading.

### Focused Scope

Unlike Volto which must balance editing and viewing concerns, Svolto optimizes purely for the presentation layer. Editing stays in Volto where it works well.

This results in a simpler architecture, clearer separation of concerns, and the ability to optimize aggressively for read performance.

## Key Features

### Core Features

- **Full Block Coverage:** Render all standard Plone blocks and Volto Light Theme blocks with pixel-perfect fidelity
- **Plone API Integration:** Seamless connection to plone.restapi via @plone/client for content fetching
- **Server-Side Rendering:** SvelteKit's SSR delivers fast initial page loads and SEO-friendly markup
- **Responsive Images:** Optimized image loading with proper srcset and lazy loading support
- **Modern seven style:** when ever possible seven style has priority to older volto implemententations

### Navigation Features

- **Breadcrumbs:** Hierarchical navigation reflecting Plone's content structure
- **Context Navigation:** Section-aware navigation menus
- **Main Navigation:** Configurable primary navigation component

### Theming Features

- **Design Token System:** Customize colors, typography, spacing, and more through configuration
- **Layout Slots:** Override specific layout regions without touching component internals
- **CSS Custom Properties:** Runtime theming support for dynamic customization
- **Minimal Override Pattern:** Theme by configuration first, component override only when necessary

### Performance Features

- **Compiled Output:** Svelte's compiler produces minimal, efficient JavaScript
- **Code Splitting:** Route-based chunking for optimal loading
- **Asset Optimization:** Proper caching, compression, and CDN-friendly output

### CMS structure and optimization Rules

read and respect agent-os/product/cms-frontend-rules.md for all developments
