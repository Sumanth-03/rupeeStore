/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
          fontFamily: {
            sans: ['Poppins', ...defaultTheme.fontFamily.sans]
          },
          colors: {
            customGray: '#253851',
            buttonBg: '#000000',
          },
          backgroundImage: {
            // buttonBg: 'linear-gradient(to bottom, #374D6B, #1C283B)',
          },
    },
  },
  plugins: [],
});

