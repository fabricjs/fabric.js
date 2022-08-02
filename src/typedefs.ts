interface NominalTag<T> {
  'nominalTag': T;
}

type Nominal<Type, Tag> = NominalTag<Tag> & Type;

const enum Degree {}
const enum Radian {}

export type TDegree = Nominal<number, Degree>;
export type TRadian = Nominal<number, Radian>;
