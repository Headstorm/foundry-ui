import React, { useState } from 'react';
import styled from 'styled-components';
import { Story, Meta } from '@storybook/react';

import colors from '../../enums/colors';
import Modal, { ModalProps } from './Modal';
import Button from '../Button/Button';
import Card from '../Card';

const Background = styled.div`
  background-image: url(https://source.unsplash.com/weekly?landscape);
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100vh;
  width: 100vw;
`;

type DefaultProps = Omit<ModalProps, 'backgroundBlur'> & {
  backgroundBlur: number;
  'onClickOutside function': boolean;
  onClose: () => void;
};

export const Default: Story<DefaultProps> = ({
  backgroundBlur,
  'onClickOutside function': onClickOutside,
  onClose,
  ...args
}: DefaultProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

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
          {...args}
          backgroundBlur={`${backgroundBlur}rem`}
          onClickOutside={onClickOutside ? handleClose : undefined}
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
            The content of the modal (the card and everything inside it) is customizable. The close
            &times; is built-in but can be easily overwritten. It is the very model of a modern
            major React modal.
          </Card>
        </Modal>
      )}
    </Background>
  );
};
Default.args = {
  closeButtonAttachment: 'inside',
  backgroundDarkness: 0.5,
  backgroundBlur: 0.5,
  'onClickOutside function': true,
};

export default {
  title: 'Modal',
  component: Modal,
  argTypes: {
    closeButtonAttachment: {
      options: ['inside', 'outside', 'corner'],
      control: {
        type: 'select',
      },
    },
    backgroundDarkness: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
    },
    backgroundBlur: {
      control: { type: 'range', min: 0, max: 5, step: 0.1 },
    },
  },
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A14',
    },
  },
} as Meta;
