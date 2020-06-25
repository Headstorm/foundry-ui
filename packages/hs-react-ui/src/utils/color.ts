import { readableColor } from 'polished';
import { ButtonVariants } from '../components/Button/Button';
import colors from '../enums/colors';

/**
 * Get the appropriate font color for the button based on the variant of button
 * @param {string} variant - The variant of button
 * @param {string} color - The color prop passed into the button
 */
export const getFontColorFromVariant = (variant: string, color: string): string => {
  if (variant === 'fill') {
    return readableColor(color, colors.background, colors.grayDark, true);
  }
  return color;
};

/**
 * Get the appropriate background color for the button based on the variant of button
 * @param {string} variant - The variant of button
 * @param {string} color - The color prop passed into the button
 */
export const getBackgroundColorFromVariant = (variant: string, color: string): string => {
  switch (variant) {
    case ButtonVariants.text:
    case ButtonVariants.outline:
      return colors.transparent;
    default:
      return color;
  }
};
