/**
 * Canvas 2D filter backend.
 */
import type { BaseFilter } from './base_filter.class';
import { T2DPipelineState } from './typedefs';
export declare class Canvas2dFilterBackend {
    /**
     * Experimental. This object is a sort of repository of help layers used to avoid
     * of recreating them during frequent filtering. If you are previewing a filter with
     * a slider you probably do not want to create help layers every filter step.
     * in this object there will be appended some canvases, created once, resized sometimes
     * cleared never. Clearing is left to the developer.
     **/
    resources: {};
    /**
     * Apply a set of filters against a source image and draw the filtered output
     * to the provided destination canvas.
     *
     * @param {EnhancedFilter} filters The filter to apply.
     * @param {HTMLImageElement|HTMLCanvasElement} sourceElement The source to be filtered.
     * @param {Number} sourceWidth The width of the source input.
     * @param {Number} sourceHeight The height of the source input.
     * @param {HTMLCanvasElement} targetCanvas The destination for filtered output to be drawn.
     */
    applyFilters(filters: BaseFilter[], sourceElement: CanvasImageSource, sourceWidth: number, sourceHeight: number, targetCanvas: HTMLCanvasElement): T2DPipelineState | void;
}
//# sourceMappingURL=2d_backend.class.d.ts.map