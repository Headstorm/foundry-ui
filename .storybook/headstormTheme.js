import { create } from '@storybook/theming/create';

const colors = {
  background: '#fff',
  primary: '#e75b27',

  grayDark: '#252c35',
  grayMedium: '#51575d',
  grayLight: '#7c8186',
  grayXlight: '#d3d6d7',

  destructive: '#dd0000',
};

export default create({
  base: 'dark',

  colorPrimary: colors.primary,
  colorSecondary: colors.grayLight,

  // UI
  appBg: colors.grayDark,
  appContentBg: colors.grayMedium,
  appBorderColor: colors.grayMedium,
  appBorderRadius: 4,

  // Typography
  fontBase: '"Arial", "Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: colors.background,
  textInverseColor: colors.primary,

  // Toolbar default and active colors
  barTextColor: colors.grayLight,
  barSelectedColor: colors.background,
  barBg: colors.grayDark,

  // Form colors
  inputBg: colors.grayXlight,
  inputBorder: colors.grayXlight,
  inputTextColor: colors.grayDark,
  inputBorderRadius: 4,

  brandTitle: 'Headstorm UI',
  brandUrl: 'https://headstorm.com',
  brandImage: '/headstorm-logo.png',
});
