import { parseToRgb } from 'polished';
import React from 'react';
import styled, { keyframes, css } from 'styled-components';

import { useTheme } from '../../context';
import { SubcomponentPropsType } from '../commonTypes';
import { Div } from '../../htmlElements';

export const movingGradient = keyframes`
  0% { background-position: 0vw bottom; }
  100% { background-position: 100vw bottom; }
`;

export const animation = css`
  ${movingGradient} 2s linear infinite;
`;

const SkeletonShimmer = styled(Div)`
  ${({ isLoading, finalColor }) => {
    const rgb = parseToRgb(finalColor);

    return css`
      opacity: ${isLoading ? 1 : 0};

      background: linear-gradient(
          90deg,
          rgba(${Object.values(rgb).join(', ')}, 0.75),
          rgba(${Object.values(rgb).join(', ')}, 0.25),
          rgba(${Object.values(rgb).join(', ')}, 0.75)
        )
        repeat;

      color: transparent;
      user-select: none;
      pointer-events: none;

      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      background-size: 100vw 100vh;
      background-attachment: fixed;
      border-radius: 0.25rem;
      animation: ${animation};
    `;
  }}
`;

const SkeletonContainer = styled(Div)`
  ${({ isLoading }: { isLoading: boolean }) => `
    display: inline-block;

    position: relative;
      & > * {
        transition: opacity .2s;
      }

    ${
      isLoading
        ? `
          & > *:not(${SkeletonShimmer}) {
            opacity: 0 !important;
            user-select: none;
            pointer-events: none;
          }
      `
        : ''
    }
  `}
`;

type SkeletonProps = {
  StyledContainer?: string & StyledComponentBase<any, {}>;
  StyledShimmer?: string & StyledComponentBase<any, {}>;
  containerProps?: SubcomponentPropsType;
  shimmerProps?: SubcomponentPropsType;

  children?: React.ReactNode;
  color?: string;
  isLoading?: boolean;
};

const Skeleton = ({
  children,
  color,
  StyledContainer = SkeletonContainer,
  StyledShimmer = SkeletonShimmer,
  isLoading = false,
  containerProps,
  shimmerProps,
}: SkeletonProps): JSX.Element | null => {
  const { colors } = useTheme();
  const finalColor = color ?? colors.grayLight;
  return (
    <StyledContainer isLoading={isLoading} {...containerProps}>
      {children}
      <StyledShimmer isLoading={isLoading} finalColor={finalColor} {...shimmerProps} />
    </StyledContainer>
  );
};

Skeleton.Container = SkeletonContainer;
Skeleton.Shimmer = SkeletonShimmer;

export default Skeleton;
