// @ts-ignore
const path = require('path');

module.exports = {
  stories: ['../src/components/**/*.stories.tsx'],
  addons: [
    {
      name: '@storybook/preset-create-react-app',
      options: {
        tsDocgenLoaderOptions: {
          tsconfigPath: path.resolve(__dirname, '../tsconfig.json'),
          shouldExtractLiteralValuesFromEnum: true,
          propFilter: prop => {
            // Currently not working, prop.parent is always null.
            if (prop.parent) {
              return !prop.parent.fileName.includes('node_modules/@types/react/');
            }

            return true;
          },
        },
      },
    },
    '@storybook/addon-actions',
    '@storybook/addon-knobs',
    '@storybook/addon-a11y',
    '@storybook/addon-backgrounds',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
  ]
};
