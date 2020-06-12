import React, { ReactNode } from 'react';
import UnstyledIcon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import styled, { StyledComponentBase } from 'styled-components';
import { readableColor, darken } from 'polished';

import timings from '../../enums/timings';
import colors from '../../enums/colors';
import Progress from '../Progress/Progress';
import { Span, Button as ButtonElement } from '../../htmlElements';

export type ButtonContainerProps = {
  elevation: number;
  color: string;
  type: string;
};

export enum ButtonTypes {
  fill = 'fill',
  link = 'link',
  outline = 'outline',
}

export type ButtonProps = {
  StyledContainer?: string & StyledComponentBase<any, {}, ButtonContainerProps>;
  iconPrefix?: string | JSX.Element;
  iconSuffix?: string | JSX.Element;
  isLoading?: boolean;
  isProcessing?: boolean;
  children?: ReactNode;
  elevation?: number;
  type?: ButtonTypes;
  color?: string;
  onClick: (...args: any[]) => void;
  LoadingBar?: string & StyledComponentBase<any, {}>;
};

/**
 * Get the appropriate font color for the button based on the type of button
 * @param {string} type - The type of button
 * @param {string} color - The color prop passed into the button
 */
export const getFontColorFromType = (type: string, color: string) => {
  if (type === 'fill') {
    return readableColor(color, colors.background, colors.grayDark, true);
  }
  return color;
};

/**
 * Get the appropriate background color for the button based on the type of button
 * @param {string} type - The type of button
 * @param {string} color - The color prop passed into the button
 */
export const getBackgroundColorFromType = (type: string, color: string) => {
  switch (type) {
    case ButtonTypes.link:
    case ButtonTypes.outline:
      return colors.transparent;
    default:
      return color;
  }
};

export const ButtonContainer: string & StyledComponentBase<any, {}, ButtonContainerProps> = styled(
  ButtonElement,
)`
  ${({ elevation = 0, color, type }: ButtonContainerProps) => {
    const backgroundColor = getBackgroundColorFromType(type, color);
    const fontColor = getFontColorFromType(type, color);
    const shadowYOffset = elevation && elevation >= 1 ? (elevation - 1) * 0.5 + 0.1 : 0;
    const shadowBlur = elevation && elevation >= 1 ? (elevation - 1) * 0.5 + 0.1 : 0;
    const shadowOpacity = 0.5 - elevation * 0.075;

    return `
      display: inline-block;
      font-size: 1em;
      padding: .75em 1em;
      border-radius: 0.25em;
      transition: filter ${timings.slow};
      filter: drop-shadow(0em ${shadowYOffset}em ${shadowBlur}em rgba(0,0,0,${shadowOpacity}));
      outline: 0 none;
      border: ${type === ButtonTypes.outline ? `1px solid ${color || colors.grayDark}` : `0 none;`};
      cursor: pointer;
      background-color: ${backgroundColor};
      color: ${fontColor};
      &:hover {
        background-color: ${
          backgroundColor !== 'transparent' ? darken(0.05, backgroundColor) : 'rgba(0, 0, 0, 0.05)'
        };
      }
      &:active {
        background-color: ${
          backgroundColor !== 'transparent' ? darken(0.1, backgroundColor) : 'rgba(0, 0, 0, 0.1)'
        };
      }
    `;
  }}
`;

const StyledProgress = styled(Progress)`
  width: 5rem;
  height: 10px;
  margin-top: -5px;
  margin-bottom: -5px;
`;

const IconContainer = styled(Span)`
  margin-top: -8px;
  margin-bottom: -8px;
`;

const LeftIconContainer = styled(IconContainer)`
  margin-right: 1em;
`;

const RightIconContainer = styled(IconContainer)`
  margin-left: 1em;
`;

const Button = ({
  StyledContainer = ButtonContainer,
  iconPrefix,
  iconSuffix,
  isLoading,
  isProcessing,
  children,
  elevation = 0,
  type = ButtonTypes.fill,
  color = colors.grayDark,
  onClick,
  LoadingBar = StyledProgress,
}: ButtonProps) => {
  return isLoading ? (
    <StyledContainer
      data-test-id="hsui-button"
      onClick={onClick}
      elevation={elevation}
      color={color}
      type={type}
    >
      <LoadingBar />
    </StyledContainer>
  ) : (
    <StyledContainer
      data-test-id="hsui-button"
      onClick={onClick}
      elevation={elevation}
      color={color}
      type={type}
    >
      {!isProcessing &&
        iconPrefix &&
        (typeof iconPrefix === 'string' && iconPrefix !== '' ? (
          <LeftIconContainer>
            <UnstyledIcon path={iconPrefix} size="1rem" />
          </LeftIconContainer>
        ) : (
          <LeftIconContainer>{iconPrefix}</LeftIconContainer>
        ))}
      {isProcessing && (
        <LeftIconContainer>
          <UnstyledIcon path={mdiLoading} size="1rem" spin={1} />
        </LeftIconContainer>
      )}
      {children}

      {iconSuffix &&
        (typeof iconSuffix === 'string' ? (
          <RightIconContainer>
            <UnstyledIcon path={iconSuffix} size="1rem" />
          </RightIconContainer>
        ) : (
          <RightIconContainer>{iconSuffix}</RightIconContainer>
        ))}
    </StyledContainer>
  );
};

Button.Container = ButtonContainer;
Button.ButtonTypes = ButtonTypes;
Button.LoadingBar = StyledProgress;
export default Button;
