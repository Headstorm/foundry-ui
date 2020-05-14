import React from 'react';
import styled from 'styled-components';
import { select } from '@storybook/addon-knobs';

import Divider from './Divider';
import { DividerTypes } from '../../enums/DividerTypes';

export default {
  title: 'Divider',
  component: Divider
};

export const Basic = () => (
  <Divider dividerType={select('Divider Type', DividerTypes, DividerTypes.primary)}></Divider>
);

Basic.story = {
  name: 'Basic'
};
