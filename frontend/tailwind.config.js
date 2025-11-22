/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10b981',
        'primary-dark': '#059669',
        secondary: '#3b82f6',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#6366f1',
        success: '#10b981',
        dark: '#0f172a',
        darker: '#020617',
        light: '#e2e8f0',
        lighter: '#f8fafc',
        gray: '#64748b',
        'gray-light': '#94a3b8',
        'gray-dark': '#475569',
        border: '#334155',
      },
    },
  },
  plugins: [],
}