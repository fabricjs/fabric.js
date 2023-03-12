import type { StaticCanvas } from '../../canvas/StaticCanvas';
import { iMatrix } from '../../constants';
import { Intersection } from '../../Intersection';
import { Point } from '../../Point';
import {
  TBBox,
  TCornerPoint,
  TMat2D,
  TOriginX,
  TOriginY,
} from '../../typedefs';
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
import { radiansToDegrees } from '../../util/misc/radiansDegreesConversion';
import { resolveOrigin } from '../../util/misc/resolveOrigin';
import { calcVectorRotation, createVector } from '../../util/misc/vectors';
import type { ObjectGeometry } from './ObjectGeometry';

export type OriginDiff = { x: TOriginX; y: TOriginY };

const CENTER_ORIGIN = { x: 'center', y: 'center' } as const;

export class PlaneBBox {
  private readonly originTransformation: TMat2D;

  static getTransformation(coords: TCornerPoint) {
    return calcBaseChangeMatrix(
      undefined,
      [createVector(coords.tl, coords.tr), createVector(coords.tl, coords.bl)],
      coords.tl.midPointFrom(coords.br)
    );
  }

  static build(coords: TCornerPoint) {
    return new this(this.getTransformation(coords));
  }

  static rect({ left, top, width, height }: TBBox) {
    const transform = calcBaseChangeMatrix(
      undefined,
      [new Point(width, 0), new Point(0, height)],
      new Point(left + width / 2, top + height / 2)
    );
    return new this(transform);
  }

  protected constructor(transform: TMat2D) {
    this.originTransformation = Object.freeze([...transform]) as TMat2D;
  }

  getTransformation() {
    return this.originTransformation;
  }

  getCoordMap() {
    return mapValues(
      {
        tl: new Point(-0.5, -0.5),
        tr: new Point(0.5, -0.5),
        br: new Point(0.5, 0.5),
        bl: new Point(-0.5, 0.5),
      },
      (origin) => this.pointFromOrigin(origin)
    );
  }

  getCoords() {
    return Object.values(this.getCoordMap());
  }

  getBBox() {
    return makeBoundingBoxFromPoints(this.getCoords());
  }

  getCenterPoint() {
    return this.pointFromOrigin(new Point());
  }

  getDimensionsVector() {
    const { width, height } = this.getBBox();
    return new Point(width, height);
  }

  static calcRotation({ tl, tr }: Record<'tl' | 'tr' | 'bl' | 'br', Point>) {
    return calcVectorRotation(createVector(tl, tr));
  }

  getRotation() {
    return PlaneBBox.calcRotation(this.getCoordMap());
  }

  pointFromOrigin(origin: Point) {
    return origin.transform(this.getTransformation());
  }

  pointToOrigin(point: Point) {
    return point.transform(invertTransform(this.getTransformation()));
  }

  vectorFromOrigin(originVector: Point) {
    return originVector.transform(this.getTransformation(), true);
  }

  vectorToOrigin(vector: Point) {
    return vector.transform(invertTransform(this.getTransformation()), true);
  }

  static resolveOrigin({ x, y }: OriginDiff): Point {
    return new Point(resolveOrigin(x), resolveOrigin(y));
  }

  static getOriginDiff(
    from: OriginDiff = CENTER_ORIGIN,
    to: OriginDiff = CENTER_ORIGIN
  ) {
    return PlaneBBox.resolveOrigin(to).subtract(PlaneBBox.resolveOrigin(from));
  }

  vectorFromOriginDiff(from?: OriginDiff, to?: OriginDiff) {
    return this.vectorFromOrigin(PlaneBBox.getOriginDiff(from, to));
  }

  calcOriginTranslation(origin: Point, prev: this) {
    return this.pointFromOrigin(origin).subtract(prev.pointFromOrigin(origin));
  }

  containsPoint(point: Point) {
    const pointAsOrigin = this.pointToOrigin(point);
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

export interface ViewportBBoxPlanes {
  viewport(): TMat2D;
}

export class ViewportBBox extends PlaneBBox {
  protected readonly planes: ViewportBBoxPlanes;

  protected constructor(transform: TMat2D, planes: ViewportBBoxPlanes) {
    super(transform);
    this.planes = planes;
  }

  sendToPlane(plane: TMat2D) {
    const backToPlane = invertTransform(
      multiplyTransformMatrices(this.planes.viewport(), plane)
    );
    return new PlaneBBox(
      multiplyTransformMatrices(backToPlane, this.getTransformation())
    );
  }

  sendToCanvas() {
    return this.sendToPlane(iMatrix);
  }

  intersect(other: ViewportBBox) {
    const coords = Object.values(this.getCoordMap());
    const otherCoords = Object.values(other.getCoordMap());
    return Intersection.intersectPolygonPolygon(coords, otherCoords);
  }

  intersects(other: ViewportBBox) {
    const intersection = this.intersect(other);
    return (
      intersection.status === 'Intersection' ||
      intersection.status === 'Coincident'
    );
  }

  contains(other: ViewportBBox) {
    const otherCoords = Object.values(other.getCoordMap());
    return otherCoords.every((coord) => this.containsPoint(coord));
  }

  isContainedBy(other: ViewportBBox) {
    return other.contains(this);
  }

  overlaps(other: ViewportBBox) {
    return (
      this.intersects(other) ||
      this.contains(other) ||
      this.isContainedBy(other)
    );
  }
}

export class CanvasBBox extends ViewportBBox {
  static getViewportCoords(canvas: StaticCanvas) {
    const size = new Point(canvas.width, canvas.height);
    return mapValues(
      {
        tl: new Point(-0.5, -0.5),
        tr: new Point(0.5, -0.5),
        br: new Point(0.5, 0.5),
        bl: new Point(-0.5, 0.5),
      },
      (coord) => coord.multiply(size).transform(canvas.viewportTransform)
    );
  }

  static getPlanes(canvas: StaticCanvas) {
    const vpt: TMat2D = [...canvas.viewportTransform];
    return {
      viewport() {
        return vpt;
      },
    };
  }

  static transformed(canvas: StaticCanvas) {
    return new this(
      this.getTransformation(this.getViewportCoords(canvas)),
      this.getPlanes(canvas)
    );
  }

  static bbox(canvas: StaticCanvas) {
    const coords = this.getViewportCoords(canvas);
    const bbox = makeBoundingBoxFromPoints(Object.values(coords));
    const transform = calcBaseChangeMatrix(
      undefined,
      [new Point(bbox.width, 0), new Point(0, bbox.height)],
      coords.tl.midPointFrom(coords.br)
    );
    return new this(transform, this.getPlanes(canvas));
  }
}

export interface BBoxPlanes extends ViewportBBoxPlanes {
  retina(): TMat2D;
  parent(): TMat2D;
  self(): TMat2D;
}

export type TRotatedBBox = ReturnType<typeof BBox['rotated']>;

export class BBox extends ViewportBBox {
  protected declare readonly planes: BBoxPlanes;

  protected constructor(transform: TMat2D, planes: BBoxPlanes) {
    super(transform, planes);
  }

  sendToParent() {
    return this.sendToPlane(this.planes.parent());
  }

  sendToSelf() {
    return this.sendToPlane(this.planes.self());
  }

  // preMultiply(transform: TMat2D) {
  //   const parent = this.planes.parent();
  //   const ownPreTransform = multiplyTransformMatrixChain([
  //     invertTransform(parent),
  //     transform,
  //     parent,
  //   ]);
  //   const self = multiplyTransformMatrixChain([
  //     parent,
  //     this.getOwnTransform(),
  //     ownPreTransform,
  //   ]);
  //   return new BBox(this.getTransformation(), {
  //     ...this.planes,
  //     self() {
  //       return self;
  //     },
  //   });
  // }

  // getOwnTransform() {
  //   return calcPlaneChangeMatrix(this.planes.self(), this.planes.parent());
  // }

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
    return new this(transform, this.buildBBoxPlanes(target));
  }

  static rotated(target: ObjectGeometry) {
    const coords = this.getViewportCoords(target);
    const rotation = this.calcRotation(coords);
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
    return Object.assign(new this(transform, this.buildBBoxPlanes(target)), {
      // angle,
      rotation,
    });
  }

  static legacy(target: ObjectGeometry) {
    const coords = this.getViewportCoords(target);
    const rotation = this.calcRotation(coords);
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
    const legacyBBox = makeBoundingBoxFromPoints(Object.values(legacyCoords));
    const transform = calcBaseChangeMatrix(
      undefined,
      [new Point(1, 0).rotate(rotation), new Point(0, 1).rotate(rotation)],
      center
    );
    return {
      angle: radiansToDegrees(rotation),
      rotation,
      getCoords() {
        return legacyCoords;
      },
      getTransformation() {
        return transform;
      },
      getBBox() {
        return legacyBBox;
      },
      getDimensionsVector() {
        return new Point(legacyBBox.width, legacyBBox.height);
      },
      transform(ctx: CanvasRenderingContext2D) {
        ctx.transform(...transform);
      },
    };
  }

  static transformed(target: ObjectGeometry) {
    const coords = this.getViewportCoords(target);
    const transform = calcBaseChangeMatrix(
      undefined,
      [createVector(coords.tl, coords.tr), createVector(coords.tl, coords.bl)],
      coords.tl.midPointFrom(coords.br)
    );
    return new this(transform, this.buildBBoxPlanes(target));
  }
}

/**
 * Perf opt
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
