/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brown-Green Theme
        'forest': {
          50: '#f6f7f1',
          100: '#e9ede0',
          200: '#d4dcc2',
          300: '#b8c59b',
          400: '#9bae73',
          500: '#7d9654',
          600: '#627741',
          700: '#4d5d35',
          800: '#3f4b2d',
          900: '#364028',
        },
        'earth': {
          50: '#faf8f3',
          100: '#f2ede1',
          200: '#e4d8c2',
          300: '#d2be9b',
          400: '#bfa172',
          500: '#a68654',
          600: '#8b6f47',
          700: '#73593d',
          800: '#5f4a36',
          900: '#513f30',
        },
        'sage': {
          50: '#f7f8f4',
          100: '#edf0e6',
          200: '#dce2ce',
          300: '#c4cfab',
          400: '#a8b884',
          500: '#8fa065',
          600: '#6f7d4e',
          700: '#586240',
          800: '#485037',
          900: '#3d4330',
        }
      }
    },
  },
  plugins: [],
};