/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#0056D2',
          600: '#0046AF',
          700: '#003789',
          800: '#002C6D',
          900: '#001F4D',
        }
      }
    },
  },
  plugins: [],
};