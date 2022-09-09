import React from 'react';
import { withDesign } from 'storybook-addon-designs';
import { configureActions } from '@storybook/addon-actions';
import colors from '../src/enums/colors';
import { withFoundryContext } from './decorators';

configureActions({
  depth: 3,
  limit: 10,
});

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
  decorators: [withFoundryContext],
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
