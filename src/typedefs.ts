// https://www.typescriptlang.org/docs/handbook/utility-types.html
import type { Gradient } from './gradient/gradient.class';
import type { Pattern } from './pattern.class';

interface NominalTag<T> {
  nominalTag?: T;
}

type Nominal<Type, Tag> = NominalTag<Tag> & Type;

// eslint-disable-next-line @typescript-eslint/ban-types
type TNonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
export type TClassProperties<T> = Pick<T, TNonFunctionPropertyNames<T>>;

const enum Degree {}
const enum Radian {}

export type TDegree = Nominal<number, Degree>;
export type TRadian = Nominal<number, Radian>;

export type TAxis = 'x' | 'y';

export type TAxisKey<T extends string> = `${T}${Capitalize<TAxis>}`;

export type TFiller = Gradient<'linear'> | Gradient<'radial'> | Pattern;

export type TSize = {
  width: number;
  height: number;
};

export type TBBox = {
  left: number;
  top: number;
} & TSize;

export type Percent = `${number}%`;

export const enum StrokeLineJoin {
  miter = 'miter',
  bevel = 'bevel',
  round = 'round',
}

export const enum ImageFormat {
  jpeg = 'jpeg',
  jpg = 'jpeg',
  png = 'png',
}

export const enum SVGElementName {
  linearGradient = 'linearGradient',
  radialGradient = 'radialGradient',
  stop = 'stop',
}

export const enum SupportedSVGUnit {
  mm = 'mm',
  cm = 'cm',
  in = 'in',
  pt = 'pt',
  pc = 'pc',
  em = 'em',
}

export type TMat2D = [number, number, number, number, number, number];

export type ModifierKey = 'altKey' | 'shiftKey' | 'ctrlKey';

/**
 * SVG path commands
 */
export type PathData = (string | number)[][];

export type TEvent<E extends Event = MouseEvent | TouchEvent> = {
  e: E;
};

export type TransformEvent<T> = TEvent &
  T & {
    transform: {
      target: any;
    };
  };

/**
 * An invalid keyword and an empty string will be handled as the `anonymous` keyword.
 * @see https://developer.mozilla.org/en-US/docs/HTML/CORS_settings_attributes
 */
export type TCrossOrigin = '' | 'anonymous' | 'use-credentials' | null;

export type TOriginX = 'center' | 'left' | 'right' | number;
export type TOriginY = 'center' | 'top' | 'bottom' | number;
