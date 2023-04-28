import { XY, Point } from '../../../Point';
import { degreesToRadians } from '../radiansDegreesConversion';
import { getBisector, getOrthonormalVector, magnitude } from '../vectors';
import { StrokeProjectionsBase } from './StrokeProjectionsBase';
import { TProjection, TProjectStrokeOnPointsOptions } from './types';

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
export class StrokeLineJoinProjections extends StrokeProjectionsBase {
  /**
   * The point being projected (the angle ∠BAC)
   */
  declare A: Point;
  /**
   * The point before A
   */
  declare B: Point;
  /**
   * The point after A
   */
  declare C: Point;
  /**
   * The bisector of A (∠BAC)
   */
  declare bisector: ReturnType<typeof getBisector>;

  constructor(A: XY, B: XY, C: XY, options: TProjectStrokeOnPointsOptions) {
    super(options);
    this.A = new Point(A);
    this.B = new Point(B);
    this.C = new Point(C);
    // First we calculate the bisector between the points. Used in `round` and `miter` cases
    // When the stroke is uniform, scaling changes the arrangement of the points, so we have to take it into account
    this.bisector = this.options.strokeUniform
      ? getBisector(
          this.A.multiply(this.scale),
          this.B.multiply(this.scale),
          this.C.multiply(this.scale)
        )
      : getBisector(this.A, this.B, this.C);
  }

  get bisectorVector() {
    return this.bisector.vector;
  }

  get bisectorAngle() {
    return this.bisector.angle;
  }

  calcOrthogonalProjection(
    from: Point,
    to: Point,
    magnitude: number = this.strokeProjectionMagnitude
  ) {
    const vector = this.createSideVector(from, to);
    const orthogonalProjection = getOrthonormalVector(vector);
    const correctSide = StrokeProjectionsBase.getAcuteAngleFactor(
      orthogonalProjection,
      this.bisectorVector
    );
    return this.scaleUnitVector(orthogonalProjection, magnitude * correctSide);
  }

  /**
   * BEVEL
   * Calculation: the projection points are formed by the vector orthogonal to the vertex.
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#2-2-bevel
   */
  projectBevel() {
    return [this.B, this.C].map((to) => this.projectOrthogonally(this.A, to));
  }

  /**
   * MITER
   * Calculation: the corner is formed by extending the outer edges of the stroke
   * at the tangents of the path segments until they intersect.
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#2-1-miter
   */
  projectMiter() {
    const alpha = Math.abs(this.bisectorAngle),
      hypotUnitScalar = 1 / Math.sin(alpha / 2),
      miterVector = this.scaleUnitVector(
        this.bisectorVector,
        -this.strokeProjectionMagnitude * hypotUnitScalar
      );

    // When two line segments meet at a sharp angle, it is possible for the join to extend,
    // far beyond the thickness of the line stroking the path. The stroke-miterlimit imposes
    // a limit on the extent of the line join.
    // MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-miterlimit
    // When the stroke is uniform, scaling changes the arrangement of points, this changes the miter-limit
    const strokeMiterLimit = this.options.strokeUniform
      ? hypotUnitScalar
      : this.options.strokeMiterLimit;

    if (
      magnitude(miterVector) / this.strokeProjectionMagnitude <=
      strokeMiterLimit
    ) {
      return [this.applySkew(this.A.add(miterVector))];
    } else {
      // when the miter-limit is reached, the stroke line join becomes of type bevel
      return this.projectBevel();
    }
  }

  /**
   * ROUND (without skew)
   * Calculation: the projections are the two vectors parallel to X and Y axes
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#2-3-1-round-without-skew
   */
  private projectRoundNoSkew() {
    // correctSide is used to only consider projecting for the outer side
    const correctSide = new Point(
        StrokeProjectionsBase.getAcuteAngleFactor(this.bisectorVector),
        StrokeProjectionsBase.getAcuteAngleFactor(
          new Point(this.bisectorVector.y, this.bisectorVector.x)
        )
      ),
      radiusOnAxisX = new Point(1, 0)
        .scalarMultiply(this.strokeProjectionMagnitude)
        .multiply(this.strokeUniformScalar)
        .multiply(correctSide),
      radiusOnAxisY = new Point(0, 1)
        .scalarMultiply(this.strokeProjectionMagnitude)
        .multiply(this.strokeUniformScalar)
        .multiply(correctSide);

    return [this.A.add(radiusOnAxisX), this.A.add(radiusOnAxisY)];
  }

  /**
   * ROUND (with skew)
   * Calculation: the projections are the points furthest from the vertex in
   * the direction of the X and Y axes after distortion.
   *
   * @todo TODO:
   *  - Consider only projections that are inside the beginning and end of the circle segment
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#2-3-2-round-skew
   */
  private projectRoundWithSkew() {
    const projections: Point[] = [];

    // The start and end points of the circle segment
    [this.B, this.C].forEach((to) =>
      projections.push(this.projectOrthogonally(this.A, to))
    );

    const { skewX, skewY } = this.options;
    // The points furthest from the vertex in the direction of the X and Y axes after distortion
    const circleRadius = new Point()
        .scalarAdd(this.strokeProjectionMagnitude)
        .multiply(this.strokeUniformScalar),
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
        Math.sqrt(newY ** 2 - ((newX * newY) / circleRadius.x) ** 2)
      );

    [furthestX, furthestY].forEach((vector) => {
      projections.push(
        this.applySkew(this.A.add(vector)),
        this.applySkew(this.A.subtract(vector))
      );
    });

    return projections;
  }

  projectRound() {
    if (!this.isSkewed()) {
      return this.projectRoundNoSkew();
    } else {
      return this.projectRoundWithSkew();
    }
  }

  /**
   * Project stroke width on points returning projections for each point as follows:
   * - `miter`: 1 point corresponding to the outer boundary. If the miter limit is exceeded, it will be 2 points (becomes bevel)
   * - `bevel`: 2 points corresponding to the bevel possible boundaries, orthogonal to the stroke.
   * - `round`: same as `bevel` when it has no skew, with skew are 4 points.
   */
  protected projectPoints() {
    switch (this.options.strokeLineJoin) {
      case 'miter':
        return this.projectMiter();
      case 'round':
        return this.projectRound();
      default:
        return this.projectBevel();
    }
  }

  public project(): TProjection[] {
    return this.projectPoints().map((point) => ({
      originPoint: this.A,
      projectedPoint: point,
      bisector: this.bisector,
    }));
  }
}
