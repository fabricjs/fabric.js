import { IPoint, Point } from '../../../point.class';
import { getOrthonormalVector } from '../vectors';
import { StrokeProjectionsBase } from './StrokeProjectionsBase';
import { TProjectStrokeOnPointsOptions, TProjection } from './types';

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
 *
 * @todo TODO: take into account line-cap (I believe that should change the projections)
 *
 */
export class StrokeLineCapProjections extends StrokeProjectionsBase {
  /**
   * edge point
   */
  A: Point;
  /**
   * point next to edge point
   */
  T: Point;

  constructor(A: IPoint, T: IPoint, options: TProjectStrokeOnPointsOptions) {
    super(options);
    this.A = new Point(A);
    this.T = new Point(T);
  }

  calcOrthogonalProjection(
    from: Point,
    to: Point,
    magnitude: number = this.strokeProjectionMagnitude
  ) {
    const vector = this.createSideVector(from, to);
    // we are looking for the vector in the opposite direction of AT, hence we negate magnitude
    return this.scaleUnitVector(getOrthonormalVector(vector), -magnitude);
  }

  /**
   * OPEN PATH START/END - Line cap: Butt
   * If open path, no matter the type of the line join, the line is always the same
   * Calculation: to find the projections, just find the points orthogonal to that stroke
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#1-1-butt
   */
  private projectButt() {
    return [this.projectOrthogonally(this.A, this.T)];
  }

  protected projectPoints() {
    return this.projectButt();
  }

  public project(): TProjection[] {
    return this.projectPoints().map((point) => ({
      originPoint: this.A,
      projectedPoint: point,
    }));
  }
}
