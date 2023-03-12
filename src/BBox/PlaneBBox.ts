import { Point } from '../Point';
import { TBBox, TCornerPoint, TMat2D } from '../typedefs';
import { mapValues } from '../util/internals';
import { makeBoundingBoxFromPoints } from '../util/misc/boundingBoxFromPoints';
import { invertTransform } from '../util/misc/matrix';
import { calcBaseChangeMatrix } from '../util/misc/planeChange';
import {
  OriginDescriptor,
  resolveOriginPoint,
} from '../util/misc/resolveOrigin';
import { calcVectorRotation, createVector } from '../util/misc/vectors';

const CENTER_ORIGIN = { x: 'center', y: 'center' } as const;

/**
 * This class is in an abstraction allowing us to operate inside a plane with origin values [-0.5, 0.5]
 * instead of using real values that depend on the plane.
 *
 * Simplifies complex layout/geometry calculations.
 */
export class PlaneBBox {
  private readonly originTransformation: TMat2D;

  protected constructor(transform: TMat2D) {
    this.originTransformation = Object.freeze([...transform]) as TMat2D;
  }

  getTransformation() {
    return this.originTransformation;
  }

  getCoords() {
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

  getBBox() {
    return makeBoundingBoxFromPoints(Object.values(this.getCoords()));
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
    return PlaneBBox.calcRotation(this.getCoords());
  }

  pointFromOrigin(origin: Point) {
    return origin.transform(this.getTransformation());
  }

  pointToOrigin(point: Point) {
    return point.transform(invertTransform(this.getTransformation()));
  }

  /**
   * This is where point and vector meet since point is a vector from its origin
   *
   * Let `O` be the origin, `P` the point, `O'` the desired origin, `P'` the point described by `O'`
   * ```latex
   * P = OP = (left, top)
   * P' = O'P = O'O + OP
   * ```
   *
   * @returns a point that is positioned in the same place as {@link point} but refers to {@link to} as its origin instead of {@link from}
   */
  changeOrigin(
    point: Point,
    from: OriginDescriptor = CENTER_ORIGIN,
    to: OriginDescriptor = CENTER_ORIGIN
  ) {
    return point.add(
      this.vectorFromOrigin(
        createVector(resolveOriginPoint(to), resolveOriginPoint(from))
      )
    );
  }

  vectorFromOrigin(originVector: Point) {
    return originVector.transform(this.getTransformation(), true);
  }

  vectorToOrigin(vector: Point) {
    return vector.transform(invertTransform(this.getTransformation()), true);
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
}
