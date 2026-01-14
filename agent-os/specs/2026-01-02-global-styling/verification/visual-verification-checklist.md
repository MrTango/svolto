# Visual Verification Checklist for Global Styling

This document specifies what should be manually verified at each responsive breakpoint to ensure the global styling implementation is correct.

## 375px (Mobile)

### Header
- [ ] Header spans full viewport width
- [ ] Header gradient background is visible (teal gradient from left to right)
- [ ] Logo is visible and clickable
- [ ] Navigation collapses to mobile hamburger menu
- [ ] Header regions stack vertically (logo, nav, utility)
- [ ] Header inner content respects 16px horizontal padding

### Breadcrumbs
- [ ] Breadcrumbs wrapper spans full viewport width
- [ ] Breadcrumbs content constrained to container-default width (940px max)
- [ ] Breadcrumbs have 16px horizontal padding
- [ ] Breadcrumb items wrap properly on narrow screens
- [ ] Breadcrumb separators (/) are visible between items

### Main Content
- [ ] Main content area is constrained to container-default width (940px max)
- [ ] Main content has 16px horizontal padding
- [ ] Main content has appropriate vertical spacing (section-spacing: 2rem)

### Footer
- [ ] Footer spans full viewport width
- [ ] Footer gradient background is visible (teal gradient)
- [ ] Footer content is constrained to container-layout width (1440px max)
- [ ] Footer has 16px horizontal padding
- [ ] Footer sticks to bottom of viewport on short content pages

### Overall Layout
- [ ] Site wrapper uses full viewport height (min-height: 100vh)
- [ ] No horizontal scrollbar appears
- [ ] Content is readable and properly spaced

---

## 768px (Tablet)

### Header
- [ ] Header spans full viewport width
- [ ] Header gradient background is visible
- [ ] Horizontal padding increases to 24px (container-padding-tablet)

### Breadcrumbs
- [ ] Breadcrumbs wrapper has 24px horizontal padding
- [ ] Breadcrumb items display inline with proper spacing

### Main Content
- [ ] Main content has 24px horizontal padding
- [ ] Content width approaches container-default max-width (940px)

### Footer
- [ ] Footer has 24px horizontal padding
- [ ] Footer content properly constrained

### Overall Layout
- [ ] Spacing is consistent across all sections
- [ ] No layout breaks or overflow issues

---

## 1024px (Desktop)

### Header
- [ ] Header spans full viewport width
- [ ] Header inner layout switches to horizontal row (flex-direction: row)
- [ ] Logo region on left, navigation region centered, utility region on right
- [ ] Header has 32px horizontal padding (container-padding-desktop)
- [ ] Navigation displays desktop mega menu (if applicable)
- [ ] Gap between header regions is 1.5rem

### Breadcrumbs
- [ ] Breadcrumbs wrapper has 32px horizontal padding
- [ ] Breadcrumb items display inline on single line

### Main Content
- [ ] Main content has 32px horizontal padding
- [ ] Content width is constrained to container-default (940px)
- [ ] Content is horizontally centered

### Footer
- [ ] Footer has 32px horizontal padding
- [ ] Footer content is horizontally centered

### Overall Layout
- [ ] Vertical rhythm is consistent
- [ ] All sections align properly

---

## 1440px+ (Large Screens)

### Header
- [ ] Header spans full viewport width
- [ ] Header inner content constrained to container-layout (1440px)
- [ ] Header inner content is horizontally centered
- [ ] No content overflow beyond 1440px

### Breadcrumbs
- [ ] Breadcrumbs content constrained to container-default (940px)
- [ ] Breadcrumbs centered within viewport

### Main Content
- [ ] Main content constrained to container-default (940px)
- [ ] Main content horizontally centered
- [ ] Blocks using .full-width break out to full viewport width correctly

### Footer
- [ ] Footer spans full viewport width
- [ ] Footer inner content constrained to container-layout (1440px)
- [ ] Footer inner content is horizontally centered

### Overall Layout
- [ ] Layout looks balanced on large screens
- [ ] No excessive whitespace or cramped areas
- [ ] Content hierarchy is clear
- [ ] Site wrapper ensures footer stays at bottom

---

## Cross-Breakpoint Verification

### CSS Custom Properties
- [ ] Container widths respect CSS variables
- [ ] Gradient colors match Volto Light Theme (teal: #0097a7 to #00838f)
- [ ] Spacing tokens are consistently applied

### Container Classes
- [ ] .container-layout constrains content to 1440px
- [ ] .container-default constrains content to 940px
- [ ] .container-narrow constrains content to 620px (if used)
- [ ] .full-width utility breaks elements out of container

### Accessibility
- [ ] Text contrast is sufficient on gradient backgrounds
- [ ] Links are distinguishable
- [ ] Focus states are visible

---

## Test Summary

| Breakpoint | Width | Tests |
|------------|-------|-------|
| Mobile | 375px | Header stacking, 16px padding, mobile nav |
| Tablet | 768px | 24px padding transition |
| Desktop | 1024px | Header row layout, 32px padding |
| Large | 1440px+ | Container constraints, centering |

**Total Global Styling Unit Tests: 23**
- Layout Variables: 4 tests
- Container Classes: 6 tests
- SiteHeader: 4 tests
- SiteFooter: 3 tests
- Layout Integration: 6 tests
