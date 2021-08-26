import React, { useRef } from 'react';
import { Story, Meta } from '@storybook/react';

import Spotlight from './Spotlight';
import { Button, Card } from '../../index';

export const AnimatedSpotlight: Story = () => {
  const buttonRef = useRef<HTMLButtonElement>();
  console.log(buttonRef.current);

  return (
    <>
      {/*
      // @ts-ignore */}
      <Card footer={<Button containerRef={buttonRef}>A button</Button>}>
        There are a few items in this card we can talk about
      </Card>
      <Spotlight targetElementRef={buttonRef} />
    </>
  );
};
AnimatedSpotlight.args = {
  animateTargetChanges: true,
  backgroundBlur: 4,
  children: 'Default text',
  isLoading: true,
  shape: 'rounded box',
  padding: 8,
};

export default {
  title: 'Spotlight',
  component: Spotlight,
  parameters: {
    // { design }, Once we have a design for Spotlight we can link it here
  },
} as Meta;
