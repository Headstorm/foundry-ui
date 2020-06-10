const webpack = require('webpack');

// @ts-ignore
const path = require('path');

module.exports = {
  stories: ['../src/components/**/*.stories.tsx', '../src/**/*.stories.(js|mdx)'],
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
    '@storybook/addon-docs',
    '@storybook/addon-actions',
    'storybook-addon-designs/register',
    '@storybook/addon-knobs',
    '@storybook/addon-a11y',
    '@storybook/addon-backgrounds',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
  ],
  webpackFinal: async (config, { configType }) => {
    config.plugins.push(
      // Removing Speedy so the static storybook styling doesn't break
      new webpack.DefinePlugin({
        SC_DISABLE_SPEEDY: true,
      }),
    );

    return config;
  },
};
