/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Main HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // All JavaScript/TypeScript files in src
    "./components/**/*.{html,js}", // All HTML and JS files in components
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}" // Flowbite components
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // Main brand color (blue)
        secondary: '#FBBF24', // Accent color (yellow)
        background: '#F3F4F6', // Light background color
        card: '#FFFFFF', // Card background color
        sidebar: {
          light: '#E5E7EB', // Light sidebar background
          DEFAULT: '#374151', // Default sidebar color
          dark: '#1F2937' // Dark sidebar color for dark mode
        },
        dashboard: {
          primary: '#3B82F6', // Dashboard primary color
          secondary: '#FBBF24', // Dashboard secondary color
          accent: '#34D399' // Dashboard accent color
        },
      },
    },
  },
  plugins: [
    require('flowbite/plugin') // Include Flowbite plugin for additional components
  ],
};