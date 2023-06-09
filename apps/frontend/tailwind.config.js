const colors = require('tailwindcss/colors');
const { createGlobPatternsForDependencies } = require('@nx/next/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    join(
      __dirname,
      '{src,pages,components}/**/*!(*.stories|*.spec).{tsx,html}'
    ),
    // Adding ts files to the glob
    ...createGlobPatternsForDependencies(__dirname).map(
      (path) => `${path.slice(0, -1)},ts}`
    ),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        green: colors.emerald,
        yellow: colors.amber,
        purple: colors.violet,
        gray: colors.neutral,
        primary: 'rgb(43, 45, 80)',
        'primary-dark': 'rgb(27, 28, 54)',
        'primary-border': '#5C5F8B',
      },
    },
  },
  plugins: [],
};

module.exports = tailwindConfig;
