/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          500: '#6366F1',
          600: '#4F46E5', // Primary brand color
          700: '#4338CA',
          800: '#3730A3',
          900: '#1E1B4B',
        },
        obsidian: {
          950: '#070A10',
          900: '#0B0F19',
          850: '#0F1524',
          800: '#141D30',
          700: '#1E293B',
          600: '#334155',
        },
        canvas: '#0B0F19',
        card: '#111827',
        subtle: '#1E293B',
        content: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
