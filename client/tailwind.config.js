/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          burgundy: '#801323',
          burgundyDark: '#5D0012',
          gold: '#D4AF37',
          goldLight: '#F5E8C7',
          terracotta: '#A64B2A',
          canvas: '#FAF6F0',
          sand: '#F7F3EB',
          ivory: '#FCF9F8',
          surface: '#FFFFFF',
          charcoal: '#2D2826',
          muted: '#6B5E59',
          subtle: '#9E918C',
          whatsapp: '#25D366',
          whatsappDark: '#1EBE5D',
          footerBg: '#1E0408',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        luxury:
          '0 10px 28px -5px rgba(128, 19, 35, 0.07), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
        floating:
          '0 8px 30px rgba(128, 19, 35, 0.14), 0 2px 6px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '10px',
        lg: '16px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};
