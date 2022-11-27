// @ts-nocheck
import { Image } from '../shapes/image.class';
import { AbstractBaseFilter, BaseFilter } from './base_filter.class';
import {
  isWebGLPipelineState,
  T2DPipelineState,
  TWebGLPipelineState,
} from './typedefs';

/**
 * A container class that knows how to apply a sequence of filters to an input image.
 */
export class Composed extends BaseFilter {
  type = 'Composed';

  /**
   * A non sparse array of filters to apply
   */
  subFilters: BaseFilter[] = [];

  setOptions({ subFilters, ...options }: Record<string, any>) {
    if (subFilters) {
      // safeguard against mutation
      this.subFilters = [...subFilters];
    }
    super.setOptions(options);
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
  static fromObject(object, options) {
    return Promise.all(
      ((object.subFilters || []) as AbstractBaseFilter[]).map((filter) =>
        Image.filters[filter.type].fromObject(filter, options)
      )
    ).then((enlivedFilters) => new Composed({ subFilters: enlivedFilters }));
  }
}
