// @ts-check
import {defineConfig} from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import {fileURLToPath} from 'url'
import path from 'path'
import netlify from '@astrojs/netlify'
import react from '@astrojs/react'
import sanity from '@sanity/astro'
import sitemap from '@astrojs/sitemap'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// projectId and dataset are not secrets — same values as in studio/sanity.config.ts
const SANITY_PROJECT_ID = 'tusnc4rf'
const SANITY_DATASET = 'production'
const SANITY_STUDIO_URL = process.env.PUBLIC_SANITY_STUDIO_URL ?? 'http://localhost:3333'

// https://astro.build/config
export default defineConfig({
  site: 'https://sharpbytony.com',
  output: 'server',
  adapter: netlify(),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/thank-you') && !page.includes('/api/'),
    }),
    react(),
    sanity({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      useCdn: false,
      apiVersion: '2026-04-26',
      stega: {
        studioUrl: SANITY_STUDIO_URL,
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~/styles': path.resolve(__dirname, 'src/styles'),
        '~/lib': path.resolve(__dirname, 'src/lib'),
        '~/components': path.resolve(__dirname, 'src/components'),
        '~/layouts': path.resolve(__dirname, 'src/layouts'),
        '~/pages': path.resolve(__dirname, 'src/pages'),
      },
    },
  },
})
