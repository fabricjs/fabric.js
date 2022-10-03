import { Point } from '../../point.class';
import { calcAngleBetweenVectors, createVector, getBisector, getOrthogonalUnitVector } from './vectors';
import { StrokeLineJoin, TDegree } from '../../typedefs';
import { degreesToRadians } from './radiansDegreesConversion';
import { hypot } from './hypot'

const PiBy2 = Math.PI / 2

/**
 * Project stroke width on points returning projections for each point as follows:
 * - `miter`: 1 point corresponding to the outer boundary and the inner boundary of stroke.
 * - `bevel`: 2 points corresponding to the bevel possible boundaries, orthogonal to the stroke.
 * - `round`: same as `bevel` when it has no skew, with skew are 4 points.
 * Used to calculate object's bounding box
 * 
 * @see https://github.com/fabricjs/fabric.js/pull/8083
 * 
 * @static
 * @memberOf fabric.util
 * @param {Point[]} points
 * @param {Object} options
 * @param {number} options.strokeWidth
 * @param {'miter'|'bevel'|'round'} options.strokeLineJoin
 * @param {number} options.strokeMiterLimit https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-miterlimit
 * @param {boolean} options.strokeUniform
 * @param {number} options.scaleX
 * @param {number} options.scaleY
 * @param {boolean} [openPath] whether the shape is open or not, affects the calculations of the first and last points
 * @returns {{projectedPoint: Point, originPoint: Point, bisector?: { vector: Point, angle: number }}[]} array of size n (for miter stroke) or 2n (for bevel or round) of all suspected points. Each element is an object with projectedPoint, originPoint and bisector?.
 */

type projectStrokeOnPointsOptions = {
  strokeWidth: number;
  strokeLineJoin: StrokeLineJoin;
  strokeMiterLimit: number; // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-miterlimit
  strokeUniform: boolean;
  scaleX: number;
  scaleY: number;
  skewX: TDegree;
  skewY: TDegree;
};

export const projectStrokeOnPoints = (
  points: Point[],
  {
    strokeWidth,
    strokeLineJoin,
    strokeMiterLimit, // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-miterlimit
    strokeUniform,
    scaleX,
    scaleY,
    skewX,
    skewY
  }: projectStrokeOnPointsOptions,
  openPath: boolean
): {projectedPoint: Point, originPoint: Point, bisector?: { vector: Point, angle: number }}[] => {

  const coords: {projectedPoint: Point, originPoint: Point, bisector?: { vector: Point, angle: number }}[] = [],
    s = strokeWidth / 2,
    scale = new Point(scaleX, scaleY),
    strokeUniformScalar = strokeUniform
      ? new Point(1 / scaleX, 1 / scaleY)
      : new Point(1, 1),
    scaleHatVector = (hatVector: Point, scalar: number) => {
      return hatVector.multiply(strokeUniformScalar).scalarMultiply(scalar);
    },
    applySkew = (v: Point) => {
      let vector = new Point(v);
      vector.y += vector.x * Math.tan(degreesToRadians(skewY)) // skewY must be applied before skewX as this distortion affects skewX calculation
      vector.x += vector.y * Math.tan(degreesToRadians(skewX))
      return vector
    };

  if (points.length <= 1) {
    return coords;
  }

  points.forEach(function (p, index) {
    let A = new Point(p.x, p.y), B, C;
    if (index === 0) {
      C = points[index + 1];
      B = openPath ? A : points[points.length - 1];
    }
    else if (index === points.length - 1) {
      B = points[index - 1];
      C = openPath ? A : points[0];
    }
    else {
      B = points[index - 1];
      C = points[index + 1];
    }

    //  safeguard in case `points` are not `Point`
    B = new Point(B.x, B.y);
    C = new Point(C.x, C.y);

    /* OPEN PATH
      If open path, no matter the type of the line join, the line is always the same
      Calculation: to find the projections, just find the points orthogonal to that stroke 
      Visually detailed here: https://github.com/fabricjs/fabric.js/issues/8025
      TODO: take into account line-cap (I believe that should change the projections)
    */
    if (openPath && (index === 0 || index === points.length - 1)) {
      var D = index === 0 ? C : B, 
        // When the stroke is uniform, scaling affects the arrangement of points. So we must take it into account.
        vector = createVector(strokeUniform ? A.multiply(scale) : A, strokeUniform ? D.multiply(scale) : D), 
        hatOrthogonalVector = getOrthogonalUnitVector(vector), 
        orthogonalVector = scaleHatVector(hatOrthogonalVector, s);

      // We must bounce the projection to both sides, since we don't know which one is the outer edge
      var proj1 = applySkew(A.add(orthogonalVector)), 
        proj2 = applySkew(A.subtract(orthogonalVector));

      [proj1, proj2].forEach(proj => {
        coords.push({
          "projectedPoint": proj,
          "originPoint": A
        });
      });
      return;
    }

    /* CLOSED PATH
      From here on, we will deal with closed path cases, which have different projections according to the line join type.
      MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin
      Spec: https://svgwg.org/svg2-draft/painting.html#StrokeLinejoinProperty
      Playground to understand how the line joins works: https://hypertolosana.github.io/efficient-webgl-stroking/index.html
      View the calculated projections here for each of the control points: https://codesandbox.io/s/project-stroke-points-with-context-to-trace-b8jc4j?file=/src/index.js
    */

    // First we calculate the bisector between the points. Used in round and miter cases
    // When the stroke is uniform, scaling changes the arrangement of the points, so we have to take it into account
    const bisector = strokeUniform 
      ? getBisector(A.multiply(scale), B.multiply(scale), C.multiply(scale)) 
      : getBisector(A, B, C),
      bisectorVector = bisector.vector,
      alpha = Math.abs(bisector.angle); //TODO: check if ABS is really needed. I don't remember why I implemented it this way

    /* MITER 
      Calculation: the corner is formed by extending the outer edges of the stroke at the tangents of the path segments until they intersect
      Visually detailed here: https://github.com/fabricjs/fabric.js/issues/8025
    */
    if (strokeLineJoin === 'miter') {
      const scalar = -s / Math.sin(alpha / 2),
        miterVector = scaleHatVector(bisectorVector, scalar);

      // When two line segments meet at a sharp angle, it is possible for the join to extend,
      // it is possible for the join to extend far beyond the thickness of the line stroking
      // the path. The stroke-miterlimit imposes a limit on the extent of the line join.
      // MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-miterlimit
      // When the stroke is uniform, scaling changes the arrangement of points, this changes the miter-limit
      let adjustedStrokeMiterLimit;
      if (strokeUniform) {
        // TODO: As it is in the MDN, the miterLimit can also be calculated as 1/sin(alpha/2) , I believe it is more performant than the current implementation.
        const miterLimitVector = scaleHatVector(bisectorVector, strokeMiterLimit * s);
        adjustedStrokeMiterLimit = hypot(miterLimitVector.x, miterLimitVector.y) / s;
      } else {
        adjustedStrokeMiterLimit = strokeMiterLimit
      }

      if (hypot(miterVector.x, miterVector.y) / s <= adjustedStrokeMiterLimit) {
        const proj1 = applySkew(A.add(miterVector));
        coords.push({
          "projectedPoint": proj1,
          "originPoint": A,
          "bisector": bisector
        });
        return;
      }
    }
    /* ROUND (without skew)
      Calculation: the projections are the two vectors parallel to X and Y axes
      Visually detailed here: https://github.com/fabricjs/fabric.js/pull/8083
    */
    if (strokeLineJoin === 'round' && skewX === 0 && skewY === 0) {
      // correctSide is used to only consider projecting for the outer side 
      const correctSide = new Point(
          Math.abs(Math.atan2(bisectorVector.y, bisectorVector.x)) >= PiBy2 ? 1 : -1, 
          Math.abs(Math.atan2(bisectorVector.x, bisectorVector.y)) >= PiBy2 ? 1 : -1
        ),
        radiusOnAxisX = new Point(s * strokeUniformScalar.x, 0).multiply(correctSide), 
        radiusOnAxisY = new Point(0, s * strokeUniformScalar.y).multiply(correctSide),
        proj1 = applySkew(A.add(radiusOnAxisX)), 
        proj2 = applySkew(A.add(radiusOnAxisY));
      [proj1, proj2].forEach(proj => {
        coords.push({
          "projectedPoint": proj,
          "originPoint": A,
          "bisector": bisector
        });
      });
    } 
    /* ROUND (with skew)
      Calculation: the projections are the points furthest from the vertex in the direction of the X and Y axes after distortion
      Visually detailed here: https://github.com/fabricjs/fabric.js/pull/8083
    */
    else if (strokeLineJoin === 'round'&& (skewX !== 0 || skewY !== 0)) {
      // We calculate the start and end points of the circle segment
      const AB = createVector(strokeUniform ? A.multiply(scale) : A, strokeUniform ? B.multiply(scale) : B), 
          AC = createVector(strokeUniform ? A.multiply(scale) : A, strokeUniform ? C.multiply(scale) : C);

      [AB, AC].forEach(function (vector) {
        const hatOrthogonal = getOrthogonalUnitVector(vector), 
          correctSide = Math.abs(calcAngleBetweenVectors(hatOrthogonal, bisectorVector)) >= PiBy2 ? 1 : -1, 
          orthogonal = scaleHatVector(hatOrthogonal, s * correctSide),
          proj1 = applySkew(A.add(orthogonal));
        coords.push({
          "projectedPoint": proj1,
          "originPoint": A,
          "bisector": bisector
        });
      });

      // The points furthest from the vertex in the direction of the X and Y axes after distortion
      // TODO: consider only projections that are inside the beginning and end of the circle segment
      // TODO: still buggy when skewX and skewY are applied at the same time
      const circleRadius = new Point(s, s).multiply(strokeUniformScalar),
        newY = circleRadius.y / Math.sqrt(1 + Math.tan(degreesToRadians(skewY))**2),
        furthestY= new Point(
          Math.sqrt(circleRadius.x**2 - (newY*circleRadius.x/circleRadius.y)**2),
          newY
        ),
        newX = circleRadius.x / Math.sqrt(1 + Math.tan(degreesToRadians(skewX))**2),
        furthestX = new Point(
          newX,
          Math.sqrt(circleRadius.y**2 - (newX*circleRadius.y/circleRadius.x)**2)
        );

      [furthestX, furthestY].forEach(function (vector) {
        coords.push({
          "projectedPoint": applySkew(A.add(vector)),
          "originPoint": A,
          "bisector": bisector
        });
        coords.push({
          "projectedPoint": applySkew(A.subtract(vector)),
          "originPoint": A,
          "bisector": bisector
        });
      })
    }
    else {
      /* BEVEL OR MITER GREATER THAN STROKE MITER LIMIT
        Calculation: the projection points are formed by the orthogonal to the vertex.
        Visually detailed here: https://github.com/fabricjs/fabric.js/pull/8083
      */
      // When the stroke is uniform, scaling changes the arrangement of the points, so we have to take it into account
      const AB = createVector(strokeUniform ? A.multiply(scale) : A, strokeUniform ? B.multiply(scale) : B), 
        AC = createVector(strokeUniform ? A.multiply(scale) : A, strokeUniform ? C.multiply(scale) : C);
      [AB, AC].forEach(function (vector) {
        const hatOrthogonal = getOrthogonalUnitVector(vector), 
          correctSide = Math.abs(calcAngleBetweenVectors(hatOrthogonal, bisectorVector)) >= PiBy2 ? 1 : -1, 
          orthogonal = scaleHatVector(hatOrthogonal, s * correctSide),
          proj1 = applySkew(A.add(orthogonal));
        coords.push({
          "projectedPoint": proj1,
          "originPoint": A,
          "bisector": bisector
        });
      });
    }
  });
  return coords;
};
