export const capValue = (min: number, value: number, max: number) =>
  Math.max(min, Math.min(value, max));
