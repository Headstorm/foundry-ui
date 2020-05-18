import { withKnobs } from '@storybook/addon-knobs';
import { withDesign } from 'storybook-addon-designs';
import { addDecorator, addParameters } from '@storybook/react';

import { ColorTypes } from '../src/enums/ColorTypes';

addParameters({
  backgrounds: [
    { name: 'grayDark', value: ColorTypes.grayDark, default: true },
    { name: 'grayLight', value: ColorTypes.grayLight },
    { name: 'background', value: ColorTypes.background },
  ],
});

addDecorator(withKnobs);
addDecorator(withDesign);