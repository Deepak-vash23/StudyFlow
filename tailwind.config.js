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
