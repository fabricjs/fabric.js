import { IPoint, Point } from '../../../point.class';
import { TProjectStrokeOnPointsOptions, TProjection } from './types';
/**
 * @see https://github.com/fabricjs/fabric.js/pull/8344
 */
export declare abstract class StrokeProjectionsBase {
    options: TProjectStrokeOnPointsOptions;
    scale: Point;
    strokeUniformScalar: Point;
    strokeProjectionMagnitude: number;
    static getAcuteAngleFactor(vector1: Point, vector2?: Point): 1 | -1;
    constructor(options: TProjectStrokeOnPointsOptions);
    /**
     * When the stroke is uniform, scaling affects the arrangement of points. So we must take it into account.
     */
    protected createSideVector(from: IPoint, to: IPoint): Point;
    protected abstract calcOrthogonalProjection(from: Point, to: Point, magnitude?: number): Point;
    protected projectOrthogonally(from: Point, to: Point, magnitude?: number): Point;
    protected isSkewed(): boolean;
    protected applySkew(point: Point): Point;
    protected scaleUnitVector(unitVector: Point, scalar: number): Point;
    protected abstract projectPoints(): Point[];
    abstract project(): TProjection[];
}
//# sourceMappingURL=StrokeProjectionsBase.d.ts.map