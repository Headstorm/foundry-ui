import React, { ReactNode } from 'react';
import UnstyledIcon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import styled, { StyledComponentBase } from 'styled-components';
import timings from '../../enums/timings';
import { useTheme } from '../../context';
import variants from '../../enums/variants';
import Progress from '../Progress/Progress';
import { StyledBaseDiv, StyledBaseSpan } from '../../htmlElements';
import { getFontColorFromVariant, getBackgroundColorFromVariant } from '../../utils/color';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import { getShadowStyle } from '../../utils/styles';

export type TagContainerProps = {
  elevation: number;
  color: string;
  variant: variants;
  type: string;
  disabled: boolean;
};

export type IconContainerProps = {
  hasContent: boolean;
  position: 'right' | 'left';
};

export type TagProps = {
  iconPrefix?: string | JSX.Element;
  iconSuffix?: string | JSX.Element;
  isLoading?: boolean;
  isProcessing?: boolean;
  children?: ReactNode;
  elevation?: number;
  variant?: variants;
  color?: string;
  id?: string;

  containerProps?: SubcomponentPropsType;
  iconPrefixContainerProps?: SubcomponentPropsType;
  iconSuffixContainerProps?: SubcomponentPropsType;
  loadingBarProps?: SubcomponentPropsType;
  StyledContainer?: StyledSubcomponentType;
  StyledIconContainer?: StyledSubcomponentType;
  StyledLoadingBar?: StyledSubcomponentType;
  containerRef?: React.RefObject<HTMLSpanElement>;
  iconPrefixContainerRef?: React.RefObject<HTMLElement>;
  iconSuffixContainerRef?: React.RefObject<HTMLElement>;
  loadingBarRef?: React.RefObject<HTMLElement>;
};

export const Container: string & StyledComponentBase<any, {}, TagContainerProps> = styled(
  StyledBaseSpan,
)`
  ${({ elevation = 0, color, variant }: TagContainerProps) => {
    const { colors } = useTheme();
    const backgroundColor = getBackgroundColorFromVariant(variant, color, colors.transparent);
    const fontColor = getFontColorFromVariant(variant, color, colors.background, colors.grayDark);

    return `
      display: inline-flex;
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
      border: ${variant === variants.outline ? `1px solid ${color || colors.grayDark};` : '0 none;'}
      background-color: ${backgroundColor};
      color: ${fontColor};
      align-items: center;
    `;
  }}
`;

const StyledProgress = styled(Progress)`
  width: 5em;
  height: 10px;
  margin-top: -5px;
  margin-bottom: -5px;
`;

const IconContainer = styled(StyledBaseDiv)`
  ${({ position, hasContent }: IconContainerProps) => {
    return `
    height: 1em;
    ${hasContent ? `margin-${position === 'right' ? 'left' : 'right'}: 1em;` : ''}
  `;
  }}
`;

const Tag = ({
  iconPrefix,
  iconSuffix,
  isLoading,
  isProcessing,
  children,
  elevation = 0,
  variant = variants.fill,
  color,
  id,

  containerProps = {},
  iconPrefixContainerProps = {},
  iconSuffixContainerProps = {},
  loadingBarProps = {},

  containerRef,
  iconPrefixContainerRef,
  iconSuffixContainerRef,
  loadingBarRef,

  StyledContainer = Container,
  StyledIconContainer = IconContainer,
  StyledLoadingBar = StyledProgress,
}: TagProps): JSX.Element => {
  const hasContent = Boolean(children);
  const { colors } = useTheme();
  const containerColor = color || colors.grayLight;
  // get everything we expose + anything consumer wants to send to container
  const mergedContainerProps = {
    id,
    elevation,
    color: containerColor,
    variant,
    ...containerProps,
  };

  return isLoading ? (
    <StyledContainer ref={containerRef} {...mergedContainerProps}>
      <StyledLoadingBar ref={loadingBarRef} {...loadingBarProps} />
    </StyledContainer>
  ) : (
    <StyledContainer ref={containerRef} {...mergedContainerProps}>
      {!isProcessing &&
        iconPrefix &&
        (typeof iconPrefix === 'string' && iconPrefix !== '' ? (
          <StyledIconContainer
            hasContent={hasContent}
            position="left"
            ref={iconPrefixContainerRef}
            {...iconPrefixContainerProps}
          >
            <UnstyledIcon path={iconPrefix} size="1em" />
          </StyledIconContainer>
        ) : (
          <StyledIconContainer ref={iconPrefixContainerRef}>{iconPrefix}</StyledIconContainer>
        ))}
      {isProcessing && (
        <StyledIconContainer
          hasContent={hasContent}
          position="left"
          ref={iconPrefixContainerRef}
          {...iconPrefixContainerProps}
        >
          <UnstyledIcon path={mdiLoading} size="1em" spin={1} />
        </StyledIconContainer>
      )}
      {children}

      {iconSuffix &&
        (typeof iconSuffix === 'string' ? (
          <StyledIconContainer
            hasContent={hasContent}
            position="right"
            ref={iconSuffixContainerRef}
            {...iconSuffixContainerProps}
          >
            <UnstyledIcon path={iconSuffix} size="1em" />
          </StyledIconContainer>
        ) : (
          <StyledIconContainer
            hasContent={hasContent}
            position="right"
            ref={iconSuffixContainerRef}
            {...iconSuffixContainerProps}
          >
            {iconSuffix}
          </StyledIconContainer>
        ))}
    </StyledContainer>
  );
};

Tag.Container = Container;
Tag.LoadingBar = StyledProgress;
Tag.IconContainer = IconContainer;
export default Tag;
