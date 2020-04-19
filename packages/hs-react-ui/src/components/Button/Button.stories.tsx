import React from 'react';
import { action } from '@storybook/addon-actions';
import { select, text } from '@storybook/addon-knobs';

import Button from './Button';
import { ButtonTypes } from 'enums/ButtonTypes';

export default {
  title: 'Button',
  component: Button
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