import {defineField, defineType} from 'sanity'

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorRole',
      title: 'Author Role',
      type: 'string',
    }),
    defineField({
      name: 'authorCompany',
      title: 'Author Company',
      type: 'string',
    }),
    defineField({
      name: 'relatedClient',
      title: 'Related Client',
      type: 'reference',
      to: [{type: 'client'}],
    }),
    defineField({
      name: 'relatedProject',
      title: 'Related Project',
      type: 'reference',
      to: [{type: 'project'}],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'authorName',
      subtitle: 'authorCompany',
    },
  },
})
