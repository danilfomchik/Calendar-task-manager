const {colors: defaultColors} = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                mainBackgroundColor: '#0D1117',
                secondaryBackgroundColor: '#161c22',
                secondaryBackgroundColorHover: '#161c22a3',
            },
            gridTemplateColumns: {
                'auto-fill': 'repeat(auto-fill, minmax(330px, 1fr))',
            },
        },
    },
    plugins: [],
};
