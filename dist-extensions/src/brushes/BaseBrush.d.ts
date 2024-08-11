import type { Point } from '../Point';
import type { Shadow } from '../Shadow';
import type { Canvas } from '../canvas/Canvas';
import type { TBrushEventData } from './typedefs';
/**
 * @see {@link http://fabricjs.com/freedrawing|Freedrawing demo}
 */
export declare abstract class BaseBrush {
    /**
     * Color of a brush
     * @type String
     * @default
     */
    color: string;
    /**
     * Width of a brush, has to be a Number, no string literals
     * @type Number
     * @default
     */
    width: number;
    /**
     * Shadow object representing shadow of this shape.
     * <b>Backwards incompatibility note:</b> This property replaces "shadowColor" (String), "shadowOffsetX" (Number),
     * "shadowOffsetY" (Number) and "shadowBlur" (Number) since v1.2.12
     * @type Shadow
     * @default
     */
    shadow: Shadow | null;
    /**
     * Line endings style of a brush (one of "butt", "round", "square")
     * @type String
     * @default
     */
    strokeLineCap: CanvasLineCap;
    /**
     * Corner style of a brush (one of "bevel", "round", "miter")
     * @type String
     * @default
     */
    strokeLineJoin: CanvasLineJoin;
    /**
     * Maximum miter length (used for strokeLineJoin = "miter") of a brush's
     * @type Number
     * @default
     */
    strokeMiterLimit: number;
    /**
     * Stroke Dash Array.
     * @type Array
     * @default
     */
    strokeDashArray: number[] | null;
    /**
     * When `true`, the free drawing is limited to the whiteboard size. Default to false.
     * @type Boolean
     * @default false
     */
    limitedToCanvasSize: boolean;
    /**
     * @todo add type
     */
    canvas: Canvas;
    constructor(canvas: Canvas);
    abstract _render(): void;
    abstract onMouseDown(pointer: Point, ev: TBrushEventData): void;
    abstract onMouseMove(pointer: Point, ev: TBrushEventData): void;
    /**
     * @returns true if brush should continue blocking interaction
     */
    abstract onMouseUp(ev: TBrushEventData): boolean | void;
    /**
     * Sets brush styles
     * @private
     * @param {CanvasRenderingContext2D} ctx
     */
    _setBrushStyles(ctx: CanvasRenderingContext2D): void;
    /**
     * Sets the transformation on given context
     * @param {CanvasRenderingContext2D} ctx context to render on
     * @private
     */
    protected _saveAndTransform(ctx: CanvasRenderingContext2D): void;
    protected needsFullRender(): boolean;
    /**
     * Sets brush shadow styles
     * @private
     */
    protected _setShadow(): void;
    /**
     * Removes brush shadow styles
     * @private
     */
    protected _resetShadow(): void;
    /**
     * Check is pointer is outside canvas boundaries
     * @param {Object} pointer
     * @private
     */
    protected _isOutSideCanvas(pointer: Point): boolean;
}
//# sourceMappingURL=BaseBrush.d.ts.map