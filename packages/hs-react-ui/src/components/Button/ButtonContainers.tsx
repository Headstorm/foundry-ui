import styled, { StyledComponentBase, css, keyframes } from 'styled-components';
import { darken, getContrast, complement } from 'polished';
import colors from '../../enums/colors';
import fonts from '../../enums/fonts';

type StyledButtonProps = {
  elevation: number;
  color?: string;
  fillColor?: string;
};
export enum ButtonTypes {
  primary = 'primary',
  secondary = 'secondary',
  default = 'default',
  destructive = 'destructive',
  link = 'link',
  outline = 'outline',
}

/**
 * Returns color2 if color1 and color2 are contrasting, otherwise it returns the complementary color
 * @param color1 The first color and color we want to have a >=4.5 contrast ration with
 * @param color2 The second color and color we return if the contrast ration is >=4.5
 */
const getComplementaryColor = (color1: string, color2: string): string => {
  const contrast = getContrast(color1, color2);

  if (contrast > 4.5) {
    return color2;
  }

  return complement(color1);
};

/* Keyframes for the loading bar gradient */
const movingGradient = keyframes`
  0% { background-position: 200% bottom; }
  100% { background-position: 0% bottom; }
`;

/* Animation to scroll the gradient toward the right */
const animation = css`
  ${movingGradient} 8s linear infinite;
`;

/* Styled div that represents the scroll bar
   Note: The border-radius 9999px is used to create a pill shape */
export const Progress = styled.div`
  ${() => css`
    background: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.75),
        rgba(0, 0, 0, 0.75),
        rgba(255, 255, 255, 0.75),
        rgba(0, 0, 0, 0.75),
        rgba(255, 255, 255, 0.75)
      )
      repeat;
    background-size: 400% 100%;
    width: 5rem;
    height: 10px;
    margin-top: -5px;
    margin-bottom: -5px;
    border-radius: 9999px;
    animation: ${animation};
    line-height: 0;
  `}
`;

// TODO: We need to use filter svg drop-shadow to get shadows for transparent (and all other) buttons
export const ButtonContainer = styled.button`
  ${({ elevation = 0 }: StyledButtonProps) => `
  display: inline-block;
  ${fonts.body}
  font-size: 1rem;
  line-height: 0;
  padding: 1.25em 1em;
  border-radius: 0.25em;
  filter: drop-shadow(0rem ${elevation * 0.25}rem ${elevation * 0.75}rem rgba(0,0,0,${0.6 -
    elevation * 0.1}));
  outline: 0 none;
  border: 0 none;
  cursor: pointer;
  background-color: ${colors.grayXlight};
  color: ${colors.grayDark};
  &:hover {
    background-color: ${darken(0.05, colors.grayXlight)};
  }
  &:active {
    background-color: ${darken(0.1, colors.grayXlight)};
  }
  `}
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

export const LinkButtonContainer = styled(ButtonContainer)`
  ${({ color }: StyledButtonProps) => `
  color: ${color || colors.grayDark};
  background-color: ${colors.transparent};
  &:hover {
    background-color: ${darken(
      0.05,
      color
        ? getComplementaryColor(color || colors.grayDark, colors.grayXlight)
        : colors.grayXlight,
    )};
  }
  &:active {
    background-color: ${darken(
      0.1,
      color
        ? getComplementaryColor(color || colors.grayDark, colors.grayXlight)
        : colors.grayXlight,
    )};
  }
  `}
`;

export const OutlineButtonContainer = styled(ButtonContainer)`
  ${({ color, fillColor }: StyledButtonProps) => `
  color: ${color || colors.grayDark};
  background-color: ${fillColor ||
    getComplementaryColor(fillColor || colors.grayDark, colors.background)};
  border: 1px solid ${color || colors.grayDark};
  &:hover {
    background-color: ${darken(
      0.05,
      fillColor ? fillColor || colors.background : colors.background,
    )};
  }
  &:active {
    background-color: ${darken(
      0.1,
      fillColor ? fillColor || colors.background : colors.background,
    )};
  }
  `}
`;

export const ButtonContainers: {
  [index: string]: StyledComponentBase<any, {}, StyledButtonProps>;
} = {
  [ButtonTypes.default]: ButtonContainer,
  [ButtonTypes.primary]: PrimaryButtonContainer,
  [ButtonTypes.secondary]: SecondaryButtonContainer,
  [ButtonTypes.destructive]: DestructiveButtonContainer,
  [ButtonTypes.link]: LinkButtonContainer,
  [ButtonTypes.outline]: OutlineButtonContainer,
};
