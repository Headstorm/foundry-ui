import React from 'react';
import styled from 'styled-components';
import { color, text, number, boolean, select } from '@storybook/addon-knobs';

import { ColorTypes } from 'src/enums/ColorTypes';
import { TimingTypes } from 'src/enums/TimingsTypes';
import Text from './Text';
import Icon from '@mdi/react';
import * as Icons from '@mdi/js';

export default {
  title: 'Text',
  component: Text
};

const themeColors = {
  ...ColorTypes,
  background: 'beige',
  primary: 'purple'
};

const themeTimings = {
  ...TimingTypes,
  xSlow: '2s',
}

const icon = <Icon path={Icons.mdiComment} size='1rem' />;

const ThemedContainer = styled.div`
  ${({ size, color }: { size: number | String, color: String }) => `
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
    color={color('color', ColorTypes.grayXlight)}
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
    size={text('size', '1rem')}
    color={color('color', ColorTypes.grayDark)}
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
    size={text('size', '1rem')}
    color={color('color', ColorTypes.grayDark)}
    iconPrefix={select('iconPrefix', options, options.none)}
    iconSuffix={select('iconSuffix', options, options.none)}
    isProcessing={boolean('isProcessing', false)}
    isLoading={boolean('isLoading', false)}
  >
    {text('children', 'Lorem ipsum dolor sit amet.')}
  </Text>
);