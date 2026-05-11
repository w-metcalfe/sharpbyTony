import {HomeIcon} from '@sanity/icons'
import {defineField, defineArrayMember, defineType} from 'sanity'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'heroKicker',
      title: 'Hero Kicker',
      type: 'string',
      description: 'Short label above the headline, e.g. "VIDEO | PHOTO | DESIGN"',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Main headline displayed in the hero card (h1)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroBody',
      title: 'Hero Body Copy',
      type: 'text',
      rows: 3,
      description: 'Short paragraph displayed in the hero card, below the tagline.',
    }),
    defineField({
      name: 'heroCta',
      title: 'CTA Button Label',
      type: 'string',
      description: 'Primary call-to-action button label, e.g. "Book Your Shoot"',
    }),
    defineField({
      name: 'heroBackground',
      title: 'Hero Background Image',
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
      description: 'Full-width background image for the homepage hero section',
    }),
    defineField({
      name: 'aboutHeading',
      title: 'About Section Heading',
      type: 'string',
    }),
    defineField({
      name: 'aboutBody',
      title: 'About Body Copy',
      type: 'text',
      rows: 5,
      description: 'Main body paragraphs for the About section. Separate paragraphs with a blank line.',
    }),
    defineField({
      name: 'aboutQuote',
      title: 'About Pull Quote',
      type: 'text',
      rows: 2,
      description: 'Blockquote displayed in the About section',
    }),
    defineField({
      name: 'aboutPortrait',
      title: 'About — Portrait Photo',
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
      description: "Tony's portrait used in the About section (home) and About page",
    }),
    defineField({
      name: 'primaryReelVideo',
      title: 'Primary Reel Video',
      type: 'videoEmbed',
      description: 'Hero video used on the home page Demo Reel section and the Demo Reel page',
    }),
    defineField({
      name: 'projectsHeading',
      title: 'Projects Section Heading',
      type: 'string',
    }),
    defineField({
      name: 'projectsSubheading',
      title: 'Projects Section Subheading',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'testimonialsHeading',
      title: 'Testimonials Section Heading',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Home Page'}
    },
  },
})
