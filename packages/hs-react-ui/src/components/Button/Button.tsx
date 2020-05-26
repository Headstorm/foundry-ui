import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import colors from '../../enums/colors';

const Text = styled.span``;

export enum ButtonTypes {
  primary = 'primary',
  secondary = 'secondary',
  default = 'default',
  destructive = 'destructive',
}

export const ButtonContainer = styled.button`
  display: inline-block;

  font-family: Montserrat;
  font-size: 1em;
  line-height: 0;

  padding: 1.25em 1em;
  border-radius: 0.25em;

  outline: 0 none;
  border: 0 none;

  cursor: pointer;

  background-color: ${colors.grayXlight};
  color: ${colors.grayDark};
`;

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

Button.Container = ButtonContainer;
Button.Types = ButtonTypes;
export default Button;
