export type CSSTransformConfig<T, K> = {
  key?: string;
  transformValue?: (
    value: K extends keyof T ? NonNullable<T[K]> : undefined,
    options: T
  ) => string | number;
  transform?: (
    key: K,
    value: K extends keyof T ? NonNullable<T[K]> : undefined,
    options: T
  ) => string;
  restoreValue?: (
    value: string | undefined,
    options: T
  ) => K extends keyof T ? T[K] | undefined : any;
};

export type CSSTransformConfigMap<T extends object, K extends keyof T> = {
  [R in K]: CSSTransformConfig<T, R>;
};
