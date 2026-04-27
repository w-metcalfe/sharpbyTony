import {defineField, defineType} from 'sanity'

export const pageType = defineType({
  name: 'page',
  title: 'Page',
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
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      // JC #10: standard decorators + link annotation; no custom blocks at this stage
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
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      // JC #11: object is required but its sub-fields are individually optional
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
    prepare({title, subtitle}) {
      return {title, subtitle: subtitle ? `/${subtitle}` : ''}
    },
  },
})
