import React from 'react';
import { select, text, boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import colors from '../../enums/colors';
import Label from './Label';
import TextInput from '../TextInput';

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A88',
};

storiesOf('Label', module).add(
  'Basic Label',
  () => (
    <Label
      labelText={text('labelText', 'This is the label text')}
      color={select('Color', colors, colors.grayDark)}
      colorValid={select('ColorValid', colors, colors.success)}
      colorInvalid={select('ColorInvalid', colors, colors.destructive)}
      isRequired={boolean('isRequired', false)}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      isValid={select('isValid', { true: true, false: false, undefined }, undefined)}
      htmlFor={text('htmlFor', 'default')}
    >
      <TextInput id={text('htmlFor', 'default')} placeholder="placeholder" />
    </Label>
  ),
  { design, centered: true },
);
