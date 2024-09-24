import type { TMat2D, TRadian } from './typedefs';
export interface XY {
    x: number;
    y: number;
}
/**
 * Adaptation of work of Kevin Lindsey(kevin@kevlindev.com)
 */
export declare class Point implements XY {
    x: number;
    y: number;
    constructor();
    constructor(x: number, y: number);
    constructor(point?: XY);
    /**
     * Adds another point to this one and returns another one
     * @param {XY} that
     * @return {Point} new Point instance with added values
     */
    add(that: XY): Point;
    /**
     * Adds another point to this one
     * @param {XY} that
     * @return {Point} thisArg
     * @chainable
     * @deprecated
     */
    addEquals(that: XY): Point;
    /**
     * Adds value to this point and returns a new one
     * @param {Number} scalar
     * @return {Point} new Point with added value
     */
    scalarAdd(scalar: number): Point;
    /**
     * Adds value to this point
     * @param {Number} scalar
     * @return {Point} thisArg
     * @chainable
     * @deprecated
     */
    scalarAddEquals(scalar: number): Point;
    /**
     * Subtracts another point from this point and returns a new one
     * @param {XY} that
     * @return {Point} new Point object with subtracted values
     */
    subtract(that: XY): Point;
    /**
     * Subtracts another point from this point
     * @param {XY} that
     * @return {Point} thisArg
     * @chainable
     * @deprecated
     */
    subtractEquals(that: XY): Point;
    /**
     * Subtracts value from this point and returns a new one
     * @param {Number} scalar
     * @return {Point}
     */
    scalarSubtract(scalar: number): Point;
    /**
     * Subtracts value from this point
     * @param {Number} scalar
     * @return {Point} thisArg
     * @chainable
     * @deprecated
     */
    scalarSubtractEquals(scalar: number): Point;
    /**
     * Multiplies this point by another value and returns a new one
     * @param {XY} that
     * @return {Point}
     */
    multiply(that: XY): Point;
    /**
     * Multiplies this point by a value and returns a new one
     * @param {Number} scalar
     * @return {Point}
     */
    scalarMultiply(scalar: number): Point;
    /**
     * Multiplies this point by a value
     * @param {Number} scalar
     * @return {Point} thisArg
     * @chainable
     * @deprecated
     */
    scalarMultiplyEquals(scalar: number): Point;
    /**
     * Divides this point by another and returns a new one
     * @param {XY} that
     * @return {Point}
     */
    divide(that: XY): Point;
    /**
     * Divides this point by a value and returns a new one
     * @param {Number} scalar
     * @return {Point}
     */
    scalarDivide(scalar: number): Point;
    /**
     * Divides this point by a value
     * @param {Number} scalar
     * @return {Point} thisArg
     * @chainable
     * @deprecated
     */
    scalarDivideEquals(scalar: number): Point;
    /**
     * Returns true if this point is equal to another one
     * @param {XY} that
     * @return {Boolean}
     */
    eq(that: XY): boolean;
    /**
     * Returns true if this point is less than another one
     * @param {XY} that
     * @return {Boolean}
     */
    lt(that: XY): boolean;
    /**
     * Returns true if this point is less than or equal to another one
     * @param {XY} that
     * @return {Boolean}
     */
    lte(that: XY): boolean;
    /**
  
     * Returns true if this point is greater another one
     * @param {XY} that
     * @return {Boolean}
     */
    gt(that: XY): boolean;
    /**
     * Returns true if this point is greater than or equal to another one
     * @param {XY} that
     * @return {Boolean}
     */
    gte(that: XY): boolean;
    /**
     * Returns new point which is the result of linear interpolation with this one and another one
     * @param {XY} that
     * @param {Number} t , position of interpolation, between 0 and 1 default 0.5
     * @return {Point}
     */
    lerp(that: XY, t?: number): Point;
    /**
     * Returns distance from this point and another one
     * @param {XY} that
     * @return {Number}
     */
    distanceFrom(that: XY): number;
    /**
     * Returns the point between this point and another one
     * @param {XY} that
     * @return {Point}
     */
    midPointFrom(that: XY): Point;
    /**
     * Returns a new point which is the min of this and another one
     * @param {XY} that
     * @return {Point}
     */
    min(that: XY): Point;
    /**
     * Returns a new point which is the max of this and another one
     * @param {XY} that
     * @return {Point}
     */
    max(that: XY): Point;
    /**
     * Returns string representation of this point
     * @return {String}
     */
    toString(): string;
    /**
     * Sets x/y of this point
     * @param {Number} x
     * @param {Number} y
     * @chainable
     */
    setXY(x: number, y: number): this;
    /**
     * Sets x of this point
     * @param {Number} x
     * @chainable
     */
    setX(x: number): this;
    /**
     * Sets y of this point
     * @param {Number} y
     * @chainable
     */
    setY(y: number): this;
    /**
     * Sets x/y of this point from another point
     * @param {XY} that
     * @chainable
     */
    setFromPoint(that: XY): this;
    /**
     * Swaps x/y of this point and another point
     * @param {XY} that
     */
    swap(that: XY): void;
    /**
     * return a cloned instance of the point
     * @return {Point}
     */
    clone(): Point;
    /**
     * Rotates `point` around `origin` with `radians`
     * @static
     * @memberOf fabric.util
     * @param {XY} origin The origin of the rotation
     * @param {TRadian} radians The radians of the angle for the rotation
     * @return {Point} The new rotated point
     */
    rotate(radians: TRadian, origin?: XY): Point;
    /**
     * Apply transform t to point p
     * @static
     * @memberOf fabric.util
     * @param  {TMat2D} t The transform
     * @param  {Boolean} [ignoreOffset] Indicates that the offset should not be applied
     * @return {Point} The transformed point
     */
    transform(t: TMat2D, ignoreOffset?: boolean): Point;
}
export declare const ZERO: Point;
//# sourceMappingURL=Point.d.ts.map