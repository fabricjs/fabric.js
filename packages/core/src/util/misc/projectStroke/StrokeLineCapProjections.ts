import type { XY } from '../../../Point';
import { Point } from '../../../Point';
import { getOrthonormalVector, getUnitVector } from '../vectors';
import { StrokeLineJoinProjections } from './StrokeLineJoinProjections';
import { StrokeProjectionsBase } from './StrokeProjectionsBase';
import type { TProjection, TProjectStrokeOnPointsOptions } from './types';

/**
 * class in charge of finding projections for each type of line cap for start/end of an open path
 * @see {@link [Open path projections at #8344](https://github.com/fabricjs/fabric.js/pull/8344#1-open-path)}
 *
 * Reference:
 * - MDN:
 *   - https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap
 *   - https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap
 * - Spec: https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-linecap-dev
 * - Playground to understand how the line joins works: https://hypertolosana.github.io/efficient-webgl-stroking/index.html
 * - View the calculated projections for each of the control points: https://codesandbox.io/s/project-stroke-points-with-context-to-trace-b8jc4j?file=/src/index.js
 */
export class StrokeLineCapProjections extends StrokeProjectionsBase {
  /**
   * edge point
   */
  declare A: Point;
  /**
   * point next to edge point
   */
  declare T: Point;

  constructor(A: XY, T: XY, options: TProjectStrokeOnPointsOptions) {
    super(options);
    this.A = new Point(A);
    this.T = new Point(T);
  }

  calcOrthogonalProjection(
    from: Point,
    to: Point,
    magnitude: number = this.strokeProjectionMagnitude,
  ) {
    const vector = this.createSideVector(from, to);
    return this.scaleUnitVector(getOrthonormalVector(vector), magnitude);
  }

  /**
   * OPEN PATH START/END - Line cap: Butt
   * Calculation: to find the projections, just find the points orthogonal to the stroke
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#1-1-butt
   */
  projectButt() {
    return [
      this.projectOrthogonally(this.A, this.T, this.strokeProjectionMagnitude),
      this.projectOrthogonally(this.A, this.T, -this.strokeProjectionMagnitude),
    ];
  }

  /**
   * OPEN PATH START/END - Line cap: Round
   * Calculation: same as stroke line join `round`
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#1-2-round
   */
  projectRound() {
    const projections: Point[] = [];

    if (!this.isSkewed() && this.A.eq(this.T)) {
      /* 1 point case without `skew`
        When `strokeUniform` is true, scaling has no effect.
        So we divide by scale, to remove its effect.
      */
      const projection = new Point(1, 1)
        .scalarMultiply(this.strokeProjectionMagnitude)
        .multiply(this.strokeUniformScalar);
      projections.push(
        this.applySkew(this.A.add(projection)),
        this.applySkew(this.A.subtract(projection)),
      );
    } else {
      projections.push(
        ...new StrokeLineJoinProjections(
          this.A,
          this.T,
          this.T,
          this.options,
        ).projectRound(),
      );
    }

    return projections;
  }

  /**
   * OPEN PATH START/END - Line cap: Square
   * Calculation: project a rectangle of points on the stroke in the opposite direction of the vector `AT`
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#1-3-square
   */
  projectSquare() {
    const projections: Point[] = [];

    if (this.A.eq(this.T)) {
      /* 1 point case without `skew`
        When `strokeUniform` is true, scaling has no effect.
        So we divide by scale, to remove its effect.
      */
      const projection = new Point(1, 1)
        .scalarMultiply(this.strokeProjectionMagnitude)
        .multiply(this.strokeUniformScalar);
      projections.push(this.A.add(projection), this.A.subtract(projection));
    } else {
      const orthogonalProjection = this.calcOrthogonalProjection(
        this.A,
        this.T,
        this.strokeProjectionMagnitude,
      );
      const strokePointingOut = this.scaleUnitVector(
        getUnitVector(this.createSideVector(this.A, this.T)),
        -this.strokeProjectionMagnitude,
      );
      const projectedA = this.A.add(strokePointingOut);
      projections.push(
        projectedA.add(orthogonalProjection),
        projectedA.subtract(orthogonalProjection),
      );
    }

    return projections.map((p) => this.applySkew(p));
  }

  protected projectPoints() {
    switch (this.options.strokeLineCap) {
      case 'round':
        return this.projectRound();
      case 'square':
        return this.projectSquare();
      default:
        return this.projectButt();
    }
  }

  public project(): TProjection[] {
    return this.projectPoints().map((point) => ({
      originPoint: this.A,
      projectedPoint: point,
    }));
  }
}
