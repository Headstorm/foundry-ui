import React from 'react';
import styled from 'styled-components';
import { makeDecorator } from '@storybook/addons';

const Centered = styled.div`
  ${({ centerStuff = false }: { centerStuff: boolean }) => `
    ${
      centerStuff
        ? `
      display: flex;
      height: 100%;
      flex-flow: column nowrap;
      align-items: center;
      justify-content: center;
    `
        : ''
    }
  `}
`;

export default makeDecorator({
  name: 'withCentered',
  parameterName: 'centered',
  wrapper: (storyFn, context, { parameters: centered }) => (
    <Centered centerStuff={centered}>{storyFn(context)}</Centered>
  ),
});
