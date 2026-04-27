import {defineField, defineType} from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
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
      name: 'client',
      title: 'Client',
      type: 'reference',
      to: [{type: 'client'}],
    }),
    defineField({
      name: 'vertical',
      title: 'Vertical',
      type: 'string',
      options: {
        list: [
          {title: 'Construction', value: 'construction'},
          {title: 'Lifestyle', value: 'lifestyle'},
          {title: 'Luxury', value: 'luxury'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'service',
      title: 'Service',
      type: 'reference',
      to: [{type: 'service'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          {title: 'Video', value: 'video'},
          {title: 'Photo', value: 'photo'},
          {title: 'Mixed', value: 'mixed'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
      // Conditional: required when mediaType is 'photo'
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document as {mediaType?: string} | undefined
          if (doc?.mediaType === 'photo') {
            const arr = value as unknown[] | undefined
            return arr && arr.length > 0
              ? true
              : 'At least one gallery image is required for photo projects'
          }
          return true
        }),
    }),
    defineField({
      name: 'videoEmbed',
      title: 'Video Embed',
      type: 'videoEmbed',
      // Conditional: required when mediaType is 'video' or 'mixed'
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document as {mediaType?: string} | undefined
          if (doc?.mediaType === 'video' || doc?.mediaType === 'mixed') {
            return value ? true : 'videoEmbed is required when mediaType is video or mixed'
          }
          return true
        }),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      description: 'Shown on grid cards',
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
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'featuredOnReel',
      title: 'Featured on Demo Reel',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      // JC #12: default to current time for new documents
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      // JC #13: no min/max — unconstrained manual sort override
      description: 'Manual sort override. Lower numbers appear first.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'thumbnail',
      subtitle: 'vertical',
    },
  },
})
