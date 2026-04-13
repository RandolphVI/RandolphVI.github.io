/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#e8e0d0',
          300: '#d4c8b0',
          400: '#c4b5a0',
          500: '#b8a88a',
          600: '#a09080',
          700: '#888070',
        },
        ink: {
          50: '#f5f5f5',
          100: '#ececec',
          200: '#bbbbbb',
          300: '#aaaaaa',
          400: '#999999',
          500: '#777777',
          600: '#666666',
          700: '#555555',
          800: '#3a3a3a',
          900: '#1b1b1f',
        },
      },
      fontFamily: {
        serif: ['"KingHwa_OldSong"', '"京華老宋体"', '"Noto Serif SC"', '"Source Han Serif SC"', '"宋体"', 'serif'],
        sans: ['"Josefin Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
