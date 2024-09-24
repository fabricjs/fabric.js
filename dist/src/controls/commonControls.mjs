import { objectSpread2 as _objectSpread2 } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { ROTATE, RESIZING } from '../constants.mjs';
import { changeWidth } from './changeWidth.mjs';
import { Control } from './Control.mjs';
import { rotationWithSnapping, rotationStyleHandler } from './rotate.mjs';
import { scaleCursorStyleHandler, scalingEqually } from './scale.mjs';
import { scaleSkewCursorStyleHandler, scalingXOrSkewingY, scaleOrSkewActionName, scalingYOrSkewingX } from './scaleSkew.mjs';

// use this function if you want to generate new controls for every instance
const createObjectDefaultControls = () => ({
  ml: new Control({
    x: -0.5,
    y: 0,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionHandler: scalingXOrSkewingY,
    getActionName: scaleOrSkewActionName
  }),
  mr: new Control({
    x: 0.5,
    y: 0,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionHandler: scalingXOrSkewingY,
    getActionName: scaleOrSkewActionName
  }),
  mb: new Control({
    x: 0,
    y: 0.5,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionHandler: scalingYOrSkewingX,
    getActionName: scaleOrSkewActionName
  }),
  mt: new Control({
    x: 0,
    y: -0.5,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionHandler: scalingYOrSkewingX,
    getActionName: scaleOrSkewActionName
  }),
  tl: new Control({
    x: -0.5,
    y: -0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually
  }),
  tr: new Control({
    x: 0.5,
    y: -0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually
  }),
  bl: new Control({
    x: -0.5,
    y: 0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually
  }),
  br: new Control({
    x: 0.5,
    y: 0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually
  }),
  mtr: new Control({
    x: 0,
    y: -0.5,
    actionHandler: rotationWithSnapping,
    cursorStyleHandler: rotationStyleHandler,
    offsetY: -40,
    withConnection: true,
    actionName: ROTATE
  })
});
const createResizeControls = () => ({
  mr: new Control({
    x: 0.5,
    y: 0,
    actionHandler: changeWidth,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionName: RESIZING
  }),
  ml: new Control({
    x: -0.5,
    y: 0,
    actionHandler: changeWidth,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionName: RESIZING
  })
});
const createTextboxDefaultControls = () => _objectSpread2(_objectSpread2({}, createObjectDefaultControls()), createResizeControls());

export { createObjectDefaultControls, createResizeControls, createTextboxDefaultControls };
//# sourceMappingURL=commonControls.mjs.map
