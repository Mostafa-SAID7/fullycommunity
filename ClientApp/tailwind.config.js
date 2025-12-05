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
        // Enhanced color palette with modern automotive theme
        primary: {
          DEFAULT: 'var(--color-primary, rgb(141, 7, 7))', // Deep automotive red
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: 'var(--color-primary, rgb(141, 7, 7))',
          600: 'var(--color-primary-hover, rgb(187, 6, 6))',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          hover: 'var(--color-primary-hover, rgb(187, 6, 6))',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary, #2E2E2E)', // Rich charcoal
          50: '#F8F8F8',
          100: '#F0F0F0',
          200: '#E0E0E0',
          300: '#C7C7C7',
          400: '#A0A0A0',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: 'var(--color-secondary, #2E2E2E)',
        },
        background: {
          DEFAULT: '#FFFFFF',
          dark: '#121212',
          surface: '#F8F9FA',
          'surface-dark': '#1A1A1A',
          card: '#FFFFFF',
          'card-dark': '#1A1A1A',
          secondary: '#F8F9FA',
          'secondary-dark': '#1A1A1A',
        },
        border: {
          DEFAULT: '#E5E7EB',
          dark: '#374151',
        },
        accent: {
          DEFAULT: 'var(--color-accent, #FF6B35)', // Vibrant orange accent
          50: '#FFF4F0',
          100: '#FFE8E0',
          200: '#FFD1C2',
          300: '#FFB8A3',
          400: '#FF7F66',
          500: 'var(--color-accent, #FF6B35)',
          600: '#E63E00',
          700: '#CC3700',
          800: '#B33000',
          900: '#992900',
          hover: '#E63E00',
        },
        success: {
          DEFAULT: '#00C853',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#00C853',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        error: {
          DEFAULT: 'rgb(255, 10, 5)',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: 'rgb(255, 10, 5)',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        warning: {
          DEFAULT: '#FFC107',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#FFC107',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        info: {
          DEFAULT: '#1E88E5',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#1E88E5',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        // Text colors
        text: {
          primary: '#1A1A1A',
          secondary: '#6B7280',
          dark: '#FFFFFF',
          'dark-secondary': '#D1D5DB',
        },
        // Additional automotive-themed colors
        automotive: {
          chrome: '#C0C0C0',
          steel: '#71797E',
          carbon: '#2C2C2C',
          gold: '#FFD700',
          copper: '#B87333',
          titanium: '#878681',
        },
        // Performance colors
        performance: {
          turbo: '#00FFFF',
          nitro: '#FF1493',
          racing: '#FF4500',
          electric: '#00FF00',
          hybrid: '#32CD32',
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
        // Automotive-themed gradients
        '.gradient-automotive': {
          background: 'linear-gradient(135deg, #0066FF 0%, #003D99 100%)',
        },
        '.gradient-performance': {
          background: 'linear-gradient(135deg, #FF4500 0%, #E63E00 100%)',
        },
        '.gradient-electric': {
          background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
        },
        '.gradient-premium': {
          background: 'linear-gradient(135deg, #1A1A1A 0%, #404040 100%)',
        },
        // Enhanced card styles
        '.card-automotive': {
          backgroundColor: theme('colors.background.card'),
          border: `1px solid ${theme('colors.border.DEFAULT')}`,
          borderRadius: theme('borderRadius.fluent-lg'),
          padding: theme('spacing.6'),
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-2px)',
          },
        },
        // Performance indicators
        '.performance-badge': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
          fontSize: theme('fontSize.xs'),
          fontWeight: theme('fontWeight.semibold'),
          borderRadius: theme('borderRadius.full'),
          textTransform: 'uppercase',
          letterSpacing: theme('letterSpacing.wide'),
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
