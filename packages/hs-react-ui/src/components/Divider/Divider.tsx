import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';

import colors from '../../constants/colors';

export const DefaultDivider = styled.hr`
  ${({ width = 90}) => `
    border: 1px, solid, ${colors.primary};
    width: ${width}%;
  `}
`;

export const DefaultDividerContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: .5rem;
  margin-bottom: .5rem;
`;

export interface DividerProps {
  StyledDivider?: StyledComponentBase<any, {}>,
  StyledDividerContainer?: StyledComponentBase<any, {}>,
  width?: number,
}

const Divider = ({
  StyledDivider = DefaultDivider,
  StyledDividerContainer = DefaultDividerContainer,
  width = 90,
  }: DividerProps) => (
    <StyledDividerContainer>
      <StyledDivider width={width}/>
    </StyledDividerContainer>
  );

export default Divider;