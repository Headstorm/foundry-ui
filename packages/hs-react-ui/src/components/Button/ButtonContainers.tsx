import styled from 'styled-components';
import { ButtonTypes } from '../../enums/ButtonTypes';
import Colors from '../../enums/Colors';
import { darken } from 'polished';

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

  background-color: ${Colors.grayXlight};
  color: ${Colors.grayDark};
`;

export const PrimaryButtonContainer = styled(ButtonContainer)`
  color: ${Colors.background};
  background-color: ${Colors.primary};
  &:hover { background-color: ${darken(.05, Colors.primary)}; }
  &:active { background-color: ${darken(.1, Colors.primary)}; }
`;

export const SecondaryButtonContainer = styled(ButtonContainer)`
  color: ${Colors.background};
  background-color: ${Colors.grayMedium};
  &:hover { background-color: ${darken(.05, Colors.grayMedium)}; }
  &:active { background-color: ${darken(.1, Colors.grayMedium)}; }
`;

export const DestructiveButtonContainer = styled(ButtonContainer)`
  color: ${Colors.background};
  background-color: ${Colors.destructive};
  &:hover { background-color: ${darken(.05, Colors.destructive)}; }
  &:active { background-color: ${darken(.1, Colors.destructive)}; }
`;

export const ButtonContainers = {
    [ButtonTypes.default]: ButtonContainer,
    [ButtonTypes.primary]: PrimaryButtonContainer,
    [ButtonTypes.secondary]: SecondaryButtonContainer,
    [ButtonTypes.destructive]: DestructiveButtonContainer,
  };