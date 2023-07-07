import * as React from 'react';
import { Story, Meta } from '@storybook/react';
import { withFoundryContext } from '../../../.storybook/decorators';
import colors from '../../enums/colors';
import Avatar, { AvatarProps } from './Avatar';

export const DefaultAvatar: Story<AvatarProps> = (args: AvatarProps) => <Avatar {...args} />;
DefaultAvatar.args = {
  placeholder: 'AA',
  children: '',
  imgURL: 'https://source.unsplash.com/collection/19271953',
  borderRadiusPercent: 50,
  color: colors.grayXlight,
  isLoading: false,
};

export default {
  title: 'Avatar',
  component: Avatar,
  decorators: [withFoundryContext],
  argTypes: {
    borderRadiusPercent: { control: { type: 'range', min: 0, max: 50, step: 1 } },
  },
} as Meta;
