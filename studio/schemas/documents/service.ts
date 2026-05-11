import {StarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const serviceType = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'Short blurb for service cards',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      // JC #14: modelled as string (icon name/identifier); defer image vs string decision to UI phase
      description: 'Icon name or identifier — choice of icon system deferred to UI phase',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Priority order: Video = 1, Photography = 2, Design = 3',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'order'},
    prepare({title, subtitle}) {
      return {title, subtitle: subtitle !== undefined ? `Order: ${subtitle}` : ''}
    },
  },
})
