import { Color, TColorArg } from '../../../color/Color';

export const colorTransformer = <T>(key: string, value: T) => {
  if (!value) return `${key}:none`;
  const color = new Color(value as TColorArg);
  const hex = `${key}:#${color.toHex().toLowerCase()}`;
  return color.getAlpha() < 1
    ? `${hex};${key}:#${color.toHexa().toLowerCase()}`
    : hex;
};

export const colorRestorer = (value?: string) =>
  value ? value.substring(0, value.indexOf(')') + 1) : '';

export const isDefinedValueTransformer = <T>(value: T) => (value ? value : '');

export const isTruthyValueTransformer = <T>(value: T, output: string): string =>
  value ? output : '';

export const unitTransformer = (value?: number, unit = 'px') =>
  typeof value === 'number' ? `${value}${unit}` : '';

export const numberRestorer = (value?: string) =>
  value ? Number.parseFloat(value) : undefined;
