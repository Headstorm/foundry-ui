import React from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';
import { select, text, boolean } from '@storybook/addon-knobs';
import Icon from '@mdi/react';
import { mdiLeadPencil } from '@mdi/js';
import { ButtonContainers } from './ButtonContainers';
import { CircularProgress } from '@material-ui/core';
import Button from './Button';
import { ButtonTypes } from '../../enums/ButtonTypes';

export default {
  title: 'Button',
  component: Button,
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=83%3A2'
  }
};

export const Basic = () => (
  <Button
    StyledContainer={ButtonContainers[select('Button Container', ButtonTypes, ButtonTypes.primary)]}
    onClick={action('button-click')}
  >
    {text('children', 'Default text')}
  </Button>
);

Basic.story = {
  name: 'Basic'
};

// text container on figma, icons, icon yes/no and then send in icon
const ThemedContainer = styled.button`
  display: inline-block;

  font-family: Helvetica;
  font-size: 2em;
  line-height: .3em;
  width: 10em;

  padding: .75em .75em;
  border-radius: 2em;

  border: 0 none;

  cursor: pointer;

  background-color: rgb(51, 29, 138);
  color: white;

  &:hover { background-color: rgb(51, 29, 138, .7); }
  &:active { background-color: rgb(51, 29, 138, .3); }
`;

export const ThemedButton = () => {
  const isLoading = {
    icon: <CircularProgress size={25} />,
    children: 'Loading'
  };
  const icon = (<Icon path={mdiLeadPencil}
    size={1}
    horizontal
    vertical
    rotate={90}/>)
  return (
    <Button
      StyledContainer={ThemedContainer}
      isLoading={boolean('Show loading?', false) ? isLoading : null}
      icon={boolean('Show icon?', true) ? icon : null}
      onClick={action('button-click')}
    >
      {text('children', 'Edit')}
    </Button>
  );
}