/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8FBC8FFF',
          prime: '#34d399',
        },
        secondary: {
          DEFAULT: '#2C3E50FF',
          soft: '#405a73',
        }
      }
    },
  },
  plugins: [],
}

