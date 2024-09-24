import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
export type InvertOwnProps = {
    alpha: boolean;
    invert: boolean;
};
export declare const invertDefaultValues: InvertOwnProps;
/**
 * @example
 * const filter = new Invert();
 * object.filters.push(filter);
 * object.applyFilters(canvas.renderAll.bind(canvas));
 */
export declare class Invert extends BaseFilter<'Invert', InvertOwnProps> {
    /**
     * Invert also alpha.
     * @param {Boolean} alpha
     * @default
     **/
    alpha: InvertOwnProps['alpha'];
    /**
     * Filter invert. if false, does nothing
     * @param {Boolean} invert
     * @default
     */
    invert: InvertOwnProps['invert'];
    static type: string;
    static defaults: InvertOwnProps;
    static uniformLocations: string[];
    /**
     * Apply the Invert operation to a Uint8Array representing the pixels of an image.
     *
     * @param {Object} options
     * @param {ImageData} options.imageData The Uint8Array to be filtered.
     */
    applyTo2d({ imageData: { data } }: T2DPipelineState): void;
    protected getFragmentSource(): string;
    /**
     * Invert filter isNeutralState implementation
     * Used only in image applyFilters to discard filters that will not have an effect
     * on the image
     * @param {Object} options
     **/
    isNeutralState(): boolean;
    /**
     * Send data from this filter to its shader program's uniforms.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
     */
    sendUniformData(gl: WebGLRenderingContext, uniformLocations: TWebGLUniformLocationMap): void;
}
//# sourceMappingURL=Invert.d.ts.map