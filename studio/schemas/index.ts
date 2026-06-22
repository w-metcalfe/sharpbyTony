import {portableTextType} from './objects/portableText'
import {seoType} from './objects/seo'
import {videoEmbedType} from './objects/videoEmbed'
import {homePageType} from './singletons/homePage'
import {siteSettingsType} from './singletons/siteSettings'
import {clientType} from './documents/client'
import {serviceType} from './documents/service'
import {projectType} from './documents/project'
import {pageType} from './documents/page'
import {testimonialType} from './documents/testimonial'
import {blogPostType} from './documents/blog'

// Objects first (referenced by document schemas), singletons, then documents
export const schemaTypes = [
  portableTextType,
  seoType,
  videoEmbedType,
  homePageType,
  siteSettingsType,
  clientType,
  serviceType,
  projectType,
  pageType,
  testimonialType,
  blogPostType,
]
