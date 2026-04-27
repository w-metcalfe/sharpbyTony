# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

Portfolio website rebuild for Sharp by Tony (sharpbytony.com) — a freelance video/photo/design brand.

**Stack:** Astro v6+ with TypeScript strict mode (frontend) · Sanity v3 with TypeScript schemas (CMS) · pnpm monorepo on Node LTS · Netlify (frontend hosting) · sanity.io managed (Studio hosting)

Phases 0–2 are complete. The schemas are locked and the Sanity data layer is wired into Astro. Phase 3 (UI build) is next. See [`docs/prd.md`](docs/prd.md) for the full product requirements and phased execution plan.

## Commands

All commands run from the repo root unless noted.

```bash
# Install everything
pnpm install

# Run both workspaces in parallel (Astro :4321, Studio :3333)
pnpm dev

# Run one workspace
pnpm --filter web dev
pnpm --filter studio dev

# Fan-out commands (run against both workspaces)
pnpm build
pnpm lint
pnpm format
pnpm typecheck

# Deploy Studio to *.sanity.studio — only run when explicitly instructed
pnpm --filter studio deploy
```

There are no tests yet. `astro check` is used for type-checking in `/web`; `tsc --noEmit` in `/studio`.

## Architecture

### Monorepo layout

```
/               ← pnpm workspace root (eslint.config.mjs, .prettierrc apply here)
├── web/        ← Astro frontend
└── studio/     ← Sanity Studio v3
```

`pnpm-workspace.yaml` declares both packages. Root `package.json` scripts fan out via `pnpm -r run <script>` (sequential) or `pnpm --parallel -r run dev`.

### /web — Astro frontend

- **Entry point:** `web/src/pages/` — Astro's file-based router. Each `.astro` file is a route.
- **Data layer:** `web/src/lib/sanity.ts` (Sanity client config) and `web/src/lib/queries.ts` (GROQ queries). Both exist and are wired up.
- **Path aliases** (configured in `web/tsconfig.json`): `~/lib/*`, `~/components/*`, `~/layouts/*`, `~/pages/*` resolve to their `src/` counterparts. Astro picks these up automatically for Vite resolution — no separate Vite alias config needed.
- **Env vars:** `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET` (exposed to client), `SANITY_API_READ_TOKEN` (server-side only). Loaded from `web/.env.local`. `SANITY_API_WRITE_TOKEN` is Studio-only — never add it to `/web`.
- **Tailwind:** `@astrojs/tailwind` is installed but the integration is not yet wired into `astro.config.mjs`. Defer until the UI phase.

### /studio — Sanity Studio v3

- **Config:** `studio/sanity.config.ts` — registers plugins and schema. Project ID `tusnc4rf`, dataset `production` are hardcoded here (not secrets).
- **Schemas:** `studio/schemas/` — fully implemented. See [Where the schemas live](#where-the-schemas-live) in `README.md` for the directory layout. **Schemas are locked** — do not edit without a migration plan (see Off limits below).
- **Structure builder:** `studio/structure.ts` — configures singletons so they cannot be duplicated or deleted.
- **Path alias:** `~/schemas/*` → `schemas/*` (configured in `studio/tsconfig.json`).

### ESLint / Prettier

- **Root `eslint.config.mjs`** — TypeScript-aware (`typescript-eslint`) + Astro rules (`eslint-plugin-astro`). Applies to the whole repo when run from root.
- **`web/eslint.config.mjs`** — re-exports the root config (so `eslint .` inside `/web` uses the same rules).
- **`studio/eslint.config.mjs`** — uses `@sanity/eslint-config-studio` independently. Do not merge with root config; the Sanity plugin needs its own plugin instance.
- **`.prettierrc`** — single root config consumed by both workspaces. Settings: no semis, single quotes, 100-char width, `prettier-plugin-astro` for `.astro` files.

## Conventions

- **TypeScript only** — never create `.js` files in either workspace.
- **ESM only** — no CommonJS (`require`, `module.exports`).
- **All image fields in Sanity schemas must require `alt` text via a Sanity validation rule**, not just as an optional field. Hard requirement.
- **No hardcoded colour values** anywhere in the codebase. Design tokens are deferred to Phase 3; use placeholder/transparent values until then.
- **Env vars live in `.env.local` (gitignored).** Never commit secrets. `web/.env.local` holds only the three web-safe keys; `SANITY_API_WRITE_TOKEN` lives in root `.env.local` and is Studio-deploy-only.
- **Schemas are locked.** Phase 2 is complete. Do not modify any schema file without an explicit migration plan.
- **Singletons** (`siteSettings`) must be configured with Sanity's structure builder so they cannot be duplicated or deleted.
- **GROQ queries** (in `web/src/lib/queries.ts`) must project only the fields needed — no `*` wildcard spreads.
- Conventional commits, even in solo development.

## Common tasks

```bash
# Add a new Astro page (Phase 3)
# Create web/src/pages/<name>.astro — the filename becomes the route

# Add a new GROQ query
# Edit web/src/lib/queries.ts — one named export per query, project only needed fields

# Check types across both workspaces
pnpm typecheck

# Fix lint + formatting in one pass
pnpm lint && pnpm format
```

## Off limits

- **`studio/schemas/`** requires **Plan Mode review before any change** once Phase 2 is locked. Do not edit schema files directly without entering Plan Mode first.
- **Do not run `sanity deploy`** (or `pnpm --filter studio deploy`) without explicit instruction from the user.

## Phase status

- Phase 0 (decisions): complete
- Phase 1 (repo + framework scaffold): complete
- Phase 2 (schemas + data layer): **complete** — schemas locked, Sanity client wired, GROQ queries written and verified
- Phase 3 (UI): **next** — page layouts, components, Tailwind integration, and design tokens
