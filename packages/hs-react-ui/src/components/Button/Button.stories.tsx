import React from 'react';
import { action } from '@storybook/addon-actions';
import { select, text, boolean, number, color } from '@storybook/addon-knobs';
import { mdiMessage, mdiSend } from '@mdi/js';
import { storiesOf } from '@storybook/react';

import Button from './Button';
import colors from '../../enums/colors';

const options = {
  none: '',
  mdiMessage,
  mdiSend,
};

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=83%3A2',
};

storiesOf('Button', module).add(
  'Basic Button',
  () => {
    return (
      <Button
        type={select('type', Button.ButtonTypes, Button.ButtonTypes.fill)}
        color={color('color', colors.grayDark)}
        onClick={action('button-click')}
        isLoading={boolean('isLoading', false)}
        elevation={number('elevation', 0)}
        isProcessing={boolean('isProcessing', false)}
        iconPrefix={select('iconPrefix', options, options.none)}
        iconSuffix={select('iconSuffix', options, options.none)}
      >
        {text('children', 'Default text')}
      </Button>
    );
  },
  { design },
);
