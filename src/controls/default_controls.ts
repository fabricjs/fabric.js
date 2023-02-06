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

export type HybridControls<T extends TControlSet> = T & {
  resolve(key: string): Control | undefined;
};

export function createControlSet<T extends TControlSet, S extends TControlSet>(
  target: T | HybridControls<T>,
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
        return (
          this[key] ||
          (this.source && this.source.resolve
            ? this.source.resolve(key)
            : this.source[key])
        );
      },
      configurable: true,
      enumerable: false,
      writable: true,
    },
  }) as HybridControls<T>;
}

export const defaultControls = createControlSet(createObjectDefaultControls());

export const textboxDefaultControls = createControlSet(
  createResizeControls(),
  defaultControls
);
