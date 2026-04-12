/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainBackgroundColor: '#0D1117',
        'secondary-background-color': 'var(--secondary-bg-color)',
        secondaryBackgroundColorHover: '#161c22a3',
        overlay: 'var(--overlay-color)',
      },
      gridTemplateColumns: {
        'auto-fill': 'repeat(auto-fill, minmax(330px, 1fr))',
      },
      height: {
        'header-height': 'var(--header-height)',
      },
    },
  },
  plugins: [],
};
