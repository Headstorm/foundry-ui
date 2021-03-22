import React from 'react';
import { color, number, boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import InteractionFeedback from './InteractionFeedback';
import Button from '../Button';
import colors from '../../enums/colors';
import styled from 'styled-components';
import Text from '../Text';

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A88',
};

const InteractionInnerContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;

storiesOf('InteractionFeedback', module).add(
  'Splash',
  () => {
    const entranceOpacity = number(
      'Circle entrance opacity',
      0.5,
      {
        range: true,
        min: 0,
        max: 1,
        step: 0.05,
      },
      'Circle fill',
    );
    const exitOpacity = number(
      'Circle exit opacity',
      0,
      {
        range: true,
        min: 0,
        max: 1,
        step: 0.05,
      },
      'Circle fill',
    );
    const transitionProps = {
      from: {
        r: `${number(
          'Starting circle radius',
          0,
          { range: true, min: 0, max: 100, step: 1 },
          'Circle radius',
        )}`,
        opacity: entranceOpacity,
      },
      enter: {
        r: `${number(
          'Ending circle radius',
          100,
          { range: true, min: 0, max: 100, step: 1 },
          'Circle radius',
        )}`,
        opacity: exitOpacity,
      },
      config: {
        mass: number(
          'mass', 90, 
          { range: true, min: 1, max: 100, step: 1 }, 
          'Circle physics'),
        tension: number(
          'tension',
          1000,
          { range: true, min: 50, max: 1000, step: 50 },
          'Circle physics',
        ),
        friction: number(
          'friction',
          20,
          { range: true, min: 1, max: 100, step: 5 },
          'Circle physics',
        ),
        clamp: boolean('clamp', true, 'Circle physics'),
      },
    };
    const interpolationFunctions = {
      r: (r: any) => r.to((val: string) => `${Math.abs(parseFloat(val).toFixed(2))}%`),
      opacity: (opacity: any) => opacity.to((val: string) => `${parseFloat(val).toFixed(2)}`),
    };
    return (
      
        <InteractionFeedback
          color={color('color', colors.grayDark, 'Circle fill')}
          interpolationFunctions={interpolationFunctions}
          transitionProps={transitionProps}
          >
          <InteractionInnerContainer onClick={action('button-click')}>
            <Text>
              Click Anywhere!
            </Text>
          </InteractionInnerContainer>
        </InteractionFeedback>
      
    );
  },
  { design },
);
