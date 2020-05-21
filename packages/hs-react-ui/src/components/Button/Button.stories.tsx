import React from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';
import { select, text, boolean, withKnobs } from '@storybook/addon-knobs';
import Icon from '@mdi/react';
import { mdiLeadPencil, mdiLoading } from '@mdi/js';
import { ButtonContainers, ButtonContainer } from './ButtonContainers';
import Button from './Button';
import { ButtonTypes } from '../../enums/ButtonTypes';
import { storiesOf, addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { withDesign } from 'storybook-addon-designs';

addDecorator(withA11y);
addDecorator(withDesign);

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=83%3A2'
}; 

storiesOf('Button', module)
  .add('Basic Button', () => (
    <Button
    StyledContainer={ButtonContainers[select('StyledContainer', ButtonTypes, ButtonTypes.primary)]}
    onClick={action('button-click')}
  >
    {text('children', 'Default text')}
  </Button>
  ), { design })
  .add('Themed Button', () => {
    const isLoading = {
      icon: <Icon path={mdiLoading}
      size={1}
      horizontal
      vertical
      rotate={90}/>,
      children: 'Loading'
    };
    const icon = (<Icon path={mdiLeadPencil}
      size={1}
      horizontal
      vertical
      rotate={90}/>);

      const ThemedContainer = styled(ButtonContainer)`
      font-family: Helvetica;
      font-size: 2em;
      vertical-align: middle;
      text-align: center;
      line-height: .5em;
      background-color: rgb(51, 29, 138);
      color: white;
      width: 10em;
      height: 2em;
      border-radius: 2em;
      &:hover { background-color: rgb(51, 29, 138, .7); }
      &:active { background-color: rgb(51, 29, 138, .3); }
    `;

    return (
      <Button
        StyledContainer={ThemedContainer}
        isLoading={boolean('isLoading?', false) ? isLoading : null}
        icon={boolean('Icon?', true) ? icon : null}
        onClick={action('button-click')}
      >
        {text('children', 'Edit')}
      </Button>
    );
  }, { design })