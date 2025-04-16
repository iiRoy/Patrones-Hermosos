import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        text: '#ebe6eb',
        textDim: '#616161',
        back: '#110e11',
        primary: '#97639c',
        primaryShade: '#6E2D75',
        secondary: '#683756',
        secondaryShade: '#C57FAB',
        accent: '#B77690',
        success: '#4B914E',
        warning: '#C17A37',
        error: '#CC445C',
      },
      boxShadow: {
        'custom-dark': '0 0.3vmax 0.5vmax rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
export default config;
