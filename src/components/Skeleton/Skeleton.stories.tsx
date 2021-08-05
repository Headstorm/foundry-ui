import React from 'react';
import { Story, Meta } from '@storybook/react';
import styled from 'styled-components';
import { mdiPhone } from '@mdi/js';

import colors from '../../enums/colors';

import Skeleton, { SkeletonProps } from './Skeleton';
import Divider from '../Divider';
import Card from '../Card';
import Text from '../Text';

const HorizontalFlexBody = styled(Card.Body)`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  flex-flow: row nowrap;
`;

const PhotoContainer = styled.div`
  border-radius: 50%;
  overflow: hidden;
`;

const ProfilePhoto = styled.div`
  width: 5rem;
  height: 5rem;
  background-image: url('https://source.unsplash.com/collection/19271953');
  background-size: cover;
  background-repeat: no-repeat;
`;

const ProfileLine = styled(Skeleton.Container)`
  margin-bottom: 0.5rem;
  display: inline-block;
`;

const Name = styled(Text.Container)`
  font-weight: bold;
  font-size: 1.125rem;
`;

export const LoadingProfileExample: Story = ({ isLoading, color }: SkeletonProps) => (
  <Card StyledBody={HorizontalFlexBody} elevation={0}>
    <PhotoContainer>
      <Skeleton isLoading={isLoading} color={color}>
        <ProfilePhoto />
      </Skeleton>
    </PhotoContainer>
    <div>
      <Skeleton isLoading={isLoading} color={color} StyledContainer={ProfileLine}>
        <Text StyledContainer={Name}>Jane Doe</Text>
      </Skeleton>
      <br />
      <Skeleton isLoading={isLoading} color={color} StyledContainer={ProfileLine}>
        <Text>Master of Ceremonies</Text>
      </Skeleton>
      <Divider />
      <Text color={colors.success} isLoading={isLoading} iconPrefix={mdiPhone}>
        214-555-1234
      </Text>
    </div>
  </Card>
);
LoadingProfileExample.args = {
  // variant: variants.fill,
  color: colors.grayLight,
  children: 'Default text',
  isLoading: true,
};

export default {
  title: 'Skeleton',
  component: Skeleton,
  parameters: {
    // { design }, Once we have a design for Skeleton we can link it here
  },
} as Meta;
