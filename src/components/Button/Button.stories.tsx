import * as React from 'react';
import styled from 'styled-components';

import { Story, Meta } from '@storybook/react';

import { mdiMessage, mdiSend } from '@mdi/js';

import Button, { ButtonProps } from './Button';

import variants from 'src/enums/variants';
import colors from 'src/enums/colors';
import FeedbackTypes from 'src/enums/feedbackTypes';

const StyledIconContainer = styled.div`
  z-index: 1;
  margin-left: 1em;
  transition: transform 0.5s ease;
  &:hover {
    transform: rotate(180deg);
  }
`;

export const BasicButton: Story<ButtonProps> = args => <Button {...args} />;
BasicButton.args = {
  variant: variants.fill,
  color: colors.primaryDark,
  disabled: false,
  feedbackType: FeedbackTypes.ripple,
  isLoading: false,
  elevation: 1,
  isProcessing: false,
  iconPrefix: 'none',
  iconSuffix: 'none',
  children: 'Default text',
  StyledRightIconContainer: StyledIconContainer,
};

const iconOptions = {
  options: ['none', 'mdiMessage', 'mdiSend'],
  mapping: {
    none: '',
    mdiMessage,
    mdiSend,
  },
  control: {
    type: 'radio',
  },
};

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    elevation: { control: { type: 'range', min: -5, max: 5, step: 1 } },
    iconPrefix: iconOptions,
    iconSuffix: iconOptions,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=83%3A2',
    },
  },
} as Meta;
