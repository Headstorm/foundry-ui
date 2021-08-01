module.exports = {
  stories: ['../src/components/**/*.stories.tsx', '../src/**/*.stories.@(js|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    'storybook-addon-designs',
    '@storybook/addon-a11y',
  ],
};
