export const clamp = (val: number, min: number, max: number): number => {
  return Math.max(Math.min(val, max), min);
};
