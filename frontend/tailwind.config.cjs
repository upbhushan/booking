/**** Tailwind Config ****/ 
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1e76d9',
          dark: '#1559a3',
          light: '#e6f2fc'
        }
      }
    },
  },
  plugins: [],
};
