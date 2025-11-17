/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0b0c10',
          800: '#1a1c23',
          700: '#2a2d3a',
        },
        blue: {
          400: '#4dabf7',
          500: '#339af0',
          600: '#228be6',
        }
      }
    },
  },
  plugins: [],
}
