import React from 'react';
import { select, text } from '@storybook/addon-knobs';
import { storiesOf, addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { withDesign } from 'storybook-addon-designs';

import colors from '../../enums/colors';
import Label from './Label';

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
      color={select('Color', colors, colors.grayDark)}
    />
  ),
  { design },
);
