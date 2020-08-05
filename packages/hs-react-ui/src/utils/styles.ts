// A constant factor that works well with base 10 logarithms
const elevationFactor = Math.pow(10, 0.1);

/**
 * Calculates the values for shadows based on the provided elevation
 * @param {number} elevation - The elevation to get values for
 */
export const getElevationValues = (elevation: number = 0) => {
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

  // Using abs will return the same values for negative and positive elevations
  const logVal = Math.log10(Math.abs(elevation) + elevationFactor);

  // Set the updated values for the elevation
  elevationValues.xOffset = 0;
  elevationValues.yOffset = (logVal / 4) * 0.5;
  elevationValues.blur = logVal * 0.5;
  elevationValues.opacity = 0.5 - logVal * 0.2;
  return elevationValues;
};
