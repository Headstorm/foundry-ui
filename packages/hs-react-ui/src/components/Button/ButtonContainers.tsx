import styled from 'styled-components';
import { ButtonTypes } from '../../enums/ButtonTypes';
import { ColorTypes } from '../../enums/ColorTypes';
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

  background-color: ${ColorTypes.grayXlight};
  color: ${ColorTypes.grayDark};
`;

export const PrimaryButtonContainer = styled(ButtonContainer)`
  color: ${ColorTypes.background};
  background-color: ${ColorTypes.primary};
  &:hover { background-color: ${darken(.05, ColorTypes.primary)}; }
  &:active { background-color: ${darken(.1, ColorTypes.primary)}; }
`;

export const SecondaryButtonContainer = styled(ButtonContainer)`
  color: ${ColorTypes.background};
  background-color: ${ColorTypes.grayMedium};
  &:hover { background-color: ${darken(.05, ColorTypes.grayMedium)}; }
  &:active { background-color: ${darken(.1, ColorTypes.grayMedium)}; }
`;

export const DestructiveButtonContainer = styled(ButtonContainer)`
  color: ${ColorTypes.background};
  background-color: ${ColorTypes.destructive};
  &:hover { background-color: ${darken(.05, ColorTypes.destructive)}; }
  &:active { background-color: ${darken(.1, ColorTypes.destructive)}; }
`;

export const ButtonContainers = {
    [ButtonTypes.default]: ButtonContainer,
    [ButtonTypes.primary]: PrimaryButtonContainer,
    [ButtonTypes.secondary]: SecondaryButtonContainer,
    [ButtonTypes.destructive]: DestructiveButtonContainer,
  };