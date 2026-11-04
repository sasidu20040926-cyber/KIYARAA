
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: "#B45D36",
        blush: "#E9A17C",
        cream: "#F8F1E9",
        sage: "#DCE4D6",
        sagedark: "#A85D37",
        soft: "#FFFCF8",
        cocoa: "#49372F",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Jost", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
