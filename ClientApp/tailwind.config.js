/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/main/src/**/*.{html,ts,scss}",
    "./projects/admin/src/**/*.{html,ts,scss}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Enhanced color palette with new scheme
        primary: {
          DEFAULT: '#FF6900', // New primary orange
          50: '#FFF4E6',
          100: '#FFE4CC',
          200: '#FFC999',
          300: '#FFAD66',
          400: '#FF9233',
          500: '#FF6900',
          600: '#E85F00', // Hover state
          700: '#CC5500',
          800: '#B34A00',
          900: '#994000',
          hover: '#E85F00',
        },
        secondary: {
          DEFAULT: '#2E2E2E', // New secondary dark
          50: '#F7F7F7',
          100: '#EEEEEE',
          200: '#DDDDDD',
          300: '#CCCCCC',
          400: '#AAAAAA',
          500: '#888888',
          600: '#666666',
          700: '#444444',
          800: '#2E2E2E',
          900: '#1A1A1A',
        },
        background: {
          DEFAULT: '#FFFFFF', // Base background
          dark: '#121212', // Dark mode base
          surface: '#FAFAFA',
          'surface-dark': '#1E1E1E',
        },
        border: {
          DEFAULT: '#E5E7EB', // Divider lines
          dark: '#374151',
        },
        accent: {
          DEFAULT: '#FF6900',
          hover: '#E85F00',
        },
        success: {
          DEFAULT: '#00C853', // Positive states
          50: '#E8F5E8',
          100: '#C8E6C8',
          200: '#A5D6A5',
          300: '#81C784',
          400: '#66BB6A',
          500: '#00C853',
          600: '#00B248',
          700: '#009A3C',
          800: '#008230',
          900: '#005A1F',
        },
        error: {
          DEFAULT: '#E53935', // Errors, alerts
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#E53935',
          600: '#D32F2F',
          700: '#C62828',
          800: '#B71C1C',
          900: '#8D1818',
        },
        warning: {
          DEFAULT: '#FFC107', // Notices
          50: '#FFFDE7',
          100: '#FFF9C4',
          200: '#FFF59D',
          300: '#FFF176',
          400: '#FFEE58',
          500: '#FFC107',
          600: '#FFB300',
          700: '#FFA000',
          800: '#FF8F00',
          900: '#FF6F00',
        },
        info: {
          DEFAULT: '#1E88E5', // Informational alerts
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#1E88E5',
          600: '#1976D2',
          700: '#1565C0',
          800: '#0D47A1',
          900: '#0A3D91',
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
        // Basic animations
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'fade-in-fast': 'fadeIn 0.15s ease-in-out',
        'fade-in-slow': 'fadeIn 0.5s ease-in-out',
        
        // Slide animations
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'slide-up-fast': 'slideUp 0.2s ease-out',
        'slide-up-slow': 'slideUp 0.5s ease-out',
        
        // Scale animations
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-in',
        'scale-bounce': 'scaleBounce 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'scale-pulse': 'scalePulse 2s infinite',
        
        // Bounce animations
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce-gentle': 'bounceGentle 0.4s ease-out',
        'bounce-dot': 'bounceDot 1.4s infinite ease-in-out both',
        
        // Rotation animations
        'spin-slow': 'spin 3s linear infinite',
        'spin-fast': 'spin 0.5s linear infinite',
        'rotate-in': 'rotateIn 0.4s ease-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        
        // Flip animations
        'flip-in': 'flipIn 0.6s ease-in-out',
        'flip-out': 'flipOut 0.6s ease-in-out',
        'flip-x': 'flipX 0.4s ease-in-out',
        'flip-y': 'flipY 0.4s ease-in-out',
        
        // Zoom animations
        'zoom-in': 'zoomIn 0.3s ease-out',
        'zoom-out': 'zoomOut 0.3s ease-in',
        'zoom-in-bounce': 'zoomInBounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        
        // Shake and vibrate
        'shake': 'shake 0.5s ease-in-out',
        'vibrate': 'vibrate 0.3s ease-in-out',
        'wobble': 'wobble 1s ease-in-out',
        
        // Loading animations
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-slow': 'pulse 3s infinite',
        'pulse-fast': 'pulse 1s infinite',
        'loading-dots': 'loadingDots 1.5s infinite ease-in-out',
        
        // Hover effects
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        
        // Entrance animations
        'slide-in-bottom': 'slideInBottom 0.4s ease-out',
        'slide-in-top': 'slideInTop 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        
        // Exit animations
        'slide-out-bottom': 'slideOutBottom 0.3s ease-in',
        'slide-out-top': 'slideOutTop 0.3s ease-in',
        'slide-out-left': 'slideOutLeft 0.3s ease-in',
        'slide-out-right': 'slideOutRight 0.3s ease-in',
        
        // Special effects
        'typewriter': 'typewriter 3s steps(40) infinite',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
        'border-dance': 'borderDance 2s linear infinite',
      },
      keyframes: {
        // Basic fade animations
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        
        // Slide animations
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        
        // Scale animations
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.9)', opacity: '0' },
        },
        scaleBounce: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scalePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        
        // Bounce animations
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0, -8px, 0)' },
          '70%': { transform: 'translate3d(0, -4px, 0)' },
          '90%': { transform: 'translate3d(0, -2px, 0)' },
        },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },
        
        // Rotation animations
        rotateIn: {
          '0%': { transform: 'rotate(-200deg)', opacity: '0' },
          '100%': { transform: 'rotate(0)', opacity: '1' },
        },
        wiggle: {
          '0%, 7%': { transform: 'rotateZ(0)' },
          '15%': { transform: 'rotateZ(-15deg)' },
          '20%': { transform: 'rotateZ(10deg)' },
          '25%': { transform: 'rotateZ(-10deg)' },
          '30%': { transform: 'rotateZ(6deg)' },
          '35%': { transform: 'rotateZ(-4deg)' },
          '40%, 100%': { transform: 'rotateZ(0)' },
        },
        
        // Flip animations
        flipIn: {
          '0%': { transform: 'perspective(400px) rotateY(90deg)', opacity: '0' },
          '40%': { transform: 'perspective(400px) rotateY(-20deg)' },
          '60%': { transform: 'perspective(400px) rotateY(10deg)' },
          '80%': { transform: 'perspective(400px) rotateY(-5deg)' },
          '100%': { transform: 'perspective(400px) rotateY(0deg)', opacity: '1' },
        },
        flipOut: {
          '0%': { transform: 'perspective(400px) rotateY(0deg)', opacity: '1' },
          '100%': { transform: 'perspective(400px) rotateY(90deg)', opacity: '0' },
        },
        flipX: {
          '0%': { transform: 'perspective(400px) rotateX(90deg)', opacity: '0' },
          '100%': { transform: 'perspective(400px) rotateX(0deg)', opacity: '1' },
        },
        flipY: {
          '0%': { transform: 'perspective(400px) rotateY(90deg)', opacity: '0' },
          '100%': { transform: 'perspective(400px) rotateY(0deg)', opacity: '1' },
        },
        
        // Zoom animations
        zoomIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        zoomOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.5)', opacity: '0' },
        },
        zoomInBounce: {
          '0%': { transform: 'scale(0.1)', opacity: '0' },
          '60%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        
        // Shake and vibrate
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
        vibrate: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        wobble: {
          '0%': { transform: 'translateX(0%)' },
          '15%': { transform: 'translateX(-25%) rotate(-5deg)' },
          '30%': { transform: 'translateX(20%) rotate(3deg)' },
          '45%': { transform: 'translateX(-15%) rotate(-3deg)' },
          '60%': { transform: 'translateX(10%) rotate(2deg)' },
          '75%': { transform: 'translateX(-5%) rotate(-1deg)' },
          '100%': { transform: 'translateX(0%)' },
        },
        
        // Loading animations
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        loadingDots: {
          '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0.5' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        
        // Hover effects
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 105, 0, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 105, 0, 0.8)' },
        },
        heartbeat: {
          '0%, 50%, 100%': { transform: 'scale(1)' },
          '25%, 75%': { transform: 'scale(1.1)' },
        },
        
        // Entrance animations
        slideInBottom: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInTop: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        
        // Exit animations
        slideOutBottom: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        slideOutTop: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-100%)', opacity: '0' },
        },
        slideOutLeft: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        
        // Special effects
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        borderDance: {
          '0%': { borderColor: '#FF6900' },
          '25%': { borderColor: '#00C853' },
          '50%': { borderColor: '#1E88E5' },
          '75%': { borderColor: '#E53935' },
          '100%': { borderColor: '#FF6900' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    function({ addUtilities, addComponents, theme }) {
      // Enhanced utilities for SCSS integration
      const newUtilities = {
        '.line-clamp-1': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
        },
        '.line-clamp-2': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.line-clamp-3': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme('colors.secondary.300'),
            borderRadius: '3px',
            '&:hover': {
              background: theme('colors.secondary.400'),
            },
          },
        },
        '.glass': {
          'backdrop-filter': 'blur(10px)',
          'background-color': 'rgba(255, 255, 255, 0.8)',
          border: `1px solid ${theme('colors.border.DEFAULT')}`,
        },
        '.glass-dark': {
          'backdrop-filter': 'blur(10px)',
          'background-color': 'rgba(0, 0, 0, 0.8)',
          border: `1px solid ${theme('colors.border.dark')}`,
        },
        '.sidebar-fixed-left': {
          position: 'fixed',
          left: '0',
          top: '60px',
          width: '200px',
          height: 'calc(100vh - 60px)',
          zIndex: '50',
        },
        '.sidebar-fixed-right': {
          position: 'fixed',
          right: '0',
          top: '60px',
          width: '320px',
          height: 'calc(100vh - 60px)',
          zIndex: '50',
        },
        '.content-with-sidebars': {
          marginLeft: '200px',
          marginRight: '320px',
        },
      }
      
      // Enhanced components for SCSS integration
      const newComponents = {
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
          borderRadius: theme('borderRadius.fluent'),
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          border: 'none',
          textDecoration: 'none',
          '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 2px ${theme('colors.primary.DEFAULT')}40`,
          },
        },
        '.btn-primary': {
          backgroundColor: theme('colors.primary.DEFAULT'),
          color: 'white',
          '&:hover': {
            backgroundColor: theme('colors.primary.hover'),
          },
        },
        '.btn-secondary': {
          backgroundColor: theme('colors.secondary.100'),
          color: theme('colors.secondary.900'),
          '&:hover': {
            backgroundColor: theme('colors.secondary.200'),
          },
        },
        '.card': {
          backgroundColor: theme('colors.background.DEFAULT'),
          border: `1px solid ${theme('colors.border.DEFAULT')}`,
          borderRadius: theme('borderRadius.fluent-lg'),
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.fluent'),
        },
        '.input': {
          width: '100%',
          padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
          border: `1px solid ${theme('colors.border.DEFAULT')}`,
          borderRadius: theme('borderRadius.fluent'),
          fontSize: theme('fontSize.sm'),
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.primary.DEFAULT'),
            boxShadow: `0 0 0 2px ${theme('colors.primary.DEFAULT')}20`,
          },
        },
      }
      
      addUtilities(newUtilities)
      addComponents(newComponents)
    }
  ],
}
