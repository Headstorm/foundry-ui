import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';

import colors from '../../constants/colors';

export const DefaultDivider = styled.hr`
  ${({ width = 90, height = 1}) => `
    border: none;
    height: ${height}px;
    width: ${width}%;
    background-color: ${colors.grayLight};
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
  height?: number,
}

const Divider = ({
  StyledDivider = DefaultDivider,
  StyledDividerContainer = DefaultDividerContainer,
  width = 90,
  height = 1,
  }: DividerProps) => (
    <StyledDividerContainer>
      <StyledDivider width={width} height={height}/>
    </StyledDividerContainer>
  );

export default Divider;