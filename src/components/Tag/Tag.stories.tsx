import React from 'react';
import { Story, Meta } from '@storybook/react';
import { mdiMessage, mdiSend } from '@mdi/js';

import Tag, { TagProps } from './Tag';
import colors from '../../enums/colors';
import variants from '../../enums/variants';

export const BasicTag: Story<TagProps> = args => <Tag {...args} />;
BasicTag.args = {
  variant: variants.outline,
  color: colors.primaryDark,
  isLoading: false,
  elevation: 0,
  isProcessing: false,
  iconPrefix: 'none',
  iconSuffix: 'none',
  containerProps: { 'data-test-id': `tag-${Math.floor(Math.random() * 100000)}` },
  children: 'Default text',
};

const iconOptions = {
  options: ['none', 'mdiMessage', 'mdiSend'],
  mapping: {
    none: '',
    mdiMessage,
    mdiSend,
  },
  control: {
    type: 'radio',
  },
};

export default {
  title: 'Tag',
  component: Tag,
  argTypes: {
    elevation: { control: { type: 'range', min: -5, max: 5, step: 1 } },
    iconPrefix: iconOptions,
    iconSuffix: iconOptions,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=0%3A1',
    },
  },
} as Meta;
