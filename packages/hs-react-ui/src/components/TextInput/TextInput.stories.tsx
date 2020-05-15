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
  <div>
    <TextInput textInputType={select('Input Type', TextInputTypes, TextInputTypes.default)}
    >
      test
  </TextInput>
    <TextInput textInputType={select('Input Type', TextInputTypes, TextInputTypes.clearable)}
    >
      test
  </TextInput>
    <TextInput textInputType={select('Input Type', TextInputTypes, TextInputTypes.placeHolder)}
    >
      test
  </TextInput>
    <TextInput textInputType={select('Input Type', TextInputTypes, TextInputTypes.error)}
    >
      test
  </TextInput>
    <TextInput textInputType={select('Input Type', TextInputTypes, TextInputTypes.icon)}
    >
      test
  </TextInput>
    <TextInput textInputType={select('Input Type', TextInputTypes, TextInputTypes.multiLine)}
    >
      test
  </TextInput>
  </div>
);

