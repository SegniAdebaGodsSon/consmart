import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      colors: {
        twitter: '#1DA1F2',
        youtube: '#FF0000',
        facebook: '#4267B2'
      },
      backgroundImage: {
        'hero-image': "url('/construction site image.jpg')"
      }
    },
  },
  daisyui: {
    themes: ['light', 'dark']
  },
  plugins: [
    require('daisyui')
  ],
} satisfies Config;
