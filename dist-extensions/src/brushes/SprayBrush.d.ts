import type { Point } from '../Point';
import type { Canvas } from '../canvas/Canvas';
import { BaseBrush } from './BaseBrush';
import type { SprayBrushPoint } from './typedefs';
export declare class SprayBrush extends BaseBrush {
    /**
     * Width of a spray
     * @type Number
     * @default
     */
    width: number;
    /**
     * Density of a spray (number of dots per chunk)
     * @type Number
     * @default
     */
    density: number;
    /**
     * Width of spray dots
     * @type Number
     * @default
     */
    dotWidth: number;
    /**
     * Width variance of spray dots
     * @type Number
     * @default
     */
    dotWidthVariance: number;
    /**
     * Whether opacity of a dot should be random
     * @type Boolean
     * @default
     */
    randomOpacity: boolean;
    /**
     * Whether overlapping dots (rectangles) should be removed (for performance reasons)
     * @type Boolean
     * @default
     */
    optimizeOverlapping: boolean;
    private sprayChunks;
    private sprayChunk;
    /**
     * Constructor
     * @param {Canvas} canvas
     * @return {SprayBrush} Instance of a spray brush
     */
    constructor(canvas: Canvas);
    /**
     * Invoked on mouse down
     * @param {Point} pointer
     */
    onMouseDown(pointer: Point): void;
    /**
     * Invoked on mouse move
     * @param {Point} pointer
     */
    onMouseMove(pointer: Point): void;
    /**
     * Invoked on mouse up
     */
    onMouseUp(): void;
    renderChunck(sprayChunck: SprayBrushPoint[]): void;
    /**
     * Render all spray chunks
     */
    _render(): void;
    /**
     * @param {Point} pointer
     */
    addSprayChunk(pointer: Point): void;
}
//# sourceMappingURL=SprayBrush.d.ts.map