/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'retro-bg': '#dce073',
        'retro-blue': '#3a6db5',
        'retro-blue-light': '#5a9ad5',
        'retro-blue-dark': '#2a5a8a',
        'retro-text': '#2a5a8a',
        'retro-muted': '#5a8ab5',
      },
      fontFamily: {
        pixel: ["'VT323'", "'Courier New'", 'monospace'],
      },
    },
  },
  plugins: [],
}
