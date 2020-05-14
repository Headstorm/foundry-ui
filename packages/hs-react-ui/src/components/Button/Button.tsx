import React, {ComponentType} from 'react';
import styled, { StyledComponent } from 'styled-components';
import { ButtonContainer } from './ButtonContainers';

const Text = styled.span``;

export interface ButtonProps {
  StyledContainer?: StyledComponent<"button", any, {}>,
  icon?: any,
  children?: string | Node,
  onClick(): void
};

// put buttonType elsewhere
const Button = ({
  StyledContainer = ButtonContainer,
  icon,
  children,
  onClick
}: ButtonProps) => (
    <StyledContainer onClick={onClick}>
      <Text>{children} {icon}</Text>
    </StyledContainer>
);

export default Button;
