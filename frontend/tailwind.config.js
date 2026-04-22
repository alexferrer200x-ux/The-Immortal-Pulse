/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary-blue': '#3b82f6',
        'primary-blue-dark': '#2563eb',
        'primary-blue-light': '#60a5fa',
        'gold': '#fbbf24',
        'gold-dark': '#f59e0b',
        'gold-light': '#fcd34d',
      },
      fontFamily: {
        'display': ['Dosis', 'sans-serif'],
        'body': ['Montserrat', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
