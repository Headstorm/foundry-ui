import React from 'react';
import styled, { css, keyframes, StyledComponentBase } from 'styled-components';

import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';

/* Default Styled Text Container */
export const TextContainer = styled.span`
  ${({ size, color }: { size: string; color: string }) => `
    display: inline-block;
    font-family: Gotham;
    font-size: ${size};
    color: ${color};
  `}
`;

export interface TextProps {
  children?: string | Node;
  color?: string;
  iconPrefix?: string | JSX.Element;
  iconSuffix?: string | JSX.Element;
  isLoading?: boolean;
  isProcessing?: boolean;
  size?: string;
  StyledContainer?: string & StyledComponentBase<any, {}>;
}

/* Keyframes for the loading bar gradient */
const movingGradient = keyframes`
  0% { background-position: left bottom; }
  100% { background-position: right bottom; }
`;

/* Animation to scroll the gradient toward the right */
const animation = css`
  ${movingGradient} 1s linear infinite;
`;

/* Styled div that represents the scroll bar
   Note: The border-radius 9999px is used to create a pill shape */
const Progress = styled.div`
  ${({ size }: { size: string }) => css`
    background: linear-gradient(
      45deg,
      #E1E4E6 0%,
      #C8D1D9 100%) repeat;
    background-size; 50% 100%;
    width: calc(${size} * 10);
    height: ${size};
    border-radius: 9999px;
    animation: ${animation}
  `}
`;

const LeftIconContainer = styled.div`
  display: inline-flex;
  margin-right: 0.25rem;
`;

const RightIconContainer = styled.div`
  display: inline-flex;
  margin-left: 0.25rem;
`;

const Text = ({
  children,
  color,
  iconPrefix,
  iconSuffix,
  isLoading,
  isProcessing,
  size = '1rem',
  StyledContainer = TextContainer,
}: TextProps) => (
  <StyledContainer size={size} color={color}>
    {isLoading && <Progress size={size} />}
    {!isLoading &&
      !isProcessing &&
      iconPrefix &&
      (typeof iconPrefix === 'string' && iconPrefix !== '' ? (
        <LeftIconContainer>
          <Icon path={iconPrefix} size={size} />
        </LeftIconContainer>
      ) : (
        <LeftIconContainer>{iconPrefix}</LeftIconContainer>
      ))}
    {!isLoading && isProcessing && (
      <LeftIconContainer>
        <Icon path={mdiLoading} size={size} spin={1} />
      </LeftIconContainer>
    )}
    {!isLoading && children}

    {!isLoading &&
      iconSuffix &&
      (typeof iconSuffix === 'string' ? (
        <RightIconContainer>
          <Icon path={iconSuffix} size={size} />
        </RightIconContainer>
      ) : (
        <RightIconContainer>{iconSuffix}</RightIconContainer>
      ))}
  </StyledContainer>
);

Text.Container = TextContainer;
export default Text;
