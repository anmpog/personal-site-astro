// @ts-check
import preact from '@astrojs/preact'
import tailwind from '@astrojs/tailwind'
import icon from 'astro-icon'
import { defineConfig } from 'astro/config'
import expressiveCode from 'astro-expressive-code'

// https://astro.build/config
export default defineConfig({
  // @ts-ignore
  integrations: [
    tailwind(),
    preact({ compat: true }),
    icon(),
    expressiveCode({
      // You can use any of the themes bundled with Shiki by name,
      // specify a path to JSON theme file, or pass an instance
      // of the `ExpressiveCodeTheme` class here:
      themes: ['everforest-dark'],
      shiki: {
        // You can pass additional plugin options here,
        // e.g. to load custom language grammars:
        langs: [
          // import('./some-exported-grammar.mjs'),
          // JSON.parse(fs.readFileSync('./some-json-grammar.json', 'utf-8'))
        ],
      },
    }),
  ],
  devToolbar: { enabled: false },
  site: 'http://www.anmpog.dev',
})
