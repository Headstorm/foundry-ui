import React from 'react';
import styled from 'styled-components';
import { color as color2, text, boolean, select } from '@storybook/addon-knobs';

import Icon from '@mdi/react';
import * as Icons from '@mdi/js';
import Text from './Text';
import colors from '../../enums/colors';
import timings from '../../enums/timings';

export default {
  title: 'Text',
  component: Text,
};

const themeColors = {
  ...colors,
  background: 'beige',
  primary: 'purple',
};

const themeTimings = {
  ...timings,
  xSlow: '2s',
};

const options = {
  none: '',
  ...Icons,
};

const getIconPath = (path: string) => (path ? <Icon size="16px" path={path} /> : undefined);

const ThemedContainer = styled.div`
  ${({ size, color }: { size: number | string; color: string }) => `
    width: fit-content;
    background-color: ${themeColors.background};
    transition: transform ${themeTimings.xSlow};
    font-family: Roboto, sans-serif;
    font-size: ${size};
    color: ${color};
    border: 1px solid ${themeColors.primary};
  `}
`;

/* Default */

export const Default = () => (
  <Text
    size={text('size', '1rem')}
    color={color2('color', colors.grayXlight)}
    iconPrefix={getIconPath(select('iconPrefix', options, options.mdiComment))}
    iconSuffix={getIconPath(select('iconSuffix', options, options.mdiComment))}
    isProcessing={boolean('isProcessing', false)}
    isLoading={boolean('isLoading', false)}
  >
    {text('children', 'Lorem ipsum dolor sit amet.')}
  </Text>
);

/* Themed with a static Icon */

export const ThemedTextWithStaticIcons = () => (
  <Text
    StyledContainer={ThemedContainer}
    size={text('size', '1rem')}
    color={color2('color', colors.grayDark)}
    iconPrefix={getIconPath(select('iconPrefix', options, options.mdiComment))}
    iconSuffix={getIconPath(select('iconPrefix', options, options.mdiComment))}
    isProcessing={boolean('isProcessing', false)}
    isLoading={boolean('isLoading', false)}
  >
    {text('children', 'Lorem ipsum dolor sit amet.')}
  </Text>
);

/* Themed with all knobs */

export const ThemedText = () => (
  <Text
    StyledContainer={ThemedContainer}
    size={text('size', '1rem')}
    color={color2('color', colors.grayDark)}
    iconPrefix={getIconPath(select('iconPrefix', options, options.mdiComment))}
    iconSuffix={getIconPath(select('iconSuffix', options, options.mdiComment))}
    isProcessing={boolean('isProcessing', false)}
    isLoading={boolean('isLoading', false)}
  >
    {text('children', 'Lorem ipsum dolor sit amet.')}
  </Text>
);
