# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

Portfolio website rebuild for Sharp by Tony (sharpbytony.com) — a freelance video/photo/design brand.

**Stack:** Astro v6+ with TypeScript strict mode (frontend) · Sanity v3 with TypeScript schemas (CMS) · pnpm monorepo on Node LTS · Netlify (frontend hosting) · sanity.io managed (Studio hosting)

Phases 0–3 are complete. Visual editing (Sanity Presentation Tool) is fully wired up and working. See [`docs/prd.md`](docs/prd.md) for the full product requirements and phased execution plan.

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

# Deploy Studio to sharpbytony.sanity.studio — only run when explicitly instructed
# appId is configured in studio/sanity.cli.ts so no interactive prompt is needed
npx sanity deploy -y --url sharpbytony
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
- **Output mode:** `server` (SSR via `@astrojs/netlify`) — required for cookie-based draft mode.
- **Data layer:**
  - `web/src/lib/sanity.ts` — base Sanity client (published perspective, no stega). Used for non-draft pages.
  - `web/src/lib/load-query.ts` — draft-mode-aware fetch. Use this on all pages that need live preview. Reads the perspective cookie and enables stega + resultSourceMap only in draft mode.
  - `web/src/lib/draft-mode.ts` — `getDraftModeProps(cookies)` helper; spread into every `loadQuery` call.
  - `web/src/lib/queries.ts` — all GROQ queries and TypeScript result types.
- **Path aliases** (configured in `web/tsconfig.json`): `~/lib/*`, `~/components/*`, `~/layouts/*`, `~/pages/*` resolve to their `src/` counterparts.
- **Env vars:** `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET` (exposed to client), `SANITY_API_READ_TOKEN` (server-side only, required for draft mode). Loaded from `web/.env.local`. `SANITY_API_WRITE_TOKEN` is Studio-only — never add it to `/web`.

### /studio — Sanity Studio v3

- **Config:** `studio/sanity.config.ts` — registers plugins and schema. Project ID `tusnc4rf`, dataset `production` are hardcoded here (not secrets).
- **Schemas:** `studio/schemas/` — fully implemented. **Schemas are locked** — do not edit without a migration plan (see Off limits below).
- **Structure builder:** `studio/structure.ts` — configures singletons so they cannot be duplicated or deleted.
- **Presentation Tool:** configured in `studio/sanity.config.ts` with `presentationTool`. Location resolvers live in `studio/lib/resolve.ts`. Preview URL: `http://localhost:4321`. Draft-mode enable endpoint: `/api/draft-mode/enable`.
- **Path alias:** `~/schemas/*` → `schemas/*` (configured in `studio/tsconfig.json`).

### Sanity Visual Editing (Presentation Tool)

The site supports live in-context editing via Sanity's Presentation Tool. Key pieces:

| File | Role |
|---|---|
| `web/src/lib/load-query.ts` | Draft-mode-aware data fetcher (replaces `sanityFetch` on editable pages) |
| `web/src/lib/draft-mode.ts` | Reads the perspective cookie; spread into `loadQuery` calls |
| `web/src/pages/api/draft-mode/enable.ts` | Validates one-time secret and sets the perspective cookie |
| `web/src/pages/api/draft-mode/disable.ts` | Clears the perspective cookie |
| `web/src/components/SanityVisualEditing.tsx` | React overlay (`client:only="react"`) — mounts when draft mode is active |
| `web/src/components/DisableDraftMode.tsx` | "Disable Draft Mode" button — shown outside the Studio iframe |
| `web/src/layouts/BaseLayout.astro` | Detects draft mode from cookies and injects both React components |
| `studio/lib/resolve.ts` | Maps each document type to its frontend URL for the Presentation panel |

**How stega works:** text fields fetched via `loadQuery` in draft mode automatically receive invisible Unicode markers (stega encoding). The `<VisualEditing>` overlay reads these to know which document/field to open when clicked — no manual `data-sanity` attribute needed for plain text.

**`data-sanity` attributes** are needed for non-text elements (images, cards, section wrappers) so the overlay can link them to Sanity documents. Use `createDataAttribute` from `@sanity/visual-editing`:
```ts
import { createDataAttribute } from '@sanity/visual-editing'
data-sanity={createDataAttribute({id: 'siteSettings', type: 'siteSettings', path: 'heroKicker'})()}
```

**`stegaClean`** must be applied to any string used in a `href`, `src`, or regex — stega characters will break URLs:
```ts
import { stegaClean } from '@sanity/client/stega'
const emailHref = stegaClean(email)
```

**Draft mode flow:**
1. Studio opens Presentation Tool → embeds `http://localhost:4321` in an iframe
2. Studio calls `/api/draft-mode/enable?sanityPreviewSecret=...`
3. The route validates the secret and sets the `__sanity_preview` perspective cookie
4. All subsequent `loadQuery` calls fetch with `perspective: 'drafts'` and stega enabled
5. Click any element → Studio highlights the matching field
6. Edit a field → iframe reloads with the draft value

**Adding a new editable field:**
1. Add the field to the schema in `studio/schemas/` (requires Plan Mode review)
2. Deploy the schema: `npx sanity deploy -y --url sharpbytony`
3. Add the field to the TypeScript type in `web/src/lib/queries.ts`
4. Project the field in the relevant GROQ query in `web/src/lib/queries.ts`
5. Use it in the component with a fallback: `{settings?.myField ?? 'Fallback text'}`
6. Add `data-sanity` if it's a non-text element

### ESLint / Prettier

- **Root `eslint.config.mjs`** — TypeScript-aware (`typescript-eslint`) + Astro rules (`eslint-plugin-astro`). Applies to the whole repo when run from root.
- **`web/eslint.config.mjs`** — re-exports the root config (so `eslint .` inside `/web` uses the same rules).
- **`studio/eslint.config.mjs`** — uses `@sanity/eslint-config-studio` independently. Do not merge with root config; the Sanity plugin needs its own plugin instance.
- **`.prettierrc`** — single root config consumed by both workspaces. Settings: no semis, single quotes, 100-char width, `prettier-plugin-astro` for `.astro` files.

## Conventions

- **TypeScript only** — never create `.js` files in either workspace.
- **ESM only** — no CommonJS (`require`, `module.exports`).
- **All image fields in Sanity schemas must require `alt` text via a Sanity validation rule**, not just as an optional field. Hard requirement.
- **No hardcoded colour values** anywhere in the codebase. Design tokens are deferred; use placeholder/transparent values until then.
- **Env vars live in `.env.local` (gitignored).** Never commit secrets. `web/.env.local` holds only the three web-safe keys; `SANITY_API_WRITE_TOKEN` lives in root `.env.local` and is Studio-deploy-only.
- **Schemas are locked.** Do not modify any schema file without an explicit migration plan reviewed in Plan Mode.
- **Singletons** (`siteSettings`) must be configured with Sanity's structure builder so they cannot be duplicated or deleted.
- **GROQ queries** (in `web/src/lib/queries.ts`) must project only the fields needed — no `*` wildcard spreads.
- **Use `loadQuery` + `getDraftModeProps`** on any page that needs live preview. The old `sanityFetch` from `sanity.ts` is left intact for pages that don't need draft mode.
- **Guard image fields** before calling `imageUrl()` — Sanity client documents may exist without a logo uploaded yet. Always check `c.logo?.asset` before rendering.
- Conventional commits, even in solo development.

## Common tasks

```bash
# Add a new Astro page
# Create web/src/pages/<name>.astro — the filename becomes the route

# Add a new GROQ query
# Edit web/src/lib/queries.ts — one named export per query, project only needed fields

# Check types across both workspaces
pnpm typecheck

# Fix lint + formatting in one pass
pnpm lint && pnpm format

# Deploy updated Studio schema (non-interactive — appId is pre-configured)
npx sanity deploy -y --url sharpbytony
```

## Off limits

- **`studio/schemas/`** requires **Plan Mode review before any change**. Do not edit schema files directly without entering Plan Mode first.
- **Do not run `sanity deploy`** without explicit instruction from the user.
- **Do not use `claude_preview` to verify frontend changes** after edits unless explicitly instructed to do so.

## Phase status

- Phase 0 (decisions): complete
- Phase 1 (repo + framework scaffold): complete
- Phase 2 (schemas + data layer): complete — schemas locked, Sanity client wired, GROQ queries written and verified
- Phase 3 (UI + Visual Editing): **complete** — all homepage sections editable via Sanity Presentation Tool; 9 testimonials and 8 client records seeded in Sanity; `siteSettings` fields cover hero, about, projects, testimonials, and contact sections
- Next: upload client logos in Studio → Clients (each record needs a logo image before it appears in the logo strip)
