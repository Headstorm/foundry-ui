import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';

import colors from '../../enums/colors';
import { Div, HR } from '../../htmlElements';

export const DefaultDivider = styled(HR)`
  ${({ width = '90%', height = '1px' }: { width: string; height: string }) => `
    border: none;
    height: ${height};
    width: ${width};
    background-color: ${colors.grayLight};
  `}
`;

export const DefaultDividerContainer = styled(Div)`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export interface DividerProps {
  StyledDivider?: StyledComponentBase<any, {}>;
  StyledDividerContainer?: StyledComponentBase<any, {}>;
  width?: string;
  height?: string;
}

const Divider = ({
  StyledDivider = DefaultDivider,
  StyledDividerContainer = DefaultDividerContainer,
  width = '90%',
  height = '1px',
}: DividerProps) => (
  <StyledDividerContainer data-test-id="hsui-Divider">
    <StyledDivider width={width} height={height} />
  </StyledDividerContainer>
);

Divider.Container = DefaultDividerContainer;
export default Divider;
