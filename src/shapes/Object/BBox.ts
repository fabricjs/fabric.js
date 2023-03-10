import { iMatrix } from '../../constants';
import { Point } from '../../Point';
import { TCornerPoint, TMat2D, TOriginX, TOriginY } from '../../typedefs';
import { mapValues } from '../../util/internals';
import { makeBoundingBoxFromPoints } from '../../util/misc/boundingBoxFromPoints';
import {
  invertTransform,
  multiplyTransformMatrices,
} from '../../util/misc/matrix';
import {
  calcBaseChangeMatrix,
  sendPointToPlane,
} from '../../util/misc/planeChange';
import { degreesToRadians } from '../../util/misc/radiansDegreesConversion';
import { resolveOrigin } from '../../util/misc/resolveOrigin';
import { createVector } from '../../util/misc/vectors';
import type { ObjectGeometry } from './ObjectGeometry';

export interface BBoxPlanes {
  retina(): TMat2D;
  viewport(): TMat2D;
  parent(): TMat2D;
  self(): TMat2D;
}

export type Coords = [Point, Point, Point, Point] & TCornerPoint;

export type TRotatedBBox = ReturnType<typeof BBox['rotated']>;

export class PlaneBBox {
  private readonly originTransformation: TMat2D;
  protected readonly coords: TCornerPoint;
  protected readonly plane: TMat2D;

  static build(coords: TCornerPoint) {
    return new this(
      coords,
      calcBaseChangeMatrix(
        undefined,
        [
          createVector(coords.tl, coords.tr),
          createVector(coords.tl, coords.bl),
        ],
        coords.tl.midPointFrom(coords.br)
      )
    );
  }

  protected constructor(
    coords: TCornerPoint,
    transform: TMat2D,
    plane: TMat2D = iMatrix
  ) {
    this.coords = coords;
    this.originTransformation = Object.freeze([...transform]) as TMat2D;
    this.plane = plane;
  }

  getTransformation() {
    return this.originTransformation;
  }

  getCoords() {
    const { tl, tr, br, bl } = this.coords;
    return Object.assign([tl, tr, br, bl], { tl, tr, br, bl }) as Coords;
  }

  getBBox() {
    return makeBoundingBoxFromPoints(this.getCoords());
  }

  getDimensionsVector() {
    const { width, height } = this.getBBox();
    return new Point(width, height);
  }

  protected applyTo2D(origin: Point, isVector = false) {
    return origin.transform(this.getTransformation(), isVector);
  }

  applyToPoint(origin: Point) {
    return this.applyTo2D(origin);
  }

  applyToVector(origin: Point) {
    return this.applyTo2D(origin, true);
  }

  /**
   * Translates the coordinates from a set of origin to another (based on the object's dimensions)
   * @param {Point} point The point which corresponds to the originX and originY params
   * @param {TOriginX} fromOriginX Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} fromOriginY Vertical origin: 'top', 'center' or 'bottom'
   * @param {TOriginX} toOriginX Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} toOriginY Vertical origin: 'top', 'center' or 'bottom'
   * @return {Point}
   */
  translateToGivenOrigin(
    point: Point,
    fromOriginX: TOriginX,
    fromOriginY: TOriginY,
    toOriginX: TOriginX,
    toOriginY: TOriginY
  ): Point {
    const originOffset = new Point(
      resolveOrigin(toOriginX) - resolveOrigin(fromOriginX),
      resolveOrigin(toOriginY) - resolveOrigin(fromOriginY)
    ).multiply(this.getDimensionsVector());
    return point.add(originOffset);
  }

  containsPoint(point: Point) {
    const pointAsOrigin = sendPointToPlane(
      point,
      undefined,
      this.getTransformation()
    );
    return (
      pointAsOrigin.x >= -0.5 &&
      pointAsOrigin.x <= 0.5 &&
      pointAsOrigin.y >= -0.5 &&
      pointAsOrigin.y <= 0.5
    );
  }

  transform(ctx: CanvasRenderingContext2D) {
    ctx.transform(...this.getTransformation());
  }
}

export class BBox extends PlaneBBox {
  protected readonly planes: BBoxPlanes;

  protected constructor(
    coords: TCornerPoint,
    transform: TMat2D,
    planes: BBoxPlanes
  ) {
    super(coords, transform);
    this.planes = planes;
  }

  sendToPlane(plane: TMat2D) {
    const backToPlane = invertTransform(
      multiplyTransformMatrices(this.planes.viewport(), plane)
    );
    return new PlaneBBox(
      mapValues(this.coords, (coord) => coord.transform(backToPlane)),
      multiplyTransformMatrices(backToPlane, this.getTransformation()),
      plane
    );
  }

  sendToCanvas() {
    return this.sendToPlane(iMatrix);
  }

  sendToParent() {
    return this.sendToPlane(this.planes.parent());
  }

  sendToSelf() {
    return this.sendToPlane(this.planes.self());
  }

  static getViewportCoords(target: ObjectGeometry) {
    const coords = target.calcCoords();
    if (target.needsViewportCoords()) {
      return coords;
    } else {
      const vpt = target.getViewportTransform();
      return mapValues(coords, (coord) => sendPointToPlane(coord, vpt));
    }
  }

  static buildBBoxPlanes(target: ObjectGeometry): BBoxPlanes {
    const self = target.calcTransformMatrix();
    const parent = target.group?.calcTransformMatrix() || iMatrix;
    const viewport = target.getViewportTransform();
    const retina = target.canvas?.getRetinaScaling() || 1;
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
      retina() {
        return [retina, 0, 0, retina, 0, 0] as TMat2D;
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
    return new this(coords, transform, this.buildBBoxPlanes(target));
  }

  static rotated(target: ObjectGeometry) {
    const angle = target.getTotalAngle();
    const rotation = degreesToRadians(angle);
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
    return Object.assign(
      new this(coords, transform, this.buildBBoxPlanes(target)),
      { angle, rotation }
    );
  }

  static legacy(target: ObjectGeometry) {
    const angle = target.getTotalAngle();
    const rotation = degreesToRadians(angle);
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
    return Object.assign(
      new this(legacyCoords, transform, this.buildBBoxPlanes(target)),
      { angle, rotation }
    );
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
          multiplyTransformMatrices(planes.viewport(), planes.self())
        )
      ),
      transform,
      planes
    );
  }

  getCoords(): Coords {
    const from = multiplyTransformMatrices(
      this.planes.viewport(),
      this.planes.self()
    );
    const { tl, tr, br, bl } = mapValues(this.coords, (coord) =>
      sendPointToPlane(coord, from)
    );
    return Object.assign([tl, tr, br, bl], { tl, tr, br, bl }) as Coords;
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
