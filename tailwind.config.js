/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dq: {
          dark: '#4c5a70',
          accent: '#8cd4ff',
          light: '#f4f6fa',
          hover: '#64748b',
          blue: '#1e40af',
          bg: '#f8fafc',
        }
      }
    },
  },
  plugins: [],
}

