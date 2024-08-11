import type { Point } from '../Point';
import type { Canvas } from '../canvas/Canvas';
import { BaseBrush } from './BaseBrush';
import type { CircleBrushPoint } from './typedefs';
export declare class CircleBrush extends BaseBrush {
    /**
     * Width of a brush
     * @type Number
     * @default
     */
    width: number;
    points: CircleBrushPoint[];
    constructor(canvas: Canvas);
    /**
     * Invoked inside on mouse down and mouse move
     * @param {Point} pointer
     */
    drawDot(pointer: Point): void;
    dot(ctx: CanvasRenderingContext2D, point: CircleBrushPoint): void;
    /**
     * Invoked on mouse down
     */
    onMouseDown(pointer: Point): void;
    /**
     * Render the full state of the brush
     * @private
     */
    _render(): void;
    /**
     * Invoked on mouse move
     * @param {Point} pointer
     */
    onMouseMove(pointer: Point): void;
    /**
     * Invoked on mouse up
     */
    onMouseUp(): void;
    /**
     * @param {Object} pointer
     * @return {Point} Just added pointer point
     */
    addPoint({ x, y }: Point): CircleBrushPoint;
}
//# sourceMappingURL=CircleBrush.d.ts.map