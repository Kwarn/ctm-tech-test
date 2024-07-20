/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1a3ddc",
        "primary-text": "#171b27",
        "primary-hover": "#2c4be7",
      },
    },
  },
  plugins: [],
};
