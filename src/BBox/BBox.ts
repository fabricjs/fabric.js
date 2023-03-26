import { iMatrix } from '../constants';
import { Point } from '../Point';
import type { ObjectBBox } from '../shapes/Object/ObjectBBox';
import { TMat2D } from '../typedefs';
import { mapValues } from '../util/internals';
import { makeBoundingBoxFromPoints } from '../util/misc/boundingBoxFromPoints';
import {
  calcBaseChangeMatrix,
  sendPointToPlane,
} from '../util/misc/planeChange';
import { radiansToDegrees } from '../util/misc/radiansDegreesConversion';
import { createVector } from '../util/misc/vectors';
import { ViewportBBox, ViewportBBoxPlanes } from './ViewportBBox';

export interface BBoxPlanes extends ViewportBBoxPlanes {
  parent(): TMat2D;
  self(): TMat2D;
}

export class BBox extends ViewportBBox {
  protected declare readonly planes: BBoxPlanes;

  protected constructor(transform: TMat2D, planes: BBoxPlanes) {
    super(transform, planes);
  }

  /**
   * Use this to operate on the object's own transformation.\
   * Used to position the object in the relative plane
   */
  sendToParent() {
    return this.sendToPlane(this.planes.parent());
  }

  /**
   * Use this to operate in a transform-less plane
   *
   * e.g.
   * {@link getBBox} will return the following:
   *
   * ```js
   * let w = object.width;
   * let h = object.height;
   * let s = object.strokeWidth;
   * let sx, sy, px, py; // non linear stroke/padding factors transformed back to the object plane
   * ```
   *
   * | case                              | left          |  top          |  width       |  height      |
   * | ---                               | ---           |  ---          |  ---         |  ---         |
   * | no `stroke`/`padding`             | `-w / 2`      | `-h / 2`      | `w`          | `h`          |
   * | `strokeUniform = false`           | `-w / 2 - s`  | `-h / 2 - s`  | `w + s * 2`  | `h + s * 2`  |
   * | `strokeUniform = true || padding` | `-w / 2 - sx` | `-h / 2 - sy` | `w + sx * 2` | `h + sy * 2` |
   *
   */
  sendToSelf() {
    return this.sendToPlane(this.planes.self());
  }

  static getViewportCoords(target: ObjectBBox) {
    const coords = target.calcCoords();
    if (target.needsViewportCoords()) {
      return coords;
    } else {
      const vpt = target.getViewportTransform();
      return mapValues(coords, (coord) => sendPointToPlane(coord, vpt));
    }
  }

  static getPlanes(target: ObjectBBox): BBoxPlanes {
    const self = target.calcTransformMatrix();
    const parent = target.group?.calcTransformMatrix() || iMatrix;
    const viewport = target.getViewportTransform();
    return {
      self() {
        return self;
      },
      parent() {
        return parent;
      },
      viewport() {
        return viewport;
      },
    };
  }

  static bbox(target: ObjectBBox) {
    const coords = this.getViewportCoords(target);
    const bbox = makeBoundingBoxFromPoints(Object.values(coords));
    const transform = calcBaseChangeMatrix(
      undefined,
      [new Point(bbox.width, 0), new Point(0, bbox.height)],
      coords.tl.midPointFrom(coords.br)
    );
    return new this(transform, this.getPlanes(target));
  }

  /**
   *
   * @param target
   * @returns the bbox that respects rotation and flipping
   */
  static rotated(target: ObjectBBox) {
    const coords = this.getViewportCoords(target);
    const rotation = this.calcRotation(coords);
    const center = coords.tl.midPointFrom(coords.br);
    const bbox = makeBoundingBoxFromPoints(
      Object.values(coords).map((coord) => coord.rotate(-rotation.x, center))
    );
    const transform = calcBaseChangeMatrix(
      undefined,
      [
        // flipX/Y are taken into consideration in `rotation`
        new Point(bbox.width, 0).rotate(rotation.x),
        new Point(0, bbox.height).rotate(rotation.y),
      ],
      center
    );
    return new this(transform, this.getPlanes(target));
  }

  static legacy(target: ObjectBBox) {
    const coords = this.getViewportCoords(target);
    const rotation = this.calcRotation(coords);
    const center = coords.tl.midPointFrom(coords.br);
    const viewportBBox = makeBoundingBoxFromPoints(Object.values(coords));
    const rotatedBBox = makeBoundingBoxFromPoints(
      Object.values(coords).map((coord) => coord.rotate(-rotation.x, center))
    );
    const bboxTransform = calcBaseChangeMatrix(
      undefined,
      [
        new Point(rotatedBBox.width / viewportBBox.width, 0),
        new Point(0, rotatedBBox.height / viewportBBox.height),
      ],
      center
    );
    const legacyCoords = mapValues(coords, (coord) =>
      coord.transform(bboxTransform)
    );
    const legacyBBox = makeBoundingBoxFromPoints(Object.values(legacyCoords));
    const transform = calcBaseChangeMatrix(
      undefined,
      [new Point(1, 0).rotate(rotation.x), new Point(0, 1).rotate(rotation.y)],
      center
    );
    return {
      angle: radiansToDegrees(rotation.x),
      getCoords() {
        return legacyCoords;
      },
      getTransformation() {
        return transform;
      },
      getBBox() {
        return legacyBBox;
      },
      getBBoxVector() {
        return new Point(legacyBBox.width, legacyBBox.height);
      },
      transform(ctx: CanvasRenderingContext2D) {
        ctx.transform(...transform);
      },
    };
  }

  static transformed(target: ObjectBBox) {
    const coords = this.getViewportCoords(target);
    const transform = calcBaseChangeMatrix(
      undefined,
      [createVector(coords.tl, coords.tr), createVector(coords.tl, coords.bl)],
      coords.tl.midPointFrom(coords.br)
    );
    return new this(transform, this.getPlanes(target));
  }
}
