import { cos } from './util/misc/cos.mjs';
import { sin } from './util/misc/sin.mjs';

/**
 * Adaptation of work of Kevin Lindsey(kevin@kevlindev.com)
 */
class Point {
  constructor() {
    let arg0 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (typeof arg0 === 'object') {
      this.x = arg0.x;
      this.y = arg0.y;
    } else {
      this.x = arg0;
      this.y = y;
    }
  }

  /**
   * Adds another point to this one and returns another one
   * @param {XY} that
   * @return {Point} new Point instance with added values
   */
  add(that) {
    return new Point(this.x + that.x, this.y + that.y);
  }

  /**
   * Adds another point to this one
   * @param {XY} that
   * @return {Point} thisArg
   * @chainable
   * @deprecated
   */
  addEquals(that) {
    this.x += that.x;
    this.y += that.y;
    return this;
  }

  /**
   * Adds value to this point and returns a new one
   * @param {Number} scalar
   * @return {Point} new Point with added value
   */
  scalarAdd(scalar) {
    return new Point(this.x + scalar, this.y + scalar);
  }

  /**
   * Adds value to this point
   * @param {Number} scalar
   * @return {Point} thisArg
   * @chainable
   * @deprecated
   */
  scalarAddEquals(scalar) {
    this.x += scalar;
    this.y += scalar;
    return this;
  }

  /**
   * Subtracts another point from this point and returns a new one
   * @param {XY} that
   * @return {Point} new Point object with subtracted values
   */
  subtract(that) {
    return new Point(this.x - that.x, this.y - that.y);
  }

  /**
   * Subtracts another point from this point
   * @param {XY} that
   * @return {Point} thisArg
   * @chainable
   * @deprecated
   */
  subtractEquals(that) {
    this.x -= that.x;
    this.y -= that.y;
    return this;
  }

  /**
   * Subtracts value from this point and returns a new one
   * @param {Number} scalar
   * @return {Point}
   */
  scalarSubtract(scalar) {
    return new Point(this.x - scalar, this.y - scalar);
  }

  /**
   * Subtracts value from this point
   * @param {Number} scalar
   * @return {Point} thisArg
   * @chainable
   * @deprecated
   */
  scalarSubtractEquals(scalar) {
    this.x -= scalar;
    this.y -= scalar;
    return this;
  }

  /**
   * Multiplies this point by another value and returns a new one
   * @param {XY} that
   * @return {Point}
   */
  multiply(that) {
    return new Point(this.x * that.x, this.y * that.y);
  }

  /**
   * Multiplies this point by a value and returns a new one
   * @param {Number} scalar
   * @return {Point}
   */
  scalarMultiply(scalar) {
    return new Point(this.x * scalar, this.y * scalar);
  }

  /**
   * Multiplies this point by a value
   * @param {Number} scalar
   * @return {Point} thisArg
   * @chainable
   * @deprecated
   */
  scalarMultiplyEquals(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /**
   * Divides this point by another and returns a new one
   * @param {XY} that
   * @return {Point}
   */
  divide(that) {
    return new Point(this.x / that.x, this.y / that.y);
  }

  /**
   * Divides this point by a value and returns a new one
   * @param {Number} scalar
   * @return {Point}
   */
  scalarDivide(scalar) {
    return new Point(this.x / scalar, this.y / scalar);
  }

  /**
   * Divides this point by a value
   * @param {Number} scalar
   * @return {Point} thisArg
   * @chainable
   * @deprecated
   */
  scalarDivideEquals(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  /**
   * Returns true if this point is equal to another one
   * @param {XY} that
   * @return {Boolean}
   */
  eq(that) {
    return this.x === that.x && this.y === that.y;
  }

  /**
   * Returns true if this point is less than another one
   * @param {XY} that
   * @return {Boolean}
   */
  lt(that) {
    return this.x < that.x && this.y < that.y;
  }

  /**
   * Returns true if this point is less than or equal to another one
   * @param {XY} that
   * @return {Boolean}
   */
  lte(that) {
    return this.x <= that.x && this.y <= that.y;
  }

  /**
    * Returns true if this point is greater another one
   * @param {XY} that
   * @return {Boolean}
   */
  gt(that) {
    return this.x > that.x && this.y > that.y;
  }

  /**
   * Returns true if this point is greater than or equal to another one
   * @param {XY} that
   * @return {Boolean}
   */
  gte(that) {
    return this.x >= that.x && this.y >= that.y;
  }

  /**
   * Returns new point which is the result of linear interpolation with this one and another one
   * @param {XY} that
   * @param {Number} t , position of interpolation, between 0 and 1 default 0.5
   * @return {Point}
   */
  lerp(that) {
    let t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
    t = Math.max(Math.min(1, t), 0);
    return new Point(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
  }

  /**
   * Returns distance from this point and another one
   * @param {XY} that
   * @return {Number}
   */
  distanceFrom(that) {
    const dx = this.x - that.x,
      dy = this.y - that.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Returns the point between this point and another one
   * @param {XY} that
   * @return {Point}
   */
  midPointFrom(that) {
    return this.lerp(that);
  }

  /**
   * Returns a new point which is the min of this and another one
   * @param {XY} that
   * @return {Point}
   */
  min(that) {
    return new Point(Math.min(this.x, that.x), Math.min(this.y, that.y));
  }

  /**
   * Returns a new point which is the max of this and another one
   * @param {XY} that
   * @return {Point}
   */
  max(that) {
    return new Point(Math.max(this.x, that.x), Math.max(this.y, that.y));
  }

  /**
   * Returns string representation of this point
   * @return {String}
   */
  toString() {
    return "".concat(this.x, ",").concat(this.y);
  }

  /**
   * Sets x/y of this point
   * @param {Number} x
   * @param {Number} y
   * @chainable
   */
  setXY(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Sets x of this point
   * @param {Number} x
   * @chainable
   */
  setX(x) {
    this.x = x;
    return this;
  }

  /**
   * Sets y of this point
   * @param {Number} y
   * @chainable
   */
  setY(y) {
    this.y = y;
    return this;
  }

  /**
   * Sets x/y of this point from another point
   * @param {XY} that
   * @chainable
   */
  setFromPoint(that) {
    this.x = that.x;
    this.y = that.y;
    return this;
  }

  /**
   * Swaps x/y of this point and another point
   * @param {XY} that
   */
  swap(that) {
    const x = this.x,
      y = this.y;
    this.x = that.x;
    this.y = that.y;
    that.x = x;
    that.y = y;
  }

  /**
   * return a cloned instance of the point
   * @return {Point}
   */
  clone() {
    return new Point(this.x, this.y);
  }

  /**
   * Rotates `point` around `origin` with `radians`
   * @static
   * @memberOf fabric.util
   * @param {XY} origin The origin of the rotation
   * @param {TRadian} radians The radians of the angle for the rotation
   * @return {Point} The new rotated point
   */
  rotate(radians) {
    let origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ZERO;
    // TODO benchmark and verify the add and subtract how much cost
    // and then in case early return if no origin is passed
    const sinus = sin(radians),
      cosinus = cos(radians);
    const p = this.subtract(origin);
    const rotated = new Point(p.x * cosinus - p.y * sinus, p.x * sinus + p.y * cosinus);
    return rotated.add(origin);
  }

  /**
   * Apply transform t to point p
   * @static
   * @memberOf fabric.util
   * @param  {TMat2D} t The transform
   * @param  {Boolean} [ignoreOffset] Indicates that the offset should not be applied
   * @return {Point} The transformed point
   */
  transform(t) {
    let ignoreOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return new Point(t[0] * this.x + t[2] * this.y + (ignoreOffset ? 0 : t[4]), t[1] * this.x + t[3] * this.y + (ignoreOffset ? 0 : t[5]));
  }
}
const ZERO = new Point(0, 0);

export { Point, ZERO };
//# sourceMappingURL=Point.mjs.map
