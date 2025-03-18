/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto Variable", "sans-serif"],
      },
      colors: {
        main: "#005100",
        mainLight: "#4CAF50",
        mainMidium: "#2E8B57",
        accent: "#6495ED",
        gray1: "#F8F8F8",
        gray2: "#D3D3D3",
        gray3: "#A9A9A9",
        gray4: "#696969",
        gray5: "#2F4F4F",
        error: "#E57373",
        warning: "#FFB300",
        info: "#81D4FA",
      },
    },
  },
  plugins: [],
};
