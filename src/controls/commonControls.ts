import { RESIZING, ROTATE } from '../constants';
import { changeWidth } from './changeWidth';
import { Control } from './Control';
import { rotationStyleHandler, rotationWithSnapping } from './rotate';
import { scaleCursorStyleHandler, scalingEqually, scalingX, scalingY } from './scale';
import {
  scaleActionName,
  scaleSkewCursorStyleHandler,
  // scaleOrSkewActionName,
  // scalingXOrSkewingY,
  // scalingYOrSkewingX,
} from './scaleSkew';

// use this function if you want to generate new controls for every instance
export const createObjectDefaultControls = () => ({
  ml: new Control({
    x: -0.5,
    y: 0,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingX,
    getActionName: scaleActionName,
    // cursorStyleHandler: scaleSkewCursorStyleHandler,
    // actionHandler: scalingXOrSkewingY,
    // getActionName: scaleOrSkewActionName,
  }),

  mr: new Control({
    x: 0.5,
    y: 0,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingX,
    getActionName: scaleActionName,
    // cursorStyleHandler: scaleSkewCursorStyleHandler,
    // actionHandler: scalingXOrSkewingY,
    // getActionName: scaleOrSkewActionName,
  }),

  mb: new Control({
    x: 0,
    y: 0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingY,
    getActionName: scaleActionName,
    // cursorStyleHandler: scaleSkewCursorStyleHandler,
    // actionHandler: scalingYOrSkewingX,
    // getActionName: scaleOrSkewActionName,
  }),

  mt: new Control({
    x: 0,
    y: -0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingY,
    getActionName: scaleActionName,
    // cursorStyleHandler: scaleSkewCursorStyleHandler,
    // actionHandler: scalingYOrSkewingX,
    // getActionName: scaleOrSkewActionName,
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
    actionName: ROTATE,
  }),
});

export const createResizeControls = () => ({
  mr: new Control({
    x: 0.5,
    y: 0,
    actionHandler: changeWidth,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionName: RESIZING,
  }),
  ml: new Control({
    x: -0.5,
    y: 0,
    actionHandler: changeWidth,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionName: RESIZING,
  }),
});

export const createTextboxDefaultControls = () => ({
  ...createObjectDefaultControls(),
  ...createResizeControls(),
});
