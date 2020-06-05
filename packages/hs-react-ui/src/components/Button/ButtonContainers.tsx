import styled, { StyledComponentBase } from 'styled-components';
import { darken, readableColor } from 'polished';
import colors from '../../enums/colors';
import fonts from '../../enums/fonts';

export type ButtonContainerProps = {
  elevation?: number;
  color?: string;
  type: string;
};
export enum ButtonTypes {
  fill = 'fill',
  link = 'link',
  outline = 'outline',
}

/**
 * Get the appropriate font color for the button based on the type of button
 * @param {string} type - The type of button
 * @param {string} color - The color prop passed into the button
 */
const getFontColorFromType = (type: string, color?: string) => {
  switch (type) {
    case ButtonTypes.link:
    case ButtonTypes.outline:
      return color || colors.grayDark;
    case ButtonTypes.fill:
    default:
      return color
        ? readableColor(color, colors.background, colors.grayDark, true)
        : colors.grayDark;
  }
};

/**
 * Get the appropriate background color for the button based on the type of button
 * @param {string} type - The type of button
 * @param {string} color - The color prop passed into the button
 */
const getBackgroundColorFromType = (type: string, color?: string) => {
  switch (type) {
    case ButtonTypes.link:
    case ButtonTypes.outline:
      return colors.transparent;
    default:
      return color || colors.grayXlight;
  }
};

export const ButtonContainer: string &
  StyledComponentBase<any, {}, ButtonContainerProps> = styled.button`
  ${({ elevation = 0, color, type }: ButtonContainerProps) => {
    const backgroundColor = getBackgroundColorFromType(type, color);
    const fontColor = getFontColorFromType(type, color);
    const elevationYOffset = elevation && elevation >= 1 ? (elevation - 1) * 0.5 + 0.1 : 0;
    const elevationBlur = elevation && elevation >= 1 ? (elevation / 16) * 0.1 + 0.3 : 0;
    return `
    display: inline-block;
    ${fonts.body}
    font-size: 1rem;
    line-height: 0;
    padding: 1.25em 1em;
    border-radius: 0.25em;
    filter: drop-shadow(0rem ${elevationYOffset}rem ${elevationBlur}rem rgba(0,0,0,${0.6 -
      elevation * 0.1}));
    outline: 0 none;
    border: ${type === ButtonTypes.outline ? `1px solid ${color || colors.grayDark}` : `0 none;`};
    cursor: pointer;
    background-color: ${backgroundColor};
    color: ${fontColor};
    &:hover {
      background-color: ${darken(0.05, backgroundColor)};
    }
    &:active {
      background-color: ${darken(0.1, backgroundColor)};
    }
  `;
  }}
`;

export default ButtonContainer;
