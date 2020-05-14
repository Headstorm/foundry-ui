import React from 'react';
import styled from 'styled-components';
import { select } from '@storybook/addon-knobs';

import Divider from './Divider';
import { DividerTypes } from '../../enums/DividerTypes';

export default {
  title: 'Divider',
  component: Divider
};

/* Default */

export const Default = () => (
  <Divider />
);
