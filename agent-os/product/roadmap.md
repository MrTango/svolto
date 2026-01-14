# Product Roadmap

## Block Coverage: Standard Plone Blocks

1. [x] Title Block — Render content title with configurable heading level and styling hooks `XS`
2. [x] Description Block — Render content description/lead text with proper semantic markup `XS`
3. [x] Text Block (Slate Complete) — Extend Slate renderer to support all inline styles, block quotes, code blocks, and nested structures `S`
4. [x] Table Block — Render tables with header rows/columns, cell alignment, and responsive behavior `S`
5. [x] Video Block — Embed videos from YouTube, Vimeo, and self-hosted sources with responsive aspect ratios `S`
6. [x] Maps Block — Render embedded maps (Google Maps, OpenStreetMap) with configurable zoom and markers `S`
7. [x] HTML Block — Safely render raw HTML content with appropriate sanitization `XS`
8. [x] TOC Block — Generate table of contents from page headings with anchor links `S`
9. [x] Listing Block — Render content listings with multiple layout variations (summary, image gallery, news items) `M`
10. [ ] Search Block — Display search interface with results rendering and faceted filtering support `M`

## Block Coverage: Volto Light Theme Blocks

11. [x] Grid Block — Render responsive grid layouts with configurable column counts and breakpoints `M`
12. [ ] Accordion Block — Collapsible content sections with accessible expand/collapse behavior `S`
13. [ ] Tabs Block — Tabbed content interface with keyboard navigation and ARIA support `S`
14. [ ] Button Block — Styled call-to-action buttons with variant options and link handling `XS`
15. [ ] Separator Block — Visual content dividers with style variations `XS`
16. [ ] Highlight Block — Featured content callouts with icon support and color variants `S`
17. [x] Introduction Block — Styled introductory text sections for page headers `XS`
18. [ ] Slider Block — Image/content carousel with navigation controls and autoplay options `M`
19. [ ] Event Metadata Block — Render event-specific information (date, time, location, registration) `S`
20. [ ] Person Block — Display person/contact cards with photo, bio, and contact details `S`

## Theming System

21. [ ] Design Token Foundation — Implement CSS custom properties system for colors, typography, spacing, and shadows `M`
22. [ ] Theme Configuration API — Create configuration interface for theme customization without component overrides `M`
23. [ ] Layout Slot System — Implement named slots for header, footer, sidebar, and content regions `S`
24. [ ] Block Style Variations — Support Volto's block style variations through CSS class mapping `S`
25. [ ] Typography Scale — Configurable type scale with fluid sizing and proper vertical rhythm `S`
26. [ ] Color Scheme Support — Light/dark mode theming with system preference detection `S`
27. [ ] Component Token Mapping — Map design tokens to individual block components for granular theming `M`

## Navigation and Layout

28. [x] Main Navigation Enhancement — Multi-level navigation with mega menu support and mobile responsive behavior `M`
29. [x] Footer Component — Configurable footer with multiple column layouts and content slots `S`
30. [x] Header Component — Flexible header with logo, navigation, search, and utility area slots `S`
31. [ ] Skip Links — Accessibility-focused skip navigation for keyboard users `XS`
32. [x] Language Switcher — Multi-language site support with language navigation component `S`

## Performance and Infrastructure

33. [x] Image Optimization Pipeline — Implement responsive images with srcset, lazy loading, and blur placeholders `M`
34. [x] Bundle Analysis and Optimization — Analyze and optimize chunk splitting for minimal initial load `S`
35. [ ] Caching Strategy — Implement proper cache headers and stale-while-revalidate patterns `S`
36. [ ] Error Boundaries — Graceful error handling with fallback UI for failed block renders `S`
37. [ ] Loading States — Skeleton screens and loading indicators for async content `S`

## Developer Experience

38. [ ] Block Registration API — Streamlined API for registering custom blocks with TypeScript support `S`
39. [ ] Storybook Integration — Component documentation and visual testing environment `M`
40. [ ] Theme Starter Kit — Documented template for creating custom Svolto themes `M`
41. [ ] Migration Guide — Documentation for teams transitioning from Volto to Svolto `S`

> Notes
>
> - Items 1-20 focus on achieving full block coverage, the primary milestone
> - Items 21-27 establish the theming system foundation
> - Performance is a continuous concern woven throughout, with dedicated items 33-37
> - Each item represents a complete, testable feature with frontend implementation
> - Dependencies: Theming system (21-22) should precede style variations (24); Design tokens (21) should precede color schemes (26)
