module.exports = {
  addons: [
    '@storybook/addon-a11y/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-docs/register',
    '@storybook/addon-knobs/register',
  ],
  stories: ['../src/**/*.stories.[tj]s']
};