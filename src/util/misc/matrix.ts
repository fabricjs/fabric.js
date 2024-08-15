import { iMatrix } from '../../constants';
import type { XY } from '../../Point';
import { Point } from '../../Point';
import type { TDegree, TRadian, TMat2D } from '../../typedefs';
import { cos } from './cos';
import { degreesToRadians, radiansToDegrees } from './radiansDegreesConversion';
import { sin } from './sin';

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
 * @deprecated use {@link Point#transform}
 * @param  {Point | XY} p The point to transform
 * @param  {Array} t The transform
 * @param  {Boolean} [ignoreOffset] Indicates that the offset should not be applied
 * @return {Point} The transformed point
 */
export const transformPoint = (
  p: XY,
  t: TMat2D,
  ignoreOffset?: boolean,
): Point => new Point(p).transform(t, ignoreOffset);

/**
 * Invert transformation t
 * @param {Array} t The transform
 * @return {Array} The inverted transform
 */
export const invertTransform = (t: TMat2D): TMat2D => {
  const a = 1 / (t[0] * t[3] - t[1] * t[2]),
    r = [a * t[3], -a * t[1], -a * t[2], a * t[0], 0, 0] as TMat2D,
    { x, y } = new Point(t[4], t[5]).transform(r, true);
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
  is2x2?: boolean,
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
 * Multiplies {@link matrices} such that a matrix defines the plane for the rest of the matrices **after** it
 *
 * `multiplyTransformMatrixArray([A, B, C, D])` is equivalent to `A(B(C(D)))`
 *
 * @param matrices an array of matrices
 * @param [is2x2] flag to multiply matrices as 2x2 matrices
 * @returns the multiplication product
 */
export const multiplyTransformMatrixArray = (
  matrices: (TMat2D | undefined | null | false)[],
  is2x2?: boolean,
) =>
  matrices.reduceRight(
    (product: TMat2D, curr) =>
      curr && product
        ? multiplyTransformMatrices(curr, product, is2x2)
        : curr || product,
    undefined as unknown as TMat2D,
  ) || iMatrix.concat();

export const calcPlaneRotation = ([a, b]: TMat2D) =>
  Math.atan2(b, a) as TRadian;

/**
 * Decomposes standard 2x3 matrix into transform components
 * @param  {TMat2D} a transformMatrix
 * @return {Object} Components of transform
 */
export const qrDecompose = (a: TMat2D): TQrDecomposeOut => {
  const angle = calcPlaneRotation(a),
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
export const createTranslateMatrix = (x: number, y = 0): TMat2D => [
  1,
  0,
  0,
  1,
  x,
  y,
];

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
export function createRotateMatrix(
  { angle = 0 }: TRotateMatrixArgs = {},
  { x = 0, y = 0 }: Partial<XY> = {},
): TMat2D {
  const angleRadiant = degreesToRadians(angle),
    cosValue = cos(angleRadiant),
    sinValue = sin(angleRadiant);
  return [
    cosValue,
    sinValue,
    -sinValue,
    cosValue,
    x ? x - (cosValue * x - sinValue * y) : 0,
    y ? y - (sinValue * x + cosValue * y) : 0,
  ];
}

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
export const createScaleMatrix = (x: number, y: number = x): TMat2D => [
  x,
  0,
  0,
  y,
  0,
  0,
];

export const angleToSkew = (angle: TDegree) =>
  Math.tan(degreesToRadians(angle));

export const skewToAngle = (value: TRadian) =>
  radiansToDegrees(Math.atan(value));

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
export const createSkewXMatrix = (skewValue: TDegree): TMat2D => [
  1,
  0,
  angleToSkew(skewValue),
  1,
  0,
  0,
];

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
export const createSkewYMatrix = (skewValue: TDegree): TMat2D => [
  1,
  angleToSkew(skewValue),
  0,
  1,
  0,
  0,
];

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
  let matrix = createScaleMatrix(
    flipX ? -scaleX : scaleX,
    flipY ? -scaleY : scaleY,
  );
  if (skewX) {
    matrix = multiplyTransformMatrices(matrix, createSkewXMatrix(skewX), true);
  }
  if (skewY) {
    matrix = multiplyTransformMatrices(matrix, createSkewYMatrix(skewY), true);
  }
  return matrix;
};

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
export const composeMatrix = (options: TComposeMatrixArgs): TMat2D => {
  const { translateX = 0, translateY = 0, angle = 0 as TDegree } = options;
  let matrix = createTranslateMatrix(translateX, translateY);
  if (angle) {
    matrix = multiplyTransformMatrices(matrix, createRotateMatrix({ angle }));
  }
  const scaleMatrix = calcDimensionsMatrix(options);
  if (!isIdentityMatrix(scaleMatrix)) {
    matrix = multiplyTransformMatrices(matrix, scaleMatrix);
  }
  return matrix;
};
