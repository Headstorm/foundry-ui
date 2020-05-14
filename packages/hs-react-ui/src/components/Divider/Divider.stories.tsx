import React from 'react';
import styled from 'styled-components';
import { number } from '@storybook/addon-knobs';

import Divider from './Divider';

export default {
  title: 'Divider',
  component: Divider
};

/* Default */

export const Default = () => (
  <Divider 
    width={number('width', 90, { range: true, min: 10, max: 100, step: 1 })}
    height={number('height', 1, { range: true, min: 1, max: 10, step: 1 })}
  />
);
