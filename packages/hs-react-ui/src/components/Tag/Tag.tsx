import React, { ReactNode } from 'react';
import UnstyledIcon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import styled, { StyledComponentBase } from 'styled-components';
import timings from '../../enums/timings';
import { useTheme } from '../../context';
import variants from '../../enums/variants';
import Progress from '../Progress/Progress';
import { Div } from '../../htmlElements';
import { getFontColorFromVariant, getBackgroundColorFromVariant } from '../../utils/color';
import { SubcomponentPropsType } from '../commonTypes';
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
  StyledContainer?: string & StyledComponentBase<any, {}>;
  containerProps?: SubcomponentPropsType;
  iconPrefix?: string | JSX.Element;
  iconSuffix?: string | JSX.Element;
  isLoading?: boolean;
  isProcessing?: boolean;
  children?: ReactNode;
  elevation?: number;
  variant?: variants;
  color?: string;
  StyledLoadingBar?: string & StyledComponentBase<any, {}>;
  loadingBarProps?: SubcomponentPropsType;
  StyledIconContainer?: string & StyledComponentBase<any, {}>;
  iconPrefixContainerProps?: SubcomponentPropsType;
  iconSuffixContainerProps?: SubcomponentPropsType;
  id?: string;
};

export const Container: string & StyledComponentBase<any, {}, TagContainerProps> = styled(Div)`
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
      border: ${variant === variants.outline ? `1px solid ${color || colors.grayDark}` : '0 none;'};
      cursor: pointer;
      background-color: ${backgroundColor};
      color: ${fontColor};
      align-items: center;
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
  ${({ position, hasContent }: IconContainerProps) => {
    return `
    height: 1rem;
    ${hasContent ? `margin-${position === 'right' ? 'left' : 'right'}: 1em;` : ''}
  `;
  }}
`;

const Tag = ({
  StyledContainer = Container,
  containerProps = {},
  StyledIconContainer = IconContainer,
  iconPrefixContainerProps = {},
  iconSuffixContainerProps = {},
  StyledLoadingBar = StyledProgress,
  loadingBarProps = {},
  iconPrefix,
  iconSuffix,
  isLoading,
  isProcessing,
  children,
  elevation = 0,
  variant = variants.fill,
  color,
  id,
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
    <StyledContainer {...mergedContainerProps}>
      <StyledLoadingBar {...loadingBarProps} />
    </StyledContainer>
  ) : (
    <StyledContainer {...mergedContainerProps}>
      {!isProcessing &&
        iconPrefix &&
        (typeof iconPrefix === 'string' && iconPrefix !== '' ? (
          <StyledIconContainer
            hasContent={hasContent}
            position="left"
            {...iconPrefixContainerProps}
          >
            <UnstyledIcon path={iconPrefix} size="1rem" />
          </StyledIconContainer>
        ) : (
          <StyledIconContainer>{iconPrefix}</StyledIconContainer>
        ))}
      {isProcessing && (
        <StyledIconContainer hasContent={hasContent} position="left" {...iconPrefixContainerProps}>
          <UnstyledIcon path={mdiLoading} size="1rem" spin={1} />
        </StyledIconContainer>
      )}
      {children}

      {iconSuffix &&
        (typeof iconSuffix === 'string' ? (
          <StyledIconContainer
            hasContent={hasContent}
            position="right"
            {...iconSuffixContainerProps}
          >
            <UnstyledIcon path={iconSuffix} size="1rem" />
          </StyledIconContainer>
        ) : (
          <StyledIconContainer
            hasContent={hasContent}
            position="right"
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
