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
  />
);
