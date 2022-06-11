//@ts-nocheck


  'use strict';

  var fabric  = global.fabric || (global.fabric = { }),
      filters = fabric.Image.filters,
      createClass = fabric.util.createClass;

  /**
   * A container class that knows how to apply a sequence of filters to an input image.
   */
export class Composed extends fabric.Image.filters.BaseFilter {

    type = 'Composed'

    /**
     * A non sparse array of filters to apply
     */
    subFilters = []

    /**
     * Constructor
     * @param {Object} [options] Options object
     */
    constructor(options) {
      super(options);
      // create a new array instead mutating the prototype with push
      this.subFilters = this.subFilters.slice(0);
    }

    /**
     * Apply this container's filters to the input image provided.
     *
     * @param {Object} options
     * @param {Number} options.passes The number of filters remaining to be applied.
     */
    applyTo(options) {
      options.passes += this.subFilters.length - 1;
      this.subFilters.forEach(function(filter) {
        filter.applyTo(options);
      });
    }

    /**
     * Serialize this filter into JSON.
     *
     * @returns {Object} A JSON representation of this filter.
     */
    toObject() {
      return fabric.util.object.extend(super.toObject(), {
        subFilters: this.subFilters.map(function(filter) { return filter.toObject(); }),
      });
    }

    isNeutralState() {
      return !this.subFilters.some(function(filter) { return !filter.isNeutralState(); });
    }
  }

  /**
   * Deserialize a JSON definition of a ComposedFilter into a concrete instance.
   */
  fabric.Image.filters.Composed.fromObject = function(object) {
    var filters = object.subFilters || [];
    return Promise.all(filters.map(function(filter) {
      return fabric.Image.filters[filter.type].fromObject(filter);
    })).then(function(enlivedFilters) {
      return new fabric.Image.filters.Composed({ subFilters: enlivedFilters });
    });
  };
