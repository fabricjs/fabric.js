import type { TClassProperties } from '../typedefs';
import { ColorMatrix } from './colormatrix_filter.class';
import type { TWebGLPipelineState, T2DPipelineState } from './typedefs';
/**
 * HueRotation filter class
 * @example
 * const filter = new HueRotation({
 *   rotation: -0.5
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
export declare class HueRotation extends ColorMatrix {
    /**
     * HueRotation value, from -1 to 1.
     */
    rotation: number;
    calculateMatrix(): void;
    isNeutralState(): boolean;
    applyTo(options: TWebGLPipelineState | T2DPipelineState): void;
    static fromObject(object: any): Promise<HueRotation>;
}
export declare const hueRotationDefaultValues: Partial<TClassProperties<HueRotation>>;
//# sourceMappingURL=hue_rotation.class.d.ts.map