import { readableColor } from 'polished';

import variants from '../enums/variants';
import colors from '../enums/colors';

/**
 * Get the appropriate font color for the button based on the variant of button
 * @param {string} variant - The variant of button
 * @param {string} color - The color prop passed into the button
 * @param {string} lightReturnColor - The color to return if the color is too dark
 * @param {string} darkReturnColor - The color to return if the color is too dark
 */
export const getFontColorFromVariant = (
  variant: string,
  color: string,
  lightReturnColor: string = colors.background,
  darkReturnColor: string = colors.grayDark,
): string => {
  if (variant === 'fill') {
    return readableColor(color, lightReturnColor, darkReturnColor, true);
  }
  return color;
};

/**
 * Get the appropriate background color for the button based on the variant of button
 * @param {string} variant - The variant of button
 * @param {string} color - The color prop passed into the button
 * @param {string} [transparentColor] - The color to use for a transparent background
 */
export const getBackgroundColorFromVariant = (
  variant: string,
  color: string,
  transparentColor = 'transparent',
): string => {
  switch (variant) {
    case variants.text:
    case variants.outline:
      return transparentColor;
    default:
      return color;
  }
};

/**
 * Returns a filter for grayscale with contrast and brightness parameters.
 */
export const disabledStyles = ({
  grayscale = 1,
  contrast = 0.5,
  brightness = 1.2,
}: {
  grayscale?: number;
  contrast?: number;
  brightness?: number;
} = {}): string => `
  filter: grayscale(${grayscale}) contrast(${contrast}) brightness(${brightness});
  pointer-events: none;
`;
