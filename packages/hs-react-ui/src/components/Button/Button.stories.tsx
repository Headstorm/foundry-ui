import React from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';
import { select, text, boolean, number, color } from '@storybook/addon-knobs';
import Icon from '@mdi/react';
import { mdiLeadPencil, mdiLoading } from '@mdi/js';
import { storiesOf, addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { withDesign } from 'storybook-addon-designs';
import Button from './Button';
import fonts from '../../enums/fonts';
import colors from '../../enums/colors';

const ButtonTypes = Button.Types;
const ButtonContainer = Button.Container;

const options = {
  none: '',
  mdiLeadPencil,
  mdiLoading,
};

addDecorator(withA11y);
addDecorator(withDesign);

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=83%3A2',
};

storiesOf('Button', module)
  .add(
    'Basic Button',
    () => {
      const useColor = boolean('Enable color property', false);
      const type = select('type', ButtonTypes, ButtonTypes.primary);

      return (
        <Button
          type={type}
          color={useColor ? color('color', colors.grayDark) : undefined}
          onClick={action('button-click')}
          isLoading={boolean('isLoading', false)}
          elevation={number('elevation', 0)}
          isProcessing={boolean('isProcessing', false)}
          iconPrefix={select('iconPrefix', options, options.none)}
          iconSuffix={select('iconSuffix', options, options.none)}
        >
          {text('children', 'Default text')}
        </Button>
      );
    },
    { design },
  )
  .add(
    'Themed Button',
    () => {
      const icon = <Icon path={mdiLeadPencil} size={1} horizontal vertical rotate={90} />;

      const ThemedContainer = styled(ButtonContainer)`
        ${fonts.body}
        font-size: 2em;
        vertical-align: middle;
        text-align: center;
        line-height: 0.5em;
        background-color: rgb(51, 29, 138);
        color: white;
        width: 10em;
        height: 2em;
        border-radius: 2em;
        &:hover {
          background-color: rgb(51, 29, 138, 0.7);
        }
        &:active {
          background-color: rgb(51, 29, 138, 0.3);
        }
      `;

      return (
        <Button
          StyledContainer={ThemedContainer}
          isLoading={boolean('isLoading', false)}
          iconPrefix={boolean('iconPrefix', true) ? icon : undefined}
          onClick={action('button-click')}
        >
          {text('children', 'Edit')}
        </Button>
      );
    },
    { design },
  );
