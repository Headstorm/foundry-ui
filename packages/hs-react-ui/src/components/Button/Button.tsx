import React, { ReactNode } from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import colors from '../../enums/colors';
import fonts from '../../enums/fonts';

export enum ButtonTypes {
  primary = 'primary',
  secondary = 'secondary',
  default = 'default',
  destructive = 'destructive',
}

export const ButtonContainer = styled.button`
  display: inline-block;

  ${fonts.body}
  font-size: 1em;

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
  children?: ReactNode;
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
      {isLoading.children} {isLoading.icon}
    </StyledContainer>
  ) : (
    <StyledContainer onClick={onClick}>
      {children} {icon}
    </StyledContainer>
  );
};

Button.Container = ButtonContainer;
Button.Types = ButtonTypes;
export default Button;
