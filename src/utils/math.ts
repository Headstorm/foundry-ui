// eslint-disable-next-line import/prefer-default-export
export const clamp = (val: number, min: number, max: number): number => {
  return Math.max(Math.min(val, max), min);
};
