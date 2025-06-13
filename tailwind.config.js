/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B00',
        'primary-light': '#FF8800',
        'primary-lighter': '#FFA200',

        background: '#FFFFFF',
        'background-secondary': '#F5F5F5',

        text: '#333333',
        'text-secondary': '#666666',
        'text-light': '#FFFFFF',

        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',

        accent1: 'rgba(255, 107, 0, 0.1)',
        accent2: 'rgba(255, 136, 0, 0.1)',
        accent3: 'rgba(255, 162, 0, 0.1)',

        border: 'rgba(255, 107, 0, 0.1)',
        'border-dark': 'rgba(255, 107, 0, 0.2)',
      },
    },
  },
  plugins: [],
};
