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
  value: V | undefined;
  prevValue: V | undefined;
  operation: 'set' | 'delete';
};

export interface ProxyTarget {
  /**
   * @returns the value to commit
   */
  transformValue?: <K extends keyof this, V extends this[K]>(
    context: TransformValueContext<K, V>,
    /**
     * {@link Reflect} receiver
     */
    receiver: this
  ) => V;

  /**
   * @returns true if the change is accepted
   */
  onChange?: <K extends keyof this, V extends this[K]>(
    context: ChangeContext<K, V>,
    /**
     * {@link Reflect} receiver
     */
    receiver: this
  ) => boolean;
}
