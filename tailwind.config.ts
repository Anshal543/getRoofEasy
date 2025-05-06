/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // border: "var(--border-color, #d1d5db)",
        outline: "var(--outline-color, #0ea5e9)",
        error: "var(--error-color, #ef4444)",
        mint: {
          500: "oklch(0.72 0.11 178)",
        },

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        destructive: "hsl(var(--destructive))",
      },
      backgroundColor: {
        dark: {
          gray: "var(--gray-800)",
        },
      },
    },
  },
  plugins: [],
};
