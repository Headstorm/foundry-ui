import { withKnobs } from '@storybook/addon-knobs';
import { withDesign } from 'storybook-addon-designs';
import { addDecorator, addParameters } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withA11y } from '@storybook/addon-a11y';
import { withCenter } from './withCenter';
import './docPagesStyle.css';

import colors from '../src/enums/colors';

addParameters({
  backgrounds: [
    { name: 'grayDark', value: colors.grayDark },
    { name: 'grayLight', value: colors.grayLight },
    { name: 'background', value: colors.background, default: true },
  ],
});

addDecorator(withCenter);
addDecorator(withA11y);
addDecorator(withKnobs);
addDecorator(withDesign);
