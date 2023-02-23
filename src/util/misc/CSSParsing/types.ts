import { FabricObject } from '../../../shapes/Object/Object';

export type CSSTransformContext<T> = {
  target: FabricObject;
  options: T;
};

export type CSSTransformConfig<T, K> = {
  key?: string;
  hasValue?: false;
  transformValue?: (
    value: K extends keyof T ? NonNullable<T[K]> : undefined,
    context: CSSTransformContext<T>
  ) => string | number | (string | number)[];
  restoreValue?: (
    value: string | undefined,
    context: CSSTransformContext<T>
  ) => K extends keyof T ? T[K] | undefined : any;
};

export type CSSTransformConfigMap<T extends object, K extends keyof T> = {
  [R in K]: CSSTransformConfig<T, R>;
};
