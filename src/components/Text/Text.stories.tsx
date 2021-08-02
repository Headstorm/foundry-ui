import React from 'react';
import { Story, Meta } from '@storybook/react';

import Icon from '@mdi/react';
import * as Icons from '@mdi/js';

import Text from './Text';
import colors from '../../enums/colors';

const options = {
  none: '',
  ...Icons,
};

export const Default: Story = args => {
  const getIconPath = (path: string) => (path ? <Icon size={args.size} path={path} /> : undefined);

  return (
    <Text
      {...args}
      iconPrefix={getIconPath(args.iconPrefix)}
      iconSuffix={getIconPath(args.iconSuffix)}
    ></Text>
  );
};
Default.args = {
  size: '1rem',
  color: colors.grayDark,
  iconPrefix: 'mdiComment',
  iconSuffix: 'mdiComment',
  isProcessing: false,
  isLoading: false,
  children: 'Lorem ipsum dolor sit amet.',
};

const iconOptions = {
  options: Object.keys(options),
  mapping: options,
  control: {
    type: 'select',
  },
};

export default {
  title: 'Text',
  component: Text,
  argTypes: {
    iconPrefix: iconOptions,
    iconSuffix: iconOptions,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=83%3A17',
    },
  },
} as Meta;
