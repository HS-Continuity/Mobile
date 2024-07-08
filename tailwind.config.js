/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      minHeight: {
        screen: ["100vh", "calc(var(--vh, 1vh) * 100)"],
      },
    },
  },
  plugins: [daisyui],
};
