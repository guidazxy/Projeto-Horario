/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        butter: {
          50: "#fffdf5",
          100: "#fff8dc",
          200: "#ffefb0",
          300: "#ffe37a",
          400: "#ffd23f",
          500: "#f2b705",
          600: "#d99500",
          700: "#be7e00",
          800: "#a56900",
        },
        azul: {
          50: "#eff6ff",
          100: "#d1e8ff",
          200: "#a3c4ff",
          300: "#73b1ff",
          400: "#4496ff",
          500: "#1e70ff",
          600: "#1c5aba",
          700: "#1e40af",
          800: "#1e3a8a",
        },
      },
    },
  },
  plugins: [],
}