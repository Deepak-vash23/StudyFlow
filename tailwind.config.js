/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1', // Indigo
          600: '#4f46e5',
          700: '#4338ca',
        },
        secondary: '#ec4899', // Pink
        accent: '#8b5cf6', // Violet
        success: '#10b981', // Emerald
        warning: '#f59e0b', // Amber
        danger: '#ef4444', // Red
        background: '#f8fafc', // Slate 50
        surface: '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // We'll need to import Inter or use system
      }
    },
  },
  plugins: [],
}
