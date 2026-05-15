/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'retro-bg': '#121018',
        'retro-surface': '#f5f0e8',
        'retro-surface-light': '#4a3a2a',
        'retro-accent': '#c89048',
        'retro-accent-light': '#e0c078',
        'retro-text': '#2a2018',
        'retro-muted': '#8a7d6e',
      },
      fontFamily: {
        pixel: ["'Kalam'", "'JasonHandwriting'", "'PingFang SC'", "'Microsoft YaHei'", 'sans-serif'],
      },
    },
  },
  plugins: [],
}
