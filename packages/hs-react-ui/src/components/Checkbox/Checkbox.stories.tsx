import React from 'react';
import { action } from '@storybook/addon-actions';
import { select, text, boolean } from '@storybook/addon-knobs';
import { storiesOf, addDecorator } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import { withA11y } from '@storybook/addon-a11y';

import Checkbox from './Checkbox';
import { CheckboxTypes } from '../../enums/CheckboxTypes';

addDecorator(withA11y);
addDecorator(withDesign);

const design = {
    type: 'figma', 
    url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=0%3A1'
}

storiesOf('Checkbox', module)
    .add('Default', () => (
        <Checkbox
        checkboxType={select('CheckboxType', CheckboxTypes, CheckboxTypes.check)}
        checked={boolean("Checked", false)}
    >
        {text('Children', 'The label for the checkbox')}
    </Checkbox>
    ), { design })