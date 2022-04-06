import React from 'react';
import { parseToRgb } from 'polished';
import styled, { keyframes, css } from 'styled-components';

import { useTheme } from '../../context';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import { Div } from '../../htmlElements';

export const movingGradient = keyframes`
  0% { background-position: 0vw bottom; }
  100% { background-position: 100vw bottom; }
`;

export const animation = css`
  ${movingGradient} 2s linear infinite;
`;

const SkeletonShimmer = styled(Div)`
  ${({ isLoading, color }) => {
    const rgb = parseToRgb(color);

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
  display: block;

  position: relative;
    & > * {
      transition: opacity .2s;
    }

  ${isLoading
      ? `
        color: transparent !important;
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

export type SkeletonProps = {
  StyledContainer?: StyledSubcomponentType;
  StyledShimmer?: StyledSubcomponentType;

  SkeletonProps?: SubcomponentPropsType;
  shimmerProps?: SubcomponentPropsType;

  children?: React.ReactNode;
  color?: string;
  isLoading?: boolean;

  skeletonRef?: React.RefObject<HTMLElement>;

};

const Skeleton = ({
  StyledContainer = SkeletonContainer,
  StyledShimmer = SkeletonShimmer,
  SkeletonProps,
  shimmerProps,
  skeletonRef,

  children,
  color,
  isLoading = false,
}: SkeletonProps): JSX.Element | null => {
  const { colors } = useTheme();
  const finalColor = color || colors.grayLight;
  return (
    <StyledContainer isLoading={isLoading} {...SkeletonProps} ref={skeletonRef}>
      {children}
      <StyledShimmer isLoading={isLoading} color={finalColor} {...shimmerProps} />
    </StyledContainer>
  );
};

Skeleton.Container = SkeletonContainer;
Skeleton.Shimmer = SkeletonShimmer;

export default Skeleton;
