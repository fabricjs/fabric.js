export type TransformValueContext<T, K extends keyof T = keyof T> = {
  key: K;
  value: T[K];
} & (
  | {
      operation: 'get';
    }
  | {
      newValue: T[K];
      operation: 'set';
    }
);

export type ChangeContext<T, K extends keyof T = keyof T> = {
  key: K;
  value: T[K];
  prevValue: T[K];
};

export interface ProxyTarget {
  /**
   * @returns the value to commit
   */
  transformValue?: <K extends keyof this>(
    context: TransformValueContext<this, K>,
    /**
     * {@link Reflect} target
     */
    target: this
  ) => this[K];

  /**
   * @returns true if the change is accepted
   */
  onChange?: <K extends keyof this>(
    context: ChangeContext<this, K>,
    /**
     * {@link Reflect} target
     */
    target: this
  ) => boolean;
}
