import { changeWidth } from './changeWidth';
import { Control } from './Control';
import { rotationStyleHandler, rotationWithSnapping } from './rotate';
import { scaleCursorStyleHandler, scalingEqually } from './scale';
import {
  scaleOrSkewActionName,
  scaleSkewCursorStyleHandler,
  scalingXOrSkewingY,
  scalingYOrSkewingX,
} from './scaleSkew';

export type TControlSet = Record<string, Control>;

// use this function if you want to generate new controls for every instance
export const createObjectDefaultControls = () => ({
  ml: new Control({
    x: -0.5,
    y: 0,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionHandler: scalingXOrSkewingY,
    getActionName: scaleOrSkewActionName,
  }),

  mr: new Control({
    x: 0.5,
    y: 0,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionHandler: scalingXOrSkewingY,
    getActionName: scaleOrSkewActionName,
  }),

  mb: new Control({
    x: 0,
    y: 0.5,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionHandler: scalingYOrSkewingX,
    getActionName: scaleOrSkewActionName,
  }),

  mt: new Control({
    x: 0,
    y: -0.5,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionHandler: scalingYOrSkewingX,
    getActionName: scaleOrSkewActionName,
  }),

  tl: new Control({
    x: -0.5,
    y: -0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  }),

  tr: new Control({
    x: 0.5,
    y: -0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  }),

  bl: new Control({
    x: -0.5,
    y: 0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  }),

  br: new Control({
    x: 0.5,
    y: 0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  }),

  mtr: new Control({
    x: 0,
    y: -0.5,
    actionHandler: rotationWithSnapping,
    cursorStyleHandler: rotationStyleHandler,
    offsetY: -40,
    withConnection: true,
    actionName: 'rotate',
  }),
});

export const createResizeControls = () => ({
  mr: new Control({
    x: 0.5,
    y: 0,
    actionHandler: changeWidth,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionName: 'resizing',
  }),
  ml: new Control({
    x: -0.5,
    y: 0,
    actionHandler: changeWidth,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionName: 'resizing',
  }),
});

export const createTextboxDefaultControls = () => ({
  ...createObjectDefaultControls(),
  ...createResizeControls(),
});

export type HybridControls<
  T extends TControlSet,
  S extends TControlSet | never = never
> = T & {
  source: S;
  resolve(key: string): Control | undefined;
  resolveSource(key: string): Control | undefined;
  keys(): (keyof (T & S))[];
  forEach<R>(cb: (control: Control, key: string) => R): void;
  map<R>(cb: (control: Control, key: string) => R): R[];
};

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

export const defaultControls = createControlSet(createObjectDefaultControls());

export const textboxDefaultControls = createControlSet(
  createResizeControls(),
  defaultControls
);
