import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';

import { Div, HR } from '../../htmlElements';
import { SubcomponentPropsType } from '../commonTypes';
import { useTheme } from '../../context';

export const DefaultDivider = styled(HR)`
  ${({ width = '90%', height = '1px' }: { width: string; height: string }) => {
    const { colors } = useTheme();
    return `
      border: none;
      height: ${height};
      width: ${width};
      background-color: ${colors.grayLight};
  `;
  }}
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
  dividerProps?: SubcomponentPropsType;
  dividerContainerProps?: SubcomponentPropsType;

  width?: string;
  height?: string;
}

const Divider = ({
  StyledDivider = DefaultDivider,
  StyledDividerContainer = DefaultDividerContainer,
  dividerProps = {},
  dividerContainerProps = {},
  width = '90%',
  height = '1px',
}: DividerProps) => (
  <StyledDividerContainer data-test-id="hsui-Divider" {...dividerContainerProps}>
    <StyledDivider width={width} height={height} {...dividerProps} />
  </StyledDividerContainer>
);

Divider.Container = DefaultDividerContainer;
export default Divider;
