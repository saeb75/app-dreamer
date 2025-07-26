/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        main: {
          primary: '#191A25',
          secondary: '#000000',
          textColor: '#000000',
          backgroundColor: '#000000',
          accent: '#000000',
        },
      },
    },
  },
  plugins: [],
};
