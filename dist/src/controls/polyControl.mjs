import { objectSpread2 as _objectSpread2 } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { Point } from '../Point.mjs';
import { Control } from './Control.mjs';
import { multiplyTransformMatrices } from '../util/misc/matrix.mjs';
import { wrapWithFireEvent } from './wrapWithFireEvent.mjs';
import { sendPointToPlane } from '../util/misc/planeChange.mjs';
import { MODIFY_POLY } from '../constants.mjs';

const ACTION_NAME = MODIFY_POLY;
/**
 * This function locates the controls.
 * It'll be used both for drawing and for interaction.
 */
const createPolyPositionHandler = pointIndex => {
  return function (dim, finalMatrix, polyObject) {
    const {
      points,
      pathOffset
    } = polyObject;
    return new Point(points[pointIndex]).subtract(pathOffset).transform(multiplyTransformMatrices(polyObject.getViewportTransform(), polyObject.calcTransformMatrix()));
  };
};

/**
 * This function defines what the control does.
 * It'll be called on every mouse move after a control has been clicked and is being dragged.
 * The function receives as argument the mouse event, the current transform object
 * and the current position in canvas coordinate `transform.target` is a reference to the
 * current object being transformed.
 */
const polyActionHandler = (eventData, transform, x, y) => {
  const {
    target,
    pointIndex
  } = transform;
  const poly = target;
  const mouseLocalPosition = sendPointToPlane(new Point(x, y), undefined, poly.calcOwnMatrix());
  poly.points[pointIndex] = mouseLocalPosition.add(poly.pathOffset);
  poly.setDimensions();
  return true;
};

/**
 * Keep the polygon in the same position when we change its `width`/`height`/`top`/`left`.
 */
const factoryPolyActionHandler = (pointIndex, fn) => {
  return function (eventData, transform, x, y) {
    const poly = transform.target,
      anchorPoint = new Point(poly.points[(pointIndex > 0 ? pointIndex : poly.points.length) - 1]),
      anchorPointInParentPlane = anchorPoint.subtract(poly.pathOffset).transform(poly.calcOwnMatrix()),
      actionPerformed = fn(eventData, _objectSpread2(_objectSpread2({}, transform), {}, {
        pointIndex
      }), x, y);
    const newAnchorPointInParentPlane = anchorPoint.subtract(poly.pathOffset).transform(poly.calcOwnMatrix());
    const diff = newAnchorPointInParentPlane.subtract(anchorPointInParentPlane);
    poly.left -= diff.x;
    poly.top -= diff.y;
    return actionPerformed;
  };
};
const createPolyActionHandler = pointIndex => wrapWithFireEvent(ACTION_NAME, factoryPolyActionHandler(pointIndex, polyActionHandler));
function createPolyControls(arg0) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const controls = {};
  for (let idx = 0; idx < (typeof arg0 === 'number' ? arg0 : arg0.points.length); idx++) {
    controls["p".concat(idx)] = new Control(_objectSpread2({
      actionName: ACTION_NAME,
      positionHandler: createPolyPositionHandler(idx),
      actionHandler: createPolyActionHandler(idx)
    }, options));
  }
  return controls;
}

export { createPolyActionHandler, createPolyControls, createPolyPositionHandler, factoryPolyActionHandler, polyActionHandler };
//# sourceMappingURL=polyControl.mjs.map
