import React from 'react';
import { Story, Meta } from '@storybook/react';

import Skeleton from './Skeleton';

// Once we have a design, we can use this block to set it
// const design = {
//   type: 'figma',
//   url: '',
// };

export const BasicSkeleton: Story = args => <Skeleton {...args} />;

export default {
  title: 'Skeleton',
  component: Skeleton,
  parameters: {
    // { design }, Once we have a design for Skeleton we can link it here
  },
} as Meta;
