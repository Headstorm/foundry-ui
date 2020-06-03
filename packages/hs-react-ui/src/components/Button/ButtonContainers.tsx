import styled, {StyledComponentBase} from 'styled-components';
import { darken } from 'polished';
import colors from '../../enums/colors';
import fonts from '../../enums/fonts';

type StyledButtonProps = {
  elevation: number;
  color?: string;
}
export enum ButtonTypes {
  primary = 'primary',
  secondary = 'secondary',
  default = 'default',
  destructive = 'destructive',
  link = 'link',
  outline = 'outline',
}
// TODO: We need to use filter svg drop-shadow to get shadows for transparent (and all other) buttons
export const ButtonContainer = styled.button`
${({ elevation = 0, color }: StyledButtonProps) =>`
  display: inline-block;

  ${fonts.body}
  font-size: 1em;
  line-height: 0;

  padding: 1.25em 1em;
  border-radius: 0.25em;

  filter: drop-shadow(0rem ${elevation * 0.25}rem ${elevation * 0.75}rem ${elevation *
    -0.25}rem rgba(0,0,0,${0.6 - elevation * 0.1}));


  outline: 0 none;
  border: 0 none;

  cursor: pointer;

  background-color: ${color || colors.grayXlight};
  color: ${colors.grayDark};
  &:hover {
    background-color: ${darken(0.05, color || colors.grayXlight)};
  }
  &:active {
    background-color: ${darken(0.1, color || colors.grayXlight)};
  }
  `
}`;

export const PrimaryButtonContainer = styled(ButtonContainer)`
${({ color }: StyledButtonProps) =>`
  color: ${colors.background};
  background-color: ${color || colors.primary};
  &:hover {
    background-color: ${darken(0.05, color || colors.primary)};
  }
  &:active {
    background-color: ${darken(0.1, color || colors.primary)};
  }
  `
}`;

export const SecondaryButtonContainer = styled(ButtonContainer)`
${({ color }: StyledButtonProps) =>`
  color: ${colors.background};
  background-color: ${color || colors.grayMedium};
  &:hover {
    background-color: ${darken(0.05, color || colors.grayMedium)};
  }
  &:active {
    background-color: ${darken(0.1, color || colors.grayMedium)};
  }
  `
}`;

export const DestructiveButtonContainer = styled(ButtonContainer)`
${({ color }: StyledButtonProps) =>`
  color: ${colors.background};
  background-color: ${color || colors.destructive};
  &:hover {
    background-color: ${darken(0.05, color || colors.destructive)};
  }
  &:active {
    background-color: ${darken(0.1, color || colors.destructive)};
  }
  `
}`;

export const LinkButtonContainer = styled(ButtonContainer)`
${({ color }: StyledButtonProps) =>`
  color: ${color || colors.grayDark};
  background-color: ${colors.transparent};
  &:hover {
    background-color: ${darken(0.05, colors.grayXlight)};
  }
  &:active {
    background-color: ${darken(0.1, colors.grayXlight)};
  }
  `
}`;

export const OutlineButtonContainer = styled(ButtonContainer)`
${({ color }: StyledButtonProps) =>`
  color: ${color || colors.grayDark};
  background-color: ${colors.background};
  border: 1px solid ${color || colors.grayDark};
  &:hover {
    background-color: ${darken(0.05, colors.grayXlight)};
  }
  &:active {
    background-color: ${darken(0.1, colors.grayXlight)};
  }
  `
}`;

export const ButtonContainers: {[index: string]: StyledComponentBase<any, {}, StyledButtonProps>} = {
  [ButtonTypes.default]: ButtonContainer,
  [ButtonTypes.primary]: PrimaryButtonContainer,
  [ButtonTypes.secondary]: SecondaryButtonContainer,
  [ButtonTypes.destructive]: DestructiveButtonContainer,
  [ButtonTypes.link]: LinkButtonContainer,
  [ButtonTypes.outline]: OutlineButtonContainer,
};
