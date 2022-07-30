import { Control } from "../control.class";
import { changeWidth, rotationStyleHandler, rotationWithSnapping, scaleCursorStyleHandler, scaleOrSkewActionName, scalingEqually, scalingXOrSkewingY, scalingYOrSkewingX } from "../controls.actions";

export const ml = new Control({
  x: -0.5,
  y: 0,
  cursorStyleHandler: scaleCursorStyleHandler,
  actionHandler: scalingXOrSkewingY,
  getActionName: scaleOrSkewActionName,
});

export const mr = new Control({
  x: 0.5,
  y: 0,
  cursorStyleHandler: scaleCursorStyleHandler,
  actionHandler: scalingXOrSkewingY,
  getActionName: scaleOrSkewActionName,
});

export const mb = new Control({
  x: 0,
  y: 0.5,
  cursorStyleHandler: scaleCursorStyleHandler,
  actionHandler: scalingYOrSkewingX,
  getActionName: scaleOrSkewActionName,
});

export const mt = new Control({
  x: 0,
  y: -0.5,
  cursorStyleHandler: scaleCursorStyleHandler,
  actionHandler: scalingYOrSkewingX,
  getActionName: scaleOrSkewActionName,
});

export const tl = new Control({
  x: -0.5,
  y: -0.5,
  cursorStyleHandler: scaleStyleHandler,
  actionHandler: scalingEqually
});

export const tr = new Control({
  x: 0.5,
  y: -0.5,
  cursorStyleHandler: scaleStyleHandler,
  actionHandler: scalingEqually
});

export const bl = new Control({
  x: -0.5,
  y: 0.5,
  cursorStyleHandler: scaleStyleHandler,
  actionHandler: scalingEqually
});

export const br = new Control({
  x: 0.5,
  y: 0.5,
  cursorStyleHandler: scaleStyleHandler,
  actionHandler: scalingEqually
});

export const mtr = new Control({
  x: 0,
  y: -0.5,
  actionHandler: rotationWithSnapping,
  cursorStyleHandler: rotationStyleHandler,
  offsetY: -40,
  withConnection: true,
  actionName: 'rotate',
});

export const mlTextbox = new Control({
  x: -0.5,
  y: 0,
  actionHandler: changeWidth,
  cursorStyleHandler: scaleCursorStyleHandler,
  actionName: 'resizing',
});

export const mrTextbox = new Control({
  x: 0.5,
  y: 0,
  actionHandler: changeWidth,
  cursorStyleHandler: scaleCursorStyleHandler,
  actionName: 'resizing',
});

export const ObjectControls = {
  ml, mr, mb, mt, tl, tr, bl, bt, mtr
}

export const TextboxControls = {
  ...ObjectControls, ml: mlTextbox, mr: mrTextbox
}