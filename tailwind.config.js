/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  extend: {
    animation: {
      shake: 'shake 0.5s ease-in-out',
    },
  },
}

