import type { Observable } from './Observable';

export type TFabricEvent<T> = FabricEvent<T> & T;

export class FabricEvent<T> {
  declare defaultPrevented: boolean;
  declare propagate: boolean;
  path: Observable<any>[] = [];
  static init<T>(data?: T) {
    return new FabricEvent<T>(data) as TFabricEvent<T>;
  }
  private constructor(data?: T) {
    Object.defineProperties(this, {
      defaultPrevented: {
        value: false,
        enumerable: false,
        configurable: false,
        writable: true,
      },
      propagate: {
        value: true,
        enumerable: false,
        configurable: false,
        writable: true,
      },
    });
    Object.assign(this, data || {});
  }
  preventDefault() {
    this.defaultPrevented = true;
  }
  stopPropagation() {
    this.propagate = false;
  }
}
