import React, { ReactNode } from 'react';
import UnstyledIcon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import styled, { StyledComponentBase } from 'styled-components';
import { darken } from 'polished';

import timings from '../../enums/timings';
import colors from '../../enums/colors';
import variants from '../../enums/variants';
import Progress from '../Progress/Progress';
import { Div, Button as ButtonElement } from '../../htmlElements';
import { getFontColorFromVariant, getBackgroundColorFromVariant } from '../../utils/color';

export type ButtonContainerProps = {
  elevation: number;
  color: string;
  variant: variants;
  type: string;
};

export enum ButtonTypes {
  button = 'button',
  reset = 'reset',
  submit = 'submit',
}

export type ButtonProps = {
  StyledContainer?: string & StyledComponentBase<any, {}, ButtonContainerProps>;
  containerProps?: object;
  iconPrefix?: string | JSX.Element;
  iconSuffix?: string | JSX.Element;
  isLoading?: boolean;
  isProcessing?: boolean;
  children?: ReactNode;
  elevation?: number;
  variant?: variants;
  type?: ButtonTypes;
  color?: string;
  onClick: (...args: any[]) => void;
  LoadingBar?: string & StyledComponentBase<any, {}>;
};

export const ButtonContainer: string & StyledComponentBase<any, {}, ButtonContainerProps> = styled(
  ButtonElement,
)`
  ${({ elevation = 0, color, variant }: ButtonContainerProps) => {
    const backgroundColor = getBackgroundColorFromVariant(variant, color);
    const fontColor = getFontColorFromVariant(variant, color);
    const shadowYOffset = elevation && elevation >= 1 ? (elevation - 1) * 0.5 + 0.1 : 0;
    const shadowBlur = elevation && elevation >= 1 ? (elevation - 1) * 0.5 + 0.1 : 0;
    const shadowOpacity = elevation > 0 ? 0.5 - elevation * 0.075 : 0;

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
      border: ${variant === variants.outline ? `1px solid ${color || colors.grayDark}` : '0 none;'};
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
  variant = variants.fill,
  type = ButtonTypes.button,
  color = colors.grayDark,
  onClick,
  LoadingBar = StyledProgress,
}: ButtonProps): JSX.Element | null => {
  const hasContent = Boolean(children);

  return isLoading ? (
    <StyledContainer
      data-test-id="hsui-button"
      onClick={onClick}
      elevation={elevation}
      color={color}
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
      color={color}
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
Button.ButtonTypes = ButtonTypes;
Button.LoadingBar = StyledProgress;
export default Button;
