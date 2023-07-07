/* eslint-disable @typescript-eslint/no-non-null-assertion */
import styled from 'styled-components';
import React, { ReactNode } from 'react';
import { darken, lighten, readableColor } from 'polished';
import { StyledBaseSpan } from '../../htmlElements';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import Skeleton from '../Skeleton/Skeleton';
import colors from '../../enums/colors';

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

  StyledAvatarContainer?: StyledSubcomponentType;
  StyledAvatarText?: StyledSubcomponentType;
  StyledAvatarShimmer?: StyledSubcomponentType;

  avatarContainerProps?: SubcomponentPropsType;
  avatarTextProps?: SubcomponentPropsType;

  avatarContainerRef?: React.RefObject<HTMLDivElement>;
  avatarTextRef?: React.RefObject<HTMLSpanElement>;
};

export const AvatarContainer = styled(Skeleton.Container)`
  ${({ size, borderRadiusPercent, imgURL, isLoading, color }: AvatarContainerProps) => {
    if (imgURL && !isLoading) {
      return `
        border-radius: ${borderRadiusPercent}%;
        overflow: hidden;
        width: ${size * 3}em;
        height: ${size * 3}em;
        background-image: url(${imgURL});
        background-size: cover;
      `;
    }
    return `
      display: flex;
      border-radius: ${borderRadiusPercent}%;
      padding: 1em;
      width: ${size * 3}em;
      height: ${size * 3}em;
      background-color: ${color};
      justify-content: center;
      align-items: center;
    `;
  }}
`;

export const AvatarText = styled(StyledBaseSpan)`
  ${({ size, textColor }: AvatarTextProps) => {
    return `
      display: flex;
      padding: 0.66em; 
      color: ${textColor};
      font-size: ${size}em; 
      font-weight: 600;
      `;
  }};
`;

export const AvatarShimmer = styled(Skeleton.Shimmer)`
${({ borderRadiusPercent }: Pick<AvatarProps, 'borderRadiusPercent'>) =>
  `
    border-radius: ${borderRadiusPercent}%;
  `
  }
`;

const Avatar = ({
  placeholder,
  // eslint-disable-next-line no-unused-vars
  children,
  imgURL,
  size = 3,
  borderRadiusPercent,
  color = colors.grayXlight,
  isLoading,
  StyledAvatarContainer = AvatarContainer,
  StyledAvatarText = AvatarText,
  StyledAvatarShimmer = AvatarShimmer,
  avatarTextProps = {},
  avatarContainerRef,
  avatarTextRef,
}: AvatarProps): JSX.Element => {
  const fontColor = readableColor(color!, colors.grayMedium, colors.background);
  const shimmerColor = fontColor === colors.background ? lighten(0.2, color!) : darken(0.2, color!);
  return (
    <Skeleton
      isLoading={isLoading}
      color={shimmerColor}
      StyledContainer={StyledAvatarContainer}
      containerProps={{ size,
      borderRadiusPercent,
      imgURL,
      color,
      avatarContainerRef }}
      shimmerProps={{ borderRadiusPercent }}
      StyledShimmer={StyledAvatarShimmer}
    >
      {!imgURL ? (
        <StyledAvatarText
          {...avatarTextProps}
          ref={avatarTextRef}
          size={size}
          textColor={fontColor}
        >
          {placeholder}
        </StyledAvatarText>
      ) : (
        ''
      )}
    </Skeleton>
  );
};

export default Avatar;
