import { withDesign } from 'storybook-addon-designs';

import colors from '../src/enums/colors';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: new RegExp(`color|${Object.keys(colors).join('|')}`, 'i'),
      date: /Date$/,
    },
    sort: 'requiredFirst',
    exclude: /\w+Props|\w+Ref|Styled\w+$/,
  },
  layout: 'centered',
  backgrounds: {
    default: 'background',
    values: [
      { name: 'background', value: colors.background },
      { name: 'grayDark', value: colors.grayDark },
      { name: 'grayLight', value: colors.grayLight },
    ],
  },
  a11y: {
    element: '#root',
    config: {},
    options: {},
  },
};

export const decorators = [withDesign];
