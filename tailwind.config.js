/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        apple: {
          gray: {
            50: "#fafafa",
            100: "#f5f5f5",
            200: "#e5e5e5",
            300: "#d4d4d4",
            400: "#a3a3a3",
            500: "#737373",
            600: "#525252",
            700: "#404040",
            750: "#363636",
            800: "#262626",
            900: "#171717",
          },
          blue: {
            50: "#eff6ff",
            500: "#3b82f6",
            600: "#2563eb",
            700: "#1d4ed8",
          },
        },
      },
      fontFamily: {
        apple: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        apple: "0 4px 20px -2px rgba(0, 0, 0, 0.1)",
        "apple-lg": "0 8px 30px -4px rgba(0, 0, 0, 0.15)",
        book: "0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 12px -4px rgba(0, 0, 0, 0.05)",
      },
      backdropBlur: {
        apple: "20px",
      },
    },
  },
  plugins: [],
};
