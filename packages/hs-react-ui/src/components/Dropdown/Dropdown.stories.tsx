import React from 'react';

import styled from 'styled-components';
import { storiesOf, addDecorator } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { withDesign } from 'storybook-addon-designs';
import { Dropdown } from './Dropdown';

const OtherDomElement = styled.div`background: red; height: 10rem; width: 10rem;`
const Background = styled.div`background: white; height: 100%;`;
storiesOf('Dropdown', module)
  .add('test', () => {
    const options = ['Cat', 'Dog', 'Bowl of Doritos'];
    return (
      <Background>
        <label htmlFor={'fave-pet'}>Favorite Pet?</label>
        <Dropdown
          multi={boolean('multi', false)}
          name={'fave-pet'}
          onSelect={(selected) => console.log(selected)}
          options={options}
        />
        <OtherDomElement>Hey I'm here don't move me</OtherDomElement>
    </Background>)
  });