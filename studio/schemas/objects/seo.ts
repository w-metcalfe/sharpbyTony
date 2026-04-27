import {defineField, defineType} from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'string',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      type: 'image',
      options: {hotspot: false},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) =>
            Rule.custom((alt, context) => {
              if (context.parent && (context.parent as {asset?: unknown}).asset) {
                return alt ? true : 'Alt text is required when an OG image is set'
              }
              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
