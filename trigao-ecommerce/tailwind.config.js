module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        trigao: {
          gold: {
            DEFAULT: '#D4A574',
            dark: '#B8885A',
            light: '#E8C9A8',
          },
          brown: {
            DEFAULT: '#8B4513',
            dark: '#6B3410',
            light: '#A0522D',
          },
          wheat: '#F5DEB3',
          cream: '#FFFEF7',
          'off-white': '#FAF8F3',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        prices: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}