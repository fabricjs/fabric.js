import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLPipelineState, TWebGLUniformLocationMap } from './typedefs';
export type TResizeType = 'bilinear' | 'hermite' | 'sliceHack' | 'lanczos';
export type ResizeOwnProps = {
    resizeType: TResizeType;
    scaleX: number;
    scaleY: number;
    lanczosLobes: number;
};
export declare const resizeDefaultValues: ResizeOwnProps;
type ResizeDuring2DResize = Resize & {
    rcpScaleX: number;
    rcpScaleY: number;
};
type ResizeDuringWEBGLResize = Resize & {
    rcpScaleX: number;
    rcpScaleY: number;
    horizontal: boolean;
    width: number;
    height: number;
    taps: number[];
    tempScale: number;
    dH: number;
    dW: number;
};
/**
 * Resize image filter class
 * @example
 * const filter = new Resize();
 * object.filters.push(filter);
 * object.applyFilters(canvas.renderAll.bind(canvas));
 */
export declare class Resize extends BaseFilter<'Resize', ResizeOwnProps> {
    /**
     * Resize type
     * for webgl resizeType is just lanczos, for canvas2d can be:
     * bilinear, hermite, sliceHack, lanczos.
     * @default
     */
    resizeType: ResizeOwnProps['resizeType'];
    /**
     * Scale factor for resizing, x axis
     * @param {Number} scaleX
     * @default
     */
    scaleX: ResizeOwnProps['scaleX'];
    /**
     * Scale factor for resizing, y axis
     * @param {Number} scaleY
     * @default
     */
    scaleY: ResizeOwnProps['scaleY'];
    /**
     * LanczosLobes parameter for lanczos filter, valid for resizeType lanczos
     * @param {Number} lanczosLobes
     * @default
     */
    lanczosLobes: ResizeOwnProps['lanczosLobes'];
    static type: string;
    static defaults: ResizeOwnProps;
    static uniformLocations: string[];
    /**
     * Send data from this filter to its shader program's uniforms.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
     */
    sendUniformData(this: ResizeDuringWEBGLResize, gl: WebGLRenderingContext, uniformLocations: TWebGLUniformLocationMap): void;
    getFilterWindow(this: ResizeDuringWEBGLResize): number;
    getCacheKey(this: ResizeDuringWEBGLResize): string;
    getFragmentSource(this: ResizeDuringWEBGLResize): string;
    getTaps(this: ResizeDuringWEBGLResize): any[];
    /**
     * Generate vertex and shader sources from the necessary steps numbers
     * @param {Number} filterWindow
     */
    generateShader(filterWindow: number): string;
    applyToForWebgl(this: ResizeDuringWEBGLResize, options: TWebGLPipelineState): void;
    /**
     * Apply the resize filter to the image
     * Determines whether to use WebGL or Canvas2D based on the options.webgl flag.
     *
     * @param {Object} options
     * @param {Number} options.passes The number of filters remaining to be executed
     * @param {Boolean} options.webgl Whether to use webgl to render the filter.
     * @param {WebGLTexture} options.sourceTexture The texture setup as the source to be filtered.
     * @param {WebGLTexture} options.targetTexture The texture where filtered output should be drawn.
     * @param {WebGLRenderingContext} options.context The GL context used for rendering.
     * @param {Object} options.programCache A map of compiled shader programs, keyed by filter type.
     */
    applyTo(options: TWebGLPipelineState | T2DPipelineState): void;
    isNeutralState(): boolean;
    lanczosCreate(lobes: number): (x: number) => number;
    applyTo2d(this: ResizeDuring2DResize, options: T2DPipelineState): void;
    /**
     * Filter sliceByTwo
     * @param {Object} canvasEl Canvas element to apply filter to
     * @param {Number} oW Original Width
     * @param {Number} oH Original Height
     * @param {Number} dW Destination Width
     * @param {Number} dH Destination Height
     * @returns {ImageData}
     */
    sliceByTwo(options: T2DPipelineState, oW: number, oH: number, dW: number, dH: number): ImageData;
    /**
     * Filter lanczosResize
     * @param {Object} canvasEl Canvas element to apply filter to
     * @param {Number} oW Original Width
     * @param {Number} oH Original Height
     * @param {Number} dW Destination Width
     * @param {Number} dH Destination Height
     * @returns {ImageData}
     */
    lanczosResize(this: ResizeDuring2DResize, options: T2DPipelineState, oW: number, oH: number, dW: number, dH: number): ImageData;
    /**
     * bilinearFiltering
     * @param {Object} canvasEl Canvas element to apply filter to
     * @param {Number} oW Original Width
     * @param {Number} oH Original Height
     * @param {Number} dW Destination Width
     * @param {Number} dH Destination Height
     * @returns {ImageData}
     */
    bilinearFiltering(this: ResizeDuring2DResize, options: T2DPipelineState, oW: number, oH: number, dW: number, dH: number): ImageData;
    /**
     * hermiteFastResize
     * @param {Object} canvasEl Canvas element to apply filter to
     * @param {Number} oW Original Width
     * @param {Number} oH Original Height
     * @param {Number} dW Destination Width
     * @param {Number} dH Destination Height
     * @returns {ImageData}
     */
    hermiteFastResize(this: ResizeDuring2DResize, options: T2DPipelineState, oW: number, oH: number, dW: number, dH: number): ImageData;
}
export {};
//# sourceMappingURL=Resize.d.ts.map