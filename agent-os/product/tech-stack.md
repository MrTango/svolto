# Tech Stack

## Framework and Runtime

| Category                  | Choice      | Notes                                                          |
| ------------------------- | ----------- | -------------------------------------------------------------- |
| **Application Framework** | SvelteKit 2 | Full-stack framework with SSR, routing, and build optimization |
| **UI Framework**          | Svelte 5    | Compiled reactive components with runes syntax                 |
| **Language**              | TypeScript  | Type safety for component props and API responses              |
| **Runtime**               | Node.js     | Server-side rendering and API proxy                            |
| **Package Manager**       | pnpm        | Fast, disk-efficient package management                        |

## Frontend

| Category                   | Choice                    | Notes                                         |
| -------------------------- | ------------------------- | --------------------------------------------- |
| **Component Architecture** | Svelte 5 Components       | Single-file components with scoped styles     |
| **Rich Text Rendering**    | Slate                     | Renders Volto's Slate-based rich text content |
| **CSS Approach**           | CSS Custom Properties     | Design token-based theming system             |
| **CSS Framework**          | Tailwind CSS 4 (optional) | Utility classes available but not required    |
| **CSS Preprocessing**      | Sass                      | Available for complex styling needs           |

## Plone Integration

| Category                   | Choice                  | Notes                                                 |
| -------------------------- | ----------------------- | ----------------------------------------------------- |
| **API Client**             | @plone/client           | Official Plone REST API client library                |
| **Configuration Registry** | @plone/registry         | Volto-compatible component and configuration registry |
| **Block Definitions**      | @plone/blocks           | Block schema and type definitions                     |
| **Data Fetching**          | @tanstack/svelte-query  | Caching, refetching, and query state management       |
| **React Interop**          | svelte-preprocess-react | Enables use of React components when necessary        |

## Testing and Quality

| Category              | Choice                  | Notes                                         |
| --------------------- | ----------------------- | --------------------------------------------- |
| **Unit Testing**      | Vitest                  | Fast Vite-native test runner                  |
| **Component Testing** | @testing-library/svelte | User-centric component testing                |
| **E2E Testing**       | Playwright              | Cross-browser end-to-end testing              |
| **Type Checking**     | svelte-check            | Svelte-aware TypeScript validation            |
| **Linting**           | ESLint                  | Code quality and consistency                  |
| **Formatting**        | Prettier                | Consistent code formatting with Svelte plugin |

## Build and Development

| Category               | Choice            | Notes                                                   |
| ---------------------- | ----------------- | ------------------------------------------------------- |
| **Build Tool**         | Vite 6            | Fast development server and optimized production builds |
| **Bundling**           | Rollup (via Vite) | Tree-shaking and code splitting                         |
| **Development Server** | Vite Dev Server   | HMR and fast refresh                                    |

## Deployment

| Category             | Choice                 | Notes                             |
| -------------------- | ---------------------- | --------------------------------- |
| **Containerization** | Docker                 | Consistent deployment environment |
| **Server**           | Node.js                | SSR and API handling              |
| **Adapter**          | @sveltejs/adapter-node | Node.js deployment target         |

## Dependencies Summary

### Production Dependencies

```
@plone/client          - Plone REST API client
@plone/registry        - Configuration and component registry
@tanstack/svelte-query - Server state management
slate                  - Rich text data structures
react, react-dom       - Required for @plone/client and potential React component interop
sass                   - CSS preprocessing
```

### Development Dependencies

```
svelte                 - UI framework
@sveltejs/kit          - Application framework
tailwindcss            - Utility CSS (optional)
typescript             - Type safety
vite                   - Build tooling
vitest                 - Unit testing
playwright             - E2E testing
prettier               - Code formatting
```

## Architecture Decisions

### Why Svelte 5?

- Compiled output with minimal runtime overhead
- Runes provide explicit, predictable reactivity
- Single-file components with scoped CSS
- Simpler mental model than React hooks

### Why Keep @plone/client and @plone/registry?

- Battle-tested API integration with Plone
- Maintains compatibility with Plone ecosystem
- Reduces reimplementation of complex REST API logic
- @plone/registry enables Volto-compatible configuration patterns

### Why @tanstack/svelte-query?

- Handles caching, background refetching, and stale data
- Reduces boilerplate for data fetching
- DevTools for debugging query state
- Consistent patterns across the application

### Why CSS Custom Properties for Theming?

- Runtime customization without rebuild
- Native browser support, no JavaScript overhead
- Works with any CSS approach (Tailwind, vanilla, Sass)
- Enables configuration-driven theming over component overrides

### Why React Interop?

- @plone/client has React dependencies
- Allows incremental adoption of existing Volto React components
- Pragmatic bridge during transition period
- Can be reduced over time as native Svelte alternatives mature
