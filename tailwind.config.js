/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#14355C',
        secondary: '#2F6B4F',
        accent: '#B5651D',
        ink: '#201D1B',
        paper: '#F7F5F0',
      },
      fontFamily: {
        display: ['var(--font-newsreader)', 'serif'],
        body: ['var(--font-plex-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
