import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react';
import { mdiArrowRightBold, mdiCheckBold, mdiChevronDoubleRight, mdiDotsVertical } from '@mdi/js';
import styled from 'styled-components';

import Spotlight, { SpotlightProps } from './Spotlight';
import { Button, Card, Text, variants, colors } from '../../index';

const Container = styled(Card.Container)`
  width: 40rem;
`;

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
        StyledContainer={Container}
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
            Start the tour!
          </Button>
        }
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus porttitor ligula id urna
        molestie vulputate a at risus. Maecenas vehicula ligula sed nulla malesuada, at cursus arcu
        feugiat. Nulla aliquam odio vitae arcu molestie, eu pretium mi tristique. Pellentesque
        scelerisque ultricies libero nec consequat. Fusce euismod diam vel eros efficitur, eget
        semper quam ultrices. Donec pharetra lectus felis, ut dapibus libero rhoncus vitae. Cras sed
        venenatis tellus. Praesent venenatis erat at tristique mollis. Donec blandit, sem ac dapibus
        vulputate, magna nisi eleifend augue, a rutrum nisl enim vitae risus. Proin porta libero ac
        ultricies vehicula. Ut sodales pellentesque magna, sed dignissim mauris pulvinar eget. Cras
        ornare lobortis blandit. Vestibulum hendrerit, mauris sit amet consectetur accumsan, ante
        nulla vehicula lorem, ac lacinia diam odio non odio. Duis volutpat tellus a rutrum varius.
        Nullam et nunc quis ipsum fringilla sollicitudin. Aenean mollis dui eget orci feugiat, vitae
        dapibus orci vestibulum. Fusce gravida vitae mi a blandit. Nunc eleifend lacinia massa
        molestie convallis. Sed sed sodales magna. Etiam lectus risus, semper non convallis vitae,
        elementum feugiat sem. Quisque rutrum velit augue, eget molestie lacus aliquet ut. Morbi et
        lacus euismod, accumsan leo vitae, consequat arcu. Suspendisse mattis, ligula sit amet
        ullamcorper tempus, elit elit feugiat mauris, ut venenatis massa diam quis orci. Nulla ex
        enim, pretium nec aliquet sit amet, laoreet ac lorem. Nam quis mi eu tellus accumsan iaculis
        vitae non nunc. Sed vel enim tortor. Curabitur quis orci sit amet urna fringilla cursus eu
        non est. Ut rutrum gravida ex non vulputate. Proin suscipit diam lorem, sit amet fringilla
        est viverra vel. Sed ut congue sem. Donec laoreet venenatis ipsum vel mollis. Nam eget dolor
        posuere massa semper elementum ac eu odio. Donec ante justo, lacinia non ex ut, fringilla
        porta enim. Maecenas vitae tortor ut ipsum imperdiet vehicula sit amet hendrerit lectus.
        Duis diam ipsum, venenatis in condimentum ac, tincidunt et est. Pellentesque venenatis, ex
        in dictum rhoncus, massa nisl egestas est, vitae consectetur est dolor eu elit. Suspendisse
        scelerisque rhoncus tellus, a sodales ipsum ultrices ut. Quisque ac quam eu tellus laoreet
        elementum sed ut urna.
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
  parameters: {
    // { design }, Once we have a design for Spotlight we can link it here
  },
} as Meta;
