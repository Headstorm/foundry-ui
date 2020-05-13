import React from 'react';
import styled from 'styled-components';
import { color, text, number, boolean, select } from '@storybook/addon-knobs';

import colors from 'src/constants/colors';
import timings from 'src/constants/timings';
import Text from './Text';
import Icon from '@mdi/react';
import * as Icons from '@mdi/js';

export default {
  title: 'Text',
  component: Text
};

const themeColors = {
  ...colors,
  background: 'beige',
  primary: 'purple'
};

const themeTimings = {
  ...timings,
  xSlow: '2s',
}

const icon = <Icon path={Icons.mdiComment} size='1rem' />;

const ThemedContainer = styled.div`
  ${({ size, color }) => `
    width: fit-content;
    background-color: ${themeColors.background};

    transition: transform ${themeTimings.xSlow};
    font-family: Roboto, sans-serif;
    font-size: ${size}rem;
    color: ${color};
    border: 1px solid ${themeColors.primary};
  `}
`;

/* Default */

export const Default = () => (
  <Text
    size={number('size', 1, { range: true, min: 0, max: 10, step: .5})}
    color={color('color', colors.grayDark)}
    iconPrefix={select('iconPrefix', options, options.mdiComment)}
    iconSuffix={select('iconSuffix', options, options.mdiComment)}
    isProcessing={boolean('isProcessing', false)}
    isLoading={boolean('isLoading', false)}
  >
    {text('children', 'Lorem ipsum dolor sit amet.')}
  </Text>
);

/* Themed with a static Icon */

export const ThemedTextWithStaticIcons= () => (
  <Text
    StyledContainer={ThemedContainer}
    size={number('size', 1, { range: true, min: 0, max: 10, step: .5})}
    color={color('color', colors.grayDark)}
    iconPrefix={icon}
    iconSuffix={icon}
    isProcessing={boolean('isProcessing', false)}
    isLoading={boolean('isLoading', false)}
  >
    {text('children', 'Lorem ipsum dolor sit amet.')}
  </Text>
);

const options = {
  none: '',
  ...Icons
};

/* Themed with all knobs */

export const ThemedText = () => (
  <Text
    StyledContainer={ThemedContainer}
    size={number('size', 1, { range: true, min: 0, max: 10, step: .5})}
    color={color('color', colors.grayDark)}
    iconPrefix={select('iconPrefix', options, options.none)}
    iconSuffix={select('iconSuffix', options, options.none)}
    isProcessing={boolean('isProcessing', false)}
    isLoading={boolean('isLoading', false)}
  >
    {text('children', 'Lorem ipsum dolor sit amet.')}
  </Text>
);