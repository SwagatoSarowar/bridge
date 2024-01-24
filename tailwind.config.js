/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: "'Roboto', sans-serif",
      },
      backgroundImage: {
        "registration-img": "url('assets/bridge-img-1.jpg')",
        "login-img": "url('assets/bridge-img-2.jpg')",
        "forgotpassword-img": "url('assets/bridge-img-3.jpg')",
      },
      colors: {
        "light-400": "#E4E6EB",
        "light-500": "#3E3F41",
        "dark-100": "#4E4F50",
        "dark-200": "#3A3B3C",
        "dark-300": "#242526",
        "dark-400": "#18191A",
      },
    },
  },
  plugins: [],
};
