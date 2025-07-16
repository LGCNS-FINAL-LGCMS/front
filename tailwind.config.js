// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        english: ["RedHatDisplay", "sans-serif"],
        korean: ["KoPubWorldDotumMedium", "sans-serif"],
      },
    },
  },
  plugins: [],
};
