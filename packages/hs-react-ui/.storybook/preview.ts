import { withKnobs } from '@storybook/addon-knobs';
import { withDesign } from 'storybook-addon-designs';
import { addDecorator, addParameters } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import Colors from '../src/enums/colors';

addParameters({
  backgrounds: [
    { name: 'grayDark', value: colors.grayDark},
    { name: 'grayLight', value: colors.grayLight },
    { name: 'background', value: colors.background, default: true  },
  ],
});

addDecorator(withKnobs);
addDecorator(withDesign);
addDecorator(withInfo);