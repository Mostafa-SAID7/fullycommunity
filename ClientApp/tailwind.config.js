/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/main/src/**/*.{html,ts}",
    "./projects/admin/src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Microsoft Fluent Design inspired colors
        primary: {
          DEFAULT: '#0078D4', // Microsoft Blue
          50: '#E6F3FF',
          100: '#CCE7FF',
          200: '#99CFFF',
          300: '#66B7FF',
          400: '#339FFF',
          500: '#0078D4',
          600: '#106EBE',
          700: '#005A9E',
          800: '#004578',
          900: '#003152',
          hover: '#106EBE',
        },
        secondary: {
          DEFAULT: '#323130', // Microsoft Gray
          50: '#F8F8F8',
          100: '#F3F2F1',
          200: '#EDEBE9',
          300: '#E1DFDD',
          400: '#D2D0CE',
          500: '#B3B0AD',
          600: '#979593',
          700: '#797775',
          800: '#605E5C',
          900: '#323130',
        },
        background: {
          DEFAULT: '#FFFFFF',
          dark: '#1B1A19',
          surface: '#FAF9F8',
          'surface-dark': '#252423',
        },
        border: {
          DEFAULT: '#EDEBE9',
          dark: '#323130',
        },
        accent: {
          DEFAULT: '#FF6900', // Orange accent
          hover: '#E85F00',
        },
        success: {
          DEFAULT: '#107C10',
          50: '#F3F9F3',
          500: '#107C10',
          600: '#0E6B0E',
        },
        error: {
          DEFAULT: '#D13438',
          50: '#FDF3F4',
          500: '#D13438',
          600: '#B92B2F',
        },
        warning: {
          DEFAULT: '#FFB900',
          50: '#FFFDF0',
          500: '#FFB900',
          600: '#E6A600',
        },
        info: {
          DEFAULT: '#0078D4',
          50: '#E6F3FF',
          500: '#0078D4',
          600: '#106EBE',
        },
      },
      fontFamily: {
        'segoe': ['Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'fluent': '0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)',
        'fluent-lg': '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
        'fluent-xl': '0 1rem 2rem rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'fluent': '0.25rem',
        'fluent-lg': '0.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
