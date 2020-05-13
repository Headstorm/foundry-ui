import React from 'react';
import Modal from './Modal';
import styled from 'styled-components';

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
export const Test = () => (
  <Background>
    <Modal
      header={<><span>Title</span><span>x</span></>}
      body={'body'}
      footer={'footer'} />
  </Background>

);
