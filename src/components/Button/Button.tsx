import React, { ComponentProps, PropsWithChildren, ReactNode } from 'react';
import UnstyledIcon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import styled from 'styled-components';
import { darken } from 'polished';

import FeedbackTypes from '../../enums/feedbackTypes';
import timings from '../../enums/timings';
import { useAnalytics, useTheme } from '../../context';
import variants from '../../enums/variants';
import Skeleton from '../Skeleton/Skeleton';
import Progress from '../Progress/Progress';
import { StyledBaseDiv, StyledBaseButton } from '../../htmlElements';
import {
  getFontColorFromVariant,
  getBackgroundColorFromVariant,
  disabledStyles,
} from '../../utils/color';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import { getShadowStyle } from '../../utils/styles';
import InteractionFeedback from '../InteractionFeedback';
import { InteractionFeedbackProps } from '../InteractionFeedback/InteractionFeedback';

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
  StyledContainer?: StyledSubcomponentType<ButtonContainerProps>;
  // TODO: rename these to StyledIconPrefixContainer - etc
  StyledLeftIconContainer?: StyledSubcomponentType;
  StyledRightIconContainer?: StyledSubcomponentType;

  skeletonShimmerProps?: ComponentProps<typeof Skeleton.Shimmer>;
  /**
   * @deprecated The ProgressBar loading skeleton is being replaced by the Skeleton component - use skeletonShimmerProps to customize the Skeleton wrapping the button.
   */
  ProgressBar?: JSX.Element | null;

  containerRef?: React.RefObject<HTMLButtonElement>;
  // TODO: rename these to iconPrefixContainerRef - etc
  leftIconContainerRef?: React.RefObject<HTMLDivElement>;
  rightIconContainerRef?: React.RefObject<HTMLDivElement>;

  containerProps?: SubcomponentPropsType;
  interactionFeedbackProps?: Omit<InteractionFeedbackProps, 'children'>;
  // TODO: rename these to iconPrefixProps - etc
  leftIconProps?: SubcomponentPropsType;
  rightIconProps?: SubcomponentPropsType;

  children?: ReactNode;

  id?: string;
  disabled?: boolean;
  elevation?: number;
  variant?: variants;
  type?: ButtonTypes;
  color?: string;
  feedbackType?: FeedbackTypes;
  iconPrefix?: string | JSX.Element;
  iconSuffix?: string | JSX.Element;
  isLoading?: boolean;
  isProcessing?: boolean;

  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onBlur?: (e: React.FocusEvent) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
};

const SkeletonButtonContainer = React.forwardRef(
  (props: PropsWithChildren<SubcomponentPropsType>, ref) => (
    <Skeleton.Container ref={ref} as={StyledBaseButton} {...props}>
      {props.children}
    </Skeleton.Container>
  ),
);

export const ButtonContainer = styled(SkeletonButtonContainer)`
  ${({ disabled, elevation = 0, color, variant, feedbackType }: ButtonContainerProps) => {
    const { colors } = useTheme();
    const backgroundColor = getBackgroundColorFromVariant(variant, color, colors.transparent);
    const fontColor = getFontColorFromVariant(variant, color, colors.background, colors.grayDark);

    return `
      -webkit-appearance: none;
      display: inline-flex;
      align-items: baseline;
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
      border: ${
        variant === variants.outline
          ? `1px solid ${color || colors.grayDark}`
          : '1px solid transparent'
      };
      cursor: pointer;
      background-color: ${backgroundColor};
      color: ${fontColor};
      user-select: none;
      align-items: center;
      ${disabled ? disabledStyles() : ''}
      &:hover {
        background-color: ${
          backgroundColor !== 'transparent' ? darken(0.05, backgroundColor) : 'rgba(0, 0, 0, 0.05)'
        };
      }
      &:focus {
        outline: none;
        box-shadow: 0 0 5px 0.150rem ${colors.tertiaryDark};
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

const IconContainer = styled(StyledBaseDiv)`
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

  skeletonShimmerProps,
  /**
   * @deprecated The ProgressBar loading skeleton is being replaced by the Skeleton component - use skeletonShimmerProps to customize the Skeleton wrapping the button.
   */
  ProgressBar, // Deprecated

  containerProps = {},
  interactionFeedbackProps,
  leftIconProps = {},
  rightIconProps = {},

  containerRef,
  leftIconContainerRef,
  rightIconContainerRef,

  iconPrefix,
  iconSuffix,
  isLoading,
  isProcessing,
  children,
  elevation = 0,
  feedbackType = FeedbackTypes.ripple,
  variant = variants.fill,
  type = ButtonTypes.button,
  color,
  disabled = false,
  onClick = () => {},
  onBlur = () => {},
  onFocus = () => {},
  onMouseDown = () => {},
  onMouseUp = () => {},
  id,
}: ButtonProps): JSX.Element | null => {
  const hasContent = Boolean(children);
  const { colors } = useTheme();
  const containerColor = color || colors.grayLight;
  const handleEventWithAnalytics = useAnalytics();

  // get everything we expose + anything consumer wants to send to container
  const mergedContainerProps = {
    id,
    isLoading,
    role: 'button',
    ref: containerRef,
    onClick: (e: any) => handleEventWithAnalytics('Button', onClick, 'onClick', e, containerProps),
    onBlur: (e: any) => handleEventWithAnalytics('Button', onBlur, 'onBlur', e, containerProps),
    onFocus: (e: any) => handleEventWithAnalytics('Button', onFocus, 'onFocus', e, containerProps),
    onMouseDown: (e: any) =>
      handleEventWithAnalytics('Button', onMouseDown, 'onMouseDown', e, containerProps),
    onMouseUp: (e: any) =>
      handleEventWithAnalytics('Button', onMouseUp, 'onMouseUp', e, containerProps),
    elevation,
    color: containerColor,
    variant,
    type,
    disabled,
    ...containerProps,
  };

  return (
    <StyledContainer {...mergedContainerProps}>
      {!isProcessing &&
        iconPrefix &&
        (typeof iconPrefix === 'string' && iconPrefix !== '' ? (
          <StyledLeftIconContainer hasContent={hasContent} ref={leftIconContainerRef}>
            <UnstyledIcon path={iconPrefix} size="1em" {...leftIconProps} />
          </StyledLeftIconContainer>
        ) : (
          <StyledLeftIconContainer ref={leftIconContainerRef}>{iconPrefix}</StyledLeftIconContainer>
        ))}
      {isProcessing && (
        <StyledLeftIconContainer hasContent={hasContent} ref={leftIconContainerRef}>
          <UnstyledIcon path={mdiLoading} size="1em" spin={1} />
        </StyledLeftIconContainer>
      )}
      {isLoading && ProgressBar ? <Progress /> : children}
      {iconSuffix &&
        (typeof iconSuffix === 'string' ? (
          <StyledRightIconContainer hasContent={hasContent} ref={rightIconContainerRef}>
            <UnstyledIcon path={iconSuffix} size="1em" {...rightIconProps} />
          </StyledRightIconContainer>
        ) : (
          <StyledRightIconContainer hasContent={hasContent} ref={rightIconContainerRef}>
            {iconSuffix}
          </StyledRightIconContainer>
        ))}
      {feedbackType === FeedbackTypes.ripple && !disabled && !isLoading && (
        <InteractionFeedback
          StyledContainer={StyledFeedbackContainer}
          StyledSVGContainer={StyledFeedbackSVGContainer}
          color={getFontColorFromVariant(variant, containerColor)}
          {...(interactionFeedbackProps || {})}
        />
      )}
      <Skeleton.Shimmer
        color={getFontColorFromVariant(variant, containerColor, colors.background, colors.grayDark)}
        isLoading={isLoading}
        {...skeletonShimmerProps}
      />
    </StyledContainer>
  );
};

Button.Container = ButtonContainer;
Button.ButtonTypes = ButtonTypes;
Button.LeftIconContainer = LeftIconContainer;
Button.RightIconContainer = RightIconContainer;

export default Button;
