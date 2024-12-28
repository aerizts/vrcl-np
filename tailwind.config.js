/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        stzhongsong: ['华文中宋', 'SimSun', 'serif'],
      },
      fontWeight: {
        light: 300,
      },
      borderColor: {
        DEFAULT: 'hsl(var(--border))',
      },
      screens: {
        'print': {'raw': 'print'},
      },
    },
  },
  plugins: [],
}

