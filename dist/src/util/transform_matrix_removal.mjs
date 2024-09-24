import { CENTER, SCALE_X, SCALE_Y } from '../constants.mjs';
import { qrDecompose } from './misc/matrix.mjs';

/**
 * This function is an helper for svg import. it decompose the transformMatrix
 * and assign properties to object.
 * untransformed coordinates
 * @private
 */
const _assignTransformMatrixProps = object => {
  if (object.transformMatrix) {
    const {
      scaleX,
      scaleY,
      angle,
      skewX
    } = qrDecompose(object.transformMatrix);
    object.flipX = false;
    object.flipY = false;
    object.set(SCALE_X, scaleX);
    object.set(SCALE_Y, scaleY);
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
const removeTransformMatrixForSvgParsing = (object, preserveAspectRatioOptions) => {
  let center = object._findCenterFromElement();
  if (object.transformMatrix) {
    _assignTransformMatrixProps(object);
    center = center.transform(object.transformMatrix);
  }
  delete object.transformMatrix;
  if (preserveAspectRatioOptions) {
    object.scaleX *= preserveAspectRatioOptions.scaleX;
    object.scaleY *= preserveAspectRatioOptions.scaleY;
    object.cropX = preserveAspectRatioOptions.cropX;
    object.cropY = preserveAspectRatioOptions.cropY;
    center.x += preserveAspectRatioOptions.offsetLeft;
    center.y += preserveAspectRatioOptions.offsetTop;
    object.width = preserveAspectRatioOptions.width;
    object.height = preserveAspectRatioOptions.height;
  }
  object.setPositionByOrigin(center, CENTER, CENTER);
};

export { removeTransformMatrixForSvgParsing };
//# sourceMappingURL=transform_matrix_removal.mjs.map
