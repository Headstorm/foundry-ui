import React, { useRef, useState } from 'react';
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
const Container = styled(Card.Container)`
  max-width: 35rem;
`;
const ScrollingWindowContainer = styled(Container)`
  margin-top: 10rem;
`;
const CustomScrollBody = styled(Card.Body)`
  overflow-y: auto;
  max-height: 70vh;
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

export const Default: Story = (args: Partial<SpotlightProps>) => {
  const [currStep, setStep] = useState<number>(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
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
        StyledContainer={ScrollingWindowContainer}
        containerRef={cardRef}
        header={
          <Button
            containerRef={menuRef}
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
            containerRef={buttonRef}
            color={colors.tertiary}
          >
            Start tour
          </Button>
        }
      >
        <p>There are a few items in this card we can talk about!</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ultricies mi eget mauris pharetra et ultrices neque
          ornare aenean. Vitae purus faucibus ornare suspendisse sed nisi lacus sed viverra.
          Ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at. Mauris a diam maecenas
          sed enim ut sem viverra aliquet. Ultrices in iaculis nunc sed augue lacus viverra. Sodales
          neque sodales ut etiam. Pulvinar neque laoreet suspendisse interdum consectetur libero id
          faucibus nisl. Ut placerat orci nulla pellentesque dignissim enim sit amet venenatis.
          Vivamus arcu felis bibendum ut tristique. Netus et malesuada fames ac turpis egestas.
          Porttitor rhoncus dolor purus non enim. Proin nibh nisl condimentum id. Aliquam ultrices
          sagittis orci a scelerisque purus semper. Faucibus purus in massa tempor nec feugiat. Et
          netus et malesuada fames. Cras pulvinar mattis nunc sed blandit libero. Nisi lacus sed
          viverra tellus in. Tellus rutrum tellus pellentesque eu tincidunt tortor aliquam nulla. Id
          porta nibh venenatis cras sed felis eget velit. Eros in cursus turpis massa tincidunt dui
          ut ornare. Proin fermentum leo vel orci porta non. Quisque non tellus orci ac auctor
          augue.
        </p>
      </Card>
      {tourStarted && (
        <Spotlight
          {...args}
          StyledAnnotation={Annotation}
          targetElement={stepOptions[currStep]?.current as HTMLElement}
        >
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
Default.args = {
  padding: 12,
  shape: 'rounded box',
  animateTargetChanges: true,
  backgroundDarkness: 0.3,
  backgroundBlur: '0.25rem',
  cornerRadius: 12,
};

export const CustomScrollWindow: Story = (args: Partial<SpotlightProps>) => {
  const [currStep, setStep] = useState<number>(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const [tourStarted, setTour] = useState<boolean>(false);

  const stepOptions = [null, menuRef, cardRef, buttonRef];
  const messages = [
    {
      title: 'Welcome to the tutorial!',
      subtitle: 'targetElement is null for this part of the tour, so nothing is highlighted!',
    },
    { title: 'This is a kebab menu.', subtitle: '' },
    { title: 'This is the whole card.', subtitle: '' },
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
        StyledBody={CustomScrollBody}
        bodyRef={bodyRef}
        containerRef={cardRef}
      >
        <Button
          containerRef={menuRef}
          iconSuffix={mdiDotsVertical}
          variant={variants.text}
          color="black"
        />
        <p>There are a few items in this card we can talk about!</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ultricies mi eget mauris pharetra et ultrices neque
          ornare aenean. Vitae purus faucibus ornare suspendisse sed nisi lacus sed viverra.
          Ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at. Mauris a diam maecenas
          sed enim ut sem viverra aliquet. Ultrices in iaculis nunc sed augue lacus viverra. Sodales
          neque sodales ut etiam. Pulvinar neque laoreet suspendisse interdum consectetur libero id
          faucibus nisl. Ut placerat orci nulla pellentesque dignissim enim sit amet venenatis.
          Vivamus arcu felis bibendum ut tristique. Netus et malesuada fames ac turpis egestas.
          Porttitor rhoncus dolor purus non enim. Proin nibh nisl condimentum id. Aliquam ultrices
          sagittis orci a scelerisque purus semper. Faucibus purus in massa tempor nec feugiat. Et
          netus et malesuada fames. Cras pulvinar mattis nunc sed blandit libero. Nisi lacus sed
          viverra tellus in. Tellus rutrum tellus pellentesque eu tincidunt tortor aliquam nulla. Id
          porta nibh venenatis cras sed felis eget velit. Eros in cursus turpis massa tincidunt dui
          ut ornare. Proin fermentum leo vel orci porta non. Quisque non tellus orci ac auctor
          augue.
        </p>
        <Button
          onClick={() => {
            setTour(true);
          }}
          containerRef={buttonRef}
          color={colors.tertiary}
        >
          Start tour
        </Button>
      </Card>
      {tourStarted && (
        <Spotlight
          {...args}
          // scrollingParentElement={bodyRef.current as HTMLElement}
          StyledAnnotation={Annotation}
          targetElement={stepOptions[currStep]?.current as HTMLElement}
        >
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
CustomScrollWindow.args = {
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
