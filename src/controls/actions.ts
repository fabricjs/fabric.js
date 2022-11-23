import { fabric } from '../../HEADER';
import { changeWidth } from './changeWidth';
import { renderCircleControl, renderSquareControl } from './controls.render';
import { dragHandler } from './drag';
import { rotationStyleHandler, rotationWithSnapping } from './rotate';
import {
  scaleCursorStyleHandler,
  scalingEqually,
  scalingX,
  scalingY,
} from './scale';
import {
  scaleOrSkewActionName,
  scaleSkewCursorStyleHandler,
  scalingXOrSkewingY,
  scalingYOrSkewingX,
} from './scaleSkew';
import { skewCursorStyleHandler, skewHandlerX, skewHandlerY } from './skew';
import { getLocalPoint, getActionFromCorner } from './util';
import { wrapWithFireEvent } from './wrapWithFireEvent';
import { wrapWithFixedAnchor } from './wrapWithFixedAnchor';

export {
  scaleCursorStyleHandler,
  skewCursorStyleHandler,
  scaleSkewCursorStyleHandler,
  rotationWithSnapping,
  scalingEqually,
  scalingX,
  scalingY,
  scalingYOrSkewingX,
  scalingXOrSkewingY,
  changeWidth,
  skewHandlerX,
  skewHandlerY,
  dragHandler,
  scaleOrSkewActionName,
  rotationStyleHandler,
  wrapWithFixedAnchor,
  wrapWithFireEvent,
  getLocalPoint,
  getActionFromCorner,
  renderCircleControl,
  renderSquareControl,
};

/**
 * @todo remove as unused
 */
fabric.controlsUtils = {
  scaleCursorStyleHandler,
  skewCursorStyleHandler,
  scaleSkewCursorStyleHandler,
  rotationWithSnapping,
  scalingEqually,
  scalingX,
  scalingY,
  scalingYOrSkewingX,
  scalingXOrSkewingY,
  changeWidth,
  skewHandlerX,
  skewHandlerY,
  dragHandler,
  scaleOrSkewActionName,
  rotationStyleHandler,
  wrapWithFixedAnchor,
  wrapWithFireEvent,
  getLocalPoint,
  renderCircleControl,
  renderSquareControl,
};
