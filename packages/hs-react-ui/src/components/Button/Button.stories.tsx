import React from 'react';
import { action } from '@storybook/addon-actions';
import { select, text } from '@storybook/addon-knobs';

import Button from './Button';
import { ButtonTypes } from '../../enums/ButtonTypes';

export default {
  title: '',
  component: Button,
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=83%3A2'
  }
};

export const Basic = () => (
  <Button
    buttonType={select('Button Type', ButtonTypes, ButtonTypes.primary)}
    onClick={action('button-click')}
  >
    {text('children', 'Default text')}
  </Button>
);

Basic.story = {
  name: 'Basic'
};