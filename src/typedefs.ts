// https://www.typescriptlang.org/docs/handbook/utility-types.html

interface NominalTag<T> {
  'nominalTag': T;
}

type Nominal<Type, Tag> = NominalTag<Tag> & Type;

const enum Degree { }
const enum Radian { }

export type TDegree = Nominal<number, Degree>;
export type TRadian = Nominal<number, Radian>;

export type TSize = {
  width: number;
  height: number;
}

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
  e: E
}

export type TransformEvent<T> = TEvent & T & {
  transform: {
    target: any
  }
}
