import React, { useState } from 'react';
import styled from 'styled-components';
import { boolean, select, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import Modal from './Modal';
import Button from '../Button/Button';
import Card from '../Card';

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A14',
};

storiesOf('Modal', module).add(
  'Default',
  () => {
    const Background = styled.div`
      background-image: url(https://source.unsplash.com/weekly?landscape);
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
    const CardFooter = () => (
      <>
        <ModalActionText onClick={() => setIsOpen(false)}>Cancel</ModalActionText>
        <ModalActionText onClick={() => setIsOpen(false)}>Okay</ModalActionText>
      </>
    );

    const handleClose = () => {
      setIsOpen(false);
      action('close')();
    };

    const buttonAttachment = select(
      'closeButtonAttachment',
      ['inside', 'outside', 'corner'],
      'inside',
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
            closeButtonAttachment={buttonAttachment}
            closeButtonProps={{
              type: buttonAttachment === 'inside' ? 'link' : 'outline',
            }}
            backgroundDarkness={number('backgroundDarkness', 0.5, {
              range: true,
              min: 0,
              max: 1,
              step: 0.05,
            })}
            backgroundBlur={`${number('backgroundBlur', 0.5, {
              range: true,
              min: 0,
              max: 5,
              step: 0.1,
            })}rem`}
            onClickOutside={boolean('onClickOutside function', true) ? handleClose : undefined}
            onClose={handleClose}
          >
            <Card footer={CardFooter} elevation={1}>
              Hello world!
            </Card>
          </Modal>
        )}
      </Background>
    );
  },
  { design },
);
