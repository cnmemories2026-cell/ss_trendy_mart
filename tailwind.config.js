/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SS Trendy Mart Logo Theme Palette (Chestnut Brown, Amber Gold, Vintage Cream)
        brand: {
          50: '#fdf8f2',
          100: '#f7efe5',
          200: '#eadbc8',
          300: '#d4a373',
          400: '#c49a6c',
          500: '#8c5221', 
          600: '#5c3a21', // Primary Chestnut Leather Brown (Logo Theme)
          700: '#4a2e1b',
          800: '#3d2314',
          900: '#2b1704',
          950: '#1c0d02',
        },
        gold: {
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#e09f3e',
          600: '#d4a373',
          700: '#b45309',
        },
        cream: {
          50: '#fffdf9',
          100: '#fdf8f2',
          200: '#f7efe5',
          300: '#eadbc8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
      },
      boxShadow: {
        '3d': '0 10px 25px -5px rgba(92, 58, 33, 0.15), 0 8px 10px -6px rgba(92, 58, 33, 0.1)',
        '3d-hover': '0 20px 35px -5px rgba(92, 58, 33, 0.25), 0 10px 15px -5px rgba(92, 58, 33, 0.15)',
      }
    },
  },
  plugins: [],
}
