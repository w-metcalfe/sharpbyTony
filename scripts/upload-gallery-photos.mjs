/**
 * Uploads photos from docs/photos/ to Sanity and patches each photo project's thumbnail.
 * Photos are sorted numerically and mapped to projects sorted by order asc.
 *
 * Run from repo root:
 *   node scripts/upload-gallery-photos.mjs
 */

import {createClient} from '../web/node_modules/@sanity/client/dist/index.cjs'
import {createReadStream, readdirSync, statSync} from 'fs'
import {resolve, join, basename} from 'path'

const PROJECT_ID = 'tusnc4rf'
const DATASET = 'production'
// Use stored CLI auth token
const AUTH_TOKEN = 'skzWUJzKTCajImxti6BFQKRNwqkGmKGYAh1avbdsICGatKDLUrJngzQCKqwcXCIJ02KEgfvpttYcK8b86'

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: AUTH_TOKEN,
  useCdn: false,
})

const PHOTOS_DIR = resolve('./docs/photos')

function numericSortKey(filename) {
  const match = filename.match(/-(\d+)\.jpg$/)
  return match ? parseInt(match[1], 10) : 0
}

async function main() {
  // 1. Get all photo projects sorted by order
  const projects = await client.fetch(
    `*[_type == "project" && mediaType == "photo"] | order(order asc, publishedAt desc) { _id, title, order }`,
  )
  console.log(`Found ${projects.length} photo projects`)

  // 2. Sort photos: no-number file first (order 0), then by number
  const files = readdirSync(PHOTOS_DIR)
    .filter((f) => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'))
    .sort((a, b) => numericSortKey(a) - numericSortKey(b))

  console.log(`Found ${files.length} photos:`)
  files.forEach((f, i) => console.log(`  ${i + 1}. ${f}`))

  if (files.length !== projects.length) {
    console.warn(`⚠️  Photo count (${files.length}) doesn't match project count (${projects.length})`)
  }

  const count = Math.min(files.length, projects.length)

  // 3. Upload each photo and patch the corresponding project
  for (let i = 0; i < count; i++) {
    const filename = files[i]
    const project = projects[i]
    const filePath = join(PHOTOS_DIR, filename)

    console.log(`\n[${i + 1}/${count}] Uploading "${filename}" → project "${project.title}" (${project._id})`)

    const asset = await client.assets.upload('image', createReadStream(filePath), {
      filename,
      contentType: 'image/jpeg',
    })

    console.log(`  ✓ Asset uploaded: ${asset._id}`)

    await client.patch(project._id).set({
      thumbnail: {
        _type: 'image',
        asset: {_type: 'reference', _ref: asset._id},
        alt: project.title,
      },
    }).commit()

    console.log(`  ✓ Project patched`)
  }

  console.log(`\n✅ Done — updated ${count} photo project thumbnails`)
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
