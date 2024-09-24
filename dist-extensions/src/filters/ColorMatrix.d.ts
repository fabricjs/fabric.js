import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TMatColorMatrix, TWebGLUniformLocationMap } from './typedefs';
type ColorMatrixOwnProps = {
    matrix: TMatColorMatrix;
    colorsOnly: boolean;
};
export declare const colorMatrixDefaultValues: ColorMatrixOwnProps;
/**
   * Color Matrix filter class
   * @see {@link http://fabricjs.com/image-filters|ImageFilters demo}
   * @see {@Link http://phoboslab.org/log/2013/11/fast-image-filters-with-webgl demo}
   * @example <caption>Kodachrome filter</caption>
   * const filter = new ColorMatrix({
   *  matrix: [
       1.1285582396593525, -0.3967382283601348, -0.03992559172921793, 0, 63.72958762196502,
       -0.16404339962244616, 1.0835251566291304, -0.05498805115633132, 0, 24.732407896706203,
       -0.16786010706155763, -0.5603416277695248, 1.6014850761964943, 0, 35.62982807460946,
       0, 0, 0, 1, 0
      ]
   * });
   * object.filters.push(filter);
   * object.applyFilters();
   */
export declare class ColorMatrix<Name extends string = 'ColorMatrix', OwnProps extends object = ColorMatrixOwnProps> extends BaseFilter<Name, OwnProps> {
    /**
     * Colormatrix for pixels.
     * array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
     * outside the -1, 1 range.
     * 0.0039215686 is the part of 1 that get translated to 1 in 2d
     * @param {Array} matrix array of 20 numbers.
     * @default
     */
    matrix: ColorMatrixOwnProps['matrix'];
    /**
     * Lock the colormatrix on the color part, skipping alpha, mainly for non webgl scenario
     * to save some calculation
     * @type Boolean
     * @default true
     */
    colorsOnly: ColorMatrixOwnProps['colorsOnly'];
    static type: string;
    static defaults: ColorMatrixOwnProps;
    static uniformLocations: string[];
    getFragmentSource(): string;
    /**
     * Apply the ColorMatrix operation to a Uint8Array representing the pixels of an image.
     *
     * @param {Object} options
     * @param {ImageData} options.imageData The Uint8Array to be filtered.
     */
    applyTo2d(options: T2DPipelineState): void;
    /**
     * Send data from this filter to its shader program's uniforms.
     *
     * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
     * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
     */
    sendUniformData(gl: WebGLRenderingContext, uniformLocations: TWebGLUniformLocationMap): void;
    toObject(): {
        type: Name;
    } & OwnProps & {
        matrix: TMatColorMatrix;
    };
}
export {};
//# sourceMappingURL=ColorMatrix.d.ts.map