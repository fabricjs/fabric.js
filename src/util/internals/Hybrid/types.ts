import { SOURCE_KEY, MONITOR_KEY, TARGETS_KEY } from './constants';

export type TransformValueContext<T, K extends keyof T = keyof T> = {
  key: T;
  value: T[K];
  isDefault: boolean;
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

export type THybrid<T, K extends keyof T = keyof T> = object & {
  /**
   * @returns the value to commit
   */
  transformValue?: (
    context: TransformValueContext<T, K>,
    /**
     * {@link Reflect} target
     */
    target: T
  ) => T[K];

  /**
   * @returns true if the change is accepted
   */
  onChange?: (
    context: ChangeContext<T, K>,
    /**
     * {@link Reflect} target
     */
    target: T
  ) => boolean;
};

export type Hybrid<
  T extends THybrid<T>,
  S extends object,
  K extends Exclude<keyof (S & T), 'transformValue' | 'onChange'> = Exclude<
    keyof (S & T),
    'transformValue' | 'onChange'
  >
> = T &
  // S is partial since keys of T might be monitored and deleted
  Partial<S> & {
    [SOURCE_KEY]: S;
    restoreDefault(key: K): boolean;
    restoreDefaults(): Record<K, boolean>;
  };

export type HybridProtected<T extends THybrid<T>, S extends object> = Hybrid<
  T,
  S
> & {
  readonly [MONITOR_KEY]: Record<string | symbol, boolean>;
  readonly [TARGETS_KEY]: Map<HybridProtected<T, S>, true>;
};
