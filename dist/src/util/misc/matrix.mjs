import { iMatrix } from '../../constants.mjs';
import { Point } from '../../Point.mjs';
import { cos } from './cos.mjs';
import { radiansToDegrees, degreesToRadians } from './radiansDegreesConversion.mjs';
import { sin } from './sin.mjs';

const isIdentityMatrix = mat => mat.every((value, index) => value === iMatrix[index]);

/**
 * Apply transform t to point p
 * @deprecated use {@link Point#transform}
 * @param  {Point | XY} p The point to transform
 * @param  {Array} t The transform
 * @param  {Boolean} [ignoreOffset] Indicates that the offset should not be applied
 * @return {Point} The transformed point
 */
const transformPoint = (p, t, ignoreOffset) => new Point(p).transform(t, ignoreOffset);

/**
 * Invert transformation t
 * @param {Array} t The transform
 * @return {Array} The inverted transform
 */
const invertTransform = t => {
  const a = 1 / (t[0] * t[3] - t[1] * t[2]),
    r = [a * t[3], -a * t[1], -a * t[2], a * t[0], 0, 0],
    {
      x,
      y
    } = new Point(t[4], t[5]).transform(r, true);
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
const multiplyTransformMatrices = (a, b, is2x2) => [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], is2x2 ? 0 : a[0] * b[4] + a[2] * b[5] + a[4], is2x2 ? 0 : a[1] * b[4] + a[3] * b[5] + a[5]];

/**
 * Multiplies {@link matrices} such that a matrix defines the plane for the rest of the matrices **after** it
 *
 * `multiplyTransformMatrixArray([A, B, C, D])` is equivalent to `A(B(C(D)))`
 *
 * @param matrices an array of matrices
 * @param [is2x2] flag to multiply matrices as 2x2 matrices
 * @returns the multiplication product
 */
const multiplyTransformMatrixArray = (matrices, is2x2) => matrices.reduceRight((product, curr) => curr && product ? multiplyTransformMatrices(curr, product, is2x2) : curr || product, undefined) || iMatrix.concat();
const calcPlaneRotation = _ref => {
  let [a, b] = _ref;
  return Math.atan2(b, a);
};

/**
 * Decomposes standard 2x3 matrix into transform components
 * @param  {TMat2D} a transformMatrix
 * @return {Object} Components of transform
 */
const qrDecompose = a => {
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
    skewY: 0,
    translateX: a[4] || 0,
    translateY: a[5] || 0
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
const createTranslateMatrix = function (x) {
  let y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return [1, 0, 0, 1, x, y];
};

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
function createRotateMatrix() {
  let {
    angle = 0
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let {
    x = 0,
    y = 0
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const angleRadiant = degreesToRadians(angle),
    cosValue = cos(angleRadiant),
    sinValue = sin(angleRadiant);
  return [cosValue, sinValue, -sinValue, cosValue, x ? x - (cosValue * x - sinValue * y) : 0, y ? y - (sinValue * x + cosValue * y) : 0];
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
const createScaleMatrix = function (x) {
  let y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
  return [x, 0, 0, y, 0, 0];
};
const angleToSkew = angle => Math.tan(degreesToRadians(angle));

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
const createSkewXMatrix = skewValue => [1, 0, angleToSkew(skewValue), 1, 0, 0];

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
const createSkewYMatrix = skewValue => [1, angleToSkew(skewValue), 0, 1, 0, 0];

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
const calcDimensionsMatrix = _ref2 => {
  let {
    scaleX = 1,
    scaleY = 1,
    flipX = false,
    flipY = false,
    skewX = 0,
    skewY = 0
  } = _ref2;
  let matrix = createScaleMatrix(flipX ? -scaleX : scaleX, flipY ? -scaleY : scaleY);
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
const composeMatrix = options => {
  const {
    translateX = 0,
    translateY = 0,
    angle = 0
  } = options;
  let matrix = createTranslateMatrix(translateX, translateY);
  if (angle) {
    matrix = multiplyTransformMatrices(matrix, createRotateMatrix({
      angle
    }));
  }
  const scaleMatrix = calcDimensionsMatrix(options);
  if (!isIdentityMatrix(scaleMatrix)) {
    matrix = multiplyTransformMatrices(matrix, scaleMatrix);
  }
  return matrix;
};

export { angleToSkew, calcDimensionsMatrix, calcPlaneRotation, composeMatrix, createRotateMatrix, createScaleMatrix, createSkewXMatrix, createSkewYMatrix, createTranslateMatrix, invertTransform, isIdentityMatrix, multiplyTransformMatrices, multiplyTransformMatrixArray, qrDecompose, transformPoint };
//# sourceMappingURL=matrix.mjs.map
