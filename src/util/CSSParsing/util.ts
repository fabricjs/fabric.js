import { Color, TColorArg } from '../../color/Color';
import { FabricObject } from '../../shapes/Object/Object';
import { CSSTransformConfig } from './types';

export const colorTransformer: CSSTransformConfig<
  FabricObject,
  'fill'
>['transformValue'] = (value) => {
  if (!value) return 'none';
  else if (typeof value === 'object') {
    // TODO: for gradients we can use css gradient, consider using css url for patterns
    return 'none';
  } else {
    const color = new Color(value as TColorArg);
    const hex = `#${color.toHex().toLowerCase()}`;
    return color.getAlpha() < 1
      ? [hex, `#${color.toHexa().toLowerCase()}`]
      : hex;
  }
};

export const colorRestorer = (value?: string) => {
  if (value) {
    const color = new Color(value.substring(0, value.indexOf(')') + 1));
    return color.getAlpha() > 0 ? color.toRgba() : '';
  }
  return '';
};

export const isDefinedValueTransformer = <T>(value: T) => (value ? value : '');

export const isTruthyValueTransformer = <T>(value: T, output: string): string =>
  value ? output : '';

export const unitTransformer = (value?: number, unit = 'px') =>
  typeof value === 'number' ? `${value}${unit}` : '';

export const numberRestorer = (value?: string) =>
  value ? Number.parseFloat(value) : undefined;
