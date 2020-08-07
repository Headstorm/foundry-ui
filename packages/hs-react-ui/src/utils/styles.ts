// A constant factor that works well with base 10 logarithms
const elevationFactor = 10 ** 0.1;

export type ElevationValues = {
  xOffset: number;
  yOffset: number;
  blur: number;
  opacity: number;
};

/**
 * Calculates the values for shadows based on the provided elevation
 * @param {number} elevation - The elevation to get values for
 * @returns {ElevationValues} The values for each of the shadow values plus color opacity
 */
export const calculateElevationValues = (elevation = 0) => {
  const elevationValues = {
    xOffset: 0,
    yOffset: 0,
    blur: 0,
    opacity: 0,
  };

  // return the default values of 0 if elevation is 0
  if (!elevation) {
    return elevationValues;
  }
  const isNegative = elevation < 0;
  const absVal = Math.abs(elevation);
  const calc = () => Math.E ** (absVal / 16);
  // Using abs will return the same values for negative and positive elevations
  const logVal = Math.log10(absVal + elevationFactor);

  // Set the updated values for the elevation
  elevationValues.xOffset = 0;
  elevationValues.yOffset = isNegative
    ? Math.round(Math.E ** (absVal / 10) + 0.1) / 16
    : calc() / 16;
  elevationValues.blur = isNegative ? (absVal * 2) / 16 : absVal * 0.25;
  elevationValues.opacity = /** isNegative ? 0.3 - 0.05 * absVal : */ 0.5 - logVal * 0.2;
  console.log(`Elevation: ${elevation}`, elevationValues);
  return elevationValues;
};

/**
 * Returns the shadow style for a given elevation. If the elevation is negative, box-shadow is used and is inset.
 * @param {number} elevation
 * @returns {string} The css style property and value
 */
export const getElevationShadowStyle = (elevation = 0) => {
  if (elevation === 0) {
    return '';
  }

  const { xOffset, yOffset, blur, opacity } = calculateElevationValues(elevation);

  return elevation > 0
    ? `filter: drop-shadow(${xOffset}rem ${yOffset}rem ${blur}rem rgba(39, 47, 78,${opacity}));`
    : `box-shadow: inset ${xOffset}rem ${yOffset}rem ${blur}rem rgba(39, 47, 78,${opacity});`;
};
