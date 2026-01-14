<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# I'm building a CMS frontend for plone based on newest svelte and sveltekit. what are the best strategies to have the ui as light weight as possible, meaning only loading what is needed in every route?

SvelteKit already does route-level code splitting for you, so the core strategy is: keep layouts thin, colocate heavy code with the route that needs it, and lazy‑load anything non‑critical via dynamic imports.[^1][^2]

## Route and layout structure

- Keep `src/routes/+layout.svelte` minimal: global chrome only (shell, nav, theme), no heavy editors, charts, or CMS tooling there.[^3][^2]
- Use nested layouts (`/app/+layout.svelte`, `/app/(admin)/+layout.svelte`, etc.) to scope heavier CMS sections so they are only loaded when those segments are active.[^3][^2]
- Colocate route‑specific utilities and components under the route folder so bundling naturally splits per page or feature.[^2]


## Data loading and rendering mode

- Put Plone fetches into `+page.server.ts` or `+layout.server.ts` where possible so data is fetched on the server and only JSON/HTML is sent to the client (less JS on the wire).[^4][^5]
- For mostly read‑only CMS views, use `prerender` where safe or hybrid rendering (static for public pages, SSR/CSR for the authenticated dashboard) to cut runtime cost on first load.[^6][^5]
- Cache Plone responses at the edge or via SvelteKit’s adapter + HTTP caching so repeat navigations hit cache instead of the CMS backend.[^7][^5]


## Component‑level lazy loading

- For heavy UI (rich text editor, media browser, schema builder, analytics charts), load them with `await import('./HeavyEditor.svelte')` or a small wrapper that lazy‑loads on demand.[^1][^3]
- Mount these heavy components only after user intent (e.g., when opening an “Edit” route, a tab, or a modal) so the initial route bundle stays **small**.[^8][^3]
- Keep top‑level `import` lists in each `+page.svelte` lean; anything imported there is bundled unconditionally into that page’s chunk.[^1][^8]


## Assets and vendor weight

- Lazy‑load images by using `loading="lazy"` and responsive sources so CMS media libraries don’t block LCP for the dashboard shell.[^3][^9]
- Avoid global registration of big libraries (rich editors, chart libs, complex form builders); instead import them only in routes that need them or behind dynamic imports.[^8][^3]
- Self‑host fonts with `font-display: swap` and prefer system fonts in the CMS UI to minimize blocking resources for logged‑in users.[^8][^3]


## Navigation behaviour

- Keep client‑side routing (default SvelteKit) so route chunks are loaded only when the user navigates there, but enable prefetch on “likely” links (`data-sveltekit-prefetch`) for a snappy feel without globally prefetching everything.[^3][^10]
- Use shallow, shared layouts plus light stores for global state; avoid a monolithic store that pulls all CMS data into every route.[^3][^9]

If you share a rough route map of your Plone CMS frontend (e.g. `/login`, `/content`, `/content/[id]/edit`, `/media`, `/settings`), concrete file structure and dynamic-import examples can be sketched tailored to that setup.
<span style="display:none">[^11][^12][^13][^14][^15][^16][^17][^18][^19][^20]</span>

<div align="center">⁂</div>

[^1]: https://svelte.dev/docs/kit/performance

[^2]: https://svelte.dev/docs/kit/routing

[^3]: https://wild.codes/candidate-toolkit-question/how-do-you-implement-routing-dynamic-imports-and-lazy-loading-in-svelte

[^4]: https://svelte.dev/docs/kit/load

[^5]: https://www.sanity.io/sveltekit-cms

[^6]: https://svelte.dev/docs/kit/page-options

[^7]: https://strapi.io/integrations/svelte-cms

[^8]: https://onenine.com/checklist-for-svelte-app-optimization/

[^9]: https://cursor.directory/svelte5-sveltekit-development-guide

[^10]: https://phc.com.kw/news-detail/distribution-of-cash-dividend-(2017)?s-news-11750556-2025-11-21-internal-routing-in-sveltekit-a-closer-look-at-its-simplified-user-friendly-navigation-system

[^11]: https://www.reddit.com/r/sveltejs/comments/1fpejje/lazy_load_routes_with_sveltekits_spa/

[^12]: https://stackoverflow.com/questions/70471512/analyzing-optimizing-and-lazy-loading-vendor-js-when-doing-sveltekit-server-sid

[^13]: https://naturaily.com/blog/best-frontend-for-headless-cms

[^14]: https://criztec.com/sveltekit-complete-developers-guide-2025

[^15]: https://stackoverflow.com/questions/76677377/loading-data-only-once-in-svelte-kit-and-when-to-use-page-js-vs-layout-js-for-lo

[^16]: https://kinsta.com/blog/wordpress-sveltekit/

[^17]: https://svelte.dev/docs/kit/llms.txt

[^18]: https://github.com/sveltejs/kit/issues/2301

[^19]: https://dev.to/mandrasch/yes-sveltekit-for-the-frontend-win-but-what-about-a-cms-dashboard-for-clients-1dm6

[^20]: https://bejamas.com/hub/tutorials/building-reactive-uis-with-sveltekit-reactive-statements

