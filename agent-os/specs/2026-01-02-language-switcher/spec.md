# Specification: Language Switcher

## Goal

Implement a language switcher component that enables users to switch between available languages on multilingual Plone sites, displaying native language names in an inline pipe-separated format within the header utility area.

## User Stories

- As a multilingual site visitor, I want to see available languages and switch to my preferred language so that I can read content in my native language.
- As a returning visitor, I want my language preference to be remembered via cookie so that I see the correct language automatically on subsequent visits.

## Specific Requirements

**LanguageSwitcher Component**

- Create a new Svelte 5 component at `src/lib/components/LanguageSwitcher.svelte`
- Display languages as inline links separated by pipe characters (e.g., `English | Deutsch | Francais`)
- Show native language names using the langmap utility (e.g., "Deutsch" not "German")
- Highlight/bold the currently selected language
- Only render when `site.features.multilingual` is truthy
- Accept `availableLanguages`, `currentLang`, `translations`, and optional `onSwitch` callback as props

**Language Map Utility**

- Create `src/lib/utils/langmap.ts` based on Volto's LanguageMap.js
- Export a typed langmap object mapping language codes to `{ nativeName: string, englishName: string }`
- Include a `normalizeLang()` helper function to handle variants like `en_US` and `en-us` to `en-US`
- Use a Proxy pattern for dynamic language code normalization (same as Volto reference)

**Navigation to Translations**

- When clicking a language link, navigate to the translated content URL if available from `@components.translations` data
- Fall back to language root URL (e.g., `/de`, `/fr`) if no translation exists for current content
- Use standard anchor tags with href for accessibility and SSR compatibility

**Cookie-Based Language Persistence**

- Create `src/lib/utils/language-cookie.ts` with helper functions for reading/writing `I18N_LANGUAGE` cookie
- Cookie settings: 6 months expiration, `SameSite: strict`, `Secure` on HTTPS, `path: /` (applies to all pages)
- Set cookie when user explicitly switches language via the component
- Respect Plone's `use_cookie_negotiation` setting from `@site` endpoint
- Cookie must be set IMMEDIATELY when user clicks a language link, BEFORE navigation occurs
- Use client-side `document.cookie` API within an `onclick` handler on language links
- Export a `setLanguageCookie(lang: string)` function for use in the LanguageSwitcher component
- This ensures the subsequent navigation request (and all future requests) include the correct cookie value

**Server-Side Language Detection**

- Modify `+layout.server.js` to fetch `@site` endpoint for language settings: `plone.available_languages`, `plone.default_language`, `use_cookie_negotiation`, `use_request_negotiation`
- Read `I18N_LANGUAGE` cookie from request headers on server in `hooks.server.ts`
- Cookie should be read on EVERY request, not just root path requests
- Store `preferredLanguage` in `event.locals` for downstream use by layouts and endpoints
- Fall back to `Accept-Language` header parsing when no cookie exists and `use_request_negotiation` is enabled
- Pass `siteSettings`, `currentLang`, and `preferredLanguage` to the layout for client hydration

**SiteHeader Integration**

- Pass the `LanguageSwitcher` component through the existing `utility` snippet slot in `SiteHeader.svelte`
- Update `+layout.svelte` to render `LanguageSwitcher` within the header utility area
- Pass required props: `availableLanguages`, `currentLang`, `translations` from page data

**Language Redirection**

- When `siteSettings.availableLanguages.length > 1` (multilingual enabled), implement automatic language redirection
- Implement redirection in `src/hooks.server.ts` using SvelteKit's `redirect()` function with status 307 (temporary redirect)
- Fetch `@site` endpoint to retrieve `availableLanguages` and check multilingual status
- Determine redirect target language using priority order: (1) `I18N_LANGUAGE` cookie if set and valid, (2) `Accept-Language` header if `use_request_negotiation` is enabled, (3) `plone.default_language` as fallback
- Use existing `detectLanguageFromHeaders()` helper from language utilities for Accept-Language parsing
- **Root path redirection**: When path is exactly `/` and user has preferred language, redirect to `/${preferredLanguage}`
- **Content page redirection**: When visiting any content page with `I18N_LANGUAGE` cookie set:
  - Fetch `@components.translations` for the current content
  - If translation exists in preferred language, redirect to that translation URL
  - If no translation exists in preferred language, stay on current page (do not redirect)
- Skip redirection if current page is already in the user's preferred language
- Redirect URL format for root: `/${targetLanguage}` (e.g., `/de`, `/en`, `/fr`)
- Redirect URL format for content: use the `@id` from `@components.translations` matching preferred language

**Accessibility Requirements**

- Include `aria-label` on each language link (e.g., "Switch to Deutsch")
- Ensure keyboard navigability with visible focus states
- Use semantic HTML with proper link elements
- Current language link should have `aria-current="true"` attribute

**Content Translations Data**

- Request `@components.translations` expander when fetching content in `+layout.server.js`
- Extract and pass translations array to client via page data
- Structure: `Array<{ language: string, '@id': string }>`

## Existing Code to Leverage

**SiteHeader.svelte utility snippet**

- Located at `/workspace/src/lib/components/SiteHeader.svelte`
- Already provides a `utility` snippet slot in the header for custom components
- Pass `LanguageSwitcher` through this slot from `+layout.svelte`

**Seven LanguageSwitcher CSS pattern**

- Reference `/workspace/volto-svolto/seven-svolto/core/packages/layout/slots/LanguageSwitcher/LanguageSwitcher.module.css`
- Inline flex display with pipe separators using CSS `::after` pseudo-element
- `.selected` class for bold/active state styling

**Volto LanguageSelector component logic**

- Reference `/workspace/volto-svolto/frontend/core/packages/volto/src/components/theme/LanguageSelector/LanguageSelector.tsx`
- Pattern for finding translation URL from `@components.translations.items`
- Fallback to language root (`/${lang}`) when no translation exists

**Volto MultilingualRedirector pattern**

- Reference `/workspace/volto-svolto/frontend/core/packages/volto/src/components/theme/MultilingualRedirector/MultilingualRedirector.jsx`
- Logic for root URL redirect: check `site.features.multilingual` and `pathname === '/'`
- Priority: `I18N_LANGUAGE` cookie, then `plone.default_language` fallback

**Volto LanguageMap.js**

- Reference `/workspace/volto-svolto/frontend/core/packages/volto/src/helpers/LanguageMap/LanguageMap.js`
- Complete mapping of language codes to native/English names
- Proxy pattern for normalizing language code variants

**Plone client API setup**

- Located at `/workspace/src/lib/api.ts`
- Use existing `createClient` and `serverClient` patterns for API calls
- Content fetching already in `+layout.server.js` can be extended for translations expander

## Out of Scope

- Dropdown or modal-based language selector UI
- Language flags or country icons
- Automatic machine translation of content
- Language-specific date/number formatting
- Admin/CMS language configuration interface
- RTL (right-to-left) language layout switching
- URL structure changes (path prefixes are assumed to exist)
- Language detection from IP geolocation
- Multiple language switcher placements (footer, mobile nav)
