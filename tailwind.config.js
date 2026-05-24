export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0B0E14',
          secondary: '#131722',
          tertiary: 'rgba(255, 255, 255, 0.03)',
          glass: 'rgba(19, 23, 34, 0.6)',
        },
        border: {
          color: 'rgba(255, 255, 255, 0.08)',
        },
        text: {
          primary: '#F3F4F6',
          secondary: '#9CA3AF',
          muted: '#6B7280',
        },
        accent: {
          primary: '#6366F1',
          hover: '#4F46E5',
          light: 'rgba(99, 102, 241, 0.15)',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 15px rgba(99, 102, 241, 0.3)',
      },
      backdropBlur: {
        glass: '12px',
      }
    },
  },
  plugins: [],
}
