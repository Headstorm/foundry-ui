import React from 'react';
import { Story, Meta } from '@storybook/react';
import styled from 'styled-components';

import colors from '../../enums/colors';

import Skeleton from './Skeleton';
import Card from '../Card';
import Text from '../Text';

const HorizontalFlexBody = styled(Card.Body)`
  display: flex;
  gap: 1rem;
  align-items: center;
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

const Name = styled(Text.Container)`
  font-weight: bold;
  font-size: 1.125rem;
`;

export const BasicSkeleton: Story = args => (
  <Card StyledBody={HorizontalFlexBody} elevation={0}>
    <PhotoContainer>
      <Skeleton {...args}>
        <ProfilePhoto />
      </Skeleton>
    </PhotoContainer>
    <div>
      <Skeleton
        {...args}
        containerProps={{ style: { display: 'inline-block', marginBottom: '.5rem' } }}
      >
        <Text StyledContainer={Name}>Jane Doe</Text>
      </Skeleton>
      <br />
      <Skeleton {...args} containerProps={{ style: { display: 'inline-block' } }}>
        <Text>Master of Ceremonies</Text>
      </Skeleton>
    </div>
  </Card>
);
BasicSkeleton.args = {
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
