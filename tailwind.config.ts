import { type Config } from "tailwindcss";
import daisyUI from "daisyui";
import typography from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {},
  daisyui: {
    themes: ["pastel"],
  },
  plugins: [daisyUI, typography],
} satisfies Config;
