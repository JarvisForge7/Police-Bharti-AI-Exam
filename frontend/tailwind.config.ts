/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Dark Mode Support
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#080C14', // Deep Premium Black
        cardBg: 'rgba(15, 23, 42, 0.65)', // Glassmorphic Card
        primaryBlue: '#2563EB', // Electric Blue
        glowBlue: '#3B82F6',
        accentCyan: '#06B6D4',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'blueGlow': '0 0 20px rgba(59, 130, 246, 0.4)',
        'floating': '0 10px 25px -5px rgba(37, 99, 235, 0.5)',
      },
      backdropBlur: {
        'glass': '16px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}