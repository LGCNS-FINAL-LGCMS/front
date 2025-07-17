// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        spin: {
          to: {
            transform: "rotate(360deg)",
          },
        },
        ping: {
          "75%, 100%": {
            transform: "scale(2)",
            opacity: "0",
          },
        },
        pulse: {
          "50%": {
            opacity: "0.5",
          },
        },
        bounce: {
          "0%, 100%": {
            transform: "translateY(-15%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "none",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
      },
      animation: {
        spin: "spin 4s linear infinite",
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 1s infinite",
      },
      colors: {
        primary: "#56abb0",
        secondary: "#428386ff",
        grayBorder: "#a7a7a7ff",
        lightGray: "#e2e2e2ff",
        lightMint: "#BAD4D4",
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
