/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f6ff',
          100: '#e0edff',
          200: '#c7ddff',
          300: '#a3c7ff',
          400: '#78a6ff',
          500: '#4d7fff',
          600: '#3355ff',
          700: '#2b43eb',
          800: '#2636bd',
          900: '#253494',
        },
        secondary: {
          50: '#f4f7fb',
          100: '#e9eff7',
          200: '#cedeed',
          300: '#a4c3dd',
          400: '#74a2c9',
          500: '#5285b5',
          600: '#406b98',
          700: '#35567b',
          800: '#2f4866',
          900: '#2b3e56',
        }
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },
  plugins: [],
};