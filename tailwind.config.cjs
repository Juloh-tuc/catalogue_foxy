/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        foxy: {
          bg: "#fff8f0", // fond crème
          orange: "#e5813e", // accent
          blue: "#191970", // texte et titres
        },
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        maeven: ["Maven Pro", "sans-serif"],
      },
    },
  },
  plugins: [],
};
