/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      backgroundColor:{
        "darkBlue": "#15202b",
        "blueSoft": "#192734"
      }
    },
  },
  plugins: [],
}

