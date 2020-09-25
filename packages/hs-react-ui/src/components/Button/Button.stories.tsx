import React from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';
import { boolean, color, number, select, text } from '@storybook/addon-knobs';
import { mdiMessage, mdiSend } from '@mdi/js';
import { storiesOf } from '@storybook/react';

import Button from './Button';
import colors from '../../enums/colors';
import variants from '../../enums/variants';
import FeedbackTypes from '../../enums/feedbackTypes';

const options = {
  none: '',
  mdiMessage,
  mdiSend,
};

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=83%3A2',
};

const StyledIconContainer = styled.div`
  z-index: 1;
  margin-left: 1em;
  transition: transform 0.5s ease;
  &:hover {
    transform: rotate(180deg);
  }
`;

storiesOf('Button', module)
  .addParameters({ component: Button })
  .add(
    'Basic Button',
    () => {
      // const buttonContainerRef = React.createRef<HTMLButtonElement>();
      const buttonContainerRef = React.useRef<HTMLButtonElement>(null);
      const onClick = (e: React.SyntheticEvent) => {
        e.preventDefault();
        action('onClick')(
          `ref width x height: ${buttonContainerRef.current?.clientWidth} x ${buttonContainerRef.current?.clientHeight}`,
        );
      };

      return (
        <Button
          variant={select('variant', variants, variants.fill)}
          color={color('color', colors.primaryDark)}
          onClick={onClick}
          disabled={boolean('disabled', false)}
          feedbackType={select('feedbackType', FeedbackTypes, FeedbackTypes.ripple)}
          isLoading={boolean('isLoading', false)}
          elevation={number('elevation', 1)}
          isProcessing={boolean('isProcessing', false)}
          iconPrefix={select('iconPrefix', options, options.none)}
          iconSuffix={select('iconSuffix', options, options.none)}
          StyledRightIconContainer={StyledIconContainer}
          ref={buttonContainerRef}
        >
          {text('children', 'Default text')}
        </Button>
      );
    },
    { design },
  );
