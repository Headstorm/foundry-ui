import * as React from 'react';
import { Story, Meta } from '@storybook/react';
import styled from 'styled-components';
import { withFoundryContext } from '../../../.storybook/decorators';
import colors from '../../enums/colors';
import Avatar, { AvatarProps } from './Avatar';

export const DefaultAvatar: Story<AvatarProps> = (args: AvatarProps) => <Avatar {...args} />;
DefaultAvatar.args = {
  placeholder: 'AA',
  children: '',
  size: 10,
  imgURL: 'https://source.unsplash.com/collection/19271953',
  borderRadiusPercent: 50,
  color: colors.grayXlight,
  isLoading: false,
};

const LabelContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 8px 0;
  text-align: center;
`;

export const LabelAvatar: Story<AvatarProps & { children: string }> = ({
  children,
  ...args
}: AvatarProps) => (
  <Avatar {...args}>
    <LabelContainer>{children}</LabelContainer>
  </Avatar>
);

LabelAvatar.args = {
  placeholder: 'JS',
  children: 'John Smith',
  size: 10,
  imgURL: 'https://source.unsplash.com/collection/19271953',
  borderRadiusPercent: 10,
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
