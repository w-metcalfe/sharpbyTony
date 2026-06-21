import type {APIRoute} from 'astro'
import {sanityFetch} from '~/lib/sanity'
import {defineQuery} from 'groq'

const SERVICE_SLUGS_QUERY = defineQuery(`
  *[_type == "service" && defined(slug.current)] {
    "slug": slug.current,
    category
  }
`)

const STATIC_URLS = [
  {loc: 'https://sharpbytony.com/', priority: '1.0'},
  {loc: 'https://sharpbytony.com/about', priority: '0.8'},
  {loc: 'https://sharpbytony.com/videos', priority: '0.9'},
  {loc: 'https://sharpbytony.com/photography', priority: '0.9'},
  {loc: 'https://sharpbytony.com/demo-reel', priority: '0.7'},
]

export const GET: APIRoute = async () => {
  const services = await sanityFetch<Array<{slug: string; category: string}>>(
    SERVICE_SLUGS_QUERY,
  ).catch(() => [] as Array<{slug: string; category: string}>)

  const serviceEntries = services.map(({slug, category}) => {
    const prefix = category === 'photography' ? 'photography' : 'video'
    return {loc: `https://sharpbytony.com/${prefix}/${slug}`, priority: '0.8'}
  })

  const allEntries = [...STATIC_URLS, ...serviceEntries]

  const urlset = allEntries
    .map(
      ({loc, priority}) =>
        `  <url>\n    <loc>${loc}</loc>\n    <priority>${priority}</priority>\n  </url>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
