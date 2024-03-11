/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        "1/10": "5%",
        "15/100": "15%",
      },
    },
  },
  plugins: [],
};
