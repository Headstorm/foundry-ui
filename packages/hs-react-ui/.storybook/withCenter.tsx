import React from 'react';
import { storiesOf } from '@storybook/react';

import styled from 'styled-components';
import { Div } from '../src/htmlElements';

const Center = styled(Div)`
  min-height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
`;

export const withCenter = storyFn => <Center>{storyFn()}</Center>;
