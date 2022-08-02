//@ts-nocheck
interface NominalTag<T> {
  'nominalTag': T;
}

type Nominal<Type, Tag> = NominalTag<Tag> & Type;

// eslint-disable-next-line no-unused-vars
const enum Degree {}
// eslint-disable-next-line no-unused-vars
const enum Radian {}

export type TDegree = Nominal<number, Degree>;
export type TRadian = Nominal<number, Radian>;
