import React, { ReactNode } from 'react';
import UnstyledIcon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import styled, { StyledComponentBase } from 'styled-components';
import { readableColor, darken } from 'polished';

import timings from '../../enums/timings';
import Progress from '../Progress/Progress';
import { Div, Button as ButtonElement } from '../../htmlElements';
import { useColors } from '../../context';
import { SubcomponentPropsType } from '../commonTypes';

export type ButtonContainerProps = {
  elevation: number;
  color: string;
  variant: string;
  type: string;
};

export enum ButtonVariants {
  fill = 'fill',
  text = 'text',
  outline = 'outline',
}

export enum ButtonTypes {
  button = 'button',
  reset = 'reset',
  submit = 'submit',
}

export type ButtonProps = {
  StyledContainer?: string & StyledComponentBase<any, {}, ButtonContainerProps>;
  containerProps?: SubcomponentPropsType;
  iconPrefix?: string | JSX.Element;
  iconSuffix?: string | JSX.Element;
  isLoading?: boolean;
  isProcessing?: boolean;
  children?: ReactNode;
  elevation?: number;
  variant?: ButtonVariants;
  type?: ButtonTypes;
  color?: string;
  onClick: (...args: any[]) => void;
  LoadingBar?: string & StyledComponentBase<any, {}>;
};

/**
 * Get the appropriate font color for the button based on the variant of button
 * @param {string} variant - The variant of button
 * @param {string} color - The color prop passed into the button
 * @param {string} lightReturnColor - The color to return if the color is too dark
 * @param {string} darkReturnColor - The color to return if the color is too dark
 */
export const getFontColorFromVariant = (
  variant: string,
  color: string,
  lightReturnColor: string,
  darkReturnColor: string,
) => {
  if (variant === 'fill') {
    return readableColor(color, lightReturnColor, darkReturnColor, true);
  }
  return color;
};

/**
 * Get the appropriate background color for the button based on the variant of button
 * @param {string} variant - The variant of button
 * @param {string} color - The color prop passed into the button
 * @param {string} [transparentColor] - The color to use for a transparent background
 */
export const getBackgroundColorFromVariant = (
  variant: string,
  color: string,
  transparentColor: string,
) => {
  switch (variant) {
    case ButtonVariants.text:
    case ButtonVariants.outline:
      return transparentColor || 'transparent';
    default:
      return color;
  }
};

export const ButtonContainer: string & StyledComponentBase<any, {}, ButtonContainerProps> = styled(
  ButtonElement,
)`
  ${({ elevation = 0, color, variant }: ButtonContainerProps) => {
    const { transparent, background, grayDark } = useColors();
    const backgroundColor = getBackgroundColorFromVariant(variant, color, transparent);
    const fontColor = getFontColorFromVariant(variant, color, background, grayDark);
    const shadowYOffset = elevation && elevation >= 1 ? (elevation - 1) * 0.5 + 0.1 : 0;
    const shadowBlur = elevation && elevation >= 1 ? (elevation - 1) * 0.5 + 0.1 : 0;
    const shadowOpacity = 0.5 - elevation * 0.075;

    return `
      display: inline-flex;
      font-size: 1em;
      padding: .75em 1em;
      border-radius: 0.25em;
      transition:
        background-color ${timings.fast},
        color ${timings.slow},
        outline ${timings.slow},
        filter ${timings.slow};
      filter: drop-shadow(0em ${shadowYOffset}em ${shadowBlur}em rgba(0,0,0,${shadowOpacity}));
      outline: 0 none;
      border: ${variant === ButtonVariants.outline ? `1px solid ${color}` : '0 none;'};
      cursor: pointer;
      background-color: ${backgroundColor};
      color: ${fontColor};
      align-items: center;
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

const IconContainer = styled(Div)`
  height: 1rem;
`;

const LeftIconContainer = styled(IconContainer)`
  ${({ hasContent }: { hasContent: boolean }) => `
    ${hasContent ? 'margin-right: 1em;' : ''}
  `}
`;

const RightIconContainer = styled(IconContainer)`
  ${({ hasContent }: { hasContent: boolean }) => `
    ${hasContent ? 'margin-left: 1em;' : ''}
  `}
`;

const Button = ({
  StyledContainer = ButtonContainer,
  containerProps = {},
  iconPrefix,
  iconSuffix,
  isLoading,
  isProcessing,
  children,
  elevation = 0,
  variant = ButtonVariants.fill,
  type = ButtonTypes.button,
  color,
  onClick,
  LoadingBar = StyledProgress,
}: ButtonProps): JSX.Element | null => {
  const hasContent = Boolean(children);
  const { grayLight } = useColors();
  const containerColor = color || grayLight;

  return isLoading ? (
    <StyledContainer
      data-test-id="hsui-button"
      onClick={onClick}
      elevation={elevation}
      color={containerColor}
      variant={variant}
      type={type}
      {...containerProps}
    >
      <LoadingBar />
    </StyledContainer>
  ) : (
    <StyledContainer
      data-test-id="hsui-button"
      onClick={onClick}
      elevation={elevation}
      color={containerColor}
      variant={variant}
      type={type}
      {...containerProps}
    >
      {!isProcessing &&
        iconPrefix &&
        (typeof iconPrefix === 'string' && iconPrefix !== '' ? (
          <LeftIconContainer hasContent={hasContent}>
            <UnstyledIcon path={iconPrefix} size="1rem" />
          </LeftIconContainer>
        ) : (
          <LeftIconContainer>{iconPrefix}</LeftIconContainer>
        ))}
      {isProcessing && (
        <LeftIconContainer hasContent={hasContent}>
          <UnstyledIcon path={mdiLoading} size="1rem" spin={1} />
        </LeftIconContainer>
      )}
      {children}

      {iconSuffix &&
        (typeof iconSuffix === 'string' ? (
          <RightIconContainer hasContent={hasContent}>
            <UnstyledIcon path={iconSuffix} size="1rem" />
          </RightIconContainer>
        ) : (
          <RightIconContainer hasContent={hasContent}>{iconSuffix}</RightIconContainer>
        ))}
    </StyledContainer>
  );
};

Button.Container = ButtonContainer;
Button.ButtonVariants = ButtonVariants;
Button.ButtonTypes = ButtonTypes;
Button.LoadingBar = StyledProgress;
export default Button;
