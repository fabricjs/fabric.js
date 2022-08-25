//@ts-nocheck
interface NominalTag<T> {
  'nominalTag': T;
}

type Nominal<Type, Tag> = NominalTag<Tag> & Type;

const enum Degree { }
const enum Radian { }

export type TDegree = Nominal<number, Degree>;
export type TRadian = Nominal<number, Radian>;

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

export type Event<E extends Event = MouseEvent | TouchEvent> = {
  e: E
}