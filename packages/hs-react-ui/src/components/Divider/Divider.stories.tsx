import React from 'react';
import styled from 'styled-components';
import { text } from '@storybook/addon-knobs';

import { storiesOf } from '@storybook/react';

import colors from '../../enums/colors';
import Divider from './Divider';

storiesOf('Divider', module)
  .add('Default', () => <Divider width={text('width', '10rem')} height={text('height', '1px')} />)
  .add('Themed', () => {
    const ThemedDivider = styled.hr`
      ${({ height, width }: { height: string; width: string }) => `
      box-shadow: 10px, 10px, ${colors.primary};
      border: none;
      background: radial-gradient(${colors.primary}, transparent);
      height: ${height};
        width: ${width};
    `}
    `;
    return (
      <Divider
        StyledDivider={ThemedDivider}
        width={text('width', '10rem')}
        height={text('height', '2px')}
      />
    );
  });
