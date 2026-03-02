/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        bg: {
          DEFAULT: "#0D1117",
          2: "#161B22",
          3: "#1C2333",
          4: "#21262D",
        },
        border: {
          DEFAULT: "#30363D",
          2: "#21262D",
        },
        accent: {
          DEFAULT: "#58A6FF",
          2: "#1F6FEB",
        },
        text: {
          1: "#E6EDF3",
          2: "#8B949E",
          3: "#6E7681",
        },
        cs: {
          green: "#3FB950",
          red: "#FF7B72",
          orange: "#FFA657",
          purple: "#D2A8FF",
          yellow: "#E3B341",
        },
      },
    },
  },
  plugins: [],
};
