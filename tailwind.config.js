/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        twitter: "#1DA1F2",
        "twitter-dark": "#15202B",
        "twitter-light": "#F5F8FA",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
