/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0A1929',
        'cyber-darker': '#061018',
        'cyber-blue': '#00F0FF',
        'cyber-purple': '#BD00FF',
        'cyber-red': '#FF0055',
        'cyber-green': '#00FF88',
        severity: {
          low: '#00FF88',
          medium: '#FFB800',
          high: '#FF0055',
          critical: '#FF0000'
        }
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'cyber-grid': '20px 20px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};