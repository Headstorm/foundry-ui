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

const Background = styled.div`
  background-image: url(https://source.unsplash.com/weekly?landscape);
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100vh;
  width: 100vw;
`;

storiesOf('Modal', module)
  .addParameters({ component: Modal })
  .add(
    'Default',
    () => {
      const [isOpen, setIsOpen] = useState(true);

      const handleClose = () => {
        setIsOpen(false);
        action('close')();
      };

      const buttonAttachment = select(
        'closeButtonAttachment',
        ['inside', 'outside', 'corner', 'none'],
        'inside',
      );

      return (
        <Background>
          <Card elevation={1} header="Use this button to open the modal again">
            <Button
              color={colors.primaryDark}
              StyledContainer={Button.Container}
              onClick={() => setIsOpen(true)}
            >
              Open modal
            </Button>
          </Card>
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
                The content of the modal (the card and everything inside it) is customizable. The
                close &times; is built-in but can be easily overwritten. It is the very model of a
                modern major React modal.
              </Card>
            </Modal>
          )}
        </Background>
      );
    },
    { design },
  );
