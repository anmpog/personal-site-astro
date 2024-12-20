/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["Open Sans", ...defaultTheme.fontFamily.sans],
        heading: ["Merriweather", ...defaultTheme.fontFamily.serif],
        monospace: ["Menlo", ...defaultTheme.fontFamily.mono],
        logo: ["Calistoga", ...defaultTheme.fontFamily.serif],
      },
      colors: {
        text: "#0A0A0A",
        background: "#23242b",
        primary: "#EE562F",
        lightPrimary: "#F17455",
        secondary: "#F2AF29",
        lightSecondary: "#F5BE51",
        muted: "#E0E0CE",
        gray: "#3D3D3D",
        darken: "#E0E0CE",
        darkCard: "#424349",
      },
      container: {
        center: true
      }
    },
  },
  plugins: [],
};
