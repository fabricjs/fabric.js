import type { XY } from '../../../Point';
import { Point } from '../../../Point';
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
export declare class StrokeLineCapProjections extends StrokeProjectionsBase {
    /**
     * edge point
     */
    A: Point;
    /**
     * point next to edge point
     */
    T: Point;
    constructor(A: XY, T: XY, options: TProjectStrokeOnPointsOptions);
    calcOrthogonalProjection(from: Point, to: Point, magnitude?: number): Point;
    /**
     * OPEN PATH START/END - Line cap: Butt
     * Calculation: to find the projections, just find the points orthogonal to the stroke
     *
     * @see https://github.com/fabricjs/fabric.js/pull/8344#1-1-butt
     */
    projectButt(): Point[];
    /**
     * OPEN PATH START/END - Line cap: Round
     * Calculation: same as stroke line join `round`
     *
     * @see https://github.com/fabricjs/fabric.js/pull/8344#1-2-round
     */
    projectRound(): Point[];
    /**
     * OPEN PATH START/END - Line cap: Square
     * Calculation: project a rectangle of points on the stroke in the opposite direction of the vector `AT`
     *
     * @see https://github.com/fabricjs/fabric.js/pull/8344#1-3-square
     */
    projectSquare(): Point[];
    protected projectPoints(): Point[];
    project(): TProjection[];
}
//# sourceMappingURL=StrokeLineCapProjections.d.ts.map