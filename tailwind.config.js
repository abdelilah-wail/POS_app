/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0A84FF",
          50:  "#E8F2FF",
          100: "#D1E6FF",
          200: "#A3CDFF",
          300: "#75B4FF",
          400: "#479BFF",
          500: "#0A84FF",
          600: "#0869CC",
          700: "#064F99",
          800: "#043466",
          900: "#021A33",
        },
        secondary: {
          DEFAULT: "#5AC8FA",
          light: "#8FDAFB",
          dark:  "#3BA8DA",
        },
        accent: {
          DEFAULT: "#34C759",
          light: "#5FD37C",
          dark:  "#28A745",
        },
        surface: "#F5F5F7",
        ink: "#1D1D1F",
        muted: "#86868B",
        glass: "rgba(255, 255, 255, 0.65)",
      },
      fontFamily: {
        sans: [
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'premium':    '0 10px 40px -10px rgba(10, 132, 255, 0.18), 0 4px 16px -4px rgba(0, 0, 0, 0.06)',
        'premium-lg': '0 25px 60px -15px rgba(10, 132, 255, 0.22), 0 10px 30px -8px rgba(0, 0, 0, 0.08)',
        'glass':      '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
        'card':       '0 2px 8px -2px rgba(0, 0, 0, 0.04), 0 4px 16px -4px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 24px -4px rgba(0, 0, 0, 0.08), 0 16px 32px -8px rgba(10, 132, 255, 0.12)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'fade-in':     { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'fade-in-up':  { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'scale-in':    { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        'slide-up':    { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
        'shimmer':     { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
        'pulse-soft':  { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
      animation: {
        'fade-in':    'fade-in 0.4s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'scale-in':   'scale-in 0.3s ease-out',
        'slide-up':   'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer':    'shimmer 2s linear infinite',
        'pulse-soft': 'pulse-soft 2.5s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
  safelist: [
  'from-sky-400', 'to-blue-500', 'from-sky-50', 'to-blue-50',
  'from-pink-400', 'to-fuchsia-500', 'from-pink-50', 'to-fuchsia-50',
  'from-amber-400', 'to-orange-500', 'from-amber-50', 'to-orange-50',
],
}
