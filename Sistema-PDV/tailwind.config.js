/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5f5',
          100: '#ffe0e0',
          200: '#ffc1c1',
          300: '#ffa3a3',
          400: '#ff8585',
          500: '#ff6666',
          600: '#e64c4c',
          700: '#cc3333',
          800: '#b31a1a',
          900: '#990000',
        },
        brand: {
          light: '#fff5f5',
          DEFAULT: '#cc3333',
          dark: '#990000',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        }
      },
      backgroundImage: {
        'red-gradient': 'linear-gradient(135deg, #cc3333 0%, #ffffff 100%)',
        'red-gradient-reversed': 'linear-gradient(135deg, #ffffff 0%, #cc3333 100%)',
        'red-gradient-subtle': 'linear-gradient(135deg, #990000 0%, #fff5f5 100%)',
        'red-gradient-intense': 'linear-gradient(135deg, #800000 0%, #ff3333 100%)',
        'red-gradient-dark': 'linear-gradient(135deg, #660000 0%, #cc3333 100%)',
        'red-gradient-vibrant': 'linear-gradient(135deg, #ff0000 0%, #ffcccc 100%)',
        'red-gradient-glass': 'linear-gradient(135deg, rgba(204, 51, 51, 0.9) 0%, rgba(255, 255, 255, 0.9) 100%)',
      },
      boxShadow: {
        'red-sm': '0 1px 2px 0 rgba(204, 51, 51, 0.05)',
        'red-md': '0 4px 6px -1px rgba(204, 51, 51, 0.1), 0 2px 4px -1px rgba(204, 51, 51, 0.06)',
        'red-lg': '0 10px 15px -3px rgba(204, 51, 51, 0.1), 0 4px 6px -2px rgba(204, 51, 51, 0.05)',
        'red-xl': '0 20px 25px -5px rgba(204, 51, 51, 0.1), 0 10px 10px -5px rgba(204, 51, 51, 0.04)',
        'red-2xl': '0 25px 50px -12px rgba(204, 51, 51, 0.25)',
        'red-inner': 'inset 0 2px 4px 0 rgba(204, 51, 51, 0.06)',
      },
      borderColor: {
        'red-default': '#cc3333',
      },
      ringColor: {
        'red-default': '#cc3333',
      }
    },
  },
  plugins: [],
}
