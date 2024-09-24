import { iMatrix } from '../../constants.mjs';
import { multiplyTransformMatrices, invertTransform } from './matrix.mjs';
import { applyTransformToObject } from './objectTransforms.mjs';

/**
 * We are actually looking for the transformation from the destination plane to the source plane (change of basis matrix)\
 * The object will exist on the destination plane and we want it to seem unchanged by it so we invert the destination matrix (`to`) and then apply the source matrix (`from`)
 * @param [from]
 * @param [to]
 * @returns
 */
const calcPlaneChangeMatrix = function () {
  let from = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : iMatrix;
  let to = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : iMatrix;
  return multiplyTransformMatrices(invertTransform(to), from);
};

/**
 * Sends a point from the source coordinate plane to the destination coordinate plane.\
 * From the canvas/viewer's perspective the point remains unchanged.
 *
 * @example <caption>Send point from canvas plane to group plane</caption>
 * var obj = new Rect({ left: 20, top: 20, width: 60, height: 60, strokeWidth: 0 });
 * var group = new Group([obj], { strokeWidth: 0 });
 * var sentPoint1 = sendPointToPlane(new Point(50, 50), undefined, group.calcTransformMatrix());
 * var sentPoint2 = sendPointToPlane(new Point(50, 50), iMatrix, group.calcTransformMatrix());
 * console.log(sentPoint1, sentPoint2) //  both points print (0,0) which is the center of group
 *
 * @param {Point} point
 * @param {TMat2D} [from] plane matrix containing object. Passing `undefined` is equivalent to passing the identity matrix, which means `point` exists in the canvas coordinate plane.
 * @param {TMat2D} [to] destination plane matrix to contain object. Passing `undefined` means `point` should be sent to the canvas coordinate plane.
 * @returns {Point} transformed point
 */
const sendPointToPlane = function (point) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : iMatrix;
  let to = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : iMatrix;
  return point.transform(calcPlaneChangeMatrix(from, to));
};

/**
 * See {@link sendPointToPlane}
 */
const sendVectorToPlane = function (point) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : iMatrix;
  let to = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : iMatrix;
  return point.transform(calcPlaneChangeMatrix(from, to), true);
};

/**
 *
 * A util that abstracts applying transform to objects.\
 * Sends `object` to the destination coordinate plane by applying the relevant transformations.\
 * Changes the space/plane where `object` is drawn.\
 * From the canvas/viewer's perspective `object` remains unchanged.
 *
 * @example <caption>Move clip path from one object to another while preserving it's appearance as viewed by canvas/viewer</caption>
 * let obj, obj2;
 * let clipPath = new Circle({ radius: 50 });
 * obj.clipPath = clipPath;
 * // render
 * sendObjectToPlane(clipPath, obj.calcTransformMatrix(), obj2.calcTransformMatrix());
 * obj.clipPath = undefined;
 * obj2.clipPath = clipPath;
 * // render, clipPath now clips obj2 but seems unchanged from the eyes of the viewer
 *
 * @example <caption>Clip an object's clip path with an existing object</caption>
 * let obj, existingObj;
 * let clipPath = new Circle({ radius: 50 });
 * obj.clipPath = clipPath;
 * let transformTo = multiplyTransformMatrices(obj.calcTransformMatrix(), clipPath.calcTransformMatrix());
 * sendObjectToPlane(existingObj, existingObj.group?.calcTransformMatrix(), transformTo);
 * clipPath.clipPath = existingObj;
 *
 * @param {FabricObject} object
 * @param {Matrix} [from] plane matrix containing object. Passing `undefined` is equivalent to passing the identity matrix, which means `object` is a direct child of canvas.
 * @param {Matrix} [to] destination plane matrix to contain object. Passing `undefined` means `object` should be sent to the canvas coordinate plane.
 * @returns {Matrix} the transform matrix that was applied to `object`
 */
const sendObjectToPlane = (object, from, to) => {
  const t = calcPlaneChangeMatrix(from, to);
  applyTransformToObject(object, multiplyTransformMatrices(t, object.calcOwnMatrix()));
  return t;
};

export { calcPlaneChangeMatrix, sendObjectToPlane, sendPointToPlane, sendVectorToPlane };
//# sourceMappingURL=planeChange.mjs.map
