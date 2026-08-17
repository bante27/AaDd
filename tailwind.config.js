/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#030712',
          card: '#0f172a',
          neon: '#06b6d4',
          purple: '#8b5cf6',
          pink: '#ec4899',
        }
      },
      boxShadow: {
        'neon': '0 0 20px rgba(6, 182, 212, 0.3)',
        'neon-pink': '0 0 20px rgba(236, 72, 153, 0.3)',
        'neon-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
      }
    },
  },
  plugins: [],
}
