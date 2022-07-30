
/**
 * Adaptation of work of Kevin Lindsey(kevin@kevlindev.com)
 */
export class Point {

  x: number

  y: number

  type = 'point'

  static toPoint(from) {
    return new Point(from.x, from.y);
  }

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Adds another point to this one and returns another one
   * @param {Point} that
   * @return {Point} new Point instance with added values
   */
  add(that) {
    return new Point(this.x + that.x, this.y + that.y);
  }

  /**
   * Adds another point to this one
   * @param {Point} that
   * @return {Point} thisArg
   * @chainable
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
   */
  scalarAddEquals(scalar) {
    this.x += scalar;
    this.y += scalar;
    return this;
  }

  /**
   * Subtracts another point from this point and returns a new one
   * @param {Point} that
   * @return {Point} new Point object with subtracted values
   */
  subtract(that) {
    return new Point(this.x - that.x, this.y - that.y);
  }

  /**
   * Subtracts another point from this point
   * @param {Point} that
   * @return {Point} thisArg
   * @chainable
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
   */
  scalarSubtractEquals(scalar) {
    this.x -= scalar;
    this.y -= scalar;
    return this;
  }

  /**
   * Multiplies this point by another value and returns a new one
   * @param {Point} that
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
   */
  scalarMultiplyEquals(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /**
   * Divides this point by another and returns a new one
   * @param {Point} that
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
   */
  scalarDivideEquals(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  /**
   * Returns true if this point is equal to another one
   * @param {Point} that
   * @return {Boolean}
   */
  eq(that) {
    return (this.x === that.x && this.y === that.y);
  }

  /**
   * Returns true if this point is less than another one
   * @param {Point} that
   * @return {Boolean}
   */
  lt(that) {
    return (this.x < that.x && this.y < that.y);
  }

  /**
   * Returns true if this point is less than or equal to another one
   * @param {Point} that
   * @return {Boolean}
   */
  lte(that) {
    return (this.x <= that.x && this.y <= that.y);
  }

  /**

   * Returns true if this point is greater another one
   * @param {Point} that
   * @return {Boolean}
   */
  gt(that) {
    return (this.x > that.x && this.y > that.y);
  }

  /**
   * Returns true if this point is greater than or equal to another one
   * @param {Point} that
   * @return {Boolean}
   */
  gte(that) {
    return (this.x >= that.x && this.y >= that.y);
  }

  /**
   * Returns new point which is the result of linear interpolation with this one and another one
   * @param {Point} that
   * @param {Number} t , position of interpolation, between 0 and 1 default 0.5
   * @return {Point}
   */
  lerp(that, t) {
    if (typeof t === 'undefined') {
      t = 0.5;
    }
    t = Math.max(Math.min(1, t), 0);
    return new Point(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
  }

  /**
   * Returns distance from this point and another one
   * @param {Point} that
   * @return {Number}
   */
  distanceFrom(that) {
    var dx = this.x - that.x,
      dy = this.y - that.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Returns the point between this point and another one
   * @param {Point} that
   * @return {Point}
   */
  midPointFrom(that) {
    return this.lerp(that);
  }

  /**
   * Returns a new point which is the min of this and another one
   * @param {Point} that
   * @return {Point}
   */
  min(that) {
    return new Point(Math.min(this.x, that.x), Math.min(this.y, that.y));
  }

  /**
   * Returns a new point which is the max of this and another one
   * @param {Point} that
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
    return this.x + ',' + this.y;
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
   * @param {Point} that
   * @chainable
   */
  setFromPoint(that) {
    this.x = that.x;
    this.y = that.y;
    return this;
  }

  /**
   * Swaps x/y of this point and another point
   * @param {Point} that
   */
  swap(that) {
    var x = this.x,
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
}

