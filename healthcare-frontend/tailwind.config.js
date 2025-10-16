/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Poppins',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'Noto Sans',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
        ],
      },
      colors: {
        brand: {
          indigo: {
            50: "#eef2ff",
            100: "#e0e7ff",
            600: "#4f46e5",
            700: "#4338ca",
          },
          emerald: {
            50: "#ecfdf5",
            100: "#d1fae5",
            600: "#059669",
            700: "#047857",
          }
        }
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
          xl: "2.5rem",
        }
      }
    },
  },
  plugins: [],
}
