// @ts-nocheck

import { fabric } from '../../HEADER';
import { FabricObject } from '../shapes/object.class';
import {
  changeWidth,
  rotationStyleHandler,
  rotationWithSnapping,
  scaleCursorStyleHandler,
  scaleOrSkewActionName,
  scaleSkewCursorStyleHandler,
  scalingEqually,
  scalingXOrSkewingY,
  scalingYOrSkewingX,
} from './actions';
import { Control } from './control.class';

export const defaultControls = {
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
};

export const textboxDefaultControls = {
  ...defaultControls,
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
};

FabricObject.prototype.controls = {
  ...(FabricObject.prototype.controls || {}),
  ...defaultControls,
};

if (fabric.Textbox) {
  // this is breaking the prototype inheritance, no time / ideas to fix it.
  // is important to document that if you want to have all objects to have a
  // specific custom control, you have to add it to Object prototype and to Textbox
  // prototype. The controls are shared as references. So changes to control `tr`
  // can still apply to all objects if needed.
  fabric.Textbox.prototype.controls = {
    ...(fabric.Textbox.prototype.controls || {}),
    ...textboxDefaultControls,
  };
}
