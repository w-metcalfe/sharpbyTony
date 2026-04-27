import {defineField, defineType} from 'sanity'

export const serviceType = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
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
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
              {title: 'Underline', value: 'underline'},
              {title: 'Strike', value: 'strike-through'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (Rule) =>
                      Rule.required().uri({scheme: ['https', 'http', 'mailto', 'tel']}),
                  }),
                  defineField({
                    name: 'blank',
                    title: 'Open in new tab',
                    type: 'boolean',
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        },
      ],
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
