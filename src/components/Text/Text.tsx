import React, { ReactNode, RefObject } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import Skeleton from '../Skeleton/Skeleton';
import { Span } from '../../htmlElements';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';

/* Default Styled Text Container */
export const TextContainer = styled(Span)`
  ${({ size, color }: { size: string; color: string }) => `
    font-size: ${size};
    color: ${color};
  `}
`;

export interface TextProps {
  children?: ReactNode;
  color?: string;
  iconPrefix?: string | JSX.Element;
  iconSuffix?: string | JSX.Element;
  isLoading?: boolean;
  isProcessing?: boolean;
  size?: string;
  StyledSkeletonContainer?: StyledSubcomponentType;
  StyledContainer?: StyledSubcomponentType;
  StyledIconContainer?: StyledSubcomponentType;
  containerProps?: SubcomponentPropsType;
  iconContainerProps?: SubcomponentPropsType;
  skeletonProps?: SubcomponentPropsType;
  containerRef?: RefObject<HTMLDivElement>;
  iconPrefixContainerRef?: RefObject<HTMLElement>;
  iconSuffixContainerRef?: RefObject<HTMLElement>;
  skeletonRef?: RefObject<HTMLElement>;
  shimmerRef?: RefObject<HTMLElement>;

}

const StyledSkeletonContainer = styled(Skeleton.Container)`
  display: inline;
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
  size = '1em',
  StyledContainer = TextContainer,
  StyledIconContainer = IconContainer,
  containerProps = {},
  iconContainerProps = {},
  skeletonProps = {},
  containerRef,
  iconPrefixContainerRef,
  iconSuffixContainerRef,
  skeletonRef,
  shimmerRef,
}: TextProps): JSX.Element => (
  <StyledContainer
    data-test-id="hsui-Text"
    size={size}
    color={color}
    ref={containerRef}
    {...containerProps}
  >
    {!isProcessing &&
      iconPrefix &&
      (typeof iconPrefix === 'string' && iconPrefix !== '' ? (
        <StyledIconContainer side="left" ref={iconPrefixContainerRef} {...iconContainerProps}>
          <Icon path={iconPrefix} size={size} />
        </StyledIconContainer>
      ) : (
        <StyledIconContainer
          side="left"
          size={size}
          ref={iconPrefixContainerRef}
          {...iconContainerProps}
        >
          {iconPrefix}
        </StyledIconContainer>
      ))}
    {isProcessing && (
      <StyledIconContainer side="left" ref={iconPrefixContainerRef} {...iconContainerProps}>
        <Icon aria-hidden="true" path={mdiLoading} size={size} spin={1} />
      </StyledIconContainer>
    )}
    <Skeleton
      color={color}
      isLoading={isLoading}
      containerRef={skeletonRef}
      shimmerRef={shimmerRef}
      StyledContainer={StyledSkeletonContainer}
      {...skeletonProps}
    >
      <Span>{children}</Span>
    </Skeleton>

    {iconSuffix &&
      (typeof iconSuffix === 'string' && iconSuffix !== '' ? (
        <StyledIconContainer side="right" ref={iconSuffixContainerRef} {...iconContainerProps}>
          <Icon path={iconSuffix} size={size} />
        </StyledIconContainer>
      ) : (
        <StyledIconContainer
          side="right"
          size={size}
          ref={iconSuffixContainerRef}
          {...iconContainerProps}
        >
          {iconSuffix}
        </StyledIconContainer>
      ))}
  </StyledContainer>
);

Text.Container = TextContainer;
Text.IconContainer = IconContainer;
export default Text;
