import { PathData } from '../typedefs';
import type { Canvas } from '../canvas/canvas_events';
import { PencilBrush } from './pencil_brush.class';
export declare class PatternBrush extends PencilBrush {
    source?: CanvasImageSource;
    constructor(canvas: Canvas);
    getPatternSrc(): HTMLCanvasElement;
    /**
     * Creates "pattern" instance property
     * @param {CanvasRenderingContext2D} ctx
     */
    getPattern(ctx: CanvasRenderingContext2D): CanvasPattern | null;
    /**
     * Sets brush styles
     * @param {CanvasRenderingContext2D} ctx
     */
    _setBrushStyles(ctx: CanvasRenderingContext2D): void;
    /**
     * Creates path
     */
    createPath(pathData: PathData): import("../shapes/path.class").Path;
}
//# sourceMappingURL=pattern_brush.class.d.ts.map