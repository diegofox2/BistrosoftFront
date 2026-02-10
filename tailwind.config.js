/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Work Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"Work Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 20px 40px -24px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  plugins: [],
}
