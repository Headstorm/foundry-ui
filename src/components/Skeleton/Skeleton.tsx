import { parseToRgb, readableColor } from 'polished';
import React from 'react';
import { useTheme } from 'src/context';
import styled, { keyframes, css } from 'styled-components';
import { Div } from '../../htmlElements';

/* Keyframes for the loading bar gradient */
export const movingGradient = keyframes`
  0% { background-position: 0vw bottom; }
  100% { background-position: 100vw bottom; }
`;

/* Animation to scroll the gradient toward the right */
export const animation = css`
  ${movingGradient} 8s linear infinite;
`;

/* Styled div that represents the scroll bar
   Note: The border-radius 9999px is used to create a pill shape */
const SkeletonContainer = styled(Div)`
  ${({ finalColor }) => {
    const rgb = parseToRgb(finalColor);
    return css`
      background: linear-gradient(
          45deg,
          rgba(${Object.values(rgb).join(', ')}, 0.75),
          rgba(${Object.values(rgb).join(', ')}, 0),
          rgba(${Object.values(rgb).join(', ')}, 0.75),
          rgba(${Object.values(rgb).join(', ')}, 0),
          rgba(${Object.values(rgb).join(', ')}, 0.75)
        )
        repeat;
      background-size: 100vw 100vh;
      background-attachment: fixed;
      min-width: 6rem;
      min-height: 1rem;
      border-radius: 9999px;
      animation: ${animation};
      line-height: 0;
    `;
  }}
`;

const Skeleton = ({ children, color, StyledContainer = SkeletonContainer }): JSX.Element | null => {
  const { colors } = useTheme();
  const finalColor = color ?? colors.grayLight;
  return <StyledContainer finalColor={finalColor}>{children}</StyledContainer>;
};

Skeleton.Container = SkeletonContainer;

export default Skeleton;
