# Navigation Mega Menu

## Initial Description

Navigation showing top 3 levels as a mega menu, similar to Volto Light Theme.

## Context

This feature aligns with roadmap item #28: "Main Navigation Enhancement - Multi-level navigation with mega menu support and mobile responsive behavior"

The goal is to implement a mega menu navigation component that displays the top 3 levels of the site hierarchy, following patterns established by the Volto Light Theme.

## Product Context

- **Mission**: Svolto is a lightweight, high-performance SvelteKit frontend for Plone CMS focusing on presentation layer with smaller bundles and faster page loads
- **Key Features**: Navigation features are core to the product including breadcrumbs, context navigation, and main navigation
- **Tech Stack**: SvelteKit 2, Svelte 5, Tailwind CSS 4, CSS Custom Properties for theming
- **Design Philosophy**: Configuration-driven theming using design tokens, minimal override pattern

## Existing Code

Current navigation implementation at `src/lib/plone/navigation.svelte` is basic single-level:
- Simple flat list of top-level items
- No multi-level support
- No mega menu panel

Context navigation at `src/lib/plone/contextnav.svelte` and `contextnavitem.svelte`:
- Recursive tree structure
- Can render nested items
- Basic accessibility with aria-label
