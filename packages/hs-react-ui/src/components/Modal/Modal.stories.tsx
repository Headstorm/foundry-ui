import React, { useState } from 'react';
import styled from 'styled-components';
import { number, text, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import Modal from './Modal';
import Button, { ButtonContainer, ButtonTypes } from '../Button/Button';

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A14',
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
              backgroundDarkness={number('backgroundDarkness', 0, {
                range: true,
                min: 0,
                max: 1,
                step: 0.05,
              })}
              backgroundBlur={`${number('backgroundBlur', 1, {
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
              StyledContainer={
                ButtonContainers[select('StyledContainer', ButtonTypes, ButtonTypes.primary)]
              }
              onClick={() => {
                setIsOpen(false);
                action('button-click')();
              }}
            >
              {text('children', 'Button Modal')}
            </Button>
          )}
        </Background>
      );
    },
    { design },
  );
