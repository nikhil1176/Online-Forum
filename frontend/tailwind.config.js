/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This tells Tailwind to scan all your component files
  ],
  theme: {
    extend: {colors: {
    primary: "#3b82f6",
    accent: "#8b5cf6",
    success: "#10b981",
    danger: "#ef4444",
    card: "#ffffff",
    bgSoft: "#f1f5f9",
  }},
  },
  plugins: [],
  
}