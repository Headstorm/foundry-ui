import React from 'react';
import styled from 'styled-components';

import { useSeparator } from 'react-aria';
import { StyledBaseDiv, StyledBaseHR } from '../../htmlElements';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import { useTheme } from '../../context';

export const DefaultDivider = styled(StyledBaseHR)`
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

export const DefaultDividerContainer = styled(StyledBaseDiv)`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export interface DividerProps {
  StyledDivider?: StyledSubcomponentType;
  StyledDividerContainer?: StyledSubcomponentType;
  dividerProps?: SubcomponentPropsType;
  dividerContainerProps?: SubcomponentPropsType;

  width?: string;
  height?: string;

  containerRef?: React.RefObject<HTMLDivElement>;
  dividerRef?: React.RefObject<HTMLHRElement>;
}

const Divider = ({
  StyledDivider = DefaultDivider,
  StyledDividerContainer = DefaultDividerContainer,
  dividerProps = {},
  dividerContainerProps = {},
  width = '90%',
  height = '1px',
  containerRef,
  dividerRef,
}: DividerProps): JSX.Element => {
  const { separatorProps: ariaProps } = useSeparator(dividerProps);
  return (
    <StyledDividerContainer
      data-test-id="hsui-Divider"
      {...dividerContainerProps}
      ref={containerRef}
    >
      <StyledDivider
        {...ariaProps}
        width={width}
        height={height}
        ref={dividerRef}
        {...dividerProps}
      />
    </StyledDividerContainer>
  );
};

Divider.Container = DefaultDividerContainer;
Divider.Divider = DefaultDivider;
export default Divider;
