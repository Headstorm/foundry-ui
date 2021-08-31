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

const Annotation = styled(Spotlight.Annotation)`
  display: flex;
  flex-flow: row wrap;
  max-width: 16rem;
`;

const NextButtonContainer = styled(Button.Container)`
  flex: 1 1 auto;
  justify-content: center;
`;

export const AnimatedSpotlight: Story = (args: Partial<SpotlightProps>) => {
  const [currStep, setStep] = useState<number>(0);
  const [buttonRef, setButtonRef] = useState<HTMLElement>();
  const [cardRef, setCardRef] = useState<HTMLElement>();
  const [menuRef, setMenuRef] = useState<HTMLElement>();
  const [tourStarted, setTour] = useState<boolean>(false);

  const stepOptions = [buttonRef, menuRef, cardRef];
  const messages = ['Click here to start the tour!', 'This is a menu.', 'This is the whole card'];

  const goNext = () => {
    setStep(step => {
      if (step >= stepOptions.length - 1) {
        setTour(false);
        return 0;
      }
      return step + 1;
    });
  };

  return (
    <>
      <Card
        StyledHeader={Header}
        containerRef={setCardRef}
        header={
          <Button
            containerRef={setMenuRef}
            iconSuffix={mdiDotsVertical}
            variant={variants.text}
            color="black"
          />
        }
        footer={
          <Button
            onClick={() => {
              setTour(true);
            }}
            containerRef={setButtonRef}
          >
            Start the tour!
          </Button>
        }
      >
        There are a few items in this card we can talk about
      </Card>
      {tourStarted && (
        <Spotlight {...args} StyledAnnotation={Annotation} targetElement={stepOptions[currStep]}>
          <Text color="white" containerProps={{ as: 'h1', style: { fontSize: '2em' } }}>
            {messages[currStep]}
          </Text>
          <Button
            color={colors.background}
            iconSuffix={mdiChevronDoubleRight}
            variant={variants.outline}
            onClick={() => {
              setStep(0);
              setTour(false);
            }}
          >
            Skip
          </Button>
          &nbsp;
          <Button
            StyledContainer={NextButtonContainer}
            elevation={1}
            color={colors.primaryDark}
            onClick={() => {
              goNext();
            }}
          >
            {currStep === stepOptions.length - 1 ? 'Done' : 'Next'}
          </Button>
        </Spotlight>
      )}
    </>
  );
};
AnimatedSpotlight.args = {
  padding: 16,
  shape: 'rounded box',
};

export default {
  title: 'Spotlight',
  component: Spotlight,
  parameters: {
    // { design }, Once we have a design for Spotlight we can link it here
  },
} as Meta;
