import { Color, TColorArg } from '../../../color/Color';
import { FabricObject } from '../../../shapes/Object/Object';
import { CSSTransformConfig } from './types';

export const colorTransformer: CSSTransformConfig<
  FabricObject,
  'fill'
>['transformValue'] = (value, { defs, target }) => {
  if (!value) return 'none';
  else if (typeof value === 'object') {
    // const svg = value.toSVG(target);
    // defs.push(svg);
    // console.log(
    //   `data:image/svg+xml,${encodeURI(`${svg.replace(newlineRegExp, '')}`)}`
    // );
    // return 'linear-gradient(45deg, red, blue)';
    // return [
    //   `url('data:image/svg+xml,${encodeURI(
    //     `<svg>${svg.replace(newlineRegExp, '')}</svg>`
    //   )}')`,
    //   // `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><circle cx="36" cy="36" r="33" stroke="black" stroke-opacity=".15" fill="none" stroke-miterlimit="10" stroke-width="5"/><path d="M14.3 60.9A33 33 0 0136 3" stroke="context-stroke" fill="none" stroke-miterlimit="10" stroke-width="5"/></svg>')`,
    //   `url('#${value.id}')`,
    // ];
    return '';
  } else {
    const color = new Color(value as TColorArg);
    const hex = `#${color.toHex().toLowerCase()}`;
    return color.getAlpha() < 1
      ? [hex, `#${color.toHexa().toLowerCase()}`]
      : hex;
  }
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
