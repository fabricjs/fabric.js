import { Image } from '../shapes/Image';
import type { FabricObject } from '../shapes/Object/FabricObject';
import { TMat2D } from '../typedefs';
import { qrDecompose } from './misc/matrix';

type FabricObjectWithTransformMatrix = FabricObject & {
  transformMatrix?: TMat2D;
};

/**
 * This function is an helper for svg import. it decompose the transformMatrix
 * and assign properties to object.
 * untransformed coordinates
 * @private
 */
const _assignTransformMatrixProps = (
  object: FabricObjectWithTransformMatrix
) => {
  if (object.transformMatrix) {
    const { scaleX, scaleY, angle, skewX } = qrDecompose(
      object.transformMatrix
    );
    object.flipX = false;
    object.flipY = false;
    object.set('scaleX', scaleX);
    object.set('scaleY', scaleY);
    object.angle = angle;
    object.skewX = skewX;
    object.skewY = 0;
  }
};

/**
 * This function is an helper for svg import. it removes the transform matrix
 * and set to object properties that fabricjs can handle
 * @private
 * @param {Object} preserveAspectRatioOptions
 */
export const removeTransformMatrixForSvgParsing = (
  object: FabricObjectWithTransformMatrix,
  preserveAspectRatioOptions?: any
) => {
  let center = object._findCenterFromElement();
  if (object.transformMatrix) {
    _assignTransformMatrixProps(object);
    center = center.transform(object.transformMatrix);
  }
  delete object.transformMatrix;
  if (preserveAspectRatioOptions) {
    object.scaleX *= preserveAspectRatioOptions.scaleX;
    object.scaleY *= preserveAspectRatioOptions.scaleY;
    (object as Image).cropX = preserveAspectRatioOptions.cropX;
    (object as Image).cropY = preserveAspectRatioOptions.cropY;
    center.x += preserveAspectRatioOptions.offsetLeft;
    center.y += preserveAspectRatioOptions.offsetTop;
    object.width = preserveAspectRatioOptions.width;
    object.height = preserveAspectRatioOptions.height;
  }
  object.setPositionByOrigin(center, 'center', 'center');
};
