import { addParameters } from '@storybook/angular'; // <- or your storybook framework

addParameters({
  backgrounds: [
    { name: 'dark', value: '#252c35', default: true },
    { name: 'light', value: '#ffffff' },
  ],
});
