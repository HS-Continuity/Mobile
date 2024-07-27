/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      minHeight: {
        screen: ["100vh", "calc(var(--vh, 1vh) * 100)"],
      },
      width: {
        "full-important": "100% !important", // !important 추가
      },
      backgroundImage: {
        "gradient-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
        "green-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%), #00835F",
      },
    },
  },
  plugins: [daisyui],
};
