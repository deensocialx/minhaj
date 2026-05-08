/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4A843',
          light: '#E8C470',
          dark: '#B8922E',
        },
        navy: {
          DEFAULT: '#0F1621',
          light: '#1A2333',
          mid: '#243044',
        },
        surface: '#1E2A3A',
        emerald: {
          minhaj: '#2ECC71',
          dim: '#1A7A44',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        base: ['15px', { lineHeight: '1.7' }],
      },
    },
  },
  plugins: [],
}
