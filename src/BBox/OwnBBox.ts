import { iMatrix } from '../constants';
import { TMat2D } from '../typedefs';
import { mapValues } from '../util/internals';
import { multiplyTransformMatrices } from '../util/misc/matrix';
import { sendPointToPlane } from '../util/misc/planeChange';
import { ObjectGeometry } from '../shapes/Object/ObjectGeometry';
import { BBox, BBoxPlanes } from './BBox';

/**
 * Performance optimization
 */
export class OwnBBox extends BBox {
  constructor(transform: TMat2D, planes: BBoxPlanes) {
    super(transform, planes);
  }

  getCoordMap() {
    const from = multiplyTransformMatrices(
      this.planes.viewport(),
      this.planes.self()
    );
    return mapValues(super.getCoordMap(), (coord) =>
      sendPointToPlane(coord, from)
    );
  }

  static buildBBoxPlanes(target: ObjectGeometry): BBoxPlanes {
    return {
      self() {
        return target.calcTransformMatrix();
      },
      parent() {
        return target.group?.calcTransformMatrix() || iMatrix;
      },
      viewport() {
        return target.getViewportTransform();
      },
      retina() {
        const retina = target.canvas?.getRetinaScaling() || 1;
        return [retina, 0, 0, retina, 0, 0] as TMat2D;
      },
    };
  }
}
