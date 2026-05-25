import {StarIcon} from '@sanity/icons'
import {defineField, defineArrayMember, defineType} from 'sanity'

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
      validation: (Rule) =>
        Rule.required().custom(async (slug, context) => {
          if (!slug?.current) return true
          const client = context.getClient({apiVersion: '2026-04-26'})
          const id = context.document?._id?.replace(/^drafts\./, '')
          const count = await client.fetch<number>(
            `count(*[_type == "service" && slug.current == $slug && _id != $id])`,
            {slug: slug.current, id},
          )
          return count === 0 || 'A service with this slug already exists'
        }),
    }),
    defineField({
      name: 'navLabel',
      title: 'Nav Dropdown Label',
      type: 'string',
      description: 'Optional short label for the header dropdown. Falls back to a derived label from the title if empty.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Video', value: 'video'},
          {title: 'Photography', value: 'photography'},
          {title: 'Design', value: 'design'},
        ],
        layout: 'radio',
      },
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
      name: 'whyChooseUsBody',
      title: 'Why Choose Us — Body',
      type: 'portableText',
      description: 'Two paragraphs shown in the "Why Choose Us" section on the service detail page.',
    }),
    defineField({
      name: 'whyChooseUsPortrait',
      title: 'Why Choose Us — Portrait',
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
    }),
    defineField({
      name: 'whyChooseUsHeading',
      title: 'Why Choose Us — Heading',
      type: 'string',
      description: 'E.g. "Why Choose Us for Wedding Videography?" — defaults to that pattern if left blank.',
    }),
    defineField({
      name: 'benefitsHeading',
      title: 'Benefits — Section Heading',
      type: 'string',
      description: 'Heading shown above the benefits grid. Defaults to "The Benefits" if left blank.',
    }),
    defineField({
      name: 'processHeading',
      title: 'Process — Section Heading',
      type: 'string',
      description: 'Heading for the process steps section. Defaults to "VIDEO PROCESS" if blank.',
    }),
    defineField({
      name: 'processIntro',
      title: 'Process — Intro Text',
      type: 'text',
      rows: 2,
      description: 'Optional short intro shown below the process heading.',
    }),
    defineField({
      name: 'processSteps',
      title: 'Process Steps',
      type: 'array',
      description: 'Exactly 3 steps recommended. Each has a label, body, and optional image.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'processStep',
          fields: [
            defineField({
              name: 'label',
              title: 'Step Label',
              type: 'string',
              description: 'Short all-caps label, e.g. "DETAILED PLAN"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Image',
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
            }),
          ],
          preview: {select: {title: 'label', media: 'image'}},
        }),
      ],
    }),
    defineField({
      name: 'testimonialsHeading',
      title: 'Testimonials — Section Heading',
      type: 'string',
      description: 'Heading shown above the testimonials grid. Defaults to "Testimonials" if blank.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
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
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'benefitItem',
          fields: [
            defineField({
              name: 'headline',
              title: 'Headline',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'SVG path data — leave blank to use the default icon for this position',
            }),
          ],
          preview: {select: {title: 'headline'}},
        }),
      ],
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'question'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'order'},
    prepare({title, subtitle}) {
      return {title, subtitle: subtitle !== undefined ? `Order: ${subtitle}` : ''}
    },
  },
})
