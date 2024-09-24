import type { XY } from '../../Point';
import { Point } from '../../Point';
import type { TDegree, TRadian, TMat2D } from '../../typedefs';
export type TRotateMatrixArgs = {
    angle?: TDegree;
};
export type TTranslateMatrixArgs = {
    translateX?: number;
    translateY?: number;
};
export type TScaleMatrixArgs = {
    scaleX?: number;
    scaleY?: number;
    flipX?: boolean;
    flipY?: boolean;
    skewX?: TDegree;
    skewY?: TDegree;
};
export type TComposeMatrixArgs = TTranslateMatrixArgs & TRotateMatrixArgs & TScaleMatrixArgs;
export type TQrDecomposeOut = Required<Omit<TComposeMatrixArgs, 'flipX' | 'flipY'>>;
export declare const isIdentityMatrix: (mat: TMat2D) => boolean;
/**
 * Apply transform t to point p
 * @deprecated use {@link Point#transform}
 * @param  {Point | XY} p The point to transform
 * @param  {Array} t The transform
 * @param  {Boolean} [ignoreOffset] Indicates that the offset should not be applied
 * @return {Point} The transformed point
 */
export declare const transformPoint: (p: XY, t: TMat2D, ignoreOffset?: boolean) => Point;
/**
 * Invert transformation t
 * @param {Array} t The transform
 * @return {Array} The inverted transform
 */
export declare const invertTransform: (t: TMat2D) => TMat2D;
/**
 * Multiply matrix A by matrix B to nest transformations
 * @param  {TMat2D} a First transformMatrix
 * @param  {TMat2D} b Second transformMatrix
 * @param  {Boolean} is2x2 flag to multiply matrices as 2x2 matrices
 * @return {TMat2D} The product of the two transform matrices
 */
export declare const multiplyTransformMatrices: (a: TMat2D, b: TMat2D, is2x2?: boolean) => TMat2D;
/**
 * Multiplies {@link matrices} such that a matrix defines the plane for the rest of the matrices **after** it
 *
 * `multiplyTransformMatrixArray([A, B, C, D])` is equivalent to `A(B(C(D)))`
 *
 * @param matrices an array of matrices
 * @param [is2x2] flag to multiply matrices as 2x2 matrices
 * @returns the multiplication product
 */
export declare const multiplyTransformMatrixArray: (matrices: (TMat2D | undefined | null | false)[], is2x2?: boolean) => TMat2D;
export declare const calcPlaneRotation: ([a, b]: TMat2D) => TRadian;
/**
 * Decomposes standard 2x3 matrix into transform components
 * @param  {TMat2D} a transformMatrix
 * @return {Object} Components of transform
 */
export declare const qrDecompose: (a: TMat2D) => TQrDecomposeOut;
/**
 * Generate a translation matrix
 *
 * A translation matrix in the form of
 * [ 1 0 x ]
 * [ 0 1 y ]
 * [ 0 0 1 ]
 *
 * See @link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#translate for more details
 *
 * @param {number} x translation on X axis
 * @param {number} [y] translation on Y axis
 * @returns {TMat2D} matrix
 */
export declare const createTranslateMatrix: (x: number, y?: number) => TMat2D;
/**
 * Generate a rotation matrix around around a point (x,y), defaulting to (0,0)
 *
 * A matrix in the form of
 * [cos(a) -sin(a) -x*cos(a)+y*sin(a)+x]
 * [sin(a)  cos(a) -x*sin(a)-y*cos(a)+y]
 * [0       0      1                 ]
 *
 *
 * @param {TDegree} angle rotation in degrees
 * @param {XY} [pivotPoint] pivot point to rotate around
 * @returns {TMat2D} matrix
 */
export declare function createRotateMatrix({ angle }?: TRotateMatrixArgs, { x, y }?: Partial<XY>): TMat2D;
/**
 * Generate a scale matrix around the point (0,0)
 *
 * A matrix in the form of
 * [x 0 0]
 * [0 y 0]
 * [0 0 1]
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#scale
 *
 * @param {number} x scale on X axis
 * @param {number} [y] scale on Y axis
 * @returns {TMat2D} matrix
 */
export declare const createScaleMatrix: (x: number, y?: number) => TMat2D;
export declare const angleToSkew: (angle: TDegree) => number;
export declare const skewToAngle: (value: TRadian) => TDegree;
/**
 * Generate a skew matrix for the X axis
 *
 * A matrix in the form of
 * [1 x 0]
 * [0 1 0]
 * [0 0 1]
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#skewx
 *
 * @param {TDegree} skewValue translation on X axis
 * @returns {TMat2D} matrix
 */
export declare const createSkewXMatrix: (skewValue: TDegree) => TMat2D;
/**
 * Generate a skew matrix for the Y axis
 *
 * A matrix in the form of
 * [1 0 0]
 * [y 1 0]
 * [0 0 1]
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#skewy
 *
 * @param {TDegree} skewValue translation on Y axis
 * @returns {TMat2D} matrix
 */
export declare const createSkewYMatrix: (skewValue: TDegree) => TMat2D;
/**
 * Returns a transform matrix starting from an object of the same kind of
 * the one returned from qrDecompose, useful also if you want to calculate some
 * transformations from an object that is not enlived yet.
 * is called DimensionsTransformMatrix because those properties are the one that influence
 * the size of the resulting box of the object.
 * @param  {Object} options
 * @param  {Number} [options.scaleX]
 * @param  {Number} [options.scaleY]
 * @param  {Boolean} [options.flipX]
 * @param  {Boolean} [options.flipY]
 * @param  {Number} [options.skewX]
 * @param  {Number} [options.skewY]
 * @return {Number[]} transform matrix
 */
export declare const calcDimensionsMatrix: ({ scaleX, scaleY, flipX, flipY, skewX, skewY, }: TScaleMatrixArgs) => TMat2D;
/**
 * Returns a transform matrix starting from an object of the same kind of
 * the one returned from qrDecompose, useful also if you want to calculate some
 * transformations from an object that is not enlived yet
 * Before changing this function look at: src/benchmarks/calcTransformMatrix.mjs
 * @param  {Object} options
 * @param  {Number} [options.angle]
 * @param  {Number} [options.scaleX]
 * @param  {Number} [options.scaleY]
 * @param  {Boolean} [options.flipX]
 * @param  {Boolean} [options.flipY]
 * @param  {Number} [options.skewX]
 * @param  {Number} [options.skewY]
 * @param  {Number} [options.translateX]
 * @param  {Number} [options.translateY]
 * @return {Number[]} transform matrix
 */
export declare const composeMatrix: (options: TComposeMatrixArgs) => TMat2D;
//# sourceMappingURL=matrix.d.ts.map