import React from 'react';

import { storiesOf, addDecorator } from '@storybook/react';
import {boolean, number, select} from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { withDesign } from 'storybook-addon-designs';
import { Dropdown } from './Dropdown';

addDecorator(withDesign);
const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A28',
};

storiesOf('Dropdown', module).add(
  'Basic',
  () => {
    const options = ['Apple', 'Banana', 'Grapefruit', 'Grape', 'Orange', 'Watermelon'];
    const selectedValue = select('values', options, undefined);
    const values = selectedValue ? [selectedValue] : undefined;
    return (
      <>
        <label htmlFor="fave-fruit">What's your favorite fruit?</label>
        <Dropdown
          clearable={boolean('clearable', false)}
          elevation={number('elevation', 2, { range: true, min: 0, max: 5, step: 1 })}
          multi={boolean('multi', false)}
          name="fave-fruit"
          onBlur={action('onBlur')}
          onClear={action('onClear')}
          onSelect={action('onSelect')}
          options={options}
          values={values}
        />
      </>
    );
  },
  { design },

);
