import { withKnobs } from '@storybook/addon-knobs';
import { withDesign } from 'storybook-addon-designs';
import { addDecorator, addParameters } from '@storybook/react';

import Colors from '../src/enums/Colors';

addParameters({
  backgrounds: [
    { name: 'grayDark', value: Colors.grayDark, default: true },
    { name: 'grayLight', value: Colors.grayLight },
    { name: 'background', value: Colors.background },
  ],
});

addDecorator(withKnobs);
addDecorator(withDesign);