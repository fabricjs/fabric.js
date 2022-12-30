import type { TClassProperties } from '../typedefs';
import { AbstractBaseFilter, BaseFilter, BaseFilterOptions } from './base_filter.class';
import type { T2DPipelineState, TWebGLPipelineState } from './typedefs';
/**
 * A container class that knows how to apply a sequence of filters to an input image.
 */
export declare class Composed extends BaseFilter {
    /**
     * A non sparse array of filters to apply
     */
    subFilters: AbstractBaseFilter[];
    constructor({ subFilters, ...options }?: Partial<BaseFilterOptions & {
        subFilters: AbstractBaseFilter[];
    }>);
    /**
     * Apply this container's filters to the input image provided.
     *
     * @param {Object} options
     * @param {Number} options.passes The number of filters remaining to be applied.
     */
    applyTo(options: TWebGLPipelineState | T2DPipelineState): void;
    /**
     * Serialize this filter into JSON.
     *
     * @returns {Object} A JSON representation of this filter.
     */
    toObject(): {
        subFilters: any[];
        type: string;
    };
    isNeutralState(): boolean;
    /**
     * Deserialize a JSON definition of a ComposedFilter into a concrete instance.
     * @static
     * @param {oject} object Object to create an instance from
     * @param {object} [options]
     * @param {AbortSignal} [options.signal] handle aborting `BlendImage` filter loading, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
     * @returns {Promise<Composed>}
     */
    static fromObject(object: any, options: any): Promise<Composed>;
}
export declare const composedDefaultValues: Partial<TClassProperties<Composed>>;
//# sourceMappingURL=composed_filter.class.d.ts.map