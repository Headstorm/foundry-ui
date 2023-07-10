/* eslint-disable @typescript-eslint/no-non-null-assertion */
import styled from 'styled-components';
import React, { ReactNode } from 'react';
import { darken, lighten, readableColor } from 'polished';
import { StyledBaseSpan } from '../../htmlElements';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import Skeleton from '../Skeleton/Skeleton';
import { useTheme } from '../../context';

export type AvatarContainerProps = {
  size: number;
  borderRadiusPercent: number;
  imgURL?: string;
  color: string;
  isLoading: boolean;
};

export type AvatarTextProps = {
  size: number;
  textColor: string;
};

export type AvatarProps = {
  placeholder?: string | ReactNode;
  children?: ReactNode;
  imgURL?: string;
  size?: number;
  color?: string;
  borderRadiusPercent?: number;
  isLoading?: boolean;

  StyledContainer?: StyledSubcomponentType;
  StyledText?: StyledSubcomponentType;
  StyledShimmer?: StyledSubcomponentType;
  containerProps?: SubcomponentPropsType;
  textProps?: SubcomponentPropsType;
  shimmerProps?: SubcomponentPropsType;
  containerRef?: React.RefObject<HTMLDivElement>;
  textRef?: React.RefObject<HTMLSpanElement>;
  shimmerRef?: React.RefObject<HTMLDivElement>;
};

export const AvatarContainer = styled(Skeleton.Container)`
  ${({ size, borderRadiusPercent, imgURL, isLoading, color }: AvatarContainerProps) => {
    if (imgURL && !isLoading) {
      return `
        border-radius: ${borderRadiusPercent}%;
        overflow: hidden;
        width: ${size}em;
        height: ${size}em;
        background-image: url(${imgURL});
        background-size: cover;
      `;
    }
    return `
      display: flex;
      border-radius: ${borderRadiusPercent}%;
      padding: 1em;
      width: ${size}em;
      height: ${size}em;
      background-color: ${color};
      justify-content: center;
      align-items: center;
    `;
  }}
`;

export const AvatarText = styled(StyledBaseSpan)`
  ${({ size, textColor }: AvatarTextProps) => {
    return `
      color: ${textColor};
      font-size: ${size / 3}em; 
      font-weight: 600;
      `;
  }};
`;

export const AvatarShimmer = styled(Skeleton.Shimmer)`
  ${({ borderRadiusPercent }: Pick<AvatarProps, 'borderRadiusPercent'>) =>
    `
      border-radius: ${borderRadiusPercent}%;
    `}
`;

const Avatar = ({
  placeholder,
  children,
  imgURL,
  size = 10,
  borderRadiusPercent = 50,
  color: initialColor,
  isLoading = false,
  StyledContainer = AvatarContainer,
  StyledText = AvatarText,
  StyledShimmer = AvatarShimmer,
  textProps = {},
  containerProps = {},
  shimmerProps = {},
  containerRef,
  textRef,
  shimmerRef,
}: AvatarProps): JSX.Element => {
  const { colors } = useTheme();
  const color = initialColor || colors.grayXlight;
  const fontColor = readableColor(color, colors.grayMedium, colors.background);
  const shimmerColor = fontColor === colors.background ? lighten(0.2, color!) : darken(0.2, color!);
  return (
    <Skeleton
      isLoading={isLoading}
      color={shimmerColor}
      StyledContainer={StyledContainer}
      containerProps={{
        size,
        borderRadiusPercent,
        imgURL,
        color,
        ...containerProps,
        ref: containerRef,
      }}
      shimmerProps={{ borderRadiusPercent, ...shimmerProps, ref: shimmerRef }}
      StyledShimmer={StyledShimmer}
    >
      {children}
      {!imgURL ? (
        <StyledText {...textProps} ref={textRef} size={size} textColor={fontColor}>
          {placeholder}
        </StyledText>
      ) : (
        ''
      )}
    </Skeleton>
  );
};

Avatar.Container = AvatarContainer;
Avatar.Text = AvatarText;

export default Avatar;
