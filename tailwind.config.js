/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            screens: {
                'md': '768px',
                // Figma breakpoints: 375px (base/mobile-first default), md=768px (Tailwind default), desktop=1440px
                'desktop': '1440px',
            },
            colors: {
                'theme-dark': '#141414',
                'theme-light': '#ffffff',
            },
            fontFamily: {
                orbitron: ['Orbitron', 'sans-serif'],
                nata: ['Nata Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
