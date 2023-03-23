import { iMatrix } from '../../constants';
import type { Point } from '../../Point';
import type { FabricObject } from '../../shapes/Object/Object';
import type { TMat2D } from '../../typedefs';
import type { StaticCanvas } from '../../canvas/StaticCanvas';
import { invertTransform, multiplyTransformMatrices } from './matrix';
import { applyTransformToObject } from './objectTransforms';

export const enum ObjectRelation {
  sibling = 'sibling',
  child = 'child',
}

/**
 * We are actually looking for the transformation from the destination plane to the source plane (change of basis matrix)\
 * The object will exist on the destination plane and we want it to seem unchanged by it so we invert the destination matrix (`to`) and then apply the source matrix (`from`)
 * @param [from]
 * @param [to]
 * @returns
 */
export const calcPlaneChangeMatrix = (
  from: TMat2D = iMatrix,
  to: TMat2D = iMatrix
) => multiplyTransformMatrices(invertTransform(to), from);

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
 * @see {transformPointRelativeToCanvas} for transforming relative to canvas
 * @param {Point} point
 * @param {TMat2D} [from] plane matrix containing object. Passing `undefined` is equivalent to passing the identity matrix, which means `point` exists in the canvas coordinate plane.
 * @param {TMat2D} [to] destination plane matrix to contain object. Passing `undefined` means `point` should be sent to the canvas coordinate plane.
 * @returns {Point} transformed point
 */
export const sendPointToPlane = (
  point: Point,
  from: TMat2D = iMatrix,
  to: TMat2D = iMatrix
): Point =>
  //  we are actually looking for the transformation from the destination plane to the source plane (which is a linear mapping)
  //  the object will exist on the destination plane and we want it to seem unchanged by it so we reverse the destination matrix (to) and then apply the source matrix (from)
  point.transform(calcPlaneChangeMatrix(from, to));

/**
 * Transform point relative to canvas.
 * From the viewport/viewer's perspective the point remains unchanged.
 *
 * `child` relation means `point` exists in the coordinate plane created by `canvas`.
 * In other words point is measured according to canvas' top left corner
 * meaning that if `point` is equal to (0,0) it is positioned at canvas' top left corner.
 *
 * `sibling` relation means `point` exists in the same coordinate plane as canvas.
 * In other words they both relate to the same (0,0) and agree on every point, which is how an event relates to canvas.
 *
 * @param {Point} point
 * @param {StaticCanvas} canvas
 * @param {'sibling'|'child'} relationBefore current relation of point to canvas
 * @param {'sibling'|'child'} relationAfter desired relation of point to canvas
 * @returns {Point} transformed point
 */
export const transformPointRelativeToCanvas = (
  point: Point,
  canvas: StaticCanvas,
  relationBefore: ObjectRelation,
  relationAfter: ObjectRelation
): Point => {
  // is this still needed with TS?
  if (
    relationBefore !== ObjectRelation.child &&
    relationBefore !== ObjectRelation.sibling
  ) {
    throw new Error(`fabric.js: received bad argument ${relationBefore}`);
  }
  if (
    relationAfter !== ObjectRelation.child &&
    relationAfter !== ObjectRelation.sibling
  ) {
    throw new Error(`fabric.js: received bad argument ${relationAfter}`);
  }
  if (relationBefore === relationAfter) {
    return point;
  }
  const t = canvas.viewportTransform;
  return point.transform(relationAfter === 'child' ? invertTransform(t) : t);
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
export const sendObjectToPlane = (
  object: FabricObject,
  from?: TMat2D,
  to?: TMat2D
): TMat2D => {
  const t = calcPlaneChangeMatrix(from, to);
  applyTransformToObject(
    object,
    multiplyTransformMatrices(t, object.calcOwnMatrix())
  );
  return t;
};
