/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ecff',
          200: '#badbff',
          300: '#86c0ff',
          400: '#4fa0ff',
          500: '#1f7aff',
          600: '#0f5ae0',
          700: '#1346ad',
          800: '#183a88',
          900: '#162f69'
        },
        ink: {
          950: '#0f1728',
        },
        sand: {
          50: '#fcfaf7',
          100: '#f5f0e8',
          200: '#ece2d3',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 70px rgba(15, 23, 42, 0.12)',
        panel: '0 18px 50px rgba(15, 23, 42, 0.08)',
        glow: '0 24px 60px rgba(15, 90, 224, 0.18)',
      }
    },
  },
  darkMode: 'class',
  plugins: [],
};
