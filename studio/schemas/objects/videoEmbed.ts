import {defineField, defineType} from 'sanity'

export const videoEmbedType = defineType({
  name: 'videoEmbed',
  title: 'Video Embed',
  type: 'object',
  fields: [
    defineField({
      name: 'provider',
      title: 'Provider',
      type: 'string',
      options: {
        list: [
          {title: 'Vimeo', value: 'vimeo'},
          {title: 'YouTube', value: 'youtube'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({scheme: ['https', 'http']}),
    }),
    defineField({
      name: 'posterFrame',
      title: 'Poster Frame',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) =>
            Rule.custom((alt, context) => {
              if (context.parent && (context.parent as {asset?: unknown}).asset) {
                return alt ? true : 'Alt text is required for the poster frame image'
              }
              return true
            }),
        }),
      ],
    }),
  ],
})
