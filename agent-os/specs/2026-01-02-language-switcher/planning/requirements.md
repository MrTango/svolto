# Spec Requirements: Language Switcher

## Initial Description

Implement a language switcher component for the Svolto frontend that allows users to switch between available languages on multilingual Plone sites, following the Volto/Seven reference implementation patterns.

## Requirements Discussion

### First Round Questions

**Q1:** Display format for language names?
**Answer:** Display language native names (e.g., "Deutsch", "Francais") - same as Volto.

**Q2:** Placement of the language switcher?
**Answer:** Header utility area (utility snippet slot in SiteHeader.svelte).

**Q3:** Presentation style?
**Answer:** Inline text-based list separated by pipes (e.g., `English | Deutsch | Francais`).

**Q4:** Navigation behavior when switching languages?
**Answer:** Navigate to translated content URL if available (from `@components.translations` data). Fall back to language root (`/de`, `/fr`, etc.) if no translation exists.

**Q5:** URL structure for multilingual content?
**Answer:** Use URL path prefixes (`/en/page`, `/de/page`) like Volto.

**Q6:** When should the language switcher be visible?
**Answer:** Only render when site has multilingual support enabled (`site.features.multilingual`).

**Q7:** Accessibility requirements?
**Answer:** Include `aria-label` attributes like "Switch to Deutsch" for each language link.

**Q8:** Language detection and persistence mechanism?
**Answer:**
- Cookie name: `I18N_LANGUAGE`
- Cookie settings: Use Volto defaults (6 months expiration, SameSite: strict, Secure on HTTPS)
- Cookie negotiation: Respect Plone's `use_cookie_negotiation` setting
- Browser detection: Only use `navigator.language` when no `I18N_LANGUAGE` cookie exists AND Plone's `use_request_negotiation` setting is enabled
- SSR: Server should read `I18N_LANGUAGE` cookie and `Accept-Language` header for correct first-load rendering

**Q9:** Plone API integration details?
**Answer:**
- Read language settings from `@site` endpoint: `plone.available_languages`, `plone.default_language`, `use_cookie_negotiation`, `use_request_negotiation`
- Use `@components.translations` expander for content translations

### Existing Code to Reference

**Similar Features Identified:**

- Feature: Seven/Volto LanguageSelector - Path: `volto-svolto/` directory
- Components to potentially reuse: SiteHeader.svelte utility snippet slot
- Backend logic to reference: Plone's `@site` endpoint and `@components.translations` expander

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

N/A - Following existing Volto/Seven implementation patterns.

## Requirements Summary

### Functional Requirements

- Display available languages with native names (e.g., "Deutsch", "Francais")
- Render as inline text-based list with pipe separators
- Navigate to translated content when available via `@components.translations`
- Fall back to language root URL when no translation exists
- Only render when `site.features.multilingual` is enabled
- Persist language preference in `I18N_LANGUAGE` cookie
- Support cookie negotiation based on Plone's `use_cookie_negotiation` setting
- Support browser language detection based on Plone's `use_request_negotiation` setting
- Server-side rendering support for correct first-load language

### Reusability Opportunities

- SiteHeader.svelte utility snippet slot for placement
- Seven/Volto LanguageSelector component as reference implementation
- Existing Plone client API integration patterns

### Scope Boundaries

**In Scope:**

- LanguageSwitcher component with pipe-separated inline display
- Integration with SiteHeader utility area
- Cookie-based language persistence (`I18N_LANGUAGE`)
- Navigation to translated content or language root fallback
- Accessibility with aria-labels
- SSR support for cookie and Accept-Language header reading
- Conditional rendering based on multilingual site feature

**Out of Scope:**

- Dropdown or modal-based language selectors
- Language flags/icons
- Automatic content translation
- Language-specific formatting (dates, numbers)
- Admin/CMS language configuration UI

### Technical Considerations

- Integration with `@site` endpoint for language settings
- Integration with `@components.translations` expander for content translations
- URL path prefix pattern (`/en/`, `/de/`, `/fr/`)
- Cookie settings: 6 months expiration, SameSite: strict, Secure on HTTPS
- Server-side cookie and Accept-Language header reading for SSR
- Reference Seven/Volto implementation in `volto-svolto/` directory
