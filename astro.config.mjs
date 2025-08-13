// @ts-check
import preact from '@astrojs/preact'
import tailwind from '@astrojs/tailwind'
import icon from 'astro-icon'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  // @ts-ignore
  integrations: [tailwind(), preact({ compat: true }), icon()],
  devToolbar: { enabled: false },
  site: 'http://www.anmpog.dev',
  markdown: {
    shikiConfig: {
      theme: 'everforest-dark',
    },
  },
})
