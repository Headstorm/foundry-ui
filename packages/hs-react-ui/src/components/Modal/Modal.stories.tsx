import React, { useState } from 'react';
import styled from 'styled-components';
import { boolean, select, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import colors from '../../enums/colors';
import Modal from './Modal';
import Button from '../Button/Button';
import Card from '../Card';

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A14',
};

storiesOf('Modal', module)
  .addParameters({ component: Modal })
  .add(
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
      const [isOpen, setIsOpen] = useState(true);

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
            <Button
              color={colors.primaryDark}
              elevation={1}
              StyledContainer={Button.Container}
              onClick={() => setIsOpen(true)}
            >
              Toggle modal
            </Button>
          )}
          {isOpen && (
            <Modal
              closeButtonAttachment={buttonAttachment}
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
              <Card
                header="Hello world!"
                footer={
                  <Button color={colors.primaryDark} onClick={handleClose}>
                    Okay...
                  </Button>
                }
                elevation={1}
              >
                Welcome to the wonderful world of modals. Hope you have a great time, and please
                pick up a t-shirt or mug from the giftshop on your way out!
              </Card>
            </Modal>
          )}
        </Background>
      );
    },
    { design },
  );
