import styled from 'styled-components';
import { darken } from 'polished';
import { ButtonTypes } from './Button';
import colors from '../../enums/colors';

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

export const PrimaryButtonContainer = styled(ButtonContainer)`
  color: ${colors.background};
  background-color: ${colors.primary};
  &:hover {
    background-color: ${darken(0.05, colors.primary)};
  }
  &:active {
    background-color: ${darken(0.1, colors.primary)};
  }
`;

export const SecondaryButtonContainer = styled(ButtonContainer)`
  color: ${colors.background};
  background-color: ${colors.grayMedium};
  &:hover {
    background-color: ${darken(0.05, colors.grayMedium)};
  }
  &:active {
    background-color: ${darken(0.1, colors.grayMedium)};
  }
`;

export const DestructiveButtonContainer = styled(ButtonContainer)`
  color: ${colors.background};
  background-color: ${colors.destructive};
  &:hover {
    background-color: ${darken(0.05, colors.destructive)};
  }
  &:active {
    background-color: ${darken(0.1, colors.destructive)};
  }
`;

export const ButtonContainers = {
  [ButtonTypes.default]: ButtonContainer,
  [ButtonTypes.primary]: PrimaryButtonContainer,
  [ButtonTypes.secondary]: SecondaryButtonContainer,
  [ButtonTypes.destructive]: DestructiveButtonContainer,
};
