import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './schemas'
import {structure} from './structure'
import {resolve} from './lib/resolve'

export default defineConfig({
  name: 'default',
  title: 'Sharp by Tony',

  projectId: 'tusnc4rf',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    visionTool(),
    presentationTool({
      resolve,
      previewUrl: {
        initial: 'http://localhost:4321',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
