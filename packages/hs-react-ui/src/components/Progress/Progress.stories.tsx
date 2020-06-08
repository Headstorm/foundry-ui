import React from 'react';
import { storiesOf, addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { withDesign } from 'storybook-addon-designs';
import Progress from './Progress';

addDecorator(withA11y);
addDecorator(withDesign);

// Once we have a design, we can use this block to set it
// const design = {
//   type: 'figma',
//   url: '',
// };

storiesOf('Progress', module).add(
  'Basic Progress',
  () => <Progress />,
  // { design }, Once we have a design for Progress we can link it here
);
