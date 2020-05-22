import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import { ButtonContainer } from './ButtonContainers';

const Text = styled.span``;

export type ButtonProps = {
  StyledContainer?: string & StyledComponentBase<any, {}>;
  icon?: any;
  isLoading?: any;
  children?: string | Node;
  onClick: (...args: any[]) => void;
};

const Button = ({
  StyledContainer = ButtonContainer,
  icon,
  isLoading,
  children,
  onClick,
}: ButtonProps) => {
  return isLoading ? (
    <StyledContainer>
      <Text>
        {isLoading.children} {isLoading.icon}
      </Text>
    </StyledContainer>
  ) : (
    <StyledContainer onClick={onClick}>
      <Text>
        {children} {icon}
      </Text>
    </StyledContainer>
  );
};
export default Button;
