# Task Breakdown: Language Switcher

## Overview

Total Tasks: 19

This spec enhances the existing language switcher implementation to add:
- Client-side cookie setting (immediate on click before navigation)
- Content page redirection based on preferred language
- Complete accessibility requirements

## Current Implementation Status

Several components already exist and are partially implemented:
- `src/lib/components/LanguageSwitcher.svelte` - Exists but missing client-side cookie setting
- `src/lib/utils/langmap.ts` - Complete
- `src/lib/utils/language-cookie.ts` - Exists but only supports server-side cookies
- `src/lib/plone/site.ts` - Complete with site settings and language detection
- `src/hooks.server.ts` - Root path redirect exists, content page redirect missing
- `src/routes/+layout.svelte` - Already integrates LanguageSwitcher

## Task List

### Utilities Layer

#### Task Group 1: Client-Side Cookie Utility

**Dependencies:** None

- [x] 1.0 Complete client-side cookie utility
  - [x] 1.1 Write 2-4 focused tests for client-side cookie functionality
    - Test `setLanguageCookieClient()` sets cookie with correct value
    - Test cookie is set with correct attributes (path, maxAge, sameSite)
    - Test `getLanguageCookieClient()` reads cookie value correctly
  - [x] 1.2 Add client-side cookie functions to `src/lib/utils/language-cookie.ts`
    - Add `setLanguageCookieClient(lang: string): void` using `document.cookie` API
    - Add `getLanguageCookieClient(): string | undefined` for client-side reading
    - Cookie settings: 6 months expiration, `SameSite=Strict`, `Secure` on HTTPS, `path=/`
    - Keep existing server-side functions unchanged
  - [x] 1.3 Ensure client-side cookie tests pass
    - Run ONLY the tests written in 1.1
    - Verify cookie is set correctly in DOM environment

**Acceptance Criteria:**

- Client-side cookie functions work with `document.cookie` API
- Cookie attributes match spec (6 months, SameSite: strict, Secure, path: /)
- Server-side functions remain unchanged and functional

---

### Component Layer

#### Task Group 2: LanguageSwitcher Cookie Integration

**Dependencies:** Task Group 1

- [x] 2.0 Complete LanguageSwitcher cookie integration
  - [x] 2.1 Write 2-4 focused tests for LanguageSwitcher cookie behavior
    - Test clicking language link calls `setLanguageCookieClient()` immediately
    - Test cookie is set BEFORE navigation occurs
    - Test `onSwitch` callback is still invoked if provided
  - [x] 2.2 Update `src/lib/components/LanguageSwitcher.svelte` to set cookie on click
    - Import `setLanguageCookieClient` from `$lib/utils/language-cookie`
    - Update `handleClick()` to call `setLanguageCookieClient(langCode)` FIRST
    - Ensure cookie is set synchronously before any navigation
    - Keep existing `onSwitch` callback invocation
  - [x] 2.3 Verify accessibility attributes are complete
    - Confirm `aria-label` on each language link
    - Confirm `aria-current="true"` on current language
    - Confirm keyboard navigation works with visible focus states
  - [x] 2.4 Ensure LanguageSwitcher tests pass
    - Run ONLY the tests written in 2.1
    - Verify cookie is set on click events

**Acceptance Criteria:**

- Cookie is set immediately on language link click
- Navigation occurs after cookie is set
- All accessibility attributes are present
- Component passes focused tests

---

### Server-Side Logic

#### Task Group 3: Content Page Language Redirection

**Dependencies:** Task Group 1

- [x] 3.0 Complete content page language redirection
  - [x] 3.1 Write 3-5 focused tests for content page redirection
    - Test content page redirects to translation when cookie is set and translation exists
    - Test content page does NOT redirect when no translation exists for preferred language
    - Test content page does NOT redirect when already in preferred language
    - Test root path redirection continues to work
  - [x] 3.2 Update `src/hooks.server.ts` to handle content page redirection
    - Read `I18N_LANGUAGE` cookie on ALL requests (not just root)
    - For non-root paths with cookie set:
      - Fetch `@components.translations` for current content path
      - Check if translation exists in preferred language
      - Redirect to translation URL if available (307 temporary redirect)
      - Stay on current page if no translation exists
    - Skip redirect if content is already in preferred language
    - Maintain existing root path redirect logic
  - [x] 3.3 Add helper function for fetching translations
    - Create `fetchContentTranslations(path: string, apiPath: string)` in `src/lib/plone/site.ts`
    - Return array of `{ language: string, '@id': string }`
    - Handle errors gracefully (return empty array on failure)
  - [x] 3.4 Extract language from URL path
    - Create `extractLanguageFromPath(pathname: string, availableLanguages: string[])` helper
    - Return detected language code or `undefined`
    - Handle paths like `/en/page`, `/de/page`, etc.
  - [x] 3.5 Ensure content page redirection tests pass
    - Run ONLY the tests written in 3.1
    - Verify redirect logic works for various scenarios

**Acceptance Criteria:**

- Content pages redirect to translations when preferred language cookie is set
- No redirect occurs when translation doesn't exist
- No redirect occurs when already in preferred language
- Root path redirection continues to work
- Helper functions are properly typed and tested

---

### Integration Layer

#### Task Group 4: End-to-End Integration

**Dependencies:** Task Groups 1, 2, 3

- [x] 4.0 Complete end-to-end integration verification
  - [x] 4.1 Write 2-3 integration tests for full language switching flow
    - Test: User clicks language link -> cookie set -> page navigates -> server redirects correctly
    - Test: User with cookie visits content page -> redirected to translation
    - Test: User with cookie visits page without translation -> stays on current page
  - [x] 4.2 Verify SiteHeader integration is complete
    - Confirm `LanguageSwitcher` renders in utility slot when multilingual
    - Confirm props are passed correctly from layout data
    - Confirm conditional rendering based on `availableLanguages.length > 1`
  - [x] 4.3 Verify data flow from server to client
    - Confirm `+layout.server.js` fetches translations via `expand: ['translations']`
    - Confirm `translations` are passed to client via page data
    - Confirm `siteSettings` includes `availableLanguages`
  - [x] 4.4 Ensure integration tests pass
    - Run ONLY the tests written in 4.1
    - Verify complete language switching workflow

**Acceptance Criteria:**

- Full language switching flow works end-to-end
- Cookie persistence works across requests
- Server-side redirection integrates with client-side cookie setting
- SiteHeader displays LanguageSwitcher correctly

---

### Testing

#### Task Group 5: Test Review and Gap Analysis

**Dependencies:** Task Groups 1-4

- [x] 5.0 Review existing tests and fill critical gaps only
  - [x] 5.1 Review tests from Task Groups 1-4
    - Review 2-4 tests from client-side cookie utility (Task 1.1)
    - Review 2-4 tests from LanguageSwitcher cookie behavior (Task 2.1)
    - Review 3-5 tests from content page redirection (Task 3.1)
    - Review 2-3 integration tests (Task 4.1)
    - Total existing tests: approximately 9-16 tests
  - [x] 5.2 Analyze test coverage gaps for language switcher feature only
    - Identify critical user workflows lacking coverage
    - Focus ONLY on gaps related to this spec's requirements
    - Prioritize cookie persistence and redirection workflows
  - [x] 5.3 Write up to 5 additional strategic tests if necessary
    - Add tests only for identified critical gaps
    - Focus on edge cases that could break user experience
    - Examples: invalid cookie values, missing translations data, network failures
  - [x] 5.4 Run all language switcher feature tests
    - Run ONLY tests related to this spec (approximately 9-21 tests total)
    - Verify all critical workflows pass
    - Do NOT run entire application test suite

**Acceptance Criteria:**

- All feature-specific tests pass
- Critical user workflows are covered
- No more than 5 additional tests added
- Testing focused on language switcher feature requirements

---

## Execution Order

Recommended implementation sequence:

1. **Utilities Layer** (Task Group 1) - Client-side cookie utility
2. **Component Layer** (Task Group 2) - LanguageSwitcher cookie integration
3. **Server-Side Logic** (Task Group 3) - Content page redirection
4. **Integration Layer** (Task Group 4) - End-to-end verification
5. **Testing** (Task Group 5) - Test review and gap analysis

---

## Technical Notes

### Cookie Behavior (Critical)

The cookie MUST be set IMMEDIATELY when the user clicks a language link, BEFORE navigation occurs. This is achieved by:

1. Using client-side `document.cookie` API (not server-side `Cookies`)
2. Setting cookie synchronously in the `onclick` handler
3. Allowing normal anchor tag navigation to proceed after cookie is set

This ensures the subsequent HTTP request includes the new cookie value, allowing the server to redirect appropriately.

### Content Page Redirection Flow

```
User clicks language link
  -> setLanguageCookieClient('de') sets cookie immediately
  -> Browser navigates to target URL
  -> Server receives request with I18N_LANGUAGE=de cookie
  -> hooks.server.ts checks if translation exists
  -> If translation exists and different from current: redirect 307
  -> If no translation or same language: serve current page
```

### Files to Modify

1. `src/lib/utils/language-cookie.ts` - Add client-side functions
2. `src/lib/components/LanguageSwitcher.svelte` - Add cookie setting on click
3. `src/hooks.server.ts` - Add content page redirection logic
4. `src/lib/plone/site.ts` - Add translations fetching helper

### Files Already Complete

1. `src/lib/utils/langmap.ts` - Language map utility (complete)
2. `src/routes/+layout.server.js` - Already fetches translations via expand (complete)
3. `src/routes/+layout.svelte` - Already integrates LanguageSwitcher (complete)
4. `src/lib/plone/site.ts` - Site settings and language detection (complete)
5. `src/hooks.server.ts` - Root path redirect (complete, needs content page redirect)

---

## Key Files

| File | Status | Purpose |
|------|--------|---------|
| `src/lib/utils/langmap.ts` | Complete | Language code to native name mapping with Proxy |
| `src/lib/utils/language-cookie.ts` | Complete | Client and server-side cookie functions |
| `src/lib/plone/site.ts` | Complete | Site settings, language detection, and translations helpers |
| `src/lib/components/LanguageSwitcher.svelte` | Complete | Client-side cookie setting on click |
| `src/routes/+layout.server.js` | Complete | Server-side data loading |
| `src/routes/+layout.svelte` | Complete | Layout integration |
| `src/hooks.server.ts` | Complete | Root and content page redirection |

---

## Reference Files

- Volto LanguageMap: `volto-svolto/frontend/core/packages/volto/src/helpers/LanguageMap/LanguageMap.js`
- Volto LanguageSelector: `volto-svolto/frontend/core/packages/volto/src/components/theme/LanguageSelector/LanguageSelector.tsx`
- Volto MultilingualRedirector: `volto-svolto/frontend/core/packages/volto/src/components/theme/MultilingualRedirector/MultilingualRedirector.jsx`
- Seven CSS: `volto-svolto/seven-svolto/core/packages/layout/slots/LanguageSwitcher/LanguageSwitcher.module.css`
