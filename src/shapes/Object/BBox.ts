import { iMatrix } from '../../constants';
import { Point } from '../../Point';
import { TCornerPoint, TMat2D } from '../../typedefs';
import { mapValues } from '../../util/internals';
import { makeBoundingBoxFromPoints } from '../../util/misc/boundingBoxFromPoints';
import { multiplyTransformMatrices } from '../../util/misc/matrix';
import {
  calcBaseChangeMatrix,
  send2DToPlane,
  sendPointToPlane,
  sendVectorToPlane,
} from '../../util/misc/planeChange';
import { degreesToRadians } from '../../util/misc/radiansDegreesConversion';
import { createVector } from '../../util/misc/vectors';
import type { ObjectGeometry } from './ObjectGeometry';

export interface BBoxPlanes {
  viewport(): TMat2D;
  parent(): TMat2D;
  own(): TMat2D;
}

type Coords = [Point, Point, Point, Point] & TCornerPoint;

export class BBox {
  readonly transform: TMat2D;
  protected readonly coords: TCornerPoint;
  protected readonly planes: BBoxPlanes;

  constructor(coords: TCornerPoint, transform: TMat2D, planes: BBoxPlanes) {
    this.coords = coords;
    // @ts-expect-error mutable frozen type
    this.transform = Object.freeze(transform);
    this.planes = Object.freeze(planes);
  }

  protected getCoords(inViewport = true, postTransform: TMat2D = iMatrix) {
    const to = multiplyTransformMatrices(
      !inViewport ? this.planes.viewport() : iMatrix,
      postTransform
    );
    const { tl, tr, br, bl } = mapValues(this.coords, (coord) =>
      sendPointToPlane(coord, undefined, to)
    );
    return Object.assign([tl, tr, br, bl], { tl, tr, br, bl }) as Coords;
  }

  getOwnCoords(inViewport = false) {
    return this.getCoords(inViewport, this.planes.own());
  }

  getCoordsInParent(inViewport = false) {
    return this.getCoords(inViewport, this.planes.parent());
  }

  getCoordsInCanvas(inViewport = false) {
    return this.getCoords(inViewport);
  }

  getBBox(inViewport: boolean) {
    return makeBoundingBoxFromPoints(this.getCoords(inViewport));
  }

  getParentBBox() {
    return makeBoundingBoxFromPoints(
      this.getCoords(false).map((coord) =>
        sendPointToPlane(coord, undefined, this.planes.parent())
      )
    );
  }

  getCanvasBBox() {
    return this.getBBox(false);
  }

  getViewportBBox() {
    return this.getBBox(true);
  }

  getDimensionsVector(inViewport: boolean) {
    const { width, height } = this.getBBox(inViewport);
    return new Point(width, height);
  }

  getDimensionsInParent() {
    return sendVectorToPlane(
      this.getDimensionsVector(true),
      undefined,
      this.planes.parent()
    );
  }

  getDimensionsInCanvas() {
    return this.getDimensionsVector(false);
  }

  getDimensionsInViewport() {
    return this.getDimensionsVector(true);
  }

  protected applyTo2D(
    origin: Point,
    {
      inViewport = true,
      isVector = false,
      postTransform,
    }: { inViewport?: boolean; isVector?: boolean; postTransform?: TMat2D } = {}
  ) {
    const t = postTransform
      ? multiplyTransformMatrices(this.transform, postTransform)
      : this.transform;
    return send2DToPlane(
      origin,
      !inViewport ? this.planes.viewport() : undefined,
      t,
      isVector
    );
  }

  applyToPointInParent(origin: Point, inViewport = false) {
    return this.applyTo2D(origin, {
      inViewport,
      postTransform: this.planes.parent(),
    });
  }

  applyToViewportPointInParent(origin: Point) {
    return this.applyToPointInParent(origin, true);
  }

  applyToPointInCanvas(origin: Point, inViewport = false) {
    return this.applyTo2D(origin, { inViewport });
  }

  applyToPointInViewport(origin: Point) {
    return this.applyToPointInCanvas(origin, true);
  }

  applyToVectorInParent(origin: Point, inViewport = false) {
    return this.applyTo2D(origin, {
      inViewport,
      postTransform: this.planes.parent(),
      isVector: true,
    });
  }

  applyToViewportVectorInParent(origin: Point) {
    return this.applyToVectorInParent(origin, true);
  }

  applyToVectorInCanvas(origin: Point, inViewport = false) {
    return this.applyTo2D(origin, { inViewport, isVector: true });
  }

  applyToVectorInViewport(origin: Point) {
    return this.applyToVectorInCanvas(origin, true);
  }

  containsPoint(point: Point, inViewport = true) {
    const pointAsOrigin = sendPointToPlane(
      point,
      !inViewport ? this.planes.viewport() : undefined,
      this.transform
    );
    return (
      pointAsOrigin.x >= -0.5 &&
      pointAsOrigin.x <= 0.5 &&
      pointAsOrigin.y >= -0.5 &&
      pointAsOrigin.y <= 0.5
    );
  }

  static getViewportCoords(target: ObjectGeometry) {
    const coords = target.bboxCoords;
    if (target.needsViewportCoords()) {
      return coords;
    } else {
      const vpt = target.getViewportTransform();
      return mapValues(coords, (coord) => sendPointToPlane(coord, vpt));
    }
  }

  static buildBBoxPlanes(target: ObjectGeometry): BBoxPlanes {
    const own = target.calcOwnMatrix();
    const parent = target.group?.calcTransformMatrix() || iMatrix;
    const viewport = target.getViewportTransform();
    return {
      own() {
        return own;
      },
      parent() {
        return parent;
      },
      viewport() {
        return viewport;
      },
    };
  }

  static canvas(target: ObjectGeometry) {
    const coords = this.getViewportCoords(target);
    const bbox = makeBoundingBoxFromPoints(Object.values(coords));
    const transform = calcBaseChangeMatrix(
      undefined,
      [new Point(bbox.width, 0), new Point(0, bbox.height)],
      coords.tl.midPointFrom(coords.br)
    );
    return new this(coords, transform, this.buildBBoxPlanes());
  }

  static rotated(target: ObjectGeometry) {
    const rotation = degreesToRadians(target.getTotalAngle());
    const coords = this.getViewportCoords(target);
    const center = coords.tl.midPointFrom(coords.br);
    const bbox = makeBoundingBoxFromPoints(
      Object.values(coords).map((coord) => coord.rotate(-rotation, center))
    );
    const transform = calcBaseChangeMatrix(
      undefined,
      [
        new Point(bbox.width, 0).rotate(rotation),
        new Point(0, bbox.height).rotate(rotation),
      ],
      center
    );
    return new this(coords, transform, this.buildBBoxPlanes(target));
  }

  static legacy(target: ObjectGeometry) {
    const rotation = degreesToRadians(target.getTotalAngle());
    const coords = this.getViewportCoords(target);
    const center = coords.tl.midPointFrom(coords.br);
    const viewportBBox = makeBoundingBoxFromPoints(Object.values(coords));
    const rotatedBBox = makeBoundingBoxFromPoints(
      Object.values(coords).map((coord) => coord.rotate(-rotation, center))
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
    const transform = calcBaseChangeMatrix(
      undefined,
      [new Point(1, 0).rotate(rotation), new Point(0, 1).rotate(rotation)],
      center
    );
    return new this(legacyCoords, transform, this.buildBBoxPlanes(target));
  }

  static transformed(target: ObjectGeometry) {
    const coords = this.getViewportCoords(target);
    const transform = calcBaseChangeMatrix(
      undefined,
      [createVector(coords.tl, coords.tr), createVector(coords.tl, coords.bl)],
      coords.tl.midPointFrom(coords.br)
    );
    return new this(coords, transform, this.buildBBoxPlanes(target));
  }

  static build(coords: TCornerPoint, vpt = iMatrix) {
    return new this(
      coords,
      calcBaseChangeMatrix(
        undefined,
        [
          createVector(coords.tl, coords.tr),
          createVector(coords.tl, coords.bl),
        ],
        coords.tl.midPointFrom(coords.br)
      ),
      {
        own() {
          return iMatrix;
        },
        parent() {
          return iMatrix;
        },
        viewport() {
          return vpt;
        },
      }
    );
  }
}

/**
 * Perf opt
 */
export class OwnBBox extends BBox {
  constructor(coords: TCornerPoint, transform: TMat2D, planes: BBoxPlanes) {
    super(
      mapValues(coords, (coord) =>
        sendPointToPlane(
          coord,
          undefined,
          multiplyTransformMatrices(planes.viewport(), planes.own())
        )
      ),
      transform,
      planes
    );
  }

  protected getCoords(
    inViewport?: boolean,
    postTransform: TMat2D = iMatrix
  ): Coords {
    const from = multiplyTransformMatrices(
      this.planes.viewport(),
      this.planes.own()
    );
    const to = multiplyTransformMatrices(
      !inViewport ? this.planes.viewport() : iMatrix,
      postTransform
    );
    const { tl, tr, br, bl } = mapValues(this.coords, (coord) =>
      sendPointToPlane(coord, from, to)
    );
    return Object.assign([tl, tr, br, bl], { tl, tr, br, bl }) as Coords;
  }

  static buildBBoxPlanes(target: ObjectGeometry): BBoxPlanes {
    return {
      own() {
        return target.calcOwnMatrix();
      },
      parent() {
        return target.group?.calcTransformMatrix() || iMatrix;
      },
      viewport() {
        return target.getViewportTransform();
      },
    };
  }
}
