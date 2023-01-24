// https://www.typescriptlang.org/docs/handbook/utility-types.html
import { BaseFabricObject } from './EventTypeDefs';
import type { Gradient } from './gradient/Gradient';
import type { Pattern } from './Pattern';
import type { Point } from './Point';
import type { FabricObject } from './shapes/Object/FabricObject';

interface NominalTag<T> {
  nominalTag?: T;
}

type Nominal<Type, Tag> = NominalTag<Tag> & Type;

// eslint-disable-next-line @typescript-eslint/ban-types
type TNonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
export type TClassProperties<T> = Pick<T, TNonFunctionPropertyNames<T>>;

// https://github.com/microsoft/TypeScript/issues/32080
export type Constructor<T = object> = new (...args: any[]) => T;

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

/**
 * SVG path commands
 */
export type PathData = (string | number)[][];

/**
 * An invalid keyword and an empty string will be handled as the `anonymous` keyword.
 * @see https://developer.mozilla.org/en-US/docs/HTML/CORS_settings_attributes
 */
export type TCrossOrigin = '' | 'anonymous' | 'use-credentials' | null;

export type TOriginX = 'center' | 'left' | 'right' | number;
export type TOriginY = 'center' | 'top' | 'bottom' | number;

export type TCornerPoint = {
  tl: Point;
  tr: Point;
  bl: Point;
  br: Point;
};

export type TSVGReviver = (markup: string) => string;

export type TValidToObjectMethod = 'toDatalessObject' | 'toObject';

export type TCacheCanvasDimensions = {
  width: number;
  height: number;
  zoomX: number;
  zoomY: number;
  x: number;
  y: number;
};

export type TToCanvasElementOptions = {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  filter?: (object: BaseFabricObject) => boolean;
};

export type TDataUrlOptions = TToCanvasElementOptions & {
  multiplier: number;
  format?: ImageFormat;
  quality?: number;
  enableRetinaScaling?: boolean;
};

export type AssertKeys<T, K extends keyof T> = T & Record<K, NonNullable<T[K]>>;
