import React from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import Text from '../Text/Text';
import {ButtonContainers, ButtonTypes, ButtonContainer} from './ButtonContainers';

const ButtonText = styled.span``;
const SVG = styled.svg`
${({elevation = 0}: ButtonProps) => `
  width: 100%;
  height: 100%;
  filter: drop-shadow(0rem ${elevation * 0.25}rem ${elevation * 0.75}rem ${elevation *
    -0.25}rem rgba(0,0,0,${0.6 - elevation * 0.1}));
`}
`;

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
