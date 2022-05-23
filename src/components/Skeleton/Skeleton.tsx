import React from 'react';
import { parseToRgb } from 'polished';
import styled, { keyframes, css } from 'styled-components';

import { useAccessibilityPreferences, useTheme } from '../../context';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import { StyledBaseDiv } from '../../htmlElements';

export const movingGradient = keyframes`
  0% { background-position: 0vw bottom; }
  100% { background-position: 100vw bottom; }
`;

export const animation = css`
  ${movingGradient} 2s linear infinite;
`;

const SkeletonShimmer = styled(StyledBaseDiv)`
  ${({ isLoading, color, animatedShimmer }) => {
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
      animation: ${animatedShimmer ? animation : 'none'};
    `;
  }}
`;

const SkeletonContainer = styled(StyledBaseDiv)`
  ${({ isLoading }: { isLoading: boolean }) => `
  display: block;

  position: relative;
    & > * {
      transition: opacity .2s;
    }

  ${
    isLoading
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

  containerProps?: SubcomponentPropsType;
  shimmerProps?: SubcomponentPropsType;

  containerRef?: React.RefObject<HTMLElement>;
  shimmerRef?: React.RefObject<HTMLElement>;

  children?: React.ReactNode;
  color?: string;
  isLoading?: boolean;
  animatedShimmer?: boolean;
};

const Skeleton = ({
  StyledContainer = SkeletonContainer,
  StyledShimmer = SkeletonShimmer,
  containerProps,
  shimmerProps,
  containerRef,
  shimmerRef,
  children,
  color,
  isLoading = false,
  animatedShimmer = true,
}: SkeletonProps): JSX.Element | null => {
  const { colors } = useTheme();
  const { prefersReducedMotion } = useAccessibilityPreferences();

  const finalColor = color || colors.grayLight;
  const finalAnimationPreference = !prefersReducedMotion && animatedShimmer;

  return (
    <StyledContainer isLoading={isLoading} {...containerProps} ref={containerRef}>
      {children}
      <StyledShimmer
        animatedShimmer={finalAnimationPreference}
        isLoading={isLoading}
        color={finalColor}
        {...shimmerProps}
        ref={shimmerRef}
      />
    </StyledContainer>
  );
};

Skeleton.Container = SkeletonContainer;
Skeleton.Shimmer = SkeletonShimmer;

export default Skeleton;
