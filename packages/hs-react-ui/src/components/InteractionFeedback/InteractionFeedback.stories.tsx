import React from 'react';
import { color, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import InteractionFeedback from './InteractionFeedback';
import Button from '../Button';
import colors from '../../enums/colors';

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A88',
};

storiesOf('InteractionFeedback', module).add(
  'Splash',
  () => {
    const entranceOpacity = number(
      'Circle entrance opacity',
      0.25,
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
    const fill = color('fillColor', colors.grayLight, 'Circle fill');
    const transitionProps = {
      enter: {
        r: `${number(
          'Maximum circle radius',
          100,
          { range: true, min: 0, max: 100, step: 1 },
          'Circle radius',
        )}`,
        opacity: entranceOpacity,
        fill,
      },
      from: {
        r: `${number(
          'Starting circle radius',
          0,
          { range: true, min: 0, max: 100, step: 1 },
          'Circle radius',
        )}`,
        opacity: entranceOpacity,
        fill,
      },
      leave: {
        r: '0',
        opacity: exitOpacity,
        fill,
      },
      config: {
        mass: number('mass', 1, { range: true, min: 1, max: 10, step: 1 }, 'Circle physics'),
        tension: number(
          'tension',
          750,
          { range: true, min: 50, max: 1000, step: 50 },
          'Circle physics',
        ),
        friction: number(
          'friction',
          35,
          { range: true, min: 1, max: 100, step: 5 },
          'Circle physics',
        ),
      },
    };

    const interpolationFunctions = {
      r: (r: any) => r.to((val: string) => `${Math.abs(parseFloat(val))}`),
    };
    return (
      <InteractionFeedback
        interpolationFunctions={interpolationFunctions}
        transitionProps={transitionProps}
      >
        <Button onClick={action('button-click')}>Click me</Button>
      </InteractionFeedback>
    );
  },
  { design },
);
