import { defineProperty as _defineProperty } from '../../../../_virtual/_rollupPluginBabelHelpers.mjs';
import { Point } from '../../../Point.mjs';
import { halfPI, twoMathPi } from '../../../constants.mjs';
import { degreesToRadians } from '../radiansDegreesConversion.mjs';
import { calcAngleBetweenVectors, calcVectorRotation, getUnitVector, rotateVector, getOrthonormalVector, magnitude, isBetweenVectors, crossProduct } from '../vectors.mjs';
import { StrokeProjectionsBase } from './StrokeProjectionsBase.mjs';

const zeroVector = new Point();

/**
 * class in charge of finding projections for each type of line join
 * @see {@link [Closed path projections at #8344](https://github.com/fabricjs/fabric.js/pull/8344#2-closed-path)}
 *
 * - MDN:
 *   - https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin
 *   - https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin
 * - Spec: https://svgwg.org/svg2-draft/painting.html#StrokeLinejoinProperty
 * - Playground to understand how the line joins works: https://hypertolosana.github.io/efficient-webgl-stroking/index.html
 * - View the calculated projections for each of the control points: https://codesandbox.io/s/project-stroke-points-with-context-to-trace-b8jc4j?file=/src/index.js
 *
 */
class StrokeLineJoinProjections extends StrokeProjectionsBase {
  static getOrthogonalRotationFactor(vector1, vector2) {
    const angle = vector2 ? calcAngleBetweenVectors(vector1, vector2) : calcVectorRotation(vector1);
    return Math.abs(angle) < halfPI ? -1 : 1;
  }
  constructor(A, B, C, options) {
    super(options);
    /**
     * The point being projected (the angle ∠BAC)
     */
    /**
     * The point before A
     */
    /**
     * The point after A
     */
    /**
     * The AB vector
     */
    _defineProperty(this, "AB", void 0);
    /**
     * The AC vector
     */
    _defineProperty(this, "AC", void 0);
    /**
     * The angle of A (∠BAC)
     */
    _defineProperty(this, "alpha", void 0);
    /**
     * The bisector of A (∠BAC)
     */
    _defineProperty(this, "bisector", void 0);
    this.A = new Point(A);
    this.B = new Point(B);
    this.C = new Point(C);
    this.AB = this.createSideVector(this.A, this.B);
    this.AC = this.createSideVector(this.A, this.C);
    this.alpha = calcAngleBetweenVectors(this.AB, this.AC);
    this.bisector = getUnitVector(
    // if AC is also the zero vector nothing will be projected
    // in that case the next point will handle the projection
    rotateVector(this.AB.eq(zeroVector) ? this.AC : this.AB, this.alpha / 2));
  }
  calcOrthogonalProjection(from, to) {
    let magnitude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.strokeProjectionMagnitude;
    const vector = this.createSideVector(from, to);
    const orthogonalProjection = getOrthonormalVector(vector);
    const correctSide = StrokeLineJoinProjections.getOrthogonalRotationFactor(orthogonalProjection, this.bisector);
    return this.scaleUnitVector(orthogonalProjection, magnitude * correctSide);
  }

  /**
   * BEVEL
   * Calculation: the projection points are formed by the vector orthogonal to the vertex.
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#2-2-bevel
   */
  projectBevel() {
    const projections = [];
    // if `alpha` equals 0 or 2*PI, the projections are the same for `B` and `C`
    (this.alpha % twoMathPi === 0 ? [this.B] : [this.B, this.C]).forEach(to => {
      projections.push(this.projectOrthogonally(this.A, to));
      projections.push(this.projectOrthogonally(this.A, to, -this.strokeProjectionMagnitude));
    });
    return projections;
  }

  /**
   * MITER
   * Calculation: the corner is formed by extending the outer edges of the stroke
   * at the tangents of the path segments until they intersect.
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#2-1-miter
   */
  projectMiter() {
    const projections = [],
      alpha = Math.abs(this.alpha),
      hypotUnitScalar = 1 / Math.sin(alpha / 2),
      miterVector = this.scaleUnitVector(this.bisector, -this.strokeProjectionMagnitude * hypotUnitScalar);

    // When two line segments meet at a sharp angle, it is possible for the join to extend,
    // far beyond the thickness of the line stroking the path. The stroke-miterlimit imposes
    // a limit on the extent of the line join.
    // MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-miterlimit
    // When the stroke is uniform, scaling changes the arrangement of points, this changes the miter-limit
    const strokeMiterLimit = this.options.strokeUniform ? magnitude(this.scaleUnitVector(this.bisector, this.options.strokeMiterLimit)) : this.options.strokeMiterLimit;
    if (magnitude(miterVector) / this.strokeProjectionMagnitude <= strokeMiterLimit) {
      projections.push(this.applySkew(this.A.add(miterVector)));
    }
    /* when the miter-limit is reached, the stroke line join becomes of type bevel.
      We always need two orthogonal projections which are basically bevel-type projections,
      so regardless of whether the miter-limit was reached or not, we include these projections.
    */
    projections.push(...this.projectBevel());
    return projections;
  }

  /**
   * ROUND (without skew)
   * Calculation: the projections are the two vectors parallel to X and Y axes
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#2-3-1-round-without-skew
   */
  projectRoundNoSkew(startCircle, endCircle) {
    const projections = [],
      // correctSide is used to only consider projecting for the outer side
      correctSide = new Point(StrokeLineJoinProjections.getOrthogonalRotationFactor(this.bisector), StrokeLineJoinProjections.getOrthogonalRotationFactor(new Point(this.bisector.y, this.bisector.x))),
      radiusOnAxisX = new Point(1, 0).scalarMultiply(this.strokeProjectionMagnitude).multiply(this.strokeUniformScalar).multiply(correctSide),
      radiusOnAxisY = new Point(0, 1).scalarMultiply(this.strokeProjectionMagnitude).multiply(this.strokeUniformScalar).multiply(correctSide);
    [radiusOnAxisX, radiusOnAxisY].forEach(vector => {
      if (isBetweenVectors(vector, startCircle, endCircle)) {
        projections.push(this.A.add(vector));
      }
    });
    return projections;
  }

  /**
   * ROUND (with skew)
   * Calculation: the projections are the points furthest from the vertex in
   * the direction of the X and Y axes after distortion.
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#2-3-2-round-skew
   */
  projectRoundWithSkew(startCircle, endCircle) {
    const projections = [];
    const {
        skewX,
        skewY,
        scaleX,
        scaleY,
        strokeUniform
      } = this.options,
      shearing = new Point(Math.tan(degreesToRadians(skewX)), Math.tan(degreesToRadians(skewY)));
    // The points furthest from the vertex in the direction of the X and Y axes after distortion
    const circleRadius = this.strokeProjectionMagnitude,
      newY = strokeUniform ? circleRadius / scaleY / Math.sqrt(1 / scaleY ** 2 + 1 / scaleX ** 2 * shearing.y ** 2) : circleRadius / Math.sqrt(1 + shearing.y ** 2),
      furthestY = new Point(
      // Safe guard due to floating point precision. In some situations the square root
      // was returning NaN because of a negative number close to zero.
      Math.sqrt(Math.max(circleRadius ** 2 - newY ** 2, 0)), newY),
      newX = strokeUniform ? circleRadius / Math.sqrt(1 + shearing.x ** 2 * (1 / scaleY) ** 2 / (1 / scaleX + 1 / scaleX * shearing.x * shearing.y) ** 2) : circleRadius / Math.sqrt(1 + shearing.x ** 2 / (1 + shearing.x * shearing.y) ** 2),
      furthestX = new Point(newX, Math.sqrt(Math.max(circleRadius ** 2 - newX ** 2, 0)));
    [furthestX, furthestX.scalarMultiply(-1), furthestY, furthestY.scalarMultiply(-1)]
    // We need to skew the vector here as this information is used to check if
    // it is between the start and end of the circle segment
    .map(vector => this.applySkew(strokeUniform ? vector.multiply(this.strokeUniformScalar) : vector)).forEach(vector => {
      if (isBetweenVectors(vector, startCircle, endCircle)) {
        projections.push(this.applySkew(this.A).add(vector));
      }
    });
    return projections;
  }
  projectRound() {
    const projections = [];
    /* Include the start and end points of the circle segment, so that only
      the projections contained within it are included */
    // add the orthogonal projections (start and end points of circle segment)
    projections.push(...this.projectBevel());
    // let's determines which one of the orthogonal projection is the beginning and end of the circle segment.
    // when `alpha` equals 0 or 2*PI, we have a straight line, so the way to find the start/end is different.
    const isStraightLine = this.alpha % twoMathPi === 0,
      // change the origin of the projections to point A
      // so that the cross product calculation is correct
      newOrigin = this.applySkew(this.A),
      proj0 = projections[isStraightLine ? 0 : 2].subtract(newOrigin),
      proj1 = projections[isStraightLine ? 1 : 0].subtract(newOrigin),
      // when `isStraightLine` === true, we compare with the vector opposite AB, otherwise we compare with the bisector.
      comparisonVector = isStraightLine ? this.applySkew(this.AB.scalarMultiply(-1)) : this.applySkew(this.bisector.multiply(this.strokeUniformScalar).scalarMultiply(-1)),
      // the beginning of the circle segment is always to the right of the comparison vector (cross product > 0)
      isProj0Start = crossProduct(proj0, comparisonVector) > 0,
      startCircle = isProj0Start ? proj0 : proj1,
      endCircle = isProj0Start ? proj1 : proj0;
    if (!this.isSkewed()) {
      projections.push(...this.projectRoundNoSkew(startCircle, endCircle));
    } else {
      projections.push(...this.projectRoundWithSkew(startCircle, endCircle));
    }
    return projections;
  }

  /**
   * Project stroke width on points returning projections for each point as follows:
   * - `miter`: 1 point corresponding to the outer boundary. If the miter limit is exceeded, it will be 2 points (becomes bevel)
   * - `bevel`: 2 points corresponding to the bevel possible boundaries, orthogonal to the stroke.
   * - `round`: same as `bevel` when it has no skew, with skew are 4 points.
   */
  projectPoints() {
    switch (this.options.strokeLineJoin) {
      case 'miter':
        return this.projectMiter();
      case 'round':
        return this.projectRound();
      default:
        return this.projectBevel();
    }
  }
  project() {
    return this.projectPoints().map(point => ({
      originPoint: this.A,
      projectedPoint: point,
      angle: this.alpha,
      bisector: this.bisector
    }));
  }
}

export { StrokeLineJoinProjections };
//# sourceMappingURL=StrokeLineJoinProjections.mjs.map
