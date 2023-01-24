import { halfPI } from '../../../constants';
import { IPoint, Point } from '../../../Point';
import { degreesToRadians } from '../radiansDegreesConversion';
import {
  calcAngleBetweenVectors,
  calcVectorRotation,
  createVector,
} from '../vectors';
import { TProjectStrokeOnPointsOptions, TProjection } from './types';

/**
 * @see https://github.com/fabricjs/fabric.js/pull/8344
 */
export abstract class StrokeProjectionsBase {
  declare options: TProjectStrokeOnPointsOptions;
  declare scale: Point;
  declare strokeUniformScalar: Point;
  declare strokeProjectionMagnitude: number;

  static getAcuteAngleFactor(vector1: Point, vector2?: Point) {
    const angle = vector2
      ? calcAngleBetweenVectors(vector1, vector2)
      : calcVectorRotation(vector1);
    return Math.abs(angle) < halfPI ? -1 : 1;
  }

  constructor(options: TProjectStrokeOnPointsOptions) {
    this.options = options;
    this.strokeProjectionMagnitude = this.options.strokeWidth / 2;
    this.scale = new Point(this.options.scaleX, this.options.scaleY);
    this.strokeUniformScalar = this.options.strokeUniform
      ? new Point(1 / this.options.scaleX, 1 / this.options.scaleY)
      : new Point(1, 1);
  }

  /**
   * When the stroke is uniform, scaling affects the arrangement of points. So we must take it into account.
   */
  protected createSideVector(from: IPoint, to: IPoint) {
    const v = createVector(from, to);
    return this.options.strokeUniform ? v.multiply(this.scale) : v;
  }

  protected abstract calcOrthogonalProjection(
    from: Point,
    to: Point,
    magnitude?: number
  ): Point;

  protected projectOrthogonally(from: Point, to: Point, magnitude?: number) {
    return this.applySkew(
      from.add(this.calcOrthogonalProjection(from, to, magnitude))
    );
  }

  protected isSkewed() {
    return this.options.skewX !== 0 || this.options.skewY !== 0;
  }

  protected applySkew(point: Point) {
    const p = new Point(point);
    // skewY must be applied before skewX as this distortion affects skewX calculation
    p.y += p.x * Math.tan(degreesToRadians(this.options.skewY));
    p.x += p.y * Math.tan(degreesToRadians(this.options.skewX));
    return p;
  }

  protected scaleUnitVector(unitVector: Point, scalar: number) {
    return unitVector.multiply(this.strokeUniformScalar).scalarMultiply(scalar);
  }

  protected abstract projectPoints(): Point[];

  public abstract project(): TProjection[];
}
