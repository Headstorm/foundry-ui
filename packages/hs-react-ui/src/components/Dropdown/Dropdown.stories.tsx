import React from 'react';

import { storiesOf, addDecorator } from '@storybook/react';
import { boolean, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { withDesign } from 'storybook-addon-designs';
import {Dropdown, ValueContainer} from './Dropdown';
import styled from 'styled-components';
import {readableColor} from 'polished';
import colors from '../../enums/colors';

addDecorator(withDesign);
const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A28',
};

storiesOf('Dropdown', module).add(
  'Basic',
  () => {
    const options = ['Apple', 'Banana', 'Grapefruit', 'Grape', 'Orange', 'Watermelon'];
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
        />
      </>
    );
  },
  { design },

).add(
  'Themed',
  () => {
    const options = ['Free parking', 'Paid parking', 'Stadium seating', 'Office seating'];
    const StyledValueContainer = styled(ValueContainer)`
      background-color: #8D1EF8;
    `
    return (
      <Dropdown
        StyledValueContainer={StyledValueContainer}
        clearable={boolean('clearable', false)}
        elevation={number('elevation', 2, { range: true, min: 0, max: 5, step: 1 })}
        name="fave-fruit"
        onBlur={action('onBlur')}
        onClear={action('onClear')}
        onSelect={action('onSelect')}
        options={options}
        valueColor={readableColor('#8D1EF8', '#000', '#fff')}
      />
    )
  }
);
