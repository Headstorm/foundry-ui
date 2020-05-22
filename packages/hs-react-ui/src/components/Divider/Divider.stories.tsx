import React from 'react';
import styled from 'styled-components';
import { text } from '@storybook/addon-knobs';

import { storiesOf, addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { withDesign } from 'storybook-addon-designs';
import Divider from './Divider';
import colors from '../../constants/colors';

addDecorator(withA11y);

storiesOf('Divider', module)
  .add('Default', () => (
    <Divider
      width={text('width', '90%')}
      height={text('height', '1px')}
    />
  ))
  .add('Themed', () => {
    const ThemedDivider = styled.hr`
      ${({ height, width }: { height: string, width: string }) => `
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
        width={text('width', '90%')}
        height={text('height', '2px')}
      />
    );
  });
