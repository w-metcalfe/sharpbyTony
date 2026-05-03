import {defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    siteSettings: defineLocations({
      select: {title: 'title'},
      resolve: () => ({
        locations: [
          {title: 'Home', href: '/'},
          {title: 'About', href: '/about'},
          {title: 'Video', href: '/videos'},
        ],
      }),
    }),
    project: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title ?? 'Untitled', href: `/projects/${doc?.slug}`},
          {title: 'Home', href: '/'},
        ],
      }),
    }),
    service: defineLocations({
      select: {title: 'title'},
      resolve: () => ({
        locations: [{title: 'Home', href: '/'}],
      }),
    }),
    page: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [{title: doc?.title ?? 'Untitled', href: `/${doc?.slug}`}],
      }),
    }),
    client: defineLocations({
      select: {name: 'name'},
      resolve: () => ({
        locations: [{title: 'Home', href: '/'}],
      }),
    }),
    testimonial: defineLocations({
      select: {authorName: 'authorName'},
      resolve: () => ({
        locations: [{title: 'Home', href: '/'}],
      }),
    }),
  },
}
