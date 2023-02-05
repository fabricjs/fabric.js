import type { Observable } from './Observable';

export type TFabricEvent<T> = FabricEvent<T> & T;

export enum PropagationState {
  propagate = 1,
  stop = 0,
  stopImmediately = -1,
}

export class FabricEvent<T> {
  declare defaultPrevented: boolean;
  declare propagate: PropagationState;
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
        value: PropagationState.propagate,
        enumerable: false,
        configurable: false,
        writable: true,
      },
    });
    Object.assign(this, data || {});
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
   */
  preventDefault() {
    this.defaultPrevented = true;
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
   */
  stopPropagation() {
    this.propagate = PropagationState.stop;
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/Event/stopImmediatePropagation
   */
  stopImmediatePropagation() {
    this.propagate = PropagationState.stopImmediately;
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath
   */
  composedPath() {
    return this.path;
  }
}
