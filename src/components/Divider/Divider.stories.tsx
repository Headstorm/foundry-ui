import React from 'react';
import styled from 'styled-components';

import { Story, Meta } from '@storybook/react';

import colors from '../../enums/colors';
import Divider from './Divider';

const Template: Story = args => <Divider {...args} />;

export const Default = Template.bind({});
Default.args = {
  width: '10rem',
  height: '1px',
};

const ThemedDivider = styled.hr`
  ${({ height, width }: { height: string; width: string }) => `
      box-shadow: 10px, 10px, ${colors.primary};
      border: none;
      background: radial-gradient(${colors.primary}, transparent);
      height: ${height};
        width: ${width};
    `}
`;

export const Themed = Template.bind({});
Themed.args = {
  ...Default.args,
  height: '2px',
  StyledDivider: ThemedDivider,
};

export default {
  title: 'Divider',
  component: Divider,
} as Meta;
