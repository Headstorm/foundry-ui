import * as React from 'react';
import { Story, Meta } from '@storybook/react';

import colors from '../../enums/colors';
import Label, { LabelProps } from './Label';
import TextInput from '../TextInput';

type BasicLabelProps = LabelProps & { htmlFor: string };

export const BasicLabel: Story<BasicLabelProps> = ({ htmlFor, ...args }: BasicLabelProps) => {
  return (
    <Label {...args}>
      <TextInput id={htmlFor} placeholder="placeholder" />
    </Label>
  );
};
BasicLabel.args = {
  labelText: 'This is the label text',
  color: 'grayDark',
  colorValid: 'success',
  colorInvalid: 'destructive',
  isRequired: false,
  htmlFor: 'default',
};

const colorOptions = {
  options: Object.keys(colors),
  mapping: colors,
  control: {
    type: 'select',
  },
};

export default {
  title: 'Label',
  component: Label,
  argTypes: {
    color: colorOptions,
    colorValid: colorOptions,
    colorInvalid: colorOptions,
    isValid: {
      options: [true, false, undefined],
      control: {
        type: 'select',
      },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A88',
    },
  },
} as Meta;
