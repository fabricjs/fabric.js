//@ts-nocheck
interface NominalTag<T> {
  'nominalTag': T;
}

type Nominal<Type, Tag> = NominalTag<Tag> & Type;

const enum Degree {}
const enum Radian {}

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

export type TMat2D = [number, number, number, number, number, number];
