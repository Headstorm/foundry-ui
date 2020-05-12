import React from 'react';
import Modal from './Modal';

export default {
  title: 'Modal',
  component: Modal
};

export const Test = () => (
  <Modal
    header={<><span>Title</span><span>x</span></>}
    body={'body'}
    footer={'footer'} />
);
