import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react';

import Spotlight, { SpotlightProps } from './Spotlight';
import { Button, Card } from '../../index';

export const AnimatedSpotlight: Story = () => {
  const [buttonRef, setRef] = useState<HTMLButtonElement>();

  return (
    <>
      {/*
      // @ts-ignore */}
      <Card
        footer={
          <Button
            containerRef={(newRef: HTMLButtonElement) => {
              if (newRef) {
                setRef(newRef);
              }
            }}
          >
            A button
          </Button>
        }
      >
        There are a few items in this card we can talk about
      </Card>
      <Spotlight
        // {...args}
        targetElementRef={{ current: buttonRef }}
      />
    </>
  );
};
AnimatedSpotlight.args = {
  animateTargetChanges: true,
  backgroundBlur: '4rem',
  shape: 'circular',
  padding: 8,
};

export default {
  title: 'Spotlight',
  component: Spotlight,
  parameters: {
    // { design }, Once we have a design for Spotlight we can link it here
  },
} as Meta;
