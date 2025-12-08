/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        purple: { primary: '#667eea', secondary: '#764ba2' },
        gold: { DEFAULT: '#FFD700', light: 'rgba(255, 215, 0, 0.9)', glow: 'rgba(255, 215, 0, 0.2)' },
        dark: { DEFAULT: '#0a0a0a', secondary: '#1a1a2e' },
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-purple-90': 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        'gradient-gold': 'linear-gradient(90deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 100%)',
        'gradient-gold-hover': 'linear-gradient(90deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.08) 100%)',
      },
      boxShadow: {
        'album': '0 20px 60px rgba(0, 0, 0, 0.5)',
        'gold': '0 0 20px rgba(255, 215, 0, 0.2)',
        'gold-hover': '0 0 25px rgba(255, 215, 0, 0.3)',
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: 1 },
          '50%': { transform: 'scale(1.2) rotate(10deg)', opacity: 0.8 },
        },
      },
      animation: {
        sparkle: 'sparkle 2s ease-in-out infinite',
      },
      backdropBlur: { xs: '10px' },
      screens: {
        'xl-dashboard': '1600px',
        'lg-dashboard': { 'max': '1100px' },
        'sm-dashboard': { 'max': '1280px' },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
