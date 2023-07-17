import { type Config } from "tailwindcss";
import daisyUI from "daisyui";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["pastel"],
  },
  plugins: [daisyUI],
} satisfies Config;
