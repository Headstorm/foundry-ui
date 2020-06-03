import React from 'react';
import UnstyledIcon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import styled, { StyledComponentBase } from 'styled-components';
import { ButtonContainers, ButtonTypes, ButtonContainer, Progress } from './ButtonContainers';

export type ButtonProps = {
  StyledContainer?: string & StyledComponentBase<any, {}, { elevation?: number; color?: string }>;
  iconPrefix?: string | JSX.Element;
  iconSuffix?: string | JSX.Element;
  isLoading?: boolean;
  isProcessing?: boolean;
  children?: string | Node;
  elevation?: number;
  type?: string;
  color?: string;
  fillColor?: string;
  onClick: (...args: any[]) => void;
};

const Icon = styled(UnstyledIcon)``;

const Text = styled.span`
  display: inline-block;
  margin-top: -8px;
  margin-bottom: -8px;
`;

const LeftIconContainer = styled(Text)`
  margin-right: 0.25rem;
`;

const RightIconContainer = styled(Text)`
  margin-left: 0.25rem;
`;

const Button = ({
  StyledContainer,
  iconPrefix,
  iconSuffix,
  isLoading,
  isProcessing,
  children,
  elevation = 0,
  type = ButtonTypes.default,
  color,
  fillColor,
  onClick,
}: ButtonProps) => {
  const Container = StyledContainer || ButtonContainers[type];
  return isLoading ? (
    <Container data-testid="hsui-button" elevation={elevation} color={color} fillColor={fillColor}>
      <Progress />
    </Container>
  ) : (
    <Container
      data-testid="hsui-button"
      onClick={onClick}
      elevation={elevation}
      color={color}
      fillColor={fillColor}
    >
      <Text>
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
      </Text>
    </Container>
  );
};

Button.Container = ButtonContainer;
Button.Types = ButtonTypes;
Button.Containers = ButtonContainers;
export default Button;
