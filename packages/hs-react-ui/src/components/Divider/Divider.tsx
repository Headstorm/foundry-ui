import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';

import colors from '../../constants/colors';

export const DefaultDivider = styled.hr`
  ${({ width = '90%', height = '1px'}: {width: string, height: string}) => `
    border: none;
    height: ${height};
    width: ${width};
    background-color: ${colors.grayLight};
  `}
`;

export const DefaultDividerContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export interface DividerProps {
  StyledDivider?: StyledComponentBase<any, {}>,
  StyledDividerContainer?: StyledComponentBase<any, {}>,
  width?: string,
  height?: string,
}

const Divider = ({
  StyledDivider = DefaultDivider,
  StyledDividerContainer = DefaultDividerContainer,
  width = '90%',
  height = '1px',
  }: DividerProps) => (
    <StyledDividerContainer>
      <StyledDivider width={width} height={height}/>
    </StyledDividerContainer>
  );

export default Divider;