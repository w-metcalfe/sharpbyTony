import {defineQuery} from 'groq'

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

/** Global brand metadata, contact info, and social links. */
export type SiteSettings = {
  title: string
  description: string
  logo: SanityImage
  favicon: SanityImage
  defaultOgImage: SanityImage
  contactEmail: string
  contactPhone: string
  contactHeading?: string
  address?: {locality?: string; region?: string}
  socialLinks?: Array<{platform: string; url: string}>
  serviceArea?: string[]
  footerBackground?: SanityImageCroppable
}

/** Home page specific content. */
export type HomePage = {
  heroKicker?: string
  tagline?: string
  heroBody?: string
  heroCta?: string
  heroBackground?: SanityImageCroppable
  aboutHeading?: string
  aboutBody?: string
  aboutQuote?: string
  aboutPortrait?: SanityImageCroppable
  primaryReelVideo?: VideoEmbed
  projectsHeading?: string
  projectsSubheading?: string
  testimonialsHeading?: string
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
  kicker?: string
  heroBackground?: SanityImageCroppable
  portrait?: SanityImageCroppable
  processStepImages?: SanityImageCroppable[]
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
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    title,
    description,
    logo { asset, alt },
    favicon { asset, alt },
    defaultOgImage { asset, alt },
    contactEmail,
    contactPhone,
    contactHeading,
    address { locality, region },
    socialLinks[] { platform, url },
    serviceArea,
    footerBackground { asset, alt, hotspot, crop }
  }
`)

/** Home page specific content — hero, about section, projects, testimonials headings. */
export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage" && _id == "homePage"][0] {
    heroKicker,
    tagline,
    heroBody,
    heroCta,
    heroBackground { asset, alt, hotspot, crop },
    aboutHeading,
    aboutBody,
    aboutQuote,
    aboutPortrait { asset, alt, hotspot, crop },
    primaryReelVideo { provider, url, posterFrame { asset, alt, hotspot, crop } },
    projectsHeading,
    projectsSubheading,
    testimonialsHeading
  }
`)

/** All projects sorted by manual order, then newest first. */
export const ALL_PROJECTS_QUERY = defineQuery(`
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
`)

/** Projects filtered by vertical. Pass `{ vertical: "construction" }` etc. */
export const PROJECTS_BY_VERTICAL_QUERY = defineQuery(`
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
`)

/** Projects flagged as featured, sorted by manual order then newest first. */
export const FEATURED_PROJECTS_QUERY = defineQuery(`
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
`)

/** Projects included in the Demo Reel, sorted by manual order then newest first. */
export const REEL_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && featuredOnReel == true] | order(order asc, publishedAt desc) {
    _id,
    title,
    slug,
    thumbnail { asset, alt, hotspot, crop },
    videoEmbed { provider, url, posterFrame { asset, alt, hotspot, crop } },
    shortDescription
  }
`)

/** Full project detail by slug. Pass `{ slug: "project-slug" }`. Returns null if not found. */
export const PROJECT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    vertical,
    mediaType,
    thumbnail { asset, alt, hotspot, crop },

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
`)

/** All services sorted by priority order. */
export const ALL_SERVICES_QUERY = defineQuery(`
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    slug,
    summary,
    icon,
    order
  }
`)

/** Static page by slug. Pass `{ slug: "about" }`. Returns null if not found. */
export const PAGE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    heroHeading,
    heroSubheading,
    kicker,
    heroBackground { asset, alt, hotspot, crop },
    portrait { asset, alt, hotspot, crop },
    processStepImages[] { asset, alt, hotspot, crop },
    body,
    seo { metaTitle, metaDescription, ogImage { asset, alt }, noIndex }
  }
`)

/** Clients flagged as featured for the home-page logo strip, sorted by manual order. */
export const FEATURED_CLIENTS_QUERY = defineQuery(`
  *[_type == "client" && featured == true] | order(order asc) {
    _id,
    name,
    logo { asset, alt, hotspot, crop },
    website
  }
`)

/** All photo-type projects sorted by manual order then newest first. */
export const PHOTO_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && mediaType == "photo"] | order(order asc, publishedAt desc) {
    _id,
    title,
    slug,
    vertical,
    mediaType,
    thumbnail { asset, alt, hotspot, crop },
    shortDescription,
    featured,
    publishedAt,
    client->{ name },
    service->{ title, slug }
  }
`)

/** All video-type projects sorted by manual order then newest first. */
export const VIDEO_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && mediaType == "video"] | order(order asc, publishedAt desc) {
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
`)

/** Testimonials flagged as featured, sorted by manual order. */
export const FEATURED_TESTIMONIALS_QUERY = defineQuery(`
  *[_type == "testimonial" && featured == true] | order(order asc) {
    _id,
    quote,
    authorName,
    authorRole,
    authorCompany,
    relatedClient->{ name },
    relatedProject->{ title, slug }
  }
`)
