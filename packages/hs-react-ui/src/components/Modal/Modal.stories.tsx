import React, { useState } from 'react';
import styled from 'styled-components';
import { select, text, boolean, number, color } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import Modal from './Modal';
import Button, { ButtonContainer } from '../Button/Button';
import { mdiMessage, mdiSend } from '@mdi/js';
import colors from '../../enums/colors';

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A14',
};

const options = {
  none: '',
  mdiMessage,
  mdiSend,
};

storiesOf('Modal', module)
  .add(
    'Default',
    () => {
      const Background = styled.div`
        background-image: url(https://upload.wikimedia.org/wikipedia/commons/b/b7/Chicago_cityscape_%285253757001%29.jpg);
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;

        height: 100vh;
        width: 100vw;
      `;

      const ModalActionText = styled.span`
        cursor: pointer;
        margin-left: 0.5rem;
        margin-right: 0.5rem;

        color: #5a27e7;
      `;
      const [isOpen, setIsOpen] = useState(true);
      const ModalFooter = () => (
        <>
          <ModalActionText onClick={() => setIsOpen(false)}>Cancel</ModalActionText>
          <ModalActionText onClick={() => setIsOpen(false)}>Okay</ModalActionText>
        </>
      );

      return (
        <Background>
          {!isOpen && (
            <Button StyledContainer={Button.Container} onClick={() => setIsOpen(true)}>
              Toggle modal
            </Button>
          )}
          {isOpen && (
            <Modal
              header={text('header', 'Title')}
              body={text('body', 'Wait! You need to see this important information!')}
              footer={<ModalFooter />}
              insideClose={boolean('insideClose', false)}
              backgroundDarkness={number('backgroundDarkness', 1, {
                range: true,
                min: 0,
                max: 1,
                step: 0.05,
              })}
              backgroundBlur={`${number('backgroundBlur', 0, {
                range: true,
                min: 0,
                max: 5,
                step: 0.1,
              })}rem`}
              onClose={() => {
                setIsOpen(false);
                action('click')();
              }}
            />
          )}
        </Background>
      );
    },
    { design },
  )

  .add(
    'Button Modal',
    () => {
      const Background = styled.div`
        background-image: url(https://upload.wikimedia.org/wikipedia/commons/b/b7/Chicago_cityscape_%285253757001%29.jpg);
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
      `;
      const [isOpen, setIsOpen] = useState(true);
      return (
        <Background>
          {!isOpen && (
            <Button StyledContainer={ButtonContainer} onClick={() => setIsOpen(true)}>
              Toggle modal
            </Button>
          )}
          {isOpen && (
            <Button
              type={select('type', Button.ButtonTypes, Button.ButtonTypes.fill)}
              color={color('color', colors.grayDark)}
              onClick={() => setIsOpen(false)}
              isLoading={boolean('isLoading', false)}
              elevation={number('elevation', 0)}
              isProcessing={boolean('isProcessing', false)}
              iconPrefix={select('iconPrefix', options, options.none)}
              iconSuffix={select('iconSuffix', options, options.none)}
            >
              {text('children', 'Default text')}
            </Button>
          )}
        </Background>
      );
    },
    { design },
  );
