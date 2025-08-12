/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.3s ease forwards",
      },
      animationDelay: {
        50: "50ms",
        100: "100ms",
        150: "150ms",
        200: "200ms",
        250: "250ms",
        300: "300ms",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const delays = {
        ".delay-50": { "animation-delay": "50ms" },
        ".delay-100": { "animation-delay": "100ms" },
        ".delay-150": { "animation-delay": "150ms" },
        ".delay-200": { "animation-delay": "200ms" },
        ".delay-250": { "animation-delay": "250ms" },
        ".delay-300": { "animation-delay": "300ms" },
      };
      addUtilities(delays);
    },
  ],
};
