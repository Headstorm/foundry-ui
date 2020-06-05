import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';

import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import fonts from '../../enums/fonts';
import Progress from '../Progress/Progress';

/* Default Styled Text Container */
export const TextContainer = styled.span`
  ${({ size, color }: { size: string; color: string }) => `
    ${fonts.body}
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

/* Styled div that represents the scroll bar */
const StyledProgress = styled(Progress)`
  ${({ size }: { size: string }) => `
    width: calc(${size} * 10);
    height: ${size};
  `}
`;

const LeftIconContainer = styled.span`
  display: inline-flex;
  margin-right: 0.25rem;
`;

const RightIconContainer = styled.span`
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
    {isLoading && <StyledProgress size={size} />}
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
