/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // We will import a nice font in CSS
        romantic: ['"Great Vibes"', 'cursive'], 
        body: ['"Montserrat"', 'sans-serif'],
      },
      colors: {
        love: '#ff4d6d',
        deep: '#590d22',
      }
    },
  },
  plugins: [],
}