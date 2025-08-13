// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,astro,html,md,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-body)', 'sans-serif'],
        heading: ['var(--font-heading)', 'serif'],
      },
      colors: {
        text: 'var(--color-text)',
        heading: 'var(--color-heading)',
        headingLight: 'var(--color-heading-light)',
        background: 'var(--color-background)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        taupe: 'var(--color-taupe)',
      },
      fontSize: {
        // Small screen sizes
        text: ['var(--fs-small-text)', { lineHeight: '1.4' }],
        h1: ['var(--fs-small-h1)', { lineHeight: '1.1' }],
        h2: ['var(--fs-small-h2)', { lineHeight: '1.1' }],
        h3: ['var(--fs-small-h3)', { lineHeight: '1.1' }],
        h4: ['var(--fs-small-h4)', { lineHeight: '1.1' }],
        h5: ['var(--fs-small-h5)', { lineHeight: '1.1' }],
        h6: ['var(--fs-small-h6)', { lineHeight: '1.1' }],
        small: ['var(--fs-small-small)', { lineHeight: '1.4' }],
        xsmall: ['var(--fs-small-xsmall)', { lineHeight: '1.4' }],

        // Medium screen overrides
        'text-md': ['var(--fs-medium-text)', { lineHeight: '1.4' }],
        'h1-md': ['var(--fs-medium-h1)', { lineHeight: '1.1' }],
        'h2-md': ['var(--fs-medium-h2)', { lineHeight: '1.1' }],
        'h3-md': ['var(--fs-medium-h3)', { lineHeight: '1.1' }],
        'h4-md': ['var(--fs-medium-h4)', { lineHeight: '1.1' }],
        'h5-md': ['var(--fs-medium-h5)', { lineHeight: '1.1' }],
        'h6-md': ['var(--fs-medium-h6)', { lineHeight: '1.1' }],
        'small-md': ['var(--fs-medium-small)', { lineHeight: '1.4' }],
        'xsmall-md': ['var(--fs-medium-xsmall)', { lineHeight: '1.4' }],

        // Desktop overrides
        'text-lg': ['var(--fs-desktop-text)', { lineHeight: '1.4' }],
        'h1-lg': ['var(--fs-desktop-h1)', { lineHeight: '1.1' }],
        'h2-lg': ['var(--fs-desktop-h2)', { lineHeight: '1.1' }],
        'h3-lg': ['var(--fs-desktop-h3)', { lineHeight: '1.1' }],
        'h4-lg': ['var(--fs-desktop-h4)', { lineHeight: '1.1' }],
        'h5-lg': ['var(--fs-desktop-h5)', { lineHeight: '1.1' }],
        'h6-lg': ['var(--fs-desktop-h6)', { lineHeight: '1.1' }],
        'small-lg': ['var(--fs-desktop-small)', { lineHeight: '1.4' }],
        'xsmall-lg': ['var(--fs-desktop-xsmall)', { lineHeight: '1.4' }],
      },
    },
  },
  safelist: ['astro-code'],
}
