import React, { FunctionComponent } from 'react';
import styled, { StyledComponent } from 'styled-components';
import { ButtonContainer } from './ButtonContainers';

const Text = styled.span``;

export interface ButtonProps {
  StyledContainer?: StyledComponent<"button", any, {}>,
  icon?: any,
  isLoading?: any,
  children?: string | Node,
  onClick(): Function | void
};

const Button: FunctionComponent<ButtonProps> = ({
  StyledContainer = ButtonContainer,
  icon,
  isLoading,
  children,
  onClick
}: ButtonProps) => isLoading ? (<StyledContainer>
  <Text>{isLoading.children} {isLoading.icon}</Text>
</StyledContainer>) : (
  <StyledContainer onClick={onClick}>
    <Text>{children} {icon}</Text>
  </StyledContainer>
);

export default Button;