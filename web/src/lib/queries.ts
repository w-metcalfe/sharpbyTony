import groq from 'groq'

// ---------------------------------------------------------------------------
// Shared primitive types
// ---------------------------------------------------------------------------

type SanityImageRef = {
  _type: 'reference'
  _ref: string
}

type SanityHotspot = {x: number; y: number; height: number; width: number}
type SanityCrop = {top: number; bottom: number; left: number; right: number}

/** Image without cropping (logos, favicons, OG images used at full dimensions) */
export type SanityImage = {
  asset: SanityImageRef
  alt: string
}

/** Image where hotspot/crop data may be present (thumbnails, gallery, client logos) */
export type SanityImageCroppable = SanityImage & {
  hotspot?: SanityHotspot
  crop?: SanityCrop
}

export type VideoEmbed = {
  provider: 'vimeo' | 'youtube'
  url: string
  posterFrame?: SanityImageCroppable
}

export type Seo = {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
  noIndex?: boolean
}

export type SlugValue = {current: string}

/**
 * Minimal Portable Text block type for scaffolding.
 * Replace with `PortableTextBlock` from `@portabletext/types` in Phase 3
 * when the renderer component is added.
 */
export type PortableTextBlock = {
  _type: string
  _key: string
  style?: string
  listItem?: string
  level?: number
  children?: Array<{_type: 'span'; _key: string; text: string; marks: string[]}>
  markDefs?: Array<{_type: string; _key: string; href?: string; blank?: boolean}>
}

// ---------------------------------------------------------------------------
// Query result types
// ---------------------------------------------------------------------------

export type SiteSettings = {
  title: string
  tagline: string
  heroBody?: string
  description: string
  logo: SanityImage
  favicon: SanityImage
  defaultOgImage: SanityImage
  contactEmail: string
  contactPhone: string
  address?: {locality?: string; region?: string}
  socialLinks?: Array<{platform: string; url: string}>
  primaryReelVideo?: VideoEmbed
  serviceArea?: string[]
}

export type ProjectCard = {
  _id: string
  title: string
  slug: SlugValue
  vertical: 'construction' | 'lifestyle' | 'luxury' | 'other'
  mediaType: 'video' | 'photo' | 'mixed'
  thumbnail: SanityImageCroppable
  shortDescription?: string
  featured: boolean
  featuredOnReel: boolean
  publishedAt: string
  client?: {name: string}
  service?: {title: string; slug: SlugValue}
}

export type ReelProject = {
  _id: string
  title: string
  slug: SlugValue
  thumbnail: SanityImageCroppable
  videoEmbed?: VideoEmbed
  shortDescription?: string
}

export type ProjectDetail = {
  _id: string
  title: string
  slug: SlugValue
  vertical: 'construction' | 'lifestyle' | 'luxury' | 'other'
  mediaType: 'video' | 'photo' | 'mixed'
  thumbnail: SanityImageCroppable
  gallery?: SanityImageCroppable[]
  videoEmbed?: VideoEmbed
  shortDescription?: string
  body?: PortableTextBlock[]
  featured: boolean
  featuredOnReel: boolean
  publishedAt: string
  client?: {_id: string; name: string; logo: SanityImage; website?: string}
  service?: {_id: string; title: string; slug: SlugValue}
  seo?: Seo
}

export type Service = {
  _id: string
  title: string
  slug: SlugValue
  summary: string
  icon?: string
  order: number
}

export type Page = {
  _id: string
  title: string
  slug: SlugValue
  heroHeading: string
  heroSubheading?: string
  body?: PortableTextBlock[]
  seo: Seo
}

export type FeaturedClient = {
  _id: string
  name: string
  logo: SanityImageCroppable
  website?: string
}

export type FeaturedTestimonial = {
  _id: string
  quote: string
  authorName: string
  authorRole?: string
  authorCompany?: string
  relatedClient?: {name: string}
  relatedProject?: {title: string; slug: SlugValue}
}

// ---------------------------------------------------------------------------
// GROQ queries
// ---------------------------------------------------------------------------

/** Global brand metadata, contact info, and social links. */
export const siteSettingsQuery = groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    title,
    tagline,
    heroBody,
    description,
    logo { asset, alt },
    favicon { asset, alt },
    defaultOgImage { asset, alt },
    contactEmail,
    contactPhone,
    address { locality, region },
    socialLinks[] { platform, url },
    primaryReelVideo { provider, url, posterFrame { asset, alt, hotspot, crop } },
    serviceArea
  }
`

/** All projects sorted by manual order, then newest first. */
export const allProjectsQuery = groq`
  *[_type == "project"] | order(order asc, publishedAt desc) {
    _id,
    title,
    slug,
    vertical,
    mediaType,
    thumbnail { asset, alt, hotspot, crop },
    shortDescription,
    featured,
    featuredOnReel,
    publishedAt,
    client->{ name },
    service->{ title, slug }
  }
`

/** Projects filtered by vertical. Pass `{ vertical: "construction" }` etc. */
export const projectsByVerticalQuery = groq`
  *[_type == "project" && vertical == $vertical] | order(order asc, publishedAt desc) {
    _id,
    title,
    slug,
    vertical,
    mediaType,
    thumbnail { asset, alt, hotspot, crop },
    shortDescription,
    featured,
    featuredOnReel,
    publishedAt,
    client->{ name },
    service->{ title, slug }
  }
`

/** Projects flagged as featured, sorted by manual order then newest first. */
export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(order asc, publishedAt desc) {
    _id,
    title,
    slug,
    vertical,
    mediaType,
    thumbnail { asset, alt, hotspot, crop },
    shortDescription,
    featured,
    featuredOnReel,
    publishedAt,
    client->{ name },
    service->{ title, slug }
  }
`

/** Projects included in the Demo Reel, sorted by manual order then newest first. */
export const reelProjectsQuery = groq`
  *[_type == "project" && featuredOnReel == true] | order(order asc, publishedAt desc) {
    _id,
    title,
    slug,
    thumbnail { asset, alt, hotspot, crop },
    videoEmbed { provider, url, posterFrame { asset, alt, hotspot, crop } },
    shortDescription
  }
`

/** Full project detail by slug. Pass `{ slug: "project-slug" }`. Returns null if not found. */
export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    vertical,
    mediaType,
    thumbnail { asset, alt, hotspot, crop },
    gallery[] { asset, alt, hotspot, crop },
    videoEmbed { provider, url, posterFrame { asset, alt, hotspot, crop } },
    shortDescription,
    body,
    featured,
    featuredOnReel,
    publishedAt,
    client->{ _id, name, logo { asset, alt }, website },
    service->{ _id, title, slug },
    seo { metaTitle, metaDescription, ogImage { asset, alt }, noIndex }
  }
`

/** All services sorted by priority order. */
export const allServicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    slug,
    summary,
    icon,
    order
  }
`

/** Static page by slug. Pass `{ slug: "about" }`. Returns null if not found. */
export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    heroHeading,
    heroSubheading,
    body,
    seo { metaTitle, metaDescription, ogImage { asset, alt }, noIndex }
  }
`

/** Clients flagged as featured for the home-page logo strip, sorted by manual order. */
export const featuredClientsQuery = groq`
  *[_type == "client" && featured == true] | order(order asc) {
    _id,
    name,
    logo { asset, alt, hotspot, crop },
    website
  }
`

/** Testimonials flagged as featured, sorted by manual order. */
export const featuredTestimonialsQuery = groq`
  *[_type == "testimonial" && featured == true] | order(order asc) {
    _id,
    quote,
    authorName,
    authorRole,
    authorCompany,
    relatedClient->{ name },
    relatedProject->{ title, slug }
  }
`
