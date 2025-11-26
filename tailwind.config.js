/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a5f',
        secondary: '#2c5282',
        accent: '#d4af37',
        surface: '#ffffff',
        background: '#f7fafc',
        success: '#38a169',
        warning: '#dd6b20',
        error: '#e53e3e',
        info: '#3182ce',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 16px rgba(0,0,0,0.12)',
        'lg': '0 8px 16px rgba(0,0,0,0.12)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '96': '24rem',
      },
    },
  },
  plugins: [],
}