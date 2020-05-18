import React from 'react';
import { ColorTypes } from 'src/enums/ColorTypes';
import Label from './Label';

export default {
  title: 'Label',
  component: Label,
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A88'
  }
};

export const Basic = () => (
  <Label
    labelText="This is a label"
    color={ColorTypes.destructive}
  />
);

Basic.story = {
  name: 'Basic'
}
