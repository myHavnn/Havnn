/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        appMain: "rgba(126, 228, 203, 1)",
        appMain50: "rgba(126, 228, 203, 0.5)",
      },
    },
  },
  plugins: [],
};
