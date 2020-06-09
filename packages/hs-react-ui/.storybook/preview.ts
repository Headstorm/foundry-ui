import { withKnobs } from '@storybook/addon-knobs';
import { withDesign } from 'storybook-addon-designs';
import { addDecorator, addParameters } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withA11y } from '@storybook/addon-a11y';
import withCenter from '../src/storyDecorators/withCenter';

import colors from '../src/enums/colors';

addParameters({
  backgrounds: [
    { name: 'grayDark', value: Colors.grayDark },
    { name: 'grayLight', value: Colors.grayLight },
    { name: 'background', value: Colors.background, default: true },
  ],
});

addDecorator(withCenter);
addDecorator(withA11y);
addDecorator(withKnobs);
addDecorator(withDesign);
