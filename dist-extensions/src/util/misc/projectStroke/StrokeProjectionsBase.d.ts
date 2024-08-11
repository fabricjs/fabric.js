import type { XY } from '../../../Point';
import { Point } from '../../../Point';
import type { TProjectStrokeOnPointsOptions, TProjection } from './types';
/**
 * @see https://github.com/fabricjs/fabric.js/pull/8344
 * @todo consider removing skewing from points before calculating stroke projection,
 * see https://github.com/fabricjs/fabric.js/commit/494a10ee2f8c2278ae9a55b20bf50cf6ee25b064#commitcomment-94751537
 */
export declare abstract class StrokeProjectionsBase {
    options: TProjectStrokeOnPointsOptions;
    scale: Point;
    strokeUniformScalar: Point;
    strokeProjectionMagnitude: number;
    constructor(options: TProjectStrokeOnPointsOptions);
    /**
     * When the stroke is uniform, scaling affects the arrangement of points. So we must take it into account.
     */
    protected createSideVector(from: XY, to: XY): Point;
    protected abstract calcOrthogonalProjection(from: Point, to: Point, magnitude?: number): Point;
    protected projectOrthogonally(from: Point, to: Point, magnitude?: number): Point;
    protected isSkewed(): boolean;
    protected applySkew(point: Point): Point;
    protected scaleUnitVector(unitVector: Point, scalar: number): Point;
    protected abstract projectPoints(): Point[];
    abstract project(): TProjection[];
}
//# sourceMappingURL=StrokeProjectionsBase.d.ts.map