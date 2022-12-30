import { IPoint, Point } from '../../../point.class';
import { getBisector } from '../vectors';
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
export declare class StrokeLineJoinProjections extends StrokeProjectionsBase {
    /**
     * The point being projected (the angle ∠BAC)
     */
    A: Point;
    /**
     * The point before A
     */
    B: Point;
    /**
     * The point after A
     */
    C: Point;
    /**
     * The bisector of A (∠BAC)
     */
    bisector: ReturnType<typeof getBisector>;
    constructor(A: IPoint, B: IPoint, C: IPoint, options: TProjectStrokeOnPointsOptions);
    get bisectorVector(): Point;
    get bisectorAngle(): import("../../../typedefs").TRadian;
    calcOrthogonalProjection(from: Point, to: Point, magnitude?: number): Point;
    /**
     * BEVEL
     * Calculation: the projection points are formed by the vector orthogonal to the vertex.
     *
     * @see https://github.com/fabricjs/fabric.js/pull/8344#2-2-bevel
     */
    projectBevel(): Point[];
    /**
     * MITER
     * Calculation: the corner is formed by extending the outer edges of the stroke
     * at the tangents of the path segments until they intersect.
     *
     * @see https://github.com/fabricjs/fabric.js/pull/8344#2-1-miter
     */
    projectMiter(): Point[];
    /**
     * ROUND (without skew)
     * Calculation: the projections are the two vectors parallel to X and Y axes
     *
     * @see https://github.com/fabricjs/fabric.js/pull/8344#2-3-1-round-without-skew
     */
    private projectRoundNoSkew;
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
    private projectRoundWithSkew;
    projectRound(): Point[];
    /**
     * Project stroke width on points returning projections for each point as follows:
     * - `miter`: 1 point corresponding to the outer boundary. If the miter limit is exceeded, it will be 2 points (becomes bevel)
     * - `bevel`: 2 points corresponding to the bevel possible boundaries, orthogonal to the stroke.
     * - `round`: same as `bevel` when it has no skew, with skew are 4 points.
     */
    protected projectPoints(): Point[];
    project(): TProjection[];
}
//# sourceMappingURL=StrokeLineJoinProjections.d.ts.map