import { XY, Point } from './Point';
import { TMat2D, TRadian } from './typedefs';

export class Vector extends Point {
  /**
   * x unit vector
   */
  static X = new Vector(1, 0);
  /**
   * y unit vector
   */
  static Y = new Vector(0, 1);

  static create(from: XY, to: XY) {
    return new Vector(to).subtract(from);
  }

  /**
   * Calculates the angle between 2 vectors
   * @param {Point} a
   * @param {Point} b
   * @returns the angle in radians from `a` to `b`
   */
  static calcAngleBetweenVectors(a: Vector, b: Vector): TRadian {
    const dot = a.x * b.x + a.y * b.y,
      det = a.x * b.y - a.y * b.x;
    return Math.atan2(det, dot) as TRadian;
  }

  /**
   * @param {Point} A
   * @param {Point} B
   * @param {Point} C
   * @returns {{ vector: Point, angle: TRadian }} vector representing the bisector of A and A's angle
   */
  static getBisector(A: Point, B: Point, C: Point) {
    const AB = this.create(A, B),
      AC = this.create(A, C),
      alpha = this.calcAngleBetweenVectors(AB, AC);
    return {
      vector: AB.rotate(alpha / 2).getUnitVector(),
      angle: alpha,
    };
  }

  asPoint() {
    return new Point(this);
  }

  magnitude() {
    return this.distanceFrom();
  }

  /**
   * @returns {Vector} vector representing the unit vector pointing to the direction of `v`
   */
  getUnitVector() {
    return this.scalarDivide(this.magnitude());
  }

  /**
   * @param {Boolean} [counterClockwise] the direction of the orthogonal vector, defaults to `true`
   * @returns {Vector} the unit orthogonal vector
   */
  getOrthonormalVector(counterClockwise = true) {
    return this.create(-this.y, this.x)
      .scalarMultiply(counterClockwise ? 1 : -1)
      .getUnitVector();
  }

  rotate(radians: TRadian) {
    return super.rotate(radians);
  }

  transform(t: TMat2D) {
    return super.transform(t, true);
  }

  /**
   * Calculates the angle between {@link from} and the vector
   * @returns the angle in radians of the vector
   */
  calcRotation(from: Vector = Vector.X) {
    return (this.constructor as typeof Vector).calcAngleBetweenVectors(
      from,
      this
    );
  }
}
