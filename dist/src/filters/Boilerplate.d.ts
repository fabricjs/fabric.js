import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
type MyFilterOwnProps = {
    myParameter: number;
};
export declare const myFilterDefaultValues: MyFilterOwnProps;
/**
 * MyFilter filter class
 * @example
 * const filter = new MyFilter({
 *   add here an example of how to use your filter
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
export declare class MyFilter extends BaseFilter<'MyFilter', MyFilterOwnProps> {
    /**
     * MyFilter value, from -1 to 1.
     * translated to -255 to 255 for 2d
     * 0.0039215686 is the part of 1 that get translated to 1 in 2d
     * @param {Number} myParameter
     * @default
     */
    myParameter: MyFilterOwnProps['myParameter'];
    static type: string;
    static defaults: MyFilterOwnProps;
    static uniformLocations: string[];
    getFragmentSource(): string;
    /**
     * Apply the MyFilter operation to a Uint8ClampedArray representing the pixels of an image.
     *
     * @param {Object} options
     * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
     */
    applyTo2d(options: T2DPipelineState): void;
    /**
     * Send data from this filter to its shader program's uniforms.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
     */
    sendUniformData(gl: WebGLRenderingContext, uniformLocations: TWebGLUniformLocationMap): void;
    static fromObject(object: any): Promise<MyFilter>;
}
export {};
//# sourceMappingURL=Boilerplate.d.ts.map