/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Add this line for class-based dark mode
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
          // Add dark mode variants
          dark: {
            50: '#082f49',
            100: '#0c4a6e',
            200: '#075985',
            300: '#0ea5e9',
            400: '#38bdf8',
            500: '#7dd3fc',
            600: '#bae6fd',
            700: '#e0f2fe',
            800: '#f0f9ff',
            900: '#f8fafc',
          }
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
          // Add dark mode variants
          dark: {
            50: '#1e293b',
            100: '#334155',
            200: '#475569',
            300: '#64748b',
            400: '#94a3b8',
            500: '#cbd5e1',
            600: '#e2e8f0',
            700: '#f1f5f9',
            800: '#f8fafc',
            900: '#ffffff',
          }
        }
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
      // Add dark mode variants for other utilities
      backgroundColor: ({ theme }) => ({
        ...theme('colors'),
        'dark-main': '#0f172a',
        'dark-secondary': '#1e293b',
      }),
      textColor: ({ theme }) => ({
        ...theme('colors'),
        'dark-main': '#f8fafc',
        'dark-secondary': '#94a3b8',
      }),
    },
  },
  plugins: [],
};