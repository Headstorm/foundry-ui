import React, { ReactNode } from 'react';
import UnstyledIcon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import styled, { StyledComponentBase } from 'styled-components';
import { darken } from 'polished';

import timings from '../../enums/timings';
import { useTheme } from '../../context';
import variants from '../../enums/variants';
import Progress from '../Progress/Progress';
import { Div, Button as ButtonElement } from '../../htmlElements';
import {
  getFontColorFromVariant,
  getBackgroundColorFromVariant,
  disabledStyles,
} from '../../utils/color';
import { SubcomponentPropsType } from '../commonTypes';
import { getShadowStyle } from '../../utils/styles';
import InteractionFeedback from '../InteractionFeedback';
import { InteractionFeedbackProps } from '../InteractionFeedback/InteractionFeedback';
import FeedbackTypes from '../../enums/feedbackTypes';

export type ButtonContainerProps = {
  elevation: number;
  color: string;
  variant: variants;
  type: string;
  disabled: boolean;
  feedbackType: FeedbackTypes;
};

export enum ButtonTypes {
  button = 'button',
  reset = 'reset',
  submit = 'submit',
}

export type ButtonProps = {
  StyledContainer?: string & StyledComponentBase<any, {}, ButtonContainerProps>;
  StyledLeftIconContainer?: StyledComponentBase<any, {}>;
  StyledRightIconContainer?: StyledComponentBase<any, {}>;
  containerProps?: SubcomponentPropsType;
  iconPrefix?: string | JSX.Element;
  iconSuffix?: string | JSX.Element;
  isLoading?: boolean;
  isProcessing?: boolean;
  children?: ReactNode;
  elevation?: number;
  variant?: variants;
  type?: ButtonTypes;
  color?: string;
  feedbackType?: FeedbackTypes;
  interactionFeedbackProps?: Omit<InteractionFeedbackProps, 'children'>;
  disabled?: boolean;
  onClick: (...args: any[]) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  LoadingBar?: string & StyledComponentBase<any, {}>;
  id?: string;
  containerRef?: React.RefObject<HTMLButtonElement>;
  leftIconContainerRef?: React.RefObject<HTMLDivElement>;
  rightIconContainerRef?: React.RefObject<HTMLDivElement>;
  loadingBarRef?: React.RefObject<HTMLDivElement>;
};

export const ButtonContainer: string & StyledComponentBase<any, {}, ButtonContainerProps> = styled(
  ButtonElement,
)`
  ${({ disabled, elevation = 0, color, variant, feedbackType }: ButtonContainerProps) => {
    const { colors } = useTheme();
    const backgroundColor = getBackgroundColorFromVariant(variant, color, colors.transparent);
    const fontColor = getFontColorFromVariant(variant, color, colors.background, colors.grayDark);

    return `
      display: inline-flex;
      position: relative;
      font-size: 1em;
      padding: .75em 1em;
      border-radius: 0.25em;
      transition:
        background-color ${timings.fast},
        color ${timings.slow},
        outline ${timings.slow},
        filter ${timings.slow},
        box-shadow ${timings.slow};
      ${getShadowStyle(elevation, colors.shadow)}
      outline: 0 none;
      border: ${variant === variants.outline ? `1px solid ${color || colors.grayDark}` : '0 none;'};
      cursor: pointer;
      background-color: ${backgroundColor};
      color: ${fontColor};
      align-items: center;
      ${disabled ? disabledStyles() : ''}
      &:hover {
        background-color: ${
          backgroundColor !== 'transparent' ? darken(0.05, backgroundColor) : 'rgba(0, 0, 0, 0.05)'
        };
      }
      ${
        feedbackType === FeedbackTypes.simple
          ? `
            &:active {
              background-color: ${
                backgroundColor !== 'transparent'
                  ? darken(0.1, backgroundColor)
                  : 'rgba(0, 0, 0, 0.1)'
              };
            }
          `
          : ''
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
  vertical-align: middle;
`;

const StyledFeedbackContainer = styled(InteractionFeedback.Container)`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;

const StyledFeedbackSVGContainer = styled(InteractionFeedback.SVGContainer)`
  border-radius: 0.25em;
`;

const LeftIconContainer = styled(IconContainer)`
  ${({ hasContent }: { hasContent: boolean }) => `
    ${hasContent ? 'margin-right: 0.75em;' : ''}
  `}
`;

const RightIconContainer = styled(IconContainer)`
  ${({ hasContent }: { hasContent: boolean }) => `
    ${hasContent ? 'margin-left: 0.75em;' : ''}
  `}
`;

const Button = ({
  StyledContainer = ButtonContainer,
  StyledLeftIconContainer = LeftIconContainer,
  StyledRightIconContainer = RightIconContainer,
  containerProps = {},
  iconPrefix,
  iconSuffix,
  isLoading,
  isProcessing,
  children,
  elevation = 0,
  feedbackType = FeedbackTypes.ripple,
  interactionFeedbackProps,
  variant = variants.fill,
  type = ButtonTypes.button,
  color,
  disabled = false,
  onClick,
  onMouseDown = () => {},
  onMouseUp = () => {},
  LoadingBar = StyledProgress,
  id,
  containerRef,
  leftIconContainerRef,
  rightIconContainerRef,
  loadingBarRef,
}: ButtonProps): JSX.Element | null => {
  const hasContent = Boolean(children);
  const { colors } = useTheme();
  const containerColor = color || colors.grayLight;
  // get everything we expose + anything consumer wants to send to container
  const mergedContainerProps = {
    'data-test-id': 'hsui-button',
    id,
    onClick,
    onMouseDown,
    onMouseUp,
    elevation,
    color: containerColor,
    variant,
    type,
    disabled,
    ...containerProps,
  };

  const buttonContent = isLoading ? (
    <LoadingBar ref={loadingBarRef} />
  ) : (
    <>
      {!isProcessing &&
        iconPrefix &&
        (typeof iconPrefix === 'string' && iconPrefix !== '' ? (
          <StyledLeftIconContainer hasContent={hasContent} ref={leftIconContainerRef}>
            <UnstyledIcon path={iconPrefix} size="1rem" />
          </StyledLeftIconContainer>
        ) : (
          <StyledLeftIconContainer ref={leftIconContainerRef}>{iconPrefix}</StyledLeftIconContainer>
        ))}
      {isProcessing && (
        <StyledLeftIconContainer hasContent={hasContent} ref={leftIconContainerRef}>
          <UnstyledIcon path={mdiLoading} size="1rem" spin={1} />
        </StyledLeftIconContainer>
      )}
      {children}

      {iconSuffix &&
        (typeof iconSuffix === 'string' ? (
          <StyledRightIconContainer hasContent={hasContent} ref={rightIconContainerRef}>
            <UnstyledIcon path={iconSuffix} size="1rem" />
          </StyledRightIconContainer>
        ) : (
          <StyledRightIconContainer hasContent={hasContent} ref={rightIconContainerRef}>
            {iconSuffix}
          </StyledRightIconContainer>
        ))}
    </>
  );

  return (
    <StyledContainer ref={containerRef} {...mergedContainerProps}>
      {buttonContent}
      {feedbackType === FeedbackTypes.ripple && !disabled && (
        <InteractionFeedback
          StyledContainer={StyledFeedbackContainer}
          StyledSVGContainer={StyledFeedbackSVGContainer}
          color={getFontColorFromVariant(variant, containerColor)}
          {...(interactionFeedbackProps || {})}
        />
      )}
    </StyledContainer>
  );
};

Button.Container = ButtonContainer;
Button.ButtonTypes = ButtonTypes;
Button.LoadingBar = StyledProgress;
Button.LeftIconContainer = LeftIconContainer;
Button.RightIconContainer = RightIconContainer;

export default Button;
