// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', // for Next.js 13+
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rubik', 'sans-serif'], // Makes Rubik the default sans font
        rubik: ['Rubik', 'sans-serif'], // Optional: Create a custom font class
      },
    },
  },
  plugins: [],
};
