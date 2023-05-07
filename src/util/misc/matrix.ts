import { iMatrix } from '../../constants';
import { scaleMatrix } from '../../parser/scaleMatrix';
import { skewXMatrix, skewYMatrix } from '../../parser/skewMatrix';
import { XY, Point } from '../../Point';
import { TDegree, TMat2D } from '../../typedefs';
import { cos } from './cos';
import { degreesToRadians, radiansToDegrees } from './radiansDegreesConversion';
import { sin } from './sin';

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

export type TComposeMatrixArgs = TTranslateMatrixArgs &
  TRotateMatrixArgs &
  TScaleMatrixArgs;

export type TQrDecomposeOut = Required<
  Omit<TComposeMatrixArgs, 'flipX' | 'flipY'>
>;

export const isIdentityMatrix = (mat: TMat2D) =>
  mat.every((value, index) => value === iMatrix[index]);

/**
 * Apply transform t to point p
 * @param  {Point | XY} p The point to transform
 * @param  {Array} t The transform
 * @param  {Boolean} [ignoreOffset] Indicates that the offset should not be applied
 * @return {Point} The transformed point
 */
export const transformPoint = (
  p: XY,
  t: TMat2D,
  ignoreOffset?: boolean
): Point => new Point(p).transform(t, ignoreOffset);

/**
 * Invert transformation t
 * @param {Array} t The transform
 * @return {Array} The inverted transform
 */
export const invertTransform = (t: TMat2D): TMat2D => {
  const a = 1 / (t[0] * t[3] - t[1] * t[2]),
    r = [a * t[3], -a * t[1], -a * t[2], a * t[0], 0, 0] as TMat2D,
    { x, y } = transformPoint(new Point(t[4], t[5]), r, true);
  r[4] = -x;
  r[5] = -y;
  return r;
};

/**
 * Multiply matrix A by matrix B to nest transformations
 * @param  {TMat2D} a First transformMatrix
 * @param  {TMat2D} b Second transformMatrix
 * @param  {Boolean} is2x2 flag to multiply matrices as 2x2 matrices
 * @return {TMat2D} The product of the two transform matrices
 */
export const multiplyTransformMatrices = (
  a: TMat2D,
  b: TMat2D,
  is2x2?: boolean
): TMat2D =>
  [
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    is2x2 ? 0 : a[0] * b[4] + a[2] * b[5] + a[4],
    is2x2 ? 0 : a[1] * b[4] + a[3] * b[5] + a[5],
  ] as TMat2D;

/**
 * Decomposes standard 2x3 matrix into transform components
 * @param  {TMat2D} a transformMatrix
 * @return {Object} Components of transform
 */
export const qrDecompose = (a: TMat2D): TQrDecomposeOut => {
  const angle = Math.atan2(a[1], a[0]),
    denom = Math.pow(a[0], 2) + Math.pow(a[1], 2),
    scaleX = Math.sqrt(denom),
    scaleY = (a[0] * a[3] - a[2] * a[1]) / scaleX,
    skewX = Math.atan2(a[0] * a[2] + a[1] * a[3], denom);
  return {
    angle: radiansToDegrees(angle),
    scaleX,
    scaleY,
    skewX: radiansToDegrees(skewX),
    skewY: 0 as TDegree,
    translateX: a[4] || 0,
    translateY: a[5] || 0,
  };
};

/**
 * Returns a transform matrix starting from an object of the same kind of
 * the one returned from qrDecompose, useful also if you want to calculate some
 * transformations from an object that is not enlived yet
 * @param  {Object} options
 * @param  {Number} [options.angle] angle in degrees
 * @return {TMat2D} transform matrix
 */
export const calcRotateMatrix = ({ angle }: TRotateMatrixArgs): TMat2D => {
  if (!angle) {
    return iMatrix;
  }
  const theta = degreesToRadians(angle),
    cosin = cos(theta),
    sinus = sin(theta);
  return [cosin, sinus, -sinus, cosin, 0, 0];
};

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
export const calcDimensionsMatrix = ({
  scaleX = 1,
  scaleY = 1,
  flipX = false,
  flipY = false,
  skewX = 0 as TDegree,
  skewY = 0 as TDegree,
}: TScaleMatrixArgs) => {
  let scaleMat = scaleMatrix(
    flipX ? -scaleX : scaleX,
    flipY ? -scaleY : scaleY
  );
  if (skewX) {
    scaleMat = multiplyTransformMatrices(scaleMat, skewXMatrix(skewX), true);
  }
  if (skewY) {
    scaleMat = multiplyTransformMatrices(scaleMat, skewYMatrix(skewY), true);
  }
  return scaleMat;
};

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
export const composeMatrix = ({
  translateX = 0,
  translateY = 0,
  angle = 0 as TDegree,
  ...otherOptions
}: TComposeMatrixArgs): TMat2D => {
  let matrix = [1, 0, 0, 1, translateX, translateY] as TMat2D;
  if (angle) {
    matrix = multiplyTransformMatrices(matrix, calcRotateMatrix({ angle }));
  }
  const scaleMatrix = calcDimensionsMatrix(otherOptions);
  if (scaleMatrix !== iMatrix) {
    matrix = multiplyTransformMatrices(matrix, scaleMatrix);
  }
  return matrix;
};
