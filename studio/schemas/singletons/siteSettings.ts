import {defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Default Meta Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: false},
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
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      options: {hotspot: false},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          // JC #5: global rule — alt required on all image fields
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default OG Image',
      type: 'image',
      options: {hotspot: false},
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
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      // JC #6: regex email validation (no built-in email type in Sanity)
      validation: (Rule) =>
        Rule.required().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
          name: 'email',
        }).error('Must be a valid email address'),
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
      // JC #7: E.164 recommended via hint, not enforced strictly to reduce author friction
      description: 'Recommended: E.164 format, e.g. +15199027253',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      // JC #8: field names match schema.org PostalAddress — locality + region
      fields: [
        defineField({
          name: 'locality',
          title: 'City / Town',
          type: 'string',
          description: 'e.g. London',
        }),
        defineField({
          name: 'region',
          title: 'Province / State',
          type: 'string',
          description: 'e.g. ON',
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'Vimeo', value: 'vimeo'},
                  {title: 'YouTube', value: 'youtube'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) =>
                Rule.required().uri({scheme: ['https', 'http']}),
            }),
          ],
          preview: {
            select: {title: 'platform', subtitle: 'url'},
          },
        },
      ],
    }),
    defineField({
      name: 'primaryReelVideo',
      title: 'Primary Reel Video',
      type: 'videoEmbed',
      description: 'Hero video used on the Demo Reel page',
    }),
    defineField({
      name: 'serviceArea',
      title: 'Service Area',
      type: 'array',
      of: [{type: 'string'}],
      description: 'e.g. "London, ON", "Southwestern Ontario" — used for local SEO copy',
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title ?? 'Site Settings'}
    },
  },
})
