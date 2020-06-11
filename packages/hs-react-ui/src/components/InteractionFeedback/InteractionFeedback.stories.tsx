import React from 'react';
import { color, number, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { config } from 'react-spring';

import InteractionFeedback from './InteractionFeedback';
import Button from '../Button';
import colors from '../../enums/colors';

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A88',
};

storiesOf('InteractionFeedback', module).add(
  'Splashy splash',
  () => {
    const entranceOpacity = number('Circle entrance opacity', 0.5, { range: true, min: 0, max: 1, step: 0.05 });
    const exitOpacity = number('Circle exit opacity', 0, { range: true, min: 0, max: 1, step: 0.05 });
    const fill = color('fillColor', colors.grayLight);
    const transitionProps = {
      enter: {
        r: `${number('Maximum circle radius', 20, { range: true, min: 0, max: 40, step: 1 })}`,
        opacity: entranceOpacity,
        fill,
      },
      from: {
        r: `${number('Starting circle radius', 0, { range: true, min: 0, max: 10, step: 1 })}`,
        opacity: entranceOpacity,
        fill,
      },
      leave: {
        r: '0',
        opacity: exitOpacity,
        fill,
      },
      config: select('Circle physics', config, config.default),
    };

    const interpolationFunctions = {
      r: (r: any) => r.interpolate((val: string) => `${Math.abs(parseFloat(val))}`),
    };
    return (
      <InteractionFeedback
        interpolationFunctions={interpolationFunctions}
        transitionProps={transitionProps}
        type={InteractionFeedback.feedbackTypes.splash}
      >
        <Button onClick={action('button-click')}>Click me</Button>
      </InteractionFeedback>
    );
  },
  { design },
);
