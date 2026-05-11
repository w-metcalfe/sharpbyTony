import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'tusnc4rf',
    dataset: 'production',
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    appId: 'ehucwwugnu709jbnfcjgbvrf',
  },
  typegen: {
    path: '../web/src/**/*.{ts,tsx,astro}',
    schema: 'schema.json',
    generates: '../web/src/sanity.types.ts',
  },
})
