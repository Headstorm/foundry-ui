import styled from 'styled-components';
import React, { ReactNode } from 'react';
import { StyledBaseDiv, StyledBaseSpan } from '../../htmlElements';
import { useTheme } from '../../context';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import Skeleton from '../Skeleton/Skeleton';
import colors from '../../enums/colors';
import { readableColor } from 'polished';

export type AvatarContainerProps = {
  size: number;
  borderRadiusPercent: number;
  imgURL?: string;
  containerColor: string;
};

export type AvatarTextProps = {
  size: number;
  textColor: string;
};

export type AvatarProps = {
  placeholder?: ReactNode | string;
  imgURL?: string;
  size?: number;
  containerColor?: string;
  borderRadiusPercent?: number;
  isLoading?: boolean;
  isError?: boolean;

  StyledAvatarContainer?: StyledSubcomponentType;
  StyledAvatarText?: StyledSubcomponentType;
  StyledLoadingContainer?: StyledSubcomponentType;

  avatarContainerProps?: SubcomponentPropsType;
  avatarTextProps?: SubcomponentPropsType;

  avatarContainerRef?: React.RefObject<HTMLDivElement>;
  avatarTextRef?: React.RefObject<HTMLSpanElement>;
  avatarLoadingRef?: React.RefObject<HTMLDivElement>;
};

export const AvatarContainer = styled(StyledBaseDiv)`
  ${({ size, borderRadiusPercent, imgURL, containerColor }: AvatarContainerProps) => {
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
      background-color: ${containerColor};
      padding: 1em;
      width: ${size * 3}em;
      height: ${size * 3}em;
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

// export const LoadingContainer = styled(Skeleton.Container)`
//   ${({ borderRadiusPercent }: AvatarContainerProps) => {
//     return `
//         display: flex;
//         border-radius: ${borderRadiusPercent}%;
//         justify-content: center;
//         align-items: center;
//         overflow: hidden;
//       `;
//   }};
// `;

const Avatar = ({
  placeholder,
  imgURL,
  size = 3,
  borderRadiusPercent,
  containerColor,
  isLoading,
  isError,
  StyledAvatarContainer = AvatarContainer,
  StyledAvatarText = AvatarText,
  avatarContainerProps = {},
  avatarTextProps = {},
  avatarContainerRef,
  avatarTextRef,
}: AvatarProps): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const fontColor = readableColor(containerColor!, colors.grayMedium, colors.background);
  // if (isLoading) {
  //   return (
  //     <StyledLoadingContainer
  //       size={size}
  //       borderRadiusPercent={borderRadiusPercent}
  //       ref={avatarLoadingRef}
  //       {...avatarLoadingProps}
  //     >
  //       <Skeleton isLoading StyledContainer={StyledLoadingContainer}>
  //         <StyledAvatarContainer
  //           ref={avatarContainerRef}
  //           size={size}
  //           borderRadiusPercent={borderRadiusPercent}
  //           {...avatarContainerProps}
  //         />
  //       </Skeleton>
  //     </StyledLoadingContainer>
  //   );
  // }

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
          color={colors.destructive}
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
      containerColor={containerColor}
      {...avatarContainerProps}
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
    </StyledAvatarContainer>
  );
};

export default Avatar;
