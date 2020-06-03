import React from 'react';
import { select, text, boolean } from '@storybook/addon-knobs';
import { storiesOf, addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { withDesign } from 'storybook-addon-designs';

import colors from '../../enums/colors';
import Label from './Label';
import TextInput from '../TextInput';

addDecorator(withA11y);
addDecorator(withDesign);

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A88',
};

storiesOf('Label', module).add(
  'Basic Label',
  () => (
    <Label
      labelText={text('labelText', 'This is the label text')}
      color={select('Color', colors, colors.grayLight)}
      colorValid={select('ColorValid', colors, colors.success)}
      colorInvalid={select('ColorInvalid', colors, colors.destructive)}
      isRequired={boolean('isRequired', false)}
      isValid={boolean('isValid', false)}
      htmlFor={text('htmlFor', 'default')}
    >

      <input id="default" />

    </Label>
  ),
  { design },
);
