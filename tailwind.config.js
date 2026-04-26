/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/page-components/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/context/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Light luxury palette */
        ivory: '#F7F4EE',
        'ivory-2': '#F2EEE7',
        'ivory-3': '#EAE4DA',
        stone: '#E0D8CC',
        charcoal: '#2A2521',
        'charcoal-2': '#3D3730',
        dark: '#F2EEE7',        /* alias for section backgrounds */
        'dark-2': '#EAE4DA',    /* alias for card surfaces */
        'dark-3': '#E0D8CC',    /* alias for borders */
        surface: '#F7F4EE',
        border: '#E0D8CC',
        orange: {
          DEFAULT: '#E8651A',
          light: '#FF7A2F',
          dark: '#C4531A',
          glow: 'rgba(232,101,26,0.12)',
        },
        cream: '#F7F4EE',
        'soft-white': '#2A2521', /* inverted — used for text in old dark theme */
        muted: 'rgba(42,37,33,0.5)',
        'muted-2': 'rgba(42,37,33,0.35)',
      },
      fontFamily: {
        display: ['Rubik', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '7xl': ['4.5rem', { lineHeight: '1.05' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '0.95' }],
      },
      letterSpacing: {
        widest: '0.25em',
        'ultra': '0.35em',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
        'fade-in': 'fadeIn 1s ease forwards',
        'slide-in-right': 'slideInRight 0.8s ease forwards',
        'slide-in-left': 'slideInLeft 0.8s ease forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-orange': 'pulseOrange 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'line-grow': 'lineGrow 1.2s ease forwards',
        'counter': 'counter 2s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseOrange: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(232,101,26,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(232,101,26,0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        lineGrow: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'orange-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(232,101,26,0.3) 50%, transparent 100%)',
      },
      boxShadow: {
        'orange-sm': '0 0 15px rgba(232,101,26,0.2)',
        'orange-md': '0 0 30px rgba(232,101,26,0.3)',
        'orange-lg': '0 0 60px rgba(232,101,26,0.4)',
        'luxury': '0 20px 50px rgba(42,37,33,0.12)',
        'card': '0 4px 20px rgba(42,37,33,0.08)',
        'card-hover': '0 16px 48px rgba(42,37,33,0.14), 0 0 0 1px rgba(232,101,26,0.06)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'premium': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
