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

const getIconPrefixPath = (path: string) => path ? <Icon size={'16px'} path={path} /> : null
const getIconSuffixPath = (path: string) => path ? <Icon size={'16px'} path={path} /> : null

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
    color={color('color', colors.grayXlight)}
    iconPrefix={getIconPrefixPath(select('iconPrefix', options, options.mdiComment))}
    iconSuffix={getIconSuffixPath(select('iconPrefix', options, options.mdiComment))}
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
    size={text('size', '1rem')}
    color={color('color', colors.grayDark)}
    iconPrefix={getIconPrefixPath(select('iconPrefix', options, options.mdiComment))}
    iconSuffix={getIconSuffixPath(select('iconPrefix', options, options.mdiComment))}
    isProcessing={boolean('isProcessing', false)}
    isLoading={boolean('isLoading', false)}
  >
    {text('children', 'Lorem ipsum dolor sit amet.')}
  </Text>
);