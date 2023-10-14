import type { XY } from '../../Point';
import { Point } from '../../Point';
import type { Group } from '../../shapes/Group';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import type { TDegree, TMat2D } from '../../typedefs';
import { cos } from '../../util/misc/cos';
import { multiplyTransformMatrices, qrDecompose } from '../../util/misc/matrix';
import { calcPlaneChangeMatrix } from '../../util/misc/planeChange';
import { degreesToRadians } from '../../util/misc/radiansDegreesConversion';
import { sin } from '../../util/misc/sin';

const compensateAngle = (angle: TDegree, vector: XY) => {
  const rad = degreesToRadians(angle),
    sine = Math.abs(sin(rad)),
    cosine = Math.abs(cos(rad)),
    rx = vector.x * cosine + vector.y * sine,
    ry = vector.x * sine + vector.y * cosine;
  return new Point(rx, ry);
};

const getObjectSizeVector = (object: FabricObject) => {
  const sizeVector = object._getTransformedDimensions().scalarDivide(2);
  if (object.angle) {
    return compensateAngle(object.angle, sizeVector);
  }
  return sizeVector;
};

const getObjectSizeVectorWithPlaneChange = (
  object: FabricObject,
  /**
   * account for selected objects in active selection
   */
  planeChange: TMat2D
) => {
  const decomposition = qrDecompose(
    multiplyTransformMatrices(planeChange, object.calcOwnMatrix())
  );
  const sizeVector = object
    ._getTransformedDimensions(decomposition)
    .scalarDivide(2);
  if (decomposition.angle !== 0) {
    return compensateAngle(object.angle, sizeVector);
  }
  return sizeVector;
};

// uncomment to debug
// const debugCode = (
//   topLeft: Point,
//   bottomRight: Point,
//   object: FabricObject
// ) => {
//   setTimeout(() => {
//     console.log('running debug code', !!object.group);
//     const ctx = object.canvas!.elements.upper.ctx;
//     ctx.beginPath();
//     ctx.lineWidth = 4;
//     ctx.strokeStyle = object.stroke;
//     ctx.moveTo(topLeft.x, topLeft.y);
//     ctx.lineTo(bottomRight.x, bottomRight.y);
//     ctx.stroke();
//     ctx.lineWidth = 2;
//     ctx.strokeStyle = object.fill;
//     ctx.stroke();
//   }, 50);
// };

/**
 * Return 2 points, the topLeft corner and the bottom right corner of an object
 * that needs to go inside group. This needs to take in account objects that are in
 * a group but also in an active selection or when they are about to be moved from a
 * group to another
 */
export const getObjectBounds = (
  group: Group,
  object: FabricObject
): [Point, Point] => {
  let objCenter = object.getRelativeCenterPoint();
  let sizeVector;
  // TODO: detail use cases
  if (object.group && object.group !== group) {
    const planeChange = calcPlaneChangeMatrix(
      object.group.calcTransformMatrix(),
      group.calcTransformMatrix()
    );
    objCenter = objCenter.transform(planeChange);
    sizeVector = getObjectSizeVectorWithPlaneChange(object, planeChange);
  } else {
    sizeVector = getObjectSizeVector(object);
  }
  // uncomment to debug
  // debugCode(objCenter.subtract(sizeVector), objCenter.add(sizeVector), object);
  return [objCenter.subtract(sizeVector), objCenter.add(sizeVector)];
};
