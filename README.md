# Sharp by Tony

Portfolio website for [sharpbytony.com](https://www.sharpbytony.com/) — a freelance video, photo, and design brand run by Antonio "Tony" Martinez. The site is built with Astro (frontend) and Sanity v3 (CMS), deployed to Netlify (frontend) and sanity.io (Studio). Phases 0–2 are complete: the monorepo is scaffolded, all content schemas are defined and locked, and the Sanity data layer is wired into Astro. Phase 3 (page UI) is the current next step. See [`docs/prd.md`](docs/prd.md) for the full product requirements and phased execution plan.

---

## Prerequisites

| Tool | Version |
|---|---|
| Node | 22+ (see `.nvmrc`) |
| pnpm | 10+ |

Install pnpm if you don't have it:

```bash
npm install -g pnpm
```

## Setup

```bash
# 1. Clone and install all workspace dependencies from the repo root
git clone <repo-url> sharpbytony
cd sharpbytony
pnpm install

# 2. Create the frontend env file
cp web/.env.example web/.env.local
```

Open `web/.env.local` and fill in the three values (see [Environment variables](#environment-variables) below).

## Local dev

```bash
# Run both workspaces in parallel
pnpm dev
# Astro frontend → http://localhost:4321
# Sanity Studio  → http://localhost:3333
```

To run one workspace at a time:

```bash
pnpm --filter web dev
pnpm --filter studio dev
```

Other useful commands (run from repo root unless noted):

```bash
pnpm build        # Build both workspaces
pnpm lint         # ESLint across both workspaces
pnpm format       # Prettier across both workspaces
pnpm typecheck    # TypeScript check across both workspaces
```

## Environment variables

The frontend reads three variables from `web/.env.local` (gitignored, never commit this file):

| Variable | Where to get it |
|---|---|
| `PUBLIC_SANITY_PROJECT_ID` | [manage.sanity.io](https://manage.sanity.io) → project settings |
| `PUBLIC_SANITY_DATASET` | `production` for live data, `development` for a staging dataset |
| `SANITY_API_READ_TOKEN` | manage.sanity.io → API → Tokens → create a read-only token |

A fourth variable, `SANITY_API_WRITE_TOKEN`, is only needed when deploying the Studio. Store it in a **root** `.env.local` (also gitignored). Never put it in `web/.env.local`.

The `.env.example` at the repo root lists all four keys with placeholder values.

## Deploy

### Frontend — Netlify

Netlify deploys automatically on push to `main`. Configure these once in Netlify → Site settings → Environment variables:

- `PUBLIC_SANITY_PROJECT_ID`
- `PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN`

| Setting | Value |
|---|---|
| Build command | `pnpm --filter web build` |
| Publish directory | `web/dist` |

### Sanity Studio

```bash
# Deploy Studio to *.sanity.studio (run from repo root)
pnpm --filter studio deploy
```

Only run this when explicitly updating the hosted Studio. The Studio URL is stored in `studio/sanity.cli.ts` after the first deploy.

## Project structure

```
/                          ← pnpm workspace root
├── docs/
│   └── prd.md             ← Full product requirements document
├── web/                   ← Astro frontend (Netlify)
│   ├── astro.config.mjs
│   ├── tsconfig.json
│   └── src/
│       ├── lib/
│       │   ├── sanity.ts  ← Sanity client config + helpers
│       │   └── queries.ts ← All GROQ queries (named exports)
│       ├── pages/         ← File-based routing (one .astro = one route)
│       ├── layouts/
│       └── components/
└── studio/                ← Sanity Studio v3 (sanity.io managed)
    ├── sanity.config.ts   ← Plugin and schema registration
    ├── sanity.cli.ts      ← Project ID, dataset, Studio URL
    ├── structure.ts       ← Structure builder (singleton config)
    └── schemas/
        ├── index.ts
        ├── singletons/
        ├── documents/
        └── objects/
```

## Where the schemas live

All content schemas are in `studio/schemas/`. **They are locked** — do not edit them without a migration plan. The set defined in Phase 2:

| File | Type | Purpose |
|---|---|---|
| `singletons/siteSettings.ts` | Singleton | Global brand metadata, contact info, social links |
| `documents/page.ts` | Document | Static pages (About, Contact, etc.) |
| `documents/project.ts` | Document | Portfolio entries (video and photo work) |
| `documents/service.ts` | Document | Video, Photography, Design |
| `documents/client.ts` | Document | Past clients with logo |
| `documents/testimonial.ts` | Document | Client quotes |
| `objects/seo.ts` | Object | Shared SEO field group |
| `objects/videoEmbed.ts` | Object | Vimeo / YouTube embed with poster frame |

The `siteSettings` singleton is protected via `studio/structure.ts` — it cannot be duplicated or deleted from the Studio UI.

GROQ queries for all types live in `web/src/lib/queries.ts`. Each is a named export that projects only the fields it needs (no wildcard spreads). See [`docs/prd.md`](docs/prd.md) section 7 for the full query list.
