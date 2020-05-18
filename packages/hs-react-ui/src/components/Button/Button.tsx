import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { darken } from 'polished';

import { ButtonTypes } from '../../enums/ButtonTypes';
import { ColorTypes }  from '../../enums/ColorTypes';

const ButtonContainer = styled.button`
  display: inline-block;

  font-family: Gotham;
  font-size: 1em;
  line-height: 0;

  padding: 1.25em 1em;
  border-radius: 0.25em;

  outline: 0 none;
  border: 0 none;

  cursor: pointer;

  background-color: ${ColorTypes.grayXlight};
  color: ${ColorTypes.grayDark};
`;

const PrimaryButtonContainer = styled(ButtonContainer)`
  color: ${ColorTypes.background};
  background-color: ${ColorTypes.primary};
  &:hover { background-color: ${darken(.05, ColorTypes.primary)}; }
  &:active { background-color: ${darken(.1, ColorTypes.primary)}; }
`;

const SecondaryButtonContainer = styled(ButtonContainer)`
  color: ${ColorTypes.background};
  background-color: ${ColorTypes.grayMedium};
  &:hover { background-color: ${darken(.05, ColorTypes.grayMedium)}; }
  &:active { background-color: ${darken(.1, ColorTypes.grayMedium)}; }
`;

const DestructiveButtonContainer = styled(ButtonContainer)`
  color: ${ColorTypes.background};
  background-color: ${ColorTypes.destructive};
  &:hover { background-color: ${darken(.05, ColorTypes.destructive)}; }
  &:active { background-color: ${darken(.1, ColorTypes.destructive)}; }
`;

const ButtonContainers = {
  [ButtonTypes.default]: ButtonContainer,
  [ButtonTypes.primary]: PrimaryButtonContainer,
  [ButtonTypes.secondary]: SecondaryButtonContainer,
  [ButtonTypes.destructive]: DestructiveButtonContainer,
};

const Text = styled.span``;

export type ButtonProps = {
  buttonType: ButtonTypes,
  children: string | Node,
  onClick(): void
}

const Button: FunctionComponent<ButtonProps> = ({
  buttonType,
  children,
  onClick
}) => {
  const Container = ButtonContainers[buttonType];

  return (
    <Container onClick={onClick}>
      <Text>{children}</Text>
    </Container>
  )
};

export default Button;
