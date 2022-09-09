import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react';
import { mdiArrowRightBold, mdiCheckBold, mdiChevronDoubleRight, mdiDotsVertical } from '@mdi/js';
import styled from 'styled-components';

import { withFoundryContext } from '../../../.storybook/decorators';
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

  const stepOptions = [null, menuRef, cardRef, buttonRef];
  const messages = [
    {
      title: 'Welcome to the tutorial!',
      subtitle: 'targetElement is null for this part of the tour, so nothing is highlighted!',
    },
    { title: 'This is a kebab menu.', subtitle: '' },
    { title: 'This is the whole card', subtitle: '' },
    { title: 'Press this button to restart the tour!', subtitle: '(you already knew that though)' },
  ];

  const goNext = () => {
    setStep(step => {
      if (step >= stepOptions.length - 1) {
        setTour(false);
        return 0;
      }
      return step + 1;
    });
  };

  const lastStep = currStep === stepOptions.length - 1;

  return (
    <>
      <Card
        StyledHeader={Header}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - our ref types don't like getting a set state dispatch function
        containerRef={setCardRef}
        header={
          <Button
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - our ref types don't like getting a set state dispatch function
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - our ref types don't like getting a set state dispatch function
            containerRef={setButtonRef}
            color={colors.tertiary}
          >
            Start tour
          </Button>
        }
      >
        There are a few items in this card we can talk about!
      </Card>
      {tourStarted && (
        <Spotlight {...args} StyledAnnotation={Annotation} targetElement={stepOptions[currStep]}>
          <Text color="white" containerProps={{ as: 'h1', style: { fontSize: '2em' } }}>
            {messages[currStep].title}
          </Text>
          <Text color="white" containerProps={{ style: { fontWeight: '700' } }}>
            {messages[currStep].subtitle}
          </Text>
          <br />
          <br />
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
            iconSuffix={lastStep ? mdiCheckBold : mdiArrowRightBold}
            elevation={1}
            color={lastStep ? colors.secondaryDark : colors.primaryDark}
            onClick={() => {
              goNext();
            }}
          >
            {lastStep ? 'I got it' : 'Next'}
          </Button>
        </Spotlight>
      )}
    </>
  );
};
AnimatedSpotlight.args = {
  padding: 12,
  shape: 'rounded box',
  animateTargetChanges: true,
  backgroundDarkness: 0.3,
  backgroundBlur: '0.25rem',
  cornerRadius: 12,
};

export default {
  title: 'Spotlight',
  component: Spotlight,
  decorators: [withFoundryContext],
  parameters: {
    // { design }, Once we have a design for Spotlight we can link it here
  },
} as Meta;
