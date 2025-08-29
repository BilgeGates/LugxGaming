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
        fadeInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.3s ease forwards",
        fadeInLeft: "fadeInLeft 0.4s ease forwards",
        fadeInRight: "fadeInRight 0.4s ease forwards",
        scaleIn: "scaleIn 0.3s ease forwards",
        slideUp: "slideUp 0.5s ease forwards",
        glow: "glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
      animationDelay: {
        50: "50ms",
        100: "100ms",
        150: "150ms",
        200: "200ms",
        250: "250ms",
        300: "300ms",
        350: "350ms",
        400: "400ms",
        450: "450ms",
        500: "500ms",
        600: "600ms",
        700: "700ms",
        800: "800ms",
        900: "900ms",
        1000: "1000ms",
      },
      backdropBlur: {
        xs: "2px",
      },
      colors: {
        game: {
          primary: "#06b6d4",
          secondary: "#8b5cf6",
          accent: "#f59e0b",
          dark: "#0f172a",
          light: "#f8fafc",
        },
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
    },
  },
  plugins: [
    function ({ addUtilities, addComponents, theme }) {
      const delays = {
        ".delay-50": { "animation-delay": "50ms" },
        ".delay-100": { "animation-delay": "100ms" },
        ".delay-150": { "animation-delay": "150ms" },
        ".delay-200": { "animation-delay": "200ms" },
        ".delay-250": { "animation-delay": "250ms" },
        ".delay-300": { "animation-delay": "300ms" },
        ".delay-350": { "animation-delay": "350ms" },
        ".delay-400": { "animation-delay": "400ms" },
        ".delay-450": { "animation-delay": "450ms" },
        ".delay-500": { "animation-delay": "500ms" },
        ".delay-600": { "animation-delay": "600ms" },
        ".delay-700": { "animation-delay": "700ms" },
        ".delay-800": { "animation-delay": "800ms" },
        ".delay-900": { "animation-delay": "900ms" },
        ".delay-1000": { "animation-delay": "1000ms" },
      };

      const gameUtilities = {
        ".glass-card": {
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "1rem",
        },
        ".glass-card-hover": {
          transition: "all 0.3s ease",
          "&:hover": {
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.1))",
            border: "1px solid rgba(255,255,255,0.2)",
            transform: "scale(1.02)",
          },
        },

        ".glow-cyan": {
          boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)",
        },
        ".glow-purple": {
          boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
        },
        ".glow-hover": {
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow:
              "0 0 30px rgba(6, 182, 212, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)",
          },
        },

        ".text-gradient-primary": {
          background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        },
        ".text-gradient-secondary": {
          background: "linear-gradient(135deg, #f59e0b, #ef4444)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        },

        ".btn-game-primary": {
          background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
          color: "white",
          padding: "0.75rem 1.5rem",
          borderRadius: "0.5rem",
          fontWeight: "600",
          transition: "all 0.3s ease",
          "&:hover": {
            background: "linear-gradient(135deg, #0891b2, #7c3aed)",
            transform: "translateY(-2px)",
            boxShadow: "0 10px 20px rgba(6, 182, 212, 0.3)",
          },
        },
        ".btn-game-secondary": {
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "white",
          padding: "0.75rem 1.5rem",
          borderRadius: "0.5rem",
          fontWeight: "600",
          transition: "all 0.3s ease",
          "&:hover": {
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))",
            transform: "translateY(-2px)",
          },
        },

        ".category-badge": {
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "0.75rem",
          padding: "0.5rem 1rem",
          transition: "all 0.3s ease",
          "&:hover": {
            background:
              "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(139,92,246,0.2))",
            border: "1px solid rgba(6,182,212,0.3)",
            transform: "scale(1.05)",
          },
        },

        ".masonry-item": {
          breakInside: "avoid",
          marginBottom: "2rem",
          width: "100%",
        },

        ".hover-lift": {
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          },
        },
        ".hover-scale": {
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        },

        ".skeleton": {
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 2s infinite",
        },
      };

      const gameComponents = {
        ".game-section": {
          position: "relative",
          minHeight: "700px",
          overflow: "hidden",
          paddingTop: "5rem",
          paddingBottom: "5rem",
        },
        ".game-container": {
          position: "relative",
          zIndex: "10",
          maxWidth: "80rem",
          margin: "0 auto",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        },
        ".game-grid": {
          display: "grid",
          gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
          gap: "2rem",
          "@screen sm": {
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          },
          "@screen lg": {
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          },
        },
        ".game-grid-masonry": {
          columns: "1",
          gap: "2rem",
          "@screen sm": {
            columns: "2",
          },
          "@screen lg": {
            columns: "4",
          },
        },
      };

      const shimmerKeyframes = {
        "@keyframes shimmer": {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
      };

      addUtilities(delays);
      addUtilities(gameUtilities);
      addUtilities(shimmerKeyframes);
      addComponents(gameComponents);
    },
  ],
};
