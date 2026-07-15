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
        paper: '#F2EEE3',
        line: '#DAD2BE',
      },
      fontFamily: {
        display: ['var(--font-newsreader)', 'serif'],
        body: ['var(--font-plex-sans)', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
