---
name: Phase 3 UI build – homepage
description: Status and design decisions from the Phase 3 homepage implementation
type: project
---

Phase 3 UI is underway. Homepage is built and rendering.

**Why:** Cloning sharpbytony.com (Wix site) onto the new Astro + Sanity stack.

**How to apply:** When continuing UI work, extend this pattern — components in `web/src/components/`, data from Sanity queries with hardcoded fallbacks, all Tailwind v4 utility classes.

## Design tokens extracted from Wix clone
- Accent/primary: `#F5C645` (golden yellow — used for headings, quote marks, CTAs, dividers)
- Dark sections: `#000000` black (hero, demo reel, project highlights, testimonials, footer)
- Light sections: `#FFFFFF` white (clients strip is yellow `#F5C645`, about section is white)
- Font: `'Helvetica Neue', Helvetica, Arial, sans-serif` — system stack, no external font loaded
- Nav: uppercase, 11px, `tracking-widest`, bold

## Files created in Phase 3
- `web/src/styles/global.css` — Tailwind v4 `@theme` tokens
- `web/src/lib/imageUrl.ts` — Sanity CDN URL builder + `WIX` constant for placeholder images
- `web/src/layouts/BaseLayout.astro` — HTML shell
- `web/src/components/Header.astro` — sticky black nav, mobile hamburger
- `web/src/components/HeroSection.astro` — full-bleed photo, dark card overlay, SVG divider
- `web/src/components/ClientsSection.astro` — yellow logo strip, 8 fallback logos
- `web/src/components/AboutSection.astro` — white section, portrait, CTA buttons
- `web/src/components/DemoReelSection.astro` — dark section, iframe or placeholder
- `web/src/components/ProjectHighlights.astro` — 3-col grid, play overlay
- `web/src/components/TestimonialsSection.astro` — dark, 3-col grid, 9 fallback quotes
- `web/src/components/ContactSection.astro` — white left info / dark right form, Netlify Forms
- `web/src/components/Footer.astro` — decorative image strip + dark bar

## Wix CDN image IDs (fallback placeholders)
- Hero bg: `c8520e_2f7c26513dcc4919abcc7e225aa6ce40~mv2.jpg`
- Logo: `c8520e_301b1a02bee3443a800790e3226eea74~mv2.png`
- About portrait: `c8520e_54104400d63f4bd7b10b4f0dfb774130~mv2.jpg`
- Footer strip: `c8520e_e436343bb7474cc8931f97c3f34aab07~mv2.jpg`

## Astro config note
`~/styles/*` alias was missing from `tsconfig.json` and `astro.config.mjs`. Both were updated to add explicit Vite `resolve.alias` entries alongside the existing `~/lib`, `~/components`, `~/layouts`, `~/pages` aliases.

## What's next for Phase 3
- Inner pages: `/about`, `/contact`, `/videos`, `/photography`, `/demo-reel`
- Populate Sanity with real content (Tony's images, settings, projects, testimonials)
- Replace Wix CDN image fallbacks with Sanity-hosted assets
- Add Sanity logo URL to Header (currently uses WIX fallback)
