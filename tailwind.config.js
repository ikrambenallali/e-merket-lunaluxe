/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        montserrat: ['"Montserrat"', 'sans-serif'], 
      },
      colors: {
        brandBrown: "#633F3B",
        brandRed: "#B5483A",
        brandSwhite: "#f1f1f1",
        brandWhite: "#fffaf9",
        l_black: "#1f1f1f",
        hoverBrandRed: "#8B2D21",
      },
    },
  },
  plugins: [],
};
