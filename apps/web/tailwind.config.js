/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
     extend: { fontFamily: { lalezar: ['Lalezar', 'cursive'] } },
     colors: {
        darkGray: '#1e1e1e',
        graphite: '#494949',
        limeGreen: '#42FD00',
        electricPurple: '#8F00FF',
        lightGray: '#F3F3F3',
        tomatoRed: '#ff6347',
     },
     boxShadow: {
        basic: '6px 4px 0px 0px #1E1E1E',
        green: '6px 4px 0px 0px #42FD00',
        none: '0 0 #0000',
        electricPurple: '6px 4px 0px 0px #8F00FF',
        footer: '4px -6px 0px 0px #8F00FF',
     },
  },
  plugins: [],
}
