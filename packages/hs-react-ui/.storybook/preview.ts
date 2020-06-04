import { withKnobs } from '@storybook/addon-knobs';
import { withDesign } from 'storybook-addon-designs';
import { addDecorator, addParameters } from '@storybook/react';

import Colors from '../src/enums/colors';

addParameters({
  backgrounds: [
    { name: 'grayDark', value: Colors.grayDark },
    { name: 'grayLight', value: Colors.grayLight },
    { name: 'background', value: Colors.background, default: true },
  ],
});

addDecorator(withKnobs);
addDecorator(withDesign);
