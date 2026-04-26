# Sharp by Tony

Website rebuild — Astro + Sanity v3 + Netlify.

## Setup

**Prerequisites:** Node 22+ and pnpm 10+.

```bash
# Install all workspace dependencies from repo root
pnpm install

# Copy env template and fill in values
cp web/.env.example web/.env.local
```

Open `web/.env.local` and populate:
- `PUBLIC_SANITY_PROJECT_ID` — from [manage.sanity.io](https://manage.sanity.io)
- `PUBLIC_SANITY_DATASET` — `production` for live, `development` for testing
- `SANITY_API_READ_TOKEN` — create a read-only token in Sanity → API → Tokens

The write token (`SANITY_API_WRITE_TOKEN`) lives in root `.env.local` and is only used for Studio deploys — never add it to `web/.env.local`.

## Local dev

```bash
# Run both workspaces in parallel
pnpm dev

# Or run individually
pnpm --filter web dev       # Astro at http://localhost:4321
pnpm --filter studio dev    # Sanity Studio at http://localhost:3333
```

Other useful commands:

```bash
pnpm build        # Build both workspaces
pnpm lint         # ESLint across both workspaces
pnpm format       # Prettier across both workspaces
pnpm typecheck    # TypeScript check across both workspaces
```

## Deploy

**Frontend (Netlify):**

Netlify deploys automatically on push to `main`. Set the following in Netlify → Site settings → Environment variables:
- `PUBLIC_SANITY_PROJECT_ID`
- `PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN`

Build command: `pnpm --filter web build`  
Publish directory: `web/dist`

**Sanity Studio:**

```bash
# Deploy Studio to *.sanity.studio (from repo root)
pnpm --filter studio deploy
```

Studio URL is set during first deploy and stored in `studio/sanity.cli.ts`.
