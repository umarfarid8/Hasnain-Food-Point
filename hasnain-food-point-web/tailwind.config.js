/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary, #141110)",
          surface: "var(--bg-surface, #1F1B19)",
        },
        accent: {
          primary: "var(--accent-primary, #FF5A1F)",
          secondary: "var(--accent-secondary, #F4B93E)",
        },
        text: {
          primary: "var(--text-primary, #FAF6F2)",
          secondary: "var(--text-secondary, #C9C0BA)",
        },
        whatsapp: {
          DEFAULT: "var(--success-whatsapp, #25D366)",
        },
        border: {
          subtle: "var(--border-subtle, #2E2925)",
        }
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "Poppins", "system-ui", "-apple-system", "sans-serif"],
        urdu: ["'Noto Nastaliq Urdu'", "'Noto Sans Arabic'", "'Segoe UI'", "Tahoma", "sans-serif"],
      }
    },
  },
  plugins: [],
}
