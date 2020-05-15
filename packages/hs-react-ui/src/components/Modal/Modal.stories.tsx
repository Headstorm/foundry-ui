import React, {useState} from 'react';
import Modal from './Modal';
import styled from 'styled-components';
import {number, text} from '@storybook/addon-knobs';
import Button from '../Button';
import {ButtonTypes} from '../../enums/ButtonTypes';
import {action} from '@storybook/addon-actions';

export default {
  title: 'Modal',
  component: Modal
};

const Background = styled.div`
  background-image: url(https://upload.wikimedia.org/wikipedia/commons/b/b7/Chicago_cityscape_%285253757001%29.jpg);
  background-size: cover;

  height: 100vh;
  width: 100vw;
`

const ModalActionText = styled.span`
  cursor: pointer;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  
  color: #5A27E7;
`

export const Test = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ModalFooter = () => (
    <>
      <ModalActionText onClick={() => setIsOpen(false)}>Cancel</ModalActionText>
      <ModalActionText onClick={() => setIsOpen(false)}>Okay</ModalActionText>
    </>
  );

  return (
    <Background>
      {!isOpen && <Button
        buttonType={ButtonTypes.default}
        onClick={() => setIsOpen(true)}
      >Toggle modal</Button>}
      {isOpen && <Modal
        header={text('header', 'Title')}
        body={text('body', 'Wait! You need to see this important information!')}
        footer={<ModalFooter />}

        backgroundDarkness={number('backgroundDarkness', 10, { range: true, min: 0, max: 100, step: 1 })}
        backgroundBlur={`${number('backgroundBlur', 1, { range: true, min: 0, max: 5, step: 0.1})}rem`}

        onClose={() => {
          setIsOpen(false);
          action('click')();
        }}
      />}
    </Background>
  );
};
