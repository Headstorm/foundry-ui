import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { darken } from 'polished';

import { ButtonTypes } from '../../enums/ButtonTypes';
import colors from '../../constants/colors';

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

  background-color: ${colors.grayXlight};
  color: ${colors.grayDark};
`;

const PrimaryButtonContainer = styled(ButtonContainer)`
  color: ${colors.background};
  background-color: ${colors.primary};
  &:hover { background-color: ${darken(.05, colors.primary)}; }
  &:active { background-color: ${darken(.1, colors.primary)}; }
`;

const SecondaryButtonContainer = styled(ButtonContainer)`
  color: ${colors.background};
  background-color: ${colors.grayMedium};
  &:hover { background-color: ${darken(.05, colors.grayMedium)}; }
  &:active { background-color: ${darken(.1, colors.grayMedium)}; }
`;

const DestructiveButtonContainer = styled(ButtonContainer)`
  color: ${colors.background};
  background-color: ${colors.destructive};
  &:hover { background-color: ${darken(.05, colors.destructive)}; }
  &:active { background-color: ${darken(.1, colors.destructive)}; }
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
