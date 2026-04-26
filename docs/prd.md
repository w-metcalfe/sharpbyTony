# Product Requirements Document: Sharp by Tony Website Scaffolding

**Project:** sharpbytony.com rebuild (custom code clone of existing site)
**Phase:** Framework and CMS scaffolding only
**Stack:** Astro + Sanity v3 + Netlify
**Owner:** William (developer)
**End client:** Antonio "Tony" Martinez, Sharp by Tony
**Document version:** 1.0
**Last updated:** 2026-04-26

---

## 1. Purpose

Set up a production-ready development foundation (repo, framework, CMS, data layer) for the Sharp by Tony website rebuild *before* any page UI is built. The goal of this phase is to lock in the content model and verify data flows end to end, so that the page-build phase can move quickly without retrofitting.

This PRD covers Phases 0 to 2 of the workflow established in prior planning, plus guardrail setup (Phase 4 partial). Page UI work (Phase 3) is explicitly out of scope.

## 2. Background

### 2.1 The business

Sharp by Tony is the freelance content production brand of Antonio "Tony" Martinez, based in southwestern Ontario.

- Tagline: *Sharp, strategic visuals for construction, lifestyle and luxury*
- Core services in priority order: video production, photography, design
- Target verticals: construction, lifestyle, luxury
- Notable clients: Magna, Nash Jewellers, Opportunity Bridal, Bath Expert, T-BO, Designer's Edge / Covers Canada, Diamond Barbershop
- Contact: tony@sharpbytony.com / 519.902.7253
- Social: Facebook, Instagram (@mexipinomedia, @therealmexipino), LinkedIn

### 2.2 The existing site

Reference site: https://www.sharpbytony.com/

Existing structure:

- Home
- About
- Contact
- Video
- Photo
- Demo Reel

The current site is a content-light portfolio with Vimeo embeds, a client logo strip, testimonials, and a contact form. No transactional or dynamic functionality.

### 2.3 Why a rebuild

The current site has known issues that the rebuild must resolve at the foundation level:

- Browser tab title reads "Media Solutions | Mexipinomedia" instead of "Sharp by Tony" (brand inconsistency, SEO loss)
- Brand identity is split between "Sharp by Tony" and "Mexipinomedia" across site, social handles, and metadata
- About copy contains a grammar error
- No service tiers, packages, or pricing signals
- No vertical-specific landing pages to capture intent-based search
- Heavy media use without a confirmed strategy for Core Web Vitals, alt text, lazy loading, or video poster frames
- Local SEO basics (Google Business Profile, NAP, location pages) unverified

The CMS-driven rebuild gives Tony a single source of truth for brand metadata and the structural foundation to fix these issues without further refactors.

### 2.4 Why Astro + Sanity + Netlify

Decision finalized in prior planning. Summary rationale:

- **Astro** ships zero JS by default, scores high on Core Web Vitals out of the box, has an official Sanity integration, and is purpose-built for content-driven sites with light interactivity. The site has no auth, cart, or app logic that would justify Next.js overhead.
- **Sanity v3** has a strong schema system, Portable Text, image hotspots, and a flexible Studio UI Tony can be trained on.
- **Netlify** deploys cleanly from a monorepo, supports Astro natively, and has straightforward forms handling for the Contact page later.

Trade-off accepted: Sanity's Presentation tool (visual live preview) requires more setup in Astro than in Next.js. For a portfolio site this is acceptable.

## 3. Goals and non-goals

### 3.1 Goals

- A working monorepo with `/web` (Astro) and `/studio` (Sanity)
- All content schemas defined, reviewed, and visible in Sanity Studio
- GROQ queries written and tested against seeded dummy content
- Sanity client wired into Astro with env vars and confirmed data flow
- Deploy targets configured (Netlify for `/web`, sanity.io for `/studio`)
- A `CLAUDE.md` at the repo root that locks in the conventions and guardrails established here
- Resolution (or explicit deferral) of the Sharp by Tony / Mexipinomedia brand-naming question before site settings content is modelled

### 3.2 Non-goals

- Page UI, layout, or styling work
- Component library setup beyond a base layout shell
- Real content entry (only dummy content for testing)
- Visual design system, brand tokens beyond placeholders
- SEO meta optimization beyond schema fields existing
- Migration of any existing site content
- Google Business Profile, NAP audit, or any local SEO outside the website itself
- Analytics, consent banners, or third-party scripts
- Pricing, packages, or service tier modelling (see section 9, open questions)

## 4. Tech stack and conventions

### 4.1 Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend framework | Astro v4+ | Latest stable at build time |
| CMS | Sanity v3 | TypeScript schemas |
| Hosting (frontend) | Netlify | Vercel acceptable as alternative if Netlify forms are dropped later |
| Hosting (Studio) | sanity.io managed | Free tier sufficient for this project |
| Language | TypeScript everywhere | No JavaScript files in either workspace |
| Package manager | pnpm | Better monorepo support than npm or yarn |
| Node version | LTS pinned in `.nvmrc` | Match Netlify build image |

### 4.2 Code conventions

- ESM only, no CommonJS
- Path aliases configured in both workspaces (`~/lib`, `~/components`, etc.)
- Prettier for formatting, ESLint for linting, both configured at the workspace root
- Conventional commits, even in solo development, to keep history clean
- All images entered through Sanity must have alt text at the schema level (validation rule, not just a recommendation)

### 4.3 Environment variables

Stored in `.env.local` (gitignored), documented in `.env.example`:

- `PUBLIC_SANITY_PROJECT_ID`
- `PUBLIC_SANITY_DATASET` (production / development split)
- `SANITY_API_READ_TOKEN` (server-side reads if needed)
- `SANITY_API_WRITE_TOKEN` (Studio deploy only, never in `/web`)

Production env vars set in Netlify dashboard. No secrets committed.

## 5. Repo structure

```
sharpbytony/
├── .gitignore
├── .nvmrc
├── .env.example
├── CLAUDE.md
├── README.md
├── package.json              # pnpm workspace root
├── pnpm-workspace.yaml
├── /web                      # Astro frontend
│   ├── astro.config.mjs
│   ├── tsconfig.json
│   ├── package.json
│   └── src/
│       ├── lib/
│       │   ├── sanity.ts     # Sanity client config
│       │   └── queries.ts    # GROQ queries
│       ├── pages/
│       │   └── test.astro    # Temporary, deleted after Phase 2
│       ├── layouts/
│       └── components/
└── /studio                   # Sanity Studio v3
    ├── sanity.config.ts
    ├── sanity.cli.ts
    ├── tsconfig.json
    ├── package.json
    └── schemas/
        ├── index.ts
        ├── singletons/
        │   └── siteSettings.ts
        └── documents/
            ├── page.ts
            ├── project.ts
            ├── testimonial.ts
            ├── client.ts
            └── service.ts
```

## 6. Content schema

### 6.1 Schema overview

| Type | Kind | Purpose |
|---|---|---|
| `siteSettings` | Singleton | Global brand metadata, contact info, social links |
| `page` | Document | Static pages (About, Contact, future legal pages) |
| `project` | Document | Portfolio entries (video and photo work) |
| `service` | Document | Video, Photography, Design (and future additions) |
| `client` | Document | Past clients, with logo and optional case study link |
| `testimonial` | Document | Quotes from clients, optionally tied to a project |

Demo Reel is intentionally **not** its own type. It is a curated subset of `project` documents flagged with `featuredOnReel: true` plus a field on `siteSettings` for the primary reel video. This keeps the schema lean and avoids duplicating video data.

### 6.2 Schema details

#### siteSettings (singleton)

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | "Sharp by Tony" |
| `tagline` | string | yes | Default: existing tagline |
| `description` | text | yes | Default site meta description |
| `logo` | image | yes | Alt text required |
| `favicon` | image | yes | |
| `defaultOgImage` | image | yes | Used when a page has no specific OG image |
| `contactEmail` | string | yes | Validated as email |
| `contactPhone` | string | yes | E.164 format recommended |
| `address` | object | no | Locality + region only, no street (Tony works on location) |
| `socialLinks` | array of `{ platform, url }` | no | Platform from enum: facebook, instagram, linkedin, vimeo, youtube |
| `primaryReelVideo` | object | no | `{ provider, url, posterFrame }` for Demo Reel page hero |
| `serviceArea` | array of strings | no | "London, ON", "Southwestern Ontario", etc. Used for local SEO copy and structured data later |

**Brand naming flag:** `title` is set as "Sharp by Tony" by decision. If the Mexipinomedia question is unresolved, do not seed real content here. Resolve first.

#### page

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | |
| `slug` | slug | yes | Source: title |
| `heroHeading` | string | yes | |
| `heroSubheading` | text | no | |
| `body` | Portable Text | no | |
| `seo` | object | yes | `metaTitle`, `metaDescription`, `ogImage`, `noIndex` |

Initial seed: About, Contact, Privacy (placeholder).

#### project

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | |
| `slug` | slug | yes | |
| `client` | reference → client | no | Optional in case of personal/spec work |
| `vertical` | string (enum) | yes | construction, lifestyle, luxury, other |
| `service` | reference → service | yes | Video, Photo, Design |
| `mediaType` | string (enum) | yes | video, photo, mixed |
| `thumbnail` | image | yes | Hotspot enabled, alt required |
| `gallery` | array of images | no | For photo projects |
| `videoEmbed` | object | no | `{ provider: vimeo|youtube, url, posterFrame }` |
| `shortDescription` | text | no | Used on grid cards |
| `body` | Portable Text | no | Long-form case study copy |
| `featured` | boolean | no | Default false |
| `featuredOnReel` | boolean | no | Default false. Powers Demo Reel page |
| `publishedAt` | datetime | yes | Default now |
| `order` | number | no | Manual sort override |
| `seo` | object | no | Same shape as `page.seo` |

Validation: if `mediaType` is `video` or `mixed`, `videoEmbed` is required. If `mediaType` is `photo`, `gallery` requires at least one image.

#### service

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | "Video Production", "Photography", "Design" |
| `slug` | slug | yes | |
| `summary` | text | yes | Short blurb for service cards |
| `body` | Portable Text | no | Long-form description |
| `icon` | image or string | no | Defer choice until UI phase |
| `order` | number | yes | Priority order: video=1, photo=2, design=3 |
| `seo` | object | no | |

Note: This type is here to support future per-vertical landing pages (e.g., Construction Video Production in London, ON) without a schema change. Combined with `project.vertical`, it gives us the base for service-area pages.

#### client

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | |
| `logo` | image | yes | Alt required |
| `website` | url | no | |
| `featured` | boolean | no | For logo strip on home page |
| `order` | number | no | |

#### testimonial

| Field | Type | Required | Notes |
|---|---|---|---|
| `quote` | text | yes | |
| `authorName` | string | yes | |
| `authorRole` | string | no | |
| `authorCompany` | string | no | |
| `relatedClient` | reference → client | no | |
| `relatedProject` | reference → project | no | |
| `featured` | boolean | no | |
| `order` | number | no | |

### 6.3 Schema rules and guardrails

- All image fields must have `alt` as a required sub-field. Hotspot enabled where the image will be cropped.
- Slugs auto-generated from title with manual override allowed.
- Singletons (`siteSettings`) configured with structure-builder so they cannot be duplicated or deleted.
- Schemas are locked once Phase 2 ships. Changes after content exists require a deliberate migration plan.

## 7. GROQ queries

Written in `/web/src/lib/queries.ts`, one named export per query. Minimum set for Phase 2 testing:

- `siteSettingsQuery` (singleton fetch)
- `allProjectsQuery` (sorted by order, then publishedAt desc)
- `projectsByVerticalQuery` (parameterized)
- `featuredProjectsQuery`
- `reelProjectsQuery` (where `featuredOnReel == true`)
- `projectBySlugQuery` (parameterized)
- `allServicesQuery`
- `pageBySlugQuery` (parameterized)
- `featuredClientsQuery`
- `featuredTestimonialsQuery`

Each query must project only the fields needed (no `...` wildcard) to keep payloads tight.

## 8. Phased execution plan

This phase plan is the working sequence for Claude Code. Each phase ends in a fresh session with a clear context reset.

### Phase 0: Decisions before code

- Confirm brand naming (Sharp by Tony vs. Mexipinomedia in metadata)
- Confirm hosting (Netlify default)
- Confirm pnpm vs npm
- Confirm whether Tailwind is in scope for scaffolding or deferred to UI phase (recommendation: defer, but install `@astrojs/tailwind` integration as a stub so the UI phase can opt in without retro fitting)

### Phase 1: Repo and framework

1. Scaffold pnpm monorepo with `/web` (Astro) and `/studio` (Sanity)
2. Run `/init` in Claude Code, generate and review `CLAUDE.md`
3. Initialize Sanity project, capture project ID and dataset name
4. Set up `.env.example` and `.gitignore`
5. Verify both workspaces build and run independently

### Phase 2: Schemas and data layer

1. Implement all schemas in `/studio/schemas/` per section 6
2. Configure Studio structure builder for singletons
3. Deploy Studio to sanity.io
4. Manually seed 2 to 3 dummy documents per type via Studio UI
5. Install and configure Sanity client in `/web`
6. Write all GROQ queries from section 7
7. Build temporary `/web/src/pages/test.astro` that renders raw JSON for each query
8. Verify all data flows. Delete test page only once verified.

### Phase 4 (partial): Guardrails

1. Finalize `CLAUDE.md` with locked rules (alt text required, no hardcoded colours, schemas locked, etc.)
2. Document deploy commands in `README.md`
3. Configure Netlify build settings and a deploy preview branch
4. Set environment variables in Netlify dashboard
5. Confirm a successful deploy preview from the test page before deletion

Phase 3 (UI build) starts in a separate engagement.

## 9. Open questions and risks

| Item | Risk level | Resolution path |
|---|---|---|
| Brand naming: Sharp by Tony vs. Mexipinomedia in title, OG, and social handles | High | Decision required from Tony before `siteSettings` is seeded with real content |
| Tailwind in scaffolding scope or deferred | Low | Recommend defer, install integration stub |
| Visual preview / Sanity Presentation tool in Astro | Medium | Acceptable to defer to Phase 3 if it slows down scaffolding |
| Service tiers, packages, pricing | Medium | Schema does not currently model these. Flag for Tony to decide if pricing transparency is part of the rebuild scope |
| Demo Reel as singleton vs. derived view | Resolved | Derived view via `project.featuredOnReel` plus `siteSettings.primaryReelVideo` |
| Local SEO landing pages (e.g., Video Production London ON) | Medium | Schema supports this via `service` + `project.vertical`. Page build is out of scope here |
| Contact form handling | Deferred | Decision needed in Phase 3: Netlify Forms vs. Sanity webhook vs. third party |
| Image storage limits on Sanity free tier | Low | Monitor in Phase 3 once real assets are uploaded |
| Tony's Studio training and editorial UX | Medium | Plan a Loom walkthrough at end of Phase 3, not earlier |

## 10. Acceptance criteria

Scaffolding is complete when all of the following are true:

1. `pnpm install` at the repo root installs both workspaces without error
2. `pnpm --filter web dev` starts the Astro dev server
3. `pnpm --filter studio dev` starts Sanity Studio locally
4. Sanity Studio is deployed and accessible at a `*.sanity.studio` URL
5. All schemas in section 6 exist, are typed, and pass Sanity's schema validation
6. At least 2 to 3 dummy documents per type exist in the production dataset
7. The temporary test page in `/web` renders data from every GROQ query in section 7
8. A Netlify deploy preview successfully builds from the main branch
9. `CLAUDE.md` exists, has been reviewed by William, and includes the locked rules from section 4.2 and section 6.3
10. No secrets are committed to the repo. `.env.example` is present and correct.
11. `README.md` documents local dev setup, deploy commands, and where to get the env vars

Once all 11 are checked, the scaffolding phase is signed off and Phase 3 (UI build) can begin.
