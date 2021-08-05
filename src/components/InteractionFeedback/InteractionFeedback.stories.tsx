import React from 'react';
import styled from 'styled-components';
import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import InteractionFeedback from './InteractionFeedback';
import colors from '../../enums/colors';
import Text from '../Text';

const InteractionInnerContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface SplashProps {
  entranceOpacity: number;
  exitOpacity: number;
  startingRadius: number;
  endingRadius: number;
  mass: number;
  tension: number;
  friction: number;
  clamp: boolean;
  color: string;
}

export const Splash: Story<SplashProps> = args => {
  const {
    startingRadius,
    entranceOpacity,
    endingRadius,
    exitOpacity,
    mass,
    tension,
    friction,
    clamp,
    color,
  } = args;

  const transitionProps = {
    from: {
      r: `${startingRadius}`,
      opacity: entranceOpacity,
    },
    enter: {
      r: `${endingRadius}`,
      opacity: exitOpacity,
    },
    config: {
      mass,
      tension,
      friction,
      clamp,
    },
  };
  const interpolationFunctions = {
    r: (r: any) => r.to((val: string) => `${Math.abs(parseFloat(val)).toFixed(1)}`),
    opacity: (opacity: any) => opacity.to((val: number) => val.toFixed(2)),
  };
  return (
    <InteractionFeedback
      color={color}
      interpolationFunctions={interpolationFunctions}
      transitionProps={transitionProps}
    >
      <InteractionInnerContainer onClick={action('button-click')}>
        <Text>Click Anywhere!</Text>
      </InteractionInnerContainer>
    </InteractionFeedback>
  );
};
Splash.args = {
  entranceOpacity: 0.5,
  exitOpacity: 0,
  startingRadius: 0,
  endingRadius: 100,
  mass: 90,
  tension: 1000,
  friction: 20,
  clamp: true,
  color: colors.grayDark,
} as SplashProps;

export default {
  title: 'InteractionFeedback',
  argTypes: {
    entranceOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05, label: 'Circle entrance opacity' },
    },
    exitOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05, label: 'Circle exit opacity' },
    },
    startingRadius: {
      control: { type: 'range', min: 0, max: 100, step: 1, label: 'Starting circle radius' },
    },
    endingRadius: {
      control: { type: 'range', min: 0, max: 100, step: 1, label: 'Ending circle radius' },
    },
    mass: { control: { type: 'range', min: 1, max: 100, step: 1 } },
    tension: { control: { type: 'range', min: 50, max: 1000, step: 50 } },
    friction: { control: { type: 'range', min: 1, max: 100, step: 1 } },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A88',
    },
  },
} as Meta;
