// tailwind.config.js

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#31D6D6',
          light: '#D6F7F7'
        },
        secondary: {
          DEFAULT: '#FFA0A0',
          light: '#FFDDDD'
        },
        black: {
          DEFAULT: '#000',
          100: '#1E1E2D',
          200: '#232533'
        },
        gray: {
          100: '#CDCDE0'
        },
        button: '#67CFCF'
      },
      fontFamily: {
        pthin: ['Poppins-Thin', 'sans-serif'],
        pextralight: ['Poppins-ExtraLight', 'sans-serif'],
        plight: ['Poppins-Light', 'sans-serif'],
        pregular: ['Poppins-Regular', 'sans-serif'],
        pmedium: ['Poppins-Medium', 'sans-serif'],
        psemibold: ['Poppins-SemiBold', 'sans-serif'],
        pbold: ['Poppins-Bold', 'sans-serif'],
        pextrabold: ['Poppins-ExtraBold', 'sans-serif'],
        pblack: ['Poppins-Black', 'sans-serif']
      }
    }
  },
  plugins: []
}
