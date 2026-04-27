// @ts-check
import {defineConfig} from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import {fileURLToPath} from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~/styles': path.resolve(__dirname, 'src/styles'),
        '~/lib': path.resolve(__dirname, 'src/lib'),
        '~/components': path.resolve(__dirname, 'src/components'),
        '~/layouts': path.resolve(__dirname, 'src/layouts'),
        '~/pages': path.resolve(__dirname, 'src/pages'),
      },
    },
  },
})
