import { Point } from '../../Point';
import type { Group } from '../../shapes/Group';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import type { TMat2D } from '../../typedefs';
import { cos } from '../../util/misc/cos';
import { multiplyTransformMatrices, qrDecompose } from '../../util/misc/matrix';
import { calcPlaneChangeMatrix } from '../../util/misc/planeChange';
import { degreesToRadians } from '../../util/misc/radiansDegreesConversion';
import { sin } from '../../util/misc/sin';

/**
 * @todo this is very buggy => refactor in redo coords
 */
export const getObjectSizeVector = (
  object: FabricObject,
  /**
   * account for selected objects in active selection
   */
  planeChange?: TMat2D
) => {
  const decomposition = planeChange
    ? qrDecompose(
        multiplyTransformMatrices(planeChange, object.calcOwnMatrix())
      )
    : undefined;
  const sizeVector = object
    ._getTransformedDimensions(decomposition)
    .scalarDivide(2);
  if (decomposition?.angle ?? object.angle) {
    const rad = degreesToRadians(object.angle),
      sine = Math.abs(sin(rad)),
      cosine = Math.abs(cos(rad)),
      rx = sizeVector.x * cosine + sizeVector.y * sine,
      ry = sizeVector.x * sine + sizeVector.y * cosine;
    return new Point(rx, ry);
  }
  return sizeVector;
};

/**
 * account for selected objects in active selection
 */
export const getObjectBounds = (group: Group, object: FabricObject) => {
  const planeChange =
    object.group !== group
      ? calcPlaneChangeMatrix(
          object.group!.calcTransformMatrix(),
          group.calcTransformMatrix()
        )
      : undefined;
  const objCenter = planeChange
    ? object.getRelativeCenterPoint().transform(planeChange)
    : object.getRelativeCenterPoint();
  const sizeVector = getObjectSizeVector(object, planeChange);
  return [objCenter.subtract(sizeVector), objCenter.add(sizeVector)];
};
