import React, { useState } from 'react';

import { storiesOf } from '@storybook/react';
import { boolean, color, number, select, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import DatePicker from './DatePicker';

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Foundry-UI?node-id=105%3A6',
};

storiesOf('DatePicker', module)
  .addParameters({ component: DatePicker })
  .add(
    'Basic',
    () => {
      return (
        <>
          <DatePicker />
        </>
      );
    },
    { design },
  );
