import { create } from '@storybook/theming/create';

const colors = {
  background: '#fff',
  primary: '#e75b27',

  grayDark: '#252c35',
  grayMedium: '#51575d',
  grayLight: '#7c8186',
  grayXlight: '#d3d6d7',

  destructive: '#dd0000'
}

export default create({
  base: 'dark',

  colorPrimary: Colors.primary,
  colorSecondary: Colors.grayLight,

  // UI
  appBg: Colors.grayDark,
  appContentBg: Colors.grayMedium,
  appBorderColor: Colors.grayMedium,
  appBorderRadius: 4,

  // Typography
  fontBase: '"Gotham", "Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: Colors.background,
  textInverseColor: Colors.primary,

  // Toolbar default and active colors
  barTextColor: Colors.grayLight,
  barSelectedColor: Colors.background,
  barBg: Colors.grayDark,

  // Form colors
  inputBg: Colors.grayXlight,
  inputBorder: Colors.grayXlight,
  inputTextColor: Colors.grayDark,
  inputBorderRadius: 4,

  brandTitle: 'Headstorm UI',
  brandUrl: 'https://headstorm.com',
  brandImage: 'headstorm-logo.png',
});