import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Party colors
        ldp: "#e31e26",
        chudou: "#00a0e9",
        ishin: "#38b649",
        dpfp: "#f39800",
        sanseito: "#ff6600",
        jcp: "#c71c22",
        reiwa: "#ed6d9b",
      },
      fontFamily: {
        sans: ["Noto Sans JP", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
