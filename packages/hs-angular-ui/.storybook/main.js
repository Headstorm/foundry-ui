module.exports = {
  addons: [
    '@storybook/addon-a11y/register',
    '@storybook/addon-docs/register',
    '@storybook/addon-knobs/register',
  ],
  stories: ['../src/**/*.stories.(ts|js|mdx)']
};