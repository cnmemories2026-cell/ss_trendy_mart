/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm Artisan Handcrafted Theme matching SS Trendy Mart Logo
        brand: {
          50: '#fffcf7',
          100: '#f7ede2',
          200: '#e8d4c1',
          300: '#d9b99b',
          400: '#b88960',
          500: '#9c6644', // Warm Handcrafted Saddle Leather
          600: '#8b5e3c', // Logo Ribbon Brown
          700: '#6e472b', // Logo Header Deep Brown
          800: '#5c3a21', // Dark Espresso Ribbon
          900: '#3e2312',
          950: '#261408',
        },
        warm: {
          50: '#fdfbf7',  // Logo Inner Circle Cream
          100: '#f8f1e5',
          200: '#eee0cb',
          300: '#e2cbac',
          400: '#d5b187',
          500: '#c49765', // Golden Honey Bear Tone
          600: '#a97a48',
          700: '#875d33',
        },
        peach: {
          50: '#fffdfa',
          100: '#f7eee1',
          200: '#eddcc5',
          300: '#dfc4a3',
        },
        cream: {
          50: '#fdfbf7',
          100: '#f9f5ed',
          200: '#f3ead8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        '3d': '0 10px 25px -5px rgba(249, 115, 22, 0.15), 0 8px 10px -6px rgba(249, 115, 22, 0.1)',
        '3d-hover': '0 20px 35px -5px rgba(234, 88, 12, 0.25), 0 10px 15px -5px rgba(234, 88, 12, 0.15)',
      }
    },
  },
  plugins: [],
}
