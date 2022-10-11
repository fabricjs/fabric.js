import { Point } from '../../point.class';
import {
  calcAngleBetweenVectors,
  createVector,
  getBisector,
  getOrthogonalUnitVector,
} from './vectors';
import { StrokeLineJoin, TDegree } from '../../typedefs';
import { degreesToRadians } from './radiansDegreesConversion';
import { halfPI } from '../../constants';

type TProjectStrokeOnPointsOptions = {
  strokeWidth: number;
  strokeLineJoin: StrokeLineJoin;
  /**
   * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-miterlimit
   */
  strokeMiterLimit: number;
  strokeUniform: boolean;
  scaleX: number;
  scaleY: number;
  skewX: TDegree;
  skewY: TDegree;
};

type TReturnedProjection = {
  projectedPoint: Point;
  originPoint: Point;
  bisector?: ReturnType<typeof getBisector>;
};

/**
 * Project stroke width on points returning projections for each point as follows:
 * - `miter`: 1 point corresponding to the outer boundary. If the miter limit is exceeded, it will be 2 points (becomes bevel)
 * - `bevel`: 2 points corresponding to the bevel possible boundaries, orthogonal to the stroke.
 * - `round`: same as `bevel` when it has no skew, with skew are 4 points.
 * Used to calculate object's bounding box
 *
 * @see https://github.com/fabricjs/fabric.js/pull/8344
 *
 */
export const projectStrokeOnPoints = (
  points: Point[],
  {
    strokeWidth,
    strokeLineJoin,
    strokeMiterLimit,
    strokeUniform,
    scaleX,
    scaleY,
    skewX,
    skewY,
  }: TProjectStrokeOnPointsOptions,
  openPath: boolean
): TReturnedProjection[] => {
  const coords: TReturnedProjection[] = [],
    s = strokeWidth / 2,
    scale = new Point(scaleX, scaleY),
    strokeUniformScalar = strokeUniform
      ? new Point(1 / scaleX, 1 / scaleY)
      : new Point(1, 1);

  if (points.length <= 1) {
    return coords;
  }

  points.forEach((p, index) => {
    const A = new Point(p);
    let B, C;
    if (index === 0) {
      C = points[index + 1];
      B = openPath ? A : points[points.length - 1];
    } else if (index === points.length - 1) {
      B = points[index - 1];
      C = openPath ? A : points[0];
    } else {
      B = points[index - 1];
      C = points[index + 1];
    }

    //  safeguard in case `points` are not `Point`
    B = new Point(B);
    C = new Point(C);

    if (openPath && (index === 0 || index === points.length - 1)) {
      //TODO: take into account line-cap (I believe that should change the projections)
      coords.push(
        ...projectionsOpenPathButt(
          index,
          A,
          B,
          C,
          strokeUniformScalar,
          scale,
          s,
          strokeUniform,
          skewX,
          skewY
        )
      );
      return;
    }

    // First we calculate the bisector between the points. Used in `round` and `miter` cases
    // When the stroke is uniform, scaling changes the arrangement of the points, so we have to take it into account
    const bisector = strokeUniform
      ? getBisector(A.multiply(scale), B.multiply(scale), C.multiply(scale))
      : getBisector(A, B, C);

    if (strokeLineJoin === 'miter') {
      coords.push(
        ...projectionsMiter(
          A,
          B,
          C,
          bisector,
          strokeUniformScalar,
          scale,
          s,
          strokeUniform,
          skewX,
          skewY,
          strokeMiterLimit
        )
      );
      return;
    } else if (strokeLineJoin === 'round' && skewX === 0 && skewY === 0) {
      coords.push(
        ...projectionsRoundNoSkew(A, bisector, s, strokeUniformScalar)
      );
      return;
    } else if (strokeLineJoin === 'round' && (skewX !== 0 || skewY !== 0)) {
      coords.push(
        ...projectionsRoundWithSkew(
          A,
          B,
          C,
          bisector,
          strokeUniformScalar,
          scale,
          s,
          strokeUniform,
          skewX,
          skewY
        )
      );
      return;
    } else {
      coords.push(
        ...projectionsBevel(
          A,
          B,
          C,
          bisector,
          strokeUniformScalar,
          scale,
          s,
          strokeUniform,
          skewX,
          skewY
        )
      );
      return;
    }
  });

  return coords;
};

const isAcute = (vector1: Point, vector2: Point): boolean =>
  Math.abs(calcAngleBetweenVectors(vector1, vector2)) < halfPI;

const scaleHatVector = (
  hatVector: Point,
  scalar: number,
  strokeUniformScalar: Point
): Point => {
  return hatVector.multiply(strokeUniformScalar).scalarMultiply(scalar);
};

const applySkew = (
  v: Point,
  skewX: TProjectStrokeOnPointsOptions['skewX'],
  skewY: TProjectStrokeOnPointsOptions['skewY']
): Point => {
  const vector = new Point(v);
  vector.y += vector.x * Math.tan(degreesToRadians(skewY)); // skewY must be applied before skewX as this distortion affects skewX calculation
  vector.x += vector.y * Math.tan(degreesToRadians(skewX));
  return vector;
};

/*
  Functions to find projections for each type of line join (or open path)
  MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin
  Spec: https://svgwg.org/svg2-draft/painting.html#StrokeLinejoinProperty
  Playground to understand how the line joins works: https://hypertolosana.github.io/efficient-webgl-stroking/index.html
  View the calculated projections for each of the control points: https://codesandbox.io/s/project-stroke-points-with-context-to-trace-b8jc4j?file=/src/index.js
*/

/**
 * OPEN PATH START/END - Line cap: Butt
 * If open path, no matter the type of the line join, the line is always the same
 * Calculation: to find the projections, just find the points orthogonal to that stroke
 *
 * @see https://github.com/fabricjs/fabric.js/pull/8344#1-1-butt
 */
const projectionsOpenPathButt = (
  index: number,
  A: Point,
  B: Point,
  C: Point,
  strokeUniformScalar: Point,
  scale: Point,
  s: number,
  strokeUniform: TProjectStrokeOnPointsOptions['strokeUniform'],
  skewX: TProjectStrokeOnPointsOptions['skewX'],
  skewY: TProjectStrokeOnPointsOptions['skewY']
): TReturnedProjection[] => {
  const D = index === 0 ? C : B,
    // When the stroke is uniform, scaling affects the arrangement of points. So we must take it into account.
    vector = createVector(
      strokeUniform ? A.multiply(scale) : A,
      strokeUniform ? D.multiply(scale) : D
    ),
    hatOrthogonalVector = getOrthogonalUnitVector(vector),
    orthogonalVector = scaleHatVector(
      hatOrthogonalVector,
      s,
      strokeUniformScalar
    );

  // We must bounce the projection to both sides, since we don't know which one is the outer edge
  const proj1 = applySkew(A.add(orthogonalVector), skewX, skewY),
    proj2 = applySkew(A.subtract(orthogonalVector), skewX, skewY);

  return [proj1, proj2].map((proj) => ({
    projectedPoint: proj,
    originPoint: A,
  }));
};

/**
 * BEVEL
 * Calculation: the projection points are formed by the vector orthogonal to the vertex.
 *
 * @see https://github.com/fabricjs/fabric.js/pull/8344#2-2-bevel
 */
const projectionsBevel = (
  A: Point,
  B: Point,
  C: Point,
  bisector: ReturnType<typeof getBisector>,
  strokeUniformScalar: Point,
  scale: Point,
  s: number,
  strokeUniform: TProjectStrokeOnPointsOptions['strokeUniform'],
  skewX: TProjectStrokeOnPointsOptions['skewX'],
  skewY: TProjectStrokeOnPointsOptions['skewY']
): TReturnedProjection[] => {
  const AB = createVector(
      strokeUniform ? A.multiply(scale) : A,
      strokeUniform ? B.multiply(scale) : B
    ),
    AC = createVector(
      strokeUniform ? A.multiply(scale) : A,
      strokeUniform ? C.multiply(scale) : C
    ),
    bisectorVector = bisector.vector;

  return [AB, AC].map((vector) => {
    const hatOrthogonal = getOrthogonalUnitVector(vector),
      correctSide = isAcute(hatOrthogonal, bisectorVector) ? -1 : 1,
      orthogonal = scaleHatVector(
        hatOrthogonal,
        s * correctSide,
        strokeUniformScalar
      ),
      proj1 = applySkew(A.add(orthogonal), skewX, skewY);

    return {
      projectedPoint: proj1,
      originPoint: A,
      bisector: bisector,
    };
  });
};

/**
 * MITER
 * Calculation: the corner is formed by extending the outer edges of the stroke
 * at the tangents of the path segments until they intersect.
 *
 * @see https://github.com/fabricjs/fabric.js/pull/8344#2-1-miter
 */
const projectionsMiter = (
  A: Point,
  B: Point,
  C: Point,
  bisector: ReturnType<typeof getBisector>,
  strokeUniformScalar: Point,
  scale: Point,
  s: number,
  strokeUniform: TProjectStrokeOnPointsOptions['strokeUniform'],
  skewX: TProjectStrokeOnPointsOptions['skewX'],
  skewY: TProjectStrokeOnPointsOptions['skewY'],
  strokeMiterLimit: TProjectStrokeOnPointsOptions['strokeMiterLimit']
): TReturnedProjection[] => {
  const bisectorVector = bisector.vector,
    alpha = Math.abs(bisector.angle),
    scalar = -s / Math.sin(alpha / 2),
    miterVector = scaleHatVector(bisectorVector, scalar, strokeUniformScalar);

  /* When two line segments meet at a sharp angle, it is possible for the join to extend,
    far beyond the thickness of the line stroking the path. The stroke-miterlimit imposes 
    a limit on the extent of the line join.
    MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-miterlimit */
  let adjustedStrokeMiterLimit;
  // When the stroke is uniform, scaling changes the arrangement of points, this changes the miter-limit
  if (strokeUniform) {
    adjustedStrokeMiterLimit = 1 / Math.sin(alpha / 2);
  } else {
    adjustedStrokeMiterLimit = strokeMiterLimit;
  }

  if (miterVector.magnitude() / s <= adjustedStrokeMiterLimit) {
    const proj1 = applySkew(A.add(miterVector), skewX, skewY);
    return [
      {
        projectedPoint: proj1,
        originPoint: A,
        bisector: bisector,
      },
    ];
  } else {
    // when the miter-limit is reached, the stroke line join becomes of type bevel
    return projectionsBevel(
      A,
      B,
      C,
      bisector,
      strokeUniformScalar,
      scale,
      s,
      strokeUniform,
      skewX,
      skewY
    );
  }
};

/**
 * ROUND (without skew)
 * Calculation: the projections are the two vectors parallel to X and Y axes
 *
 * @see https://github.com/fabricjs/fabric.js/pull/8344#2-3-1-round-without-skew
 */
const projectionsRoundNoSkew = (
  A: Point,
  bisector: ReturnType<typeof getBisector>,
  s: number,
  strokeUniformScalar: Point
): TReturnedProjection[] => {
  // correctSide is used to only consider projecting for the outer side
  const bisectorVector = bisector.vector,
    hatVectorAxisX = new Point(1, 0),
    correctSide = new Point(
      isAcute(hatVectorAxisX, bisectorVector) ? -1 : 1,
      isAcute(hatVectorAxisX, new Point(bisectorVector.y, bisectorVector.x))
        ? -1
        : 1
    ),
    radiusOnAxisX = new Point(s * strokeUniformScalar.x, 0).multiply(
      correctSide
    ),
    radiusOnAxisY = new Point(0, s * strokeUniformScalar.y).multiply(
      correctSide
    ),
    proj1 = A.add(radiusOnAxisX),
    proj2 = A.add(radiusOnAxisY);

  return [proj1, proj2].map((proj) => ({
    projectedPoint: proj,
    originPoint: A,
    bisector: bisector,
  }));
};

/**
 * ROUND (with skew)
 * Calculation: the projections are the points furthest from the vertex in
 * the direction of the X and Y axes after distortion.
 *
 * TODO:
 *  - Consider only projections that are inside the beginning and end of the circle segment
 *  - Still buggy when skewX and skewY are applied at the same time
 *
 * @see https://github.com/fabricjs/fabric.js/pull/8344#2-3-2-round-skew
 */
const projectionsRoundWithSkew = (
  A: Point,
  B: Point,
  C: Point,
  bisector: ReturnType<typeof getBisector>,
  strokeUniformScalar: Point,
  scale: Point,
  s: number,
  strokeUniform: TProjectStrokeOnPointsOptions['strokeUniform'],
  skewX: TProjectStrokeOnPointsOptions['skewX'],
  skewY: TProjectStrokeOnPointsOptions['skewY']
): TReturnedProjection[] => {
  const bisectorVector = bisector.vector,
    AB = createVector(
      strokeUniform ? A.multiply(scale) : A,
      strokeUniform ? B.multiply(scale) : B
    ),
    AC = createVector(
      strokeUniform ? A.multiply(scale) : A,
      strokeUniform ? C.multiply(scale) : C
    );

  const finalProjs: TReturnedProjection[] = [];

  // The start and end points of the circle segment
  [AB, AC].forEach((vector) => {
    const hatOrthogonal = getOrthogonalUnitVector(vector),
      correctSide = isAcute(hatOrthogonal, bisectorVector) ? -1 : 1,
      orthogonal = scaleHatVector(
        hatOrthogonal,
        s * correctSide,
        strokeUniformScalar
      ),
      proj1 = applySkew(A.add(orthogonal), skewX, skewY);
    finalProjs.push({
      projectedPoint: proj1,
      originPoint: A,
      bisector: bisector,
    });
  });

  // The points furthest from the vertex in the direction of the X and Y axes after distortion
  const circleRadius = new Point(s, s).multiply(strokeUniformScalar),
    newY =
      circleRadius.y / Math.sqrt(1 + Math.tan(degreesToRadians(skewY)) ** 2),
    furthestY = new Point(
      Math.sqrt(
        circleRadius.x ** 2 - ((newY * circleRadius.x) / circleRadius.y) ** 2
      ),
      newY
    ),
    newX =
      circleRadius.x / Math.sqrt(1 + Math.tan(degreesToRadians(skewX)) ** 2),
    furthestX = new Point(
      newX,
      Math.sqrt(
        circleRadius.y ** 2 - ((newX * circleRadius.y) / circleRadius.x) ** 2
      )
    );

  [furthestX, furthestY].forEach((vector) => {
    finalProjs.push({
      projectedPoint: applySkew(A.add(vector), skewX, skewY),
      originPoint: A,
      bisector: bisector,
    });
    finalProjs.push({
      projectedPoint: applySkew(A.subtract(vector), skewX, skewY),
      originPoint: A,
      bisector: bisector,
    });
  });

  return finalProjs;
};
