/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        movistar: {
          blue: '#019DF4',
          'blue-dark': '#0086d1',
          navy: '#00263E',
          gray: '#f5f5f5',
          purple: '#660099'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
};
