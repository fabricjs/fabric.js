import { IPoint, Point } from '../../point.class';
import { TDegree, TMat2D } from '../../typedefs';
type TRotateMatrixArgs = {
    angle?: TDegree;
};
type TTranslateMatrixArgs = {
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
/**
 * Apply transform t to point p
 * @param  {Point | IPoint} p The point to transform
 * @param  {Array} t The transform
 * @param  {Boolean} [ignoreOffset] Indicates that the offset should not be applied
 * @return {Point} The transformed point
 */
export declare const transformPoint: (p: IPoint, t: TMat2D, ignoreOffset?: boolean) => Point;
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
 * Decomposes standard 2x3 matrix into transform components
 * @param  {TMat2D} a transformMatrix
 * @return {Object} Components of transform
 */
export declare const qrDecompose: (a: TMat2D) => TQrDecomposeOut;
/**
 * Returns a transform matrix starting from an object of the same kind of
 * the one returned from qrDecompose, useful also if you want to calculate some
 * transformations from an object that is not enlived yet
 * @param  {Object} options
 * @param  {Number} [options.angle] angle in degrees
 * @return {TMat2D} transform matrix
 */
export declare const calcRotateMatrix: ({ angle }: TRotateMatrixArgs) => TMat2D;
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
export declare const composeMatrix: ({ translateX, translateY, angle, ...otherOptions }: TComposeMatrixArgs) => TMat2D;
export {};
//# sourceMappingURL=matrix.d.ts.map