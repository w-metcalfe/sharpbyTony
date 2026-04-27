import {seoType} from './objects/seo'
import {videoEmbedType} from './objects/videoEmbed'
import {siteSettingsType} from './singletons/siteSettings'
import {clientType} from './documents/client'
import {serviceType} from './documents/service'
import {projectType} from './documents/project'
import {pageType} from './documents/page'
import {testimonialType} from './documents/testimonial'

// Objects first (referenced by document schemas), singleton, then documents
export const schemaTypes = [
  seoType,
  videoEmbedType,
  siteSettingsType,
  clientType,
  serviceType,
  projectType,
  pageType,
  testimonialType,
]
