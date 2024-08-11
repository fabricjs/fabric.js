import type { ModifierKey, TEvent } from '../EventTypeDefs';
import type { Point } from '../Point';
import { Path } from '../shapes/Path';
import type { Canvas } from '../canvas/Canvas';
import { BaseBrush } from './BaseBrush';
import type { TSimplePathData } from '../util/path/typedefs';
export declare class PencilBrush extends BaseBrush {
    /**
     * Discard points that are less than `decimate` pixel distant from each other
     * @type Number
     * @default 0.4
     */
    decimate: number;
    /**
     * Draws a straight line between last recorded point to current pointer
     * Used for `shift` functionality
     *
     * @type boolean
     * @default false
     */
    drawStraightLine: boolean;
    /**
     * The event modifier key that makes the brush draw a straight line.
     * If `null` or 'none' or any other string that is not a modifier key the feature is disabled.
     * @type {ModifierKey | undefined | null}
     */
    straightLineKey: ModifierKey | undefined | null;
    private _points;
    private _hasStraightLine;
    private oldEnd?;
    constructor(canvas: Canvas);
    needsFullRender(): boolean;
    static drawSegment(ctx: CanvasRenderingContext2D, p1: Point, p2: Point): Point;
    /**
     * Invoked on mouse down
     * @param {Point} pointer
     */
    onMouseDown(pointer: Point, { e }: TEvent): void;
    /**
     * Invoked on mouse move
     * @param {Point} pointer
     */
    onMouseMove(pointer: Point, { e }: TEvent): void;
    /**
     * Invoked on mouse up
     */
    onMouseUp({ e }: TEvent): boolean;
    /**
     * @private
     * @param {Point} pointer Actual mouse position related to the canvas.
     */
    _prepareForDrawing(pointer: Point): void;
    /**
     * @private
     * @param {Point} point Point to be added to points array
     */
    _addPoint(point: Point): boolean;
    /**
     * Clear points array and set contextTop canvas style.
     * @private
     */
    _reset(): void;
    /**
     * Draw a smooth path on the topCanvas using quadraticCurveTo
     * @private
     * @param {CanvasRenderingContext2D} [ctx]
     */
    _render(ctx?: CanvasRenderingContext2D): void;
    /**
     * Converts points to SVG path
     * @param {Point[]} points Array of points
     * @return {TSimplePathData} SVG path commands
     */
    convertPointsToSVGPath(points: Point[]): TSimplePathData;
    /**
     * Creates a Path object to add on canvas
     * @param {TSimplePathData} pathData Path data
     * @return {Path} Path to add on canvas
     */
    createPath(pathData: TSimplePathData): Path;
    /**
     * Decimate points array with the decimate value
     */
    decimatePoints(points: Point[], distance: number): Point[];
    /**
     * On mouseup after drawing the path on contextTop canvas
     * we use the points captured to create an new Path object
     * and add it to the canvas.
     */
    _finalizeAndAddPath(): void;
}
//# sourceMappingURL=PencilBrush.d.ts.map