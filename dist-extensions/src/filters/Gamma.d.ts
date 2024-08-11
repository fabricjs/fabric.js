import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLUniformLocationMap } from './typedefs';
declare const GAMMA: "Gamma";
export type GammaInput = [number, number, number];
export type GammaOwnProps = {
    gamma: GammaInput;
};
export declare const gammaDefaultValues: GammaOwnProps;
/**
 * Gamma filter class
 * @example
 * const filter = new Gamma({
 *   gamma: [1, 0.5, 2.1]
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
export declare class Gamma extends BaseFilter<typeof GAMMA, GammaOwnProps> {
    /**
     * Gamma array value, from 0.01 to 2.2.
     * @param {Array} gamma
     * @default
     */
    gamma: GammaOwnProps['gamma'];
    rgbValues?: {
        r: Uint8Array;
        g: Uint8Array;
        b: Uint8Array;
    };
    static type: "Gamma";
    static defaults: GammaOwnProps;
    static uniformLocations: string[];
    getFragmentSource(): string;
    constructor(options?: {
        gamma?: GammaInput;
    });
    /**
     * Apply the Gamma operation to a Uint8Array representing the pixels of an image.
     *
     * @param {Object} options
     * @param {ImageData} options.imageData The Uint8Array to be filtered.
     */
    applyTo2d({ imageData: { data } }: T2DPipelineState): void;
    /**
     * Send data from this filter to its shader program's uniforms.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
     */
    sendUniformData(gl: WebGLRenderingContext, uniformLocations: TWebGLUniformLocationMap): void;
    isNeutralState(): boolean;
    toObject(): {
        type: typeof GAMMA;
        gamma: GammaInput;
    };
}
export {};
//# sourceMappingURL=Gamma.d.ts.map