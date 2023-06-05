export type TransformValueContext<K, V> = {
  key: K;
  value: V;
} & (
  | {
      operation: 'get';
    }
  | {
      newValue: V;
      operation: 'set';
    }
);

export type ChangeContext<K, V> = {
  key: K;
  value: V;
  prevValue: V;
};

export interface ProxyTarget {
  /**
   * @returns the value to commit
   */
  transformValue?: <K extends keyof this, V extends this[K]>(
    context: TransformValueContext<K, V>,
    /**
     * {@link Reflect} target
     */
    target: this
  ) => V;

  /**
   * @returns true if the change is accepted
   */
  onChange?: <K extends keyof this, V extends this[K]>(
    context: ChangeContext<K, V>,
    /**
     * {@link Reflect} target
     */
    target: this
  ) => boolean;
}
