import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react';
import { mdiChevronDoubleRight, mdiDotsVertical } from '@mdi/js';
import styled from 'styled-components';

import Spotlight, { SpotlightProps } from './Spotlight';
import { Button, Card, Text, variants, colors } from '../../index';

const Header = styled(Card.NoPaddingHeader)`
  display: flex;
  justify-content: flex-end;
`;

export const AnimatedSpotlight: Story = (args: Partial<SpotlightProps>) => {
  const [buttonRef, setRef] = useState<HTMLButtonElement>();
  const [tourStarted, setTour] = useState<boolean>(false);

  return (
    <>
      <Card
        StyledHeader={Header}
        header={<Button iconSuffix={mdiDotsVertical} variant={variants.text} color="black" />}
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
          <Text color="white" containerProps={{ as: 'h1', style: { fontSize: '2em' } }}>
            Click this button! It seems like a good idea.
          </Text>
          <Button
            color={colors.background}
            iconSuffix={mdiChevronDoubleRight}
            variant={variants.outline}
            onClick={() => {
              setTour(false);
            }}
          >
            Skip
          </Button>
          &nbsp;
          <Button elevation={1} color={colors.primaryDark} onClick={() => {}}>
            Next
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
