import React from 'react';
import styled from 'styled-components';
import { number } from '@storybook/addon-knobs';
import colors from '../../constants/colors';

import Divider from './Divider';

export default {
  title: 'Divider',
  component: Divider
};

/* Default */

export const Default = () => (
  <Divider 
    width={number('width', 90, { range: true, min: 1, max: 100, step: 1 })}
    height={number('height', 1)}
  />
);

/* Themed */

const ThemedDivider = styled.hr`
  ${({ height, width }: { height: number, width: number }) => `
  box-shadow: 10px, 10px, ${colors.primary};
  border: none;
  background: radial-gradient(${colors.primary}, transparent);
  height: ${height}px;
    width: ${width}%;
  `}
`;

export const Themed = () => (
  <Divider 
    StyledDivider={ThemedDivider}
    width={number('width', 90, { range: true, min: 1, max: 100, step: 1 })}
    height={number('height', 1)}
  />
);
