/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'
import { addIconSelectors } from '@iconify/tailwind'
import plugin from 'tailwindcss/plugin'

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        body: ['Open Sans', ...defaultTheme.fontFamily.sans],
        heading: ['Merriweather', ...defaultTheme.fontFamily.serif],
        monospace: ['Menlo', ...defaultTheme.fontFamily.mono],
        logo: ['Calistoga', ...defaultTheme.fontFamily.serif],
      },
      colors: {
        text: '#0A0A0A',
        background: '#23242b',
        primary: '#EE562F',
        'light-primary': '#F17455',
        secondary: '#F2AF29',
        'light-secondary': '#F5BE51',
        muted: '#E0E0CE',
        gray: '#3D3D3D',
        darken: '#E0E0CE',
        'dark-card': '#424349',
      },
      container: {
        center: true,
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    addIconSelectors(['ion']),
    plugin(function ({ addVariant }) {
      addVariant(
        'prose-inline-code',
        '&.prose :where(:not(pre)>code):not(:where([class~="not-prose"] *))'
      )
    }),
  ],
}
