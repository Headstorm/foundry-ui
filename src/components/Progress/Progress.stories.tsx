import React from 'react';
import { Story, Meta } from '@storybook/react';

import Progress from './Progress';

// Once we have a design, we can use this block to set it
// const design = {
//   type: 'figma',
//   url: '',
// };

// TODO - add a reusable deprecation warning to this story
export const BasicProgress: Story = args => <Progress {...args} />;

export default {
  title: 'Progress',
  component: Progress,
  parameters: {
    // { design }, Once we have a design for Progress we can link it here
  },
} as Meta;
