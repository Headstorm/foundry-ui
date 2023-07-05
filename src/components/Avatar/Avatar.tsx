import styled from 'styled-components';
import React, { ReactNode } from 'react';
import { StyledBaseDiv, StyledBaseSpan } from '../../htmlElements';
import { useTheme } from '../../context';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import Skeleton from '../Skeleton/Skeleton';

export type AvatarContainerProps = {
  size: number;
  borderRadiusPercent: number;
  imgURL?: string;
};

export type AvatarTextProps = {
  size: number;
  color: string;
};

export type AvatarProps = {
  initials?: ReactNode;
  imgURL?: string;
  size?: number;
  borderRadiusPercent?: number;
  isLoading?: boolean;
  isError?: boolean;

  StyledAvatarContainer?: StyledSubcomponentType;
  StyledAvatarText?: StyledSubcomponentType;

  avatarContainerProps?: SubcomponentPropsType;
  avatarTextProps?: SubcomponentPropsType;

  avatarContainerRef?: React.RefObject<HTMLDivElement>;
  avatarTextRef?: React.RefObject<HTMLSpanElement>;
};

export const AvatarContainer = styled(StyledBaseDiv)`
  ${({ size, borderRadiusPercent, imgURL }: AvatarContainerProps) => {
    const { colors } = useTheme();

    if (imgURL) {
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
      background-color: ${colors.grayXlight};
      padding: 1em;
      width: ${size * 3}em;
      height: ${size * 3}em;
      justify-content: center;
      align-items: center;
    `;
  }}
`;

export const AvatarText = styled(StyledBaseSpan)`
  ${({ size, color }: AvatarTextProps) => {
    return `
      display: flex;
      padding: 0.66em; 
      color: ${color};
      font-size: ${size}em; 
      font-weight: 600;
      `;
  }};
`;

const Avatar = ({
  initials,
  imgURL,
  size = 3,
  borderRadiusPercent,
  isLoading,
  isError,
  StyledAvatarContainer = AvatarContainer,
  StyledAvatarText = AvatarText,
  avatarContainerProps = {},
  avatarTextProps = {},
  avatarContainerRef,
  avatarTextRef,
}: AvatarProps): JSX.Element => {
  const { colors } = useTheme();
  if (isLoading) {
    return (
      <div style={{ borderRadius: `${borderRadiusPercent}%`, overflow: 'hidden' }}>
        <Skeleton isLoading color={colors.grayXlight}>
          <div style={{ width: `${size * 3}em`, height: `${size * 3}em` }} />
        </Skeleton>
      </div>
    );
  }

  if (isError) {
    return (
      <StyledAvatarContainer
        ref={avatarContainerRef}
        size={size}
        borderRadiusPercent={borderRadiusPercent}
        imgURL=""
        {...avatarContainerProps}
      >
        <StyledAvatarText
          ref={avatarTextRef}
          size={size * 2}
          color="#c94545d9"
          {...avatarTextProps}
        >
          !
        </StyledAvatarText>
      </StyledAvatarContainer>
    );
  }

  return (
    <StyledAvatarContainer
      ref={avatarContainerRef}
      size={size}
      borderRadiusPercent={borderRadiusPercent}
      imgURL={imgURL}
      {...avatarContainerProps}
    >
      {!imgURL ? (
        <StyledAvatarText
          {...avatarTextProps}
          ref={avatarTextRef}
          size={size}
          color={colors.grayMedium}
        >
          {initials}
        </StyledAvatarText>
      ) : (
        ''
      )}
    </StyledAvatarContainer>
  );
};

export default Avatar;
