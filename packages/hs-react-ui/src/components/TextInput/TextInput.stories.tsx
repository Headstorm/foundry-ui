import React from 'react';
import { select } from '@storybook/addon-knobs';


import TextInput from './TextInput';
import { TextInputTypes } from '../../enums/TextInputTypes';

export default {
  title: 'TextInput',
  component: TextInput,
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A29'
  }
};

export const Basic = () => (
  <TextInput textInputType={select('Input Type', TextInputTypes, TextInputTypes.default)}
  >
    test
  </TextInput>
);

Basic.story = {
  name: 'Basic'
};