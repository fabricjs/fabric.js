import { Point, ZERO } from '../../Point';
import type { Group } from '../../shapes/Group';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import { multiplyTransformMatrixArray } from '../../util/misc/matrix';
import { sizeAfterTransform } from '../../util/misc/objectTransforms';
import {
  calcPlaneChangeMatrix,
  sendVectorToPlane,
} from '../../util/misc/planeChange';

/**
 * @returns 2 points, the tl and br corners of the non rotated bounding box of an object
 * in the {@link group} plane, taking into account objects that {@link group} is their parent
 * but also belong to the active selection.
 */
export const getObjectBounds = (
  group: Group,
  object: FabricObject
): Point[] => {
  const t =
    object.group && object.group !== group
      ? calcPlaneChangeMatrix(
          object.group.calcTransformMatrix(),
          group.calcTransformMatrix()
        )
      : null;
  const objectCenter = t
    ? object.getRelativeCenterPoint().transform(t)
    : object.getRelativeCenterPoint();
  const strokeUniformVector = object.strokeUniform
    ? sendVectorToPlane(
        new Point(object.strokeWidth, object.strokeWidth),
        undefined,
        group.calcTransformMatrix()
      )
    : ZERO;
  const scalingStrokeWidth = !object.strokeUniform ? object.strokeWidth : 0;
  const sizeVector = sizeAfterTransform(
    object.width + scalingStrokeWidth,
    object.height + scalingStrokeWidth,
    multiplyTransformMatrixArray([t, object.calcOwnMatrix()], true)
  )
    .add(strokeUniformVector)
    .scalarDivide(2);
  return [objectCenter.subtract(sizeVector), objectCenter.add(sizeVector)];
};
