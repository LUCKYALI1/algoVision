/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // class-based dark mode
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
