import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import Text from '../Text/Text';
import {ButtonContainers, ButtonTypes, ButtonContainer} from './ButtonContainers';

const ButtonText = styled.span``;

export type ButtonProps = {
  StyledContainer?: string & StyledComponentBase<any, {}, { elevation?: number, color?: string}>;
  icon?: any;
  isLoading?: any;
  children?: string | Node;
  elevation?: number;
  type?: string,
  color?: string,
  onClick: (...args: any[]) => void;
};

const Button = ({
  StyledContainer,
  icon,
  isLoading,
  children,
  elevation = 0,
  type = ButtonTypes.default,
  color,
  onClick,
}: ButtonProps) => {
  const Container = StyledContainer || ButtonContainers[type]
  return isLoading ? (
    <Container elevation={elevation} color={color}>
      <Text isLoading />
    </Container>
  ) : (
    <Container onClick={onClick} elevation={elevation} color={color}>
      <ButtonText>
        {children} {icon}
      </ButtonText>
    </Container>
  );
};

Button.Container = ButtonContainer;
Button.Types = ButtonTypes;
Button.Containers = ButtonContainers
export default Button;
