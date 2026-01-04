/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        // Цвета из оригинальной темы Stack
        primary: {
          DEFAULT: '#4A90E2', // Основной синий цвет
          hover: '#609DE6',   // При наведении
          active: '#3483DE',  // При нажатии
          1: '#31639C',       // Вариант 1 (темнее)
          2: '#465773',       // Вариант 2 (серо-синий)
        },
        dark: '#252525',      // Темный фон и заголовки
        body: '#666666',      // Цвет основного текста
        secondary: '#FAFAFA', // Светлый фон
        white: '#FFFFFF',     // Белый цвет
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
      fontWeight: {
        normal: '400',
        light: '300',
      },
      // Размеры шрифтов из темы Stack
      fontSize: {
        // Базовый размер = 14px (87.5% от 16px)
        // h1: 3.14285714em = 44px (при базе 14px)
        'h1': ['3.14285714em', { lineHeight: '1.31818182em' }],
        // h2: 2.35714286em = 33px
        'h2': ['2.35714286em', { lineHeight: '1.36363636em' }],
        // h3: 1.78571429em = 25px
        'h3': ['1.78571429em', { lineHeight: '1.5em' }],
        // h4: 1.35714286em = 19px
        'h4': ['1.35714286em', { lineHeight: '1.36842105em' }],
        // h5: 1em = 14px
        'h5': ['1em', { lineHeight: '1.85714286em' }],
        // h6: 0.85714286em = 12px
        'h6': ['0.85714286em', { lineHeight: '2.16666667em' }],
        // lead: 1.35714286em = 19px
        'lead': ['1.35714286em', { lineHeight: '1.68421053em' }],
        // body: 1em = 14px
        'body': ['1em', { lineHeight: '1.85714286em' }],
      },
      // Межстрочные интервалы из темы Stack
      lineHeight: {
        'h1': '1.31818182em',
        'h2': '1.36363636em',
        'h3': '1.5em',
        'h4': '1.36842105em',
        'body': '1.85714286em',
        'lead': '1.68421053em',
        'h5': '1.85714286em',
        'h6': '2.16666667em',
      },
    },
  },
  plugins: [],
}

