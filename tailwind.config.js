import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Landing Page colors
        'l-primary': '#6366f1',
        'l-secondary': '#a78bfa',
        'l-tertiary': '#fbbf24',
        'l-surface': '#0a0a1f',
        'l-surface-container-high': '#161635',
        'l-surface-container-low': '#0d0d29',
        'l-surface-container-lowest': '#030310',
        'l-surface-container-highest': '#1c1c44',
        'l-surface-bright': '#1e1e4a',
        'l-surface-variant': '#1c1c44',
        'l-on-surface': '#f1f5f9',
        'l-on-surface-variant': '#a5a5d9',
        'l-outline': '#4b4b7c',
        'l-outline-variant': '#2d2d5a',
        'l-background': '#050514',

        background: '#0F172A',
        surface: '#1E293B',
        card: '#1A2332',
        primary: {
          ...colors.sky,
          DEFAULT: colors.sky[400], // #38BDF8
          text: '#E2E8F0',
        },
        secondary: {
          ...colors.gray,
          DEFAULT: colors.gray[900], // #1E293B
          text: '#94A3B8',
        },
        muted: '#64748B',
        success: '#22C55E',
        error: '#EF4444', // "Failed"
        warning: '#F59E0B',
        info: '#38BDF8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}
