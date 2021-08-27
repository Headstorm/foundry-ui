import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react';
import { mdiDotsVertical } from '@mdi/js';

import Spotlight, { SpotlightProps } from './Spotlight';
import { Button, Card, Dropdown } from '../../index';

export const AnimatedSpotlight: Story = (args: Partial<SpotlightProps>) => {
  const [buttonRef, setRef] = useState<HTMLButtonElement>();
  const [tourStarted, setTour] = useState<boolean>(false);

  return (
    <>
      <Card
        header={<Dropdown options={[]} valueContainerProps={{ iconSuffix: mdiDotsVertical }} />}
        footer={
          <Button
            onClick={() => {
              setTour(true);
            }}
            containerRef={setRef}
          >
            A button
          </Button>
        }
      >
        There are a few items in this card we can talk about
      </Card>
      {tourStarted && (
        <Spotlight {...args} targetElement={buttonRef}>
          <Button
            elevation={1}
            onClick={() => {
              setTour(false);
            }}
          >
            Skip
          </Button>
        </Spotlight>
      )}
    </>
  );
};
AnimatedSpotlight.args = {
  padding: 12,
};

export default {
  title: 'Spotlight',
  component: Spotlight,
  parameters: {
    // { design }, Once we have a design for Spotlight we can link it here
  },
} as Meta;
