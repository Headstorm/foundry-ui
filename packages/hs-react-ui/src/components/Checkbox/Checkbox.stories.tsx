import React from 'react';
import { action } from '@storybook/addon-actions';
import { select, text, boolean } from '@storybook/addon-knobs';

import Checkbox from './Checkbox';
import { CheckboxTypes } from '../../enums/CheckboxTypes';

export default {
    title: 'Checkbox',
    component: Checkbox,
};

export const Default = () => (
    <Checkbox
        checkboxType={select('CheckboxType', CheckboxTypes, CheckboxTypes.check)}
        checked={boolean("Checked", false)}
    >
        {text('Children', 'The label for the checkbox')}
    </Checkbox>
);
