/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'base' : '0 3px 30px 0 rgba(141,168,232,0.47)',
        'input' : '0 3px 30px 0 #8DA8E8',
      },
      colors: {
        'primary': '#D0CFEE',
        'secondary': '#8B8FD5',
        'tertiary': '#8DA8E8',
      },
        fontFamily: {
            'cofo': ['cofo-sans-variable', 'sans-serif'],
        }
    },
  },
  plugins: [],
}
