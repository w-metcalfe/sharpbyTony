import tseslint from 'typescript-eslint'
import astroPlugin from 'eslint-plugin-astro'

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.astro/**',
      '**/.sanity/**',
    ],
  },
  ...tseslint.configs.recommended,
  ...astroPlugin.configs['flat/recommended'],
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
    },
  },
)
