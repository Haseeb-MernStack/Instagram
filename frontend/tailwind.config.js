/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"], // Enable dark mode based on the class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure to include all your source files
    "./node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}", // Include shadcn/ui if you're using it
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)', // Custom border radius
        md: 'calc(var(--radius) - 2px)', // Custom border radius
        sm: 'calc(var(--radius) - 4px)', // Custom border radius
      },
    },
  },
  plugins: [tailwindcssAnimate], // Add the tailwindcss-animate plugin
};
