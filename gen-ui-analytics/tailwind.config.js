/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc6fb',
          400: '#36a9f7',
          500: '#0d8de3',
          600: '#0071e3', // Apple blue
          700: '#0058b0',
          800: '#004a91',
          900: '#003d77',
        },
        tourist: {
          600: '#8f41e9', // Purple for tourist
        },
        driver: {
          600: '#f54f7a', // Pink for driver
        },
        ev: {
          600: '#30d158', // Green for EV
        },
        car: {
          600: '#5e5ce6', // Blue for car
        },
        bike: {
          600: '#ff9f0a', // Orange for bike
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"San Francisco"',
          '"Helvetica Neue"',
          'sans-serif',
        ],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-out': 'fadeOut 1s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
