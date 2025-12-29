# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Svolto is a SvelteKit-based frontend for rendering Plone CMS content. It serves as a Svelte alternative to Volto (React-based Plone frontend) and the emerging "Seven" next-generation UI. The project renders Volto Blocks content from a Plone backend with plone.restapi enabled.

The `volto-svolto/` subdirectory contains a React reference implementation of Volto and Seven for comparison.

## Commands

```bash
# Development
pnpm dev                    # Start dev server (default: http://localhost:5173)

# Build & Preview
pnpm build                  # Production build
pnpm preview                # Preview production build

# Testing
pnpm test                   # Run all tests (e2e + unit)
pnpm test:e2e               # Playwright e2e tests
pnpm test:unit              # Vitest unit tests
pnpm test:unit -- --run     # Run unit tests once (no watch)

# Code Quality
pnpm lint                   # Check formatting (Prettier)
pnpm format                 # Fix formatting
pnpm check                  # Svelte type checking
pnpm check:watch            # Type checking in watch mode
```

## Architecture

### Data Flow

1. `@plone/client` connects to Plone backend API (configured via `PUBLIC_API_PATH` in `.env`)
2. SvelteKit routes fetch content in `+layout.js` using the client
3. `RenderBlocks.svelte` iterates over Plone blocks and renders appropriate block components
4. Block components are registered in `src/lib/blocks/index.ts` with a Volto-like configuration pattern

### Block System

Blocks follow Volto's architecture pattern:

- Each block type has a configuration object with `id`, `title`, `view` component
- `RenderBlocks.svelte` looks up block types from `blocksConfig` and renders the appropriate view
- `@plone/registry` provides configuration management (same as Volto)
- Default fallback: `DefaultBlockView.svelte`

Current blocks:

- `image` - Image block rendering
- `slate` - Rich text (Slate editor content) with nested components for elements (H2, H3, Link, Strong, Em, Ol, Ul, Li)
- `teaser` - Teaser block

### Key Files

- `src/lib/api.ts` - Plone client initialization
- `src/lib/blocks/index.ts` - Block type registry
- `src/lib/RenderBlocks.svelte` - Main block rendering loop
- `src/routes/+layout.js` - Config initialization and content loading

### React Interop

Uses `svelte-preprocess-react` for potential React component integration (useful for gradually migrating Volto components or using `@plone/blocks` directly).

## Environment

Required `.env` variables:

```
PUBLIC_API_PATH=http://localhost:8080/Plone
PUBLIC_FRONTEND_BASE_URL=http://localhost:5173
```

## Backend Setup

Use `compose.yaml` to run Plone backend with Volto frontend for content editing:

```bash
docker compose up -d
```

- Plone backend: http://localhost:8080/Plone
- Volto frontend (for editing): http://localhost:3000

## Tech Stack

- SvelteKit 2 with Svelte 5
- Tailwind CSS 4
- Slate (for rich text)
- Vitest + Playwright for testing
- TypeScript

## btca

Trigger: user says "use btca" (for codebase/docs questions).

Run:

- btca ask -t <tech> -q "<question>"

Available <tech>: svelte, tailwindcss

## Rules

- use btca for svelte, sveltekit, seven and volto!
- when running /agent-os:implement-tasks don't ask me just proceed with implementing of all tasks in groups!
