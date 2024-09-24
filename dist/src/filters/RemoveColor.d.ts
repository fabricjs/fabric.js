import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
export type RemoveColorOwnProps = {
    color: string;
    distance: number;
    useAlpha: boolean;
};
export declare const removeColorDefaultValues: RemoveColorOwnProps;
/**
 * Remove white filter class
 * @example
 * const filter = new RemoveColor({
 *   threshold: 0.2,
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
export declare class RemoveColor extends BaseFilter<'RemoveColor', RemoveColorOwnProps> {
    /**
     * Color to remove, in any format understood by {@link Color}.
     * @param {String} type
     * @default
     */
    color: RemoveColorOwnProps['color'];
    /**
     * distance to actual color, as value up or down from each r,g,b
     * between 0 and 1
     **/
    distance: RemoveColorOwnProps['distance'];
    /**
     * For color to remove inside distance, use alpha channel for a smoother deletion
     * NOT IMPLEMENTED YET
     **/
    useAlpha: RemoveColorOwnProps['useAlpha'];
    static type: string;
    static defaults: RemoveColorOwnProps;
    static uniformLocations: string[];
    getFragmentSource(): string;
    /**
     * Applies filter to canvas element
     * @param {Object} canvasEl Canvas element to apply filter to
     */
    applyTo2d({ imageData: { data } }: T2DPipelineState): void;
    /**
     * Send data from this filter to its shader program's uniforms.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
     */
    sendUniformData(gl: WebGLRenderingContext, uniformLocations: TWebGLUniformLocationMap): void;
}
//# sourceMappingURL=RemoveColor.d.ts.map