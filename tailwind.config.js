// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#56abb0",
        secondary: "#428386ff",
        accent: "#F59E0B",
        danger: "#EF4444",
        brand: {
          light: "#93C5FD",
          DEFAULT: "#3B82F6", // 기본값
          dark: "#1E3A8A",
        },
      },
      fontFamily: {
        english: ["RedHatDisplay", "sans-serif"],
        korean: ["KoPubWorldDotumMedium", "sans-serif"],
      },
    },
  },
  plugins: [],
};
