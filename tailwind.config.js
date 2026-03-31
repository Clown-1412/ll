/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // From theme.js palette
        primary: '#d9534f',
        gray: {
          100: '#f8f9fa',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
        // Theme specific colors from lightTheme
        background: '#f8f9fa',
        card: '#ffffff',
        text: '#212529',
        textSecondary: '#6c757d',
        border: '#dee2e6',
        notification: '#d9534f',
        // from colors.ts
        lighter: '#F3F3F3',
        light: '#DAE1E7',
        dark: '#444444',
        darker: '#222222',
      },
      spacing: {
        'xs': '4px',
        's': '8px',
        'm': '16px',
        'l': '24px',
        'xl': '40px',
      }
    },
  },
  plugins: [],
};
