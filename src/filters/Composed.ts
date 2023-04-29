import { BaseFilter } from './BaseFilter';
import type { T2DPipelineState, TWebGLPipelineState } from './typedefs';
import { isWebGLPipelineState } from './typedefs';
import { classRegistry } from '../ClassRegistry';

/**
 * A container class that knows how to apply a sequence of filters to an input image.
 */
export class Composed extends BaseFilter {
  /**
   * A non sparse array of filters to apply
   */
  declare subFilters: BaseFilter[];

  constructor({
    subFilters = [],
    ...options
  }: { subFilters?: BaseFilter[] } & Record<string, any> = {}) {
    super(options);
    this.subFilters = subFilters;
  }

  /**
   * Apply this container's filters to the input image provided.
   *
   * @param {Object} options
   * @param {Number} options.passes The number of filters remaining to be applied.
   */
  applyTo(options: TWebGLPipelineState | T2DPipelineState) {
    if (isWebGLPipelineState(options)) {
      options.passes += this.subFilters.length - 1;
    }
    this.subFilters.forEach((filter) => {
      filter.applyTo(options);
    });
  }

  /**
   * Serialize this filter into JSON.
   *
   * @returns {Object} A JSON representation of this filter.
   */
  toObject() {
    return {
      ...super.toObject(),
      subFilters: this.subFilters.map((filter) => filter.toObject()),
    };
  }

  isNeutralState() {
    return !this.subFilters.some((filter) => !filter.isNeutralState());
  }

  /**
   * Deserialize a JSON definition of a ComposedFilter into a concrete instance.
   * @static
   * @param {oject} object Object to create an instance from
   * @param {object} [options]
   * @param {AbortSignal} [options.signal] handle aborting `BlendImage` filter loading, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns {Promise<Composed>}
   */
  static fromObject(
    object: Record<string, any>,
    options: { signal: AbortSignal }
  ) {
    return Promise.all(
      ((object.subFilters || []) as BaseFilter[]).map((filter) =>
        classRegistry.getClass(filter.type).fromObject(filter, options)
      )
    ).then(
      (enlivedFilters) => new this({ subFilters: enlivedFilters }) as BaseFilter
    );
  }
}

classRegistry.setClass(Composed);
