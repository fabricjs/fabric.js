import { Control } from './Control';
import { HybridControls } from './default_controls';

export type TControlSet = Record<string, Control>;

export function createControlSet<T extends TControlSet, S extends TControlSet>(
  target: T | HybridControls<T, S>,
  source?: S | HybridControls<S>
) {
  return Object.defineProperties(target, {
    source: {
      value: source,
      configurable: true,
      enumerable: false,
      writable: true,
    },
    resolve: {
      value(key: string) {
        return (this[key] || this.resolveSource(key)) as Control | undefined;
      },
      configurable: true,
      enumerable: false,
      writable: true,
    },
    resolveSource: {
      value(key: string) {
        return (this.source &&
          (this.source[key] ||
            (this.source.resolve && this.source.resolve(key)))) as
          | Control
          | undefined;
      },
      configurable: true,
      enumerable: false,
      writable: true,
    },
    keys: {
      value() {
        return Object.keys({ ...this.source, ...this });
      },
      configurable: true,
      enumerable: false,
      writable: true,
    },
    forEach: {
      value<T>(cb: (control: Control, key: string) => T) {
        return Object.entries<Control>({ ...this.source, ...this }).forEach(
          ([key, control]) => cb(control, key)
        );
      },
      configurable: true,
      enumerable: false,
      writable: true,
    },
    map: {
      value<T>(cb: (control: Control, key: string) => T) {
        return Object.entries<Control>({ ...this.source, ...this }).map(
          ([key, control]) => cb(control, key)
        );
      },
      configurable: true,
      enumerable: false,
      writable: true,
    },
  }) as HybridControls<T, S>;
}
