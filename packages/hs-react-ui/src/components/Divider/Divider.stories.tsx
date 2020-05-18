import React from 'react';
import styled from 'styled-components';
import { text, number } from '@storybook/addon-knobs';
import { ColorTypes } from '../../enums/ColorTypes';

import Divider from './Divider';

export default {
  title: 'Divider',
  component: Divider
};

/* Default */

export const Default = () => (
  <Divider 
  width={text('width', '90%')}
  height={text('height', '1px')}
  />
);

/* Themed */

const ThemedDivider = styled.hr`
  ${({ height, width }: { height: string, width: string }) => `
  box-shadow: 10px, 10px, ${ColorTypes.primary};
  border: none;
  background: radial-gradient(${ColorTypes.primary}, transparent);
  height: ${height};
    width: ${width};
  `}
`;

export const Themed = () => (
  <Divider 
    StyledDivider={ThemedDivider}
    width={text('width', '90%')}
    height={text('height', '2px')}
  />
);
