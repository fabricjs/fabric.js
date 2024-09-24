import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLPipelineState } from './typedefs';
type ComposedOwnProps = {
    subFilters: BaseFilter<string, object>[];
};
/**
 * A container class that knows how to apply a sequence of filters to an input image.
 */
export declare class Composed extends BaseFilter<'Composed', ComposedOwnProps> {
    /**
     * A non sparse array of filters to apply
     */
    subFilters: ComposedOwnProps['subFilters'];
    static type: string;
    constructor(options?: {
        subFilters?: BaseFilter<string, object>[];
    } & Record<string, any>);
    /**
     * Apply this container's filters to the input image provided.
     *
     * @param {Object} options
     * @param {Number} options.passes The number of filters remaining to be applied.
     */
    applyTo(options: TWebGLPipelineState | T2DPipelineState): void;
    /**
     * Serialize this filter into JSON.
     * @returns {Object} A JSON representation of this filter.
     */
    toObject(): {
        type: 'Composed';
        subFilters: ReturnType<BaseFilter<string, object>['toObject']>[];
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
    static fromObject(object: Record<string, any>, options: {
        signal: AbortSignal;
    }): Promise<Composed>;
}
export {};
//# sourceMappingURL=Composed.d.ts.map