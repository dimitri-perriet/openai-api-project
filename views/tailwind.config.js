/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
      'base' : '0 3px 30px 0 rgba(141,168,232,0.47)',
      }
    },
  },
  plugins: [],
}
