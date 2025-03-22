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
        },
        severity: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
        sensor: {
          temperature: '#FF6384',
          humidity: '#36A2EB',
          luminosity: '#FFCE56',
          pressure: '#10B981',
        }
      }
    },
  },
  plugins: [],
}

