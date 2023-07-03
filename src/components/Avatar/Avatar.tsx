/* eslint-disable no-unused-vars */
import styled from 'styled-components';
import React, { ReactNode } from 'react';
import { StyledBaseDiv, StyledBaseSpan } from '../../htmlElements';
import { useTheme } from '../../context';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import Skeleton from '../Skeleton/Skeleton';

export type AvatarProps = {
  initials?: ReactNode;
  imgURL?: string;
  size?: number;
  shape?: number;
  isLoading?: boolean;
  isError?: boolean;
  hasImage?: boolean;

  StyledAvatarContainer?: StyledSubcomponentType;
  StyledAvatarText?: StyledSubcomponentType;
  StyledAvatarImage?: StyledSubcomponentType;

  avatarProps?: SubcomponentPropsType;

  avatarTextRef?: React.RefObject<HTMLSpanElement>;
  avatarImageRef?: React.RefObject<HTMLImageElement>
  avatarContainerRef?: React.RefObject<HTMLDivElement>;

};

export const AvatarContainer = styled(StyledBaseDiv)`
  ${({ size, shape }: { size: number, shape: string }) => {
    return `
      display: flex;
      border-radius: ${`${shape}%`};
      background-color: #eaeaea; 
      padding: 1rem;
      width: ${`${size * 3}rem`};
      height: ${`${size * 3}rem`};
      justify-content: center;
      align-items: center;
    `;
  }}
`;

export const AvatarText = styled(StyledBaseSpan)`
  ${({ size, colors }: { size: string, colors: string }) => {
    return `
        display: flex;
        padding: 2rem;
        color: ${colors};
        font-size: ${`${size}rem`};
        font-weight: 600;
      `;
  }};
`;

export const AvatarImage = styled(StyledBaseDiv)`
${({ size, shape }: { size: number, shape: string }) => {
    return `
      display: flex;
      justify-content: center;
      align-items: center;
      object-fit: cover;
      border-radius: ${`${shape}%`};
      overflow: hidden;
      width: ${`${size * 3}rem`};
      height: ${`${size * 3}rem`};

      img { =
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    `;
  }}
`;

const Avatar = ({
  initials,
  imgURL,
  size = 3,
  shape,
  isLoading,
  isError,
  hasImage,
  StyledAvatarContainer = AvatarContainer,
  StyledAvatarText = AvatarText,
  StyledAvatarImage = AvatarImage,
  avatarProps = {},
  avatarContainerRef,
  avatarTextRef,
  avatarImageRef,
}: AvatarProps): JSX.Element => {
  const { colors } = useTheme();
  if (isLoading) {
   return (
      <div style={{ borderRadius: `${shape}%`, overflow: 'hidden' }}>
        <Skeleton
          isLoading
          color={colors.grayLight}
        >
          <div style={{ width: `${size * 3}rem`, height: `${size * 3}rem` }} />
        </Skeleton>
      </div>
   );
  }

  if (hasImage) {
    return (
      <StyledAvatarImage ref={avatarImageRef} size={size} shape={shape}>
       <img
         alt="profile"
         {...avatarProps}
         src={imgURL}
         ref={avatarImageRef}
       />
      </StyledAvatarImage>
    );
  }

  return (
    <StyledAvatarContainer ref={avatarContainerRef} size={size} shape={shape}>
        { !isError ?
        <StyledAvatarText {...avatarProps} ref={avatarTextRef} size={size} colors={colors.grayLight}>
          {initials}
        </StyledAvatarText> :
        <StyledAvatarText {...avatarProps} ref={avatarTextRef} size={size * 2} colors="#c94545d9">
          !
        </StyledAvatarText>}
    </StyledAvatarContainer>
  );
};

export default Avatar;
