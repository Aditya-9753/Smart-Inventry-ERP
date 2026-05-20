/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontSize: {
        xs: '12px',
        sm: '13px',
        base: '14px',
        lg: '15px',
        xl: '16px',
        '2xl': '18px',
        '3xl': '20px',
        '4xl': '24px',
        '5xl': '28px',
        '6xl': '32px',
      },
      spacing: {
        4.5: '1.125rem',
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        13: '3.25rem',
        15: '3.75rem',
      },
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        neutral: {
          0: '#ffffff',
          50: '#fafafa',
          100: '#f5f5f5',
          150: '#efefef',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        status: {
          success: {
            50: '#f0fdf4',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
          },
          warning: {
            50: '#fffbeb',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
          },
          critical: {
            50: '#fef2f2',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
          },
          info: {
            50: '#eff6ff',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
          },
        },
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        card: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        dark: '0 1px 3px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        xs: '2px',
        sm: '4px',
        base: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
      transitionDuration: {
        75: '75ms',
        100: '100ms',
        150: '150ms',
        200: '200ms',
        300: '300ms',
        500: '500ms',
      },
      animation: {
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'skeleton': 'skeleton 2s infinite',
        'slide-in': 'slide-in 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
      keyframes: {
        skeleton: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'slide-in': {
          'from': { transform: 'translateY(-4px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    function ({ addBase, addComponents, addUtilities, theme }) {
      addBase({
        '*': {
          '@apply border-neutral-200 dark:border-neutral-700': {},
        },
        'input, textarea, select': {
          '@apply dark:text-neutral-50': {},
        },
        '::-webkit-scrollbar': {
          '@apply w-2 h-2': {},
        },
        '::-webkit-scrollbar-track': {
          '@apply bg-neutral-100 dark:bg-neutral-900': {},
        },
        '::-webkit-scrollbar-thumb': {
          '@apply bg-neutral-300 dark:bg-neutral-600 rounded-full': {},
        },
        '::-webkit-scrollbar-thumb:hover': {
          '@apply bg-neutral-400 dark:bg-neutral-500': {},
        },
      });

      addComponents({
        '.focus-ring': {
          '@apply focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500 dark:focus-visible:ring-offset-neutral-900': {},
        },
        '.input-ring': {
          '@apply focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-opacity-50': {},
        },
      });

      addUtilities({
        '.text-truncate': {
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap',
        },
        '.line-clamp-2': {
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
  ],
}
