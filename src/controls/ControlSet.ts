import { Control } from './Control';

export type TControlSet = Record<string, Control>;

export type HybridControls<
  T extends TControlSet,
  S extends TControlSet | never = never
> = T & {
  source: S;
  resolve(key: string): Control | undefined;
  resolveAll(): S & T;
  keys(): (keyof (S & T))[];
  forEach<R>(cb: (control: Control, key: string) => R): void;
  map<R>(cb: (control: Control, key: string) => R): R[];
};

export function createControlSet<T extends TControlSet, S extends TControlSet>(
  target: T,
  source?: S | HybridControls<S>
) {
  if (target.source) throw new Error('fabric.js: source is a reserved key');
  return Object.defineProperties(target, {
    source: {
      value: source,
      configurable: false,
      enumerable: false,
      writable: true,
    },
    resolve: {
      value(key: string) {
        return (this[key] || this.resolveSource(key)) as Control | undefined;
      },
      configurable: false,
      enumerable: false,
      writable: false,
    },
    resolveSource: {
      value(key: string) {
        return ((this.source &&
          (this.source[key] ||
            (typeof this.source.resolve === 'function' &&
              this.source.resolve(key)))) ||
          undefined) as Control | undefined;
      },
      configurable: false,
      enumerable: false,
      writable: false,
    },
    resolveAll: {
      value() {
        return {
          ...(typeof this.source?.resolveAll === 'function'
            ? this.source.resolveAll()
            : this.source),
          ...this,
        };
      },
      configurable: false,
      enumerable: false,
      writable: false,
    },
    keys: {
      value() {
        return Object.keys(this.resolveAll());
      },
      configurable: false,
      enumerable: false,
      writable: false,
    },
    forEach: {
      value<T>(cb: (control: Control, key: string) => T) {
        return Object.entries<Control>(this.resolveAll()).forEach(
          ([key, control]) => cb(control, key)
        );
      },
      configurable: false,
      enumerable: false,
      writable: false,
    },
    map: {
      value<T>(cb: (control: Control, key: string) => T) {
        return Object.entries<Control>(this.resolveAll()).map(
          ([key, control]) => cb(control, key)
        );
      },
      configurable: false,
      enumerable: false,
      writable: false,
    },
  }) as HybridControls<T, S>;
}
