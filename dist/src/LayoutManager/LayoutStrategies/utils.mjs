import { Point, ZERO } from '../../Point.mjs';
import { multiplyTransformMatrixArray } from '../../util/misc/matrix.mjs';
import { sizeAfterTransform } from '../../util/misc/objectTransforms.mjs';
import { calcPlaneChangeMatrix, sendVectorToPlane } from '../../util/misc/planeChange.mjs';

/**
 * @returns 2 points, the tl and br corners of the non rotated bounding box of an object
 * in the {@link group} plane, taking into account objects that {@link group} is their parent
 * but also belong to the active selection.
 */
const getObjectBounds = (destinationGroup, object) => {
  const {
    strokeUniform,
    strokeWidth,
    width,
    height,
    group: currentGroup
  } = object;
  const t = currentGroup && currentGroup !== destinationGroup ? calcPlaneChangeMatrix(currentGroup.calcTransformMatrix(), destinationGroup.calcTransformMatrix()) : null;
  const objectCenter = t ? object.getRelativeCenterPoint().transform(t) : object.getRelativeCenterPoint();
  const accountForStroke = !object['isStrokeAccountedForInDimensions']();
  const strokeUniformVector = strokeUniform && accountForStroke ? sendVectorToPlane(new Point(strokeWidth, strokeWidth), undefined, destinationGroup.calcTransformMatrix()) : ZERO;
  const scalingStrokeWidth = !strokeUniform && accountForStroke ? strokeWidth : 0;
  const sizeVector = sizeAfterTransform(width + scalingStrokeWidth, height + scalingStrokeWidth, multiplyTransformMatrixArray([t, object.calcOwnMatrix()], true)).add(strokeUniformVector).scalarDivide(2);
  return [objectCenter.subtract(sizeVector), objectCenter.add(sizeVector)];
};

export { getObjectBounds };
//# sourceMappingURL=utils.mjs.map
