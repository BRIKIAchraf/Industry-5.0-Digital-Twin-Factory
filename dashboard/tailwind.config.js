/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          900: '#0a0a0c',
          800: '#121214',
          700: '#1a1a1e',
          600: '#2d2d35',
          500: '#3f3f4a',
          blue: '#0062ff',
          green: '#00ff9d',
          red: '#ff0055',
          yellow: '#ffcc00'
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
