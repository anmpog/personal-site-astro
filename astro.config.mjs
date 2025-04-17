// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import preact from '@astrojs/preact'
import icon from 'astro-icon'

// https://astro.build/config
export default defineConfig({
  // @ts-ignore
  vite: { plugins: [tailwindcss()] },
  integrations: [preact({ compat: true }), icon()],
  devToolbar: { enabled: false },
  markdown: {
    shikiConfig: {
      theme: 'dracula',
    },
  },
})
