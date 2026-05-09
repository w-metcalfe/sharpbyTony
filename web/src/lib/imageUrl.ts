const PROJECT_ID = import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? 'tusnc4rf'
const DATASET = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production'

type AssetRef = { _ref: string }
type ImageWithAsset = { asset: AssetRef }

/**
 * Builds a Sanity CDN image URL from an asset reference.
 * Ref format: image-{hash}-{w}x{h}-{ext}
 */
export function imageUrl(
  image: ImageWithAsset,
  opts: { width?: number; height?: number; quality?: number } = {},
): string {
  const ref = image.asset._ref.replace(/^image-/, '')
  const parts = ref.split('-')
  const ext = parts.pop()
  const dims = parts.pop()
  const hash = parts.join('-')

  let url = `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${hash}-${dims}.${ext}`

  const params = new URLSearchParams()
  if (opts.width) params.set('w', String(opts.width))
  if (opts.height) params.set('h', String(opts.height))
  if (opts.width || opts.height) params.set('fit', 'crop')
  params.set('auto', 'format')
  if (opts.quality) params.set('q', String(opts.quality))

  const qs = params.toString()
  return qs ? `${url}?${qs}` : url
}

