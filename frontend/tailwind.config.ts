import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05070B",
          900: "#0A0F18",
          850: "#0D1420",
          800: "#151F2F"
        },
        line: "#223047",
        teal: "#29D3B5",
        sky: "#56B6FF",
        amber: "#F2B84B",
        rose: "#FF6B8A",
        violet: "#9B8CFF"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(41, 211, 181, 0.12)",
        panel: "inset 0 1px 0 rgba(255,255,255,0.05), 0 18px 60px rgba(0,0,0,0.28)"
      }
    }
  },
  plugins: []
};

export default config;
