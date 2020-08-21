import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';

import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import Progress from '../Progress/Progress';
import { Span } from '../../htmlElements';
import { SubcomponentPropsType } from '../commonTypes';

/* Default Styled Text Container */
export const TextContainer = styled(Span)`
  ${({ size, color }: { size: string; color: string }) => `
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
  StyledIconContainer?: string & StyledComponentBase<any, {}>;
  containerProps?: SubcomponentPropsType;
  iconContainerProps?: SubcomponentPropsType;
}

/* Styled div that represents the scroll bar */
const StyledProgress = styled(Progress)`
  ${({ size }: { size: string }) => `
    width: calc(${size} * 10);
    height: ${size};
  `}
`;

const IconContainer = styled(Span)`
  ${({ side }: { side: 'left' | 'right' }) => `
    margin-${side === 'left' ? 'right' : 'left'}: .5em;
    display: inline-flex;
    vertical-align: middle;
  `}
`;

// TODO: If children are passed in and loading===true,
// set the children to visibility: none and have the loading bar fill their width
// that way the end developer can pass "placeholder" text for how long the text will probably be
// when loaded
const Text = ({
  children,
  color,
  iconPrefix,
  iconSuffix,
  isLoading,
  isProcessing,
  size = '1rem',

  StyledContainer = TextContainer,
  StyledIconContainer = IconContainer,
  containerProps = {},
  iconContainerProps = {},
}: TextProps) => (
  <StyledContainer data-test-id="hsui-Text" size={size} color={color} {...containerProps}>
    {isLoading && <StyledProgress size={size} />}
    {!isLoading &&
      !isProcessing &&
      iconPrefix &&
      (typeof iconPrefix === 'string' && iconPrefix !== '' ? (
        <StyledIconContainer side="left" {...iconContainerProps}>
          <Icon path={iconPrefix} size={size} />
        </StyledIconContainer>
      ) : (
        <StyledIconContainer side="left" size={size} {...iconContainerProps}>
          {iconPrefix}
        </StyledIconContainer>
      ))}
    {!isLoading && isProcessing && (
      <StyledIconContainer side="left" {...iconContainerProps}>
        <Icon path={mdiLoading} size={size} spin={1} />
      </StyledIconContainer>
    )}
    {!isLoading && children}

    {!isLoading &&
      iconSuffix &&
      (typeof iconSuffix === 'string' ? (
        <StyledIconContainer side="right" {...iconContainerProps}>
          <Icon path={iconSuffix} size={size} />
        </StyledIconContainer>
      ) : (
        <StyledIconContainer side="right" {...iconContainerProps}>
          {iconSuffix}
        </StyledIconContainer>
      ))}
  </StyledContainer>
);

Text.Container = TextContainer;
Text.IconContainer = IconContainer;
export default Text;
