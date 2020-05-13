import React from 'react';
import styled, { css, keyframes, StyledComponentBase } from 'styled-components';

import colors from '../../constants/colors';

import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';

/* Default Styled Text Container */
export const TextContainer = styled.span`
  ${({ size, color }) => `
    display: inline-block;
    font-family: Gotham;
    font-size: ${size}rem;
    color: ${color};
    margin: .25rem;
    background-color: ${colors.background};
  `}
`;

export interface TextProps {
  children?: String | Node,
  color?: String,
  iconPrefix?: String | JSX.Element,
  iconSuffix?: String | JSX.Element,
  isLoading?: Boolean,
  isProcessing?: Boolean,
  size?: Number
  StyledContainer?: String & StyledComponentBase<any, {}>,
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
  ${({size }) => css`
    background: linear-gradient(
      45deg,
      #E1E4E6 0%,
      #C8D1D9 100%) repeat;
    background-size; 50% 100%;
    width: ${126 * size}px;
    height: ${size}rem;
    border-radius: 9999px;
    animation: ${animation}
  `}
`;

const LeftIconContainer = styled.div`
  display: inline-flex;
  margin-right: .25rem;
`;


const RightIconContainer = styled.div`
  display: inline-flex;
  margin-left: .25rem;
`;

const Text = ({
  children,
  color,
  iconPrefix,
  iconSuffix,
  isLoading,
  isProcessing,
  size = 1,
  StyledContainer = TextContainer,
}: TextProps) => (
  <StyledContainer size={size} color={color} >
    {isLoading && <Progress size={size} color={color} />}
    {!isLoading && !isProcessing && iconPrefix &&
      (typeof iconPrefix === 'string' && iconPrefix !== '' ?
      <LeftIconContainer><Icon path={iconPrefix} size={size + 'rem'} /></LeftIconContainer> : <LeftIconContainer>{iconPrefix}</LeftIconContainer>)}
    {!isLoading && isProcessing && <LeftIconContainer><Icon path={mdiLoading} size={size + 'rem'} spin={1} /></LeftIconContainer>}
    {!isLoading && children}

    {!isLoading && iconSuffix &&
      (typeof iconSuffix === 'string' ?
      <RightIconContainer><Icon path={iconSuffix} size={size + 'rem'}/></RightIconContainer> : <RightIconContainer>{iconSuffix}</RightIconContainer>)}
  </StyledContainer>
);

export default Text;
