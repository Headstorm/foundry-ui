import React, { ReactNode } from 'react';
import UnstyledIcon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import styled, { StyledComponentBase } from 'styled-components';

import colors from '../../enums/colors';
import ButtonContainer, { ButtonTypes, ButtonContainerProps } from './ButtonContainers';
import Progress from '../Progress/Progress';

export type ButtonProps = {
  StyledContainer?: string & StyledComponentBase<any, {}, ButtonContainerProps>;
  iconPrefix?: string | JSX.Element;
  iconSuffix?: string | JSX.Element;
  isLoading?: boolean;
  isProcessing?: boolean;
  children?: ReactNode;
  elevation?: number;
  type?: ButtonTypes;
  color?: string;
  onClick: (...args: any[]) => void;
  LoadingBar?: string & StyledComponentBase<any, {}>;
};

const Icon = styled(UnstyledIcon)``;

const Text = styled.span`
  margin-top: -8px;
  margin-bottom: -8px;
`;

export const StyledProgress = styled(Progress)`
  width: 5rem;
  height: 10px;
  margin-top: -5px;
  margin-bottom: -5px;
`;

const LeftIconContainer = styled(Text)`
  margin-right: 0.25rem;
`;

const RightIconContainer = styled(Text)`
  margin-left: 0.25rem;
`;

const Button = ({
  StyledContainer = ButtonContainer,
  iconPrefix,
  iconSuffix,
  isLoading,
  isProcessing,
  children,
  elevation = 0,
  type = ButtonTypes.fill,
  color = colors.grayDark,
  onClick,
  LoadingBar = StyledProgress,
}: ButtonProps) => {
  return isLoading ? (
    <StyledContainer
      data-test-id="hsui-button"
      onClick={onClick}
      elevation={elevation}
      color={color}
      type={type}
    >
      <LoadingBar />
    </StyledContainer>
  ) : (
    <StyledContainer
      data-test-id="hsui-button"
      onClick={onClick}
      elevation={elevation}
      color={color}
      type={type}
    >
      {!isProcessing &&
        iconPrefix &&
        (typeof iconPrefix === 'string' && iconPrefix !== '' ? (
          <LeftIconContainer>
            <Icon path={iconPrefix} size="1rem" />
          </LeftIconContainer>
        ) : (
          <LeftIconContainer>{iconPrefix}</LeftIconContainer>
        ))}
      {isProcessing && (
        <LeftIconContainer>
          <Icon path={mdiLoading} size="1rem" spin={1} />
        </LeftIconContainer>
      )}
      {children}

      {iconSuffix &&
        (typeof iconSuffix === 'string' ? (
          <RightIconContainer>
            <Icon path={iconSuffix} size="1rem" />
          </RightIconContainer>
        ) : (
          <RightIconContainer>{iconSuffix}</RightIconContainer>
        ))}
    </StyledContainer>
  );
};

Button.Container = ButtonContainer;
Button.Types = ButtonTypes;
Button.LoadingBar = StyledProgress;
export default Button;
