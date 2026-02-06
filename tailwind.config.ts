import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: "#F9F3E8", 100: "#F9F3E8", 200: "#EFE6D5" },
        charcoal: { DEFAULT: "#1A2E2E", light: "#2F4545" },
        gold: { DEFAULT: "#E89B6E", hover: "#D68A5C" },
        // BROCHURE TRACK COLORS
        track: {
          1: "#4A90E2", // Networking (Blue)
          2: "#9013FE", // IoT (Purple)
          3: "#F5A623", // Software (Orange)
          4: "#7ED321", // NLP (Green)
          5: "#BD10E0", // AI/ML (Deep Pink/Magenta)
          6: "#50E3C2", // Algorithms (Teal)
          7: "#B8E986", // Signal (Light Green)
          8: "#D0021B", // Big Data (Red)
          9: "#9B9B9B", // Emerging (Grey)
        }
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;