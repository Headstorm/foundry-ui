module.exports = {
  addons: [
    '@storybook/addon-knobs/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-backgrounds/register',
    'storybook-addon-designs/register',
  ],
  stories: ['../src/**/*.stories.[tj]s']
};
