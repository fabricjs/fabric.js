(function(global) {

  'use strict';

  var fabric  = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend,
      filters = fabric.Image.filters,
      createClass = fabric.util.createClass;

  /**
   * Saturate filter class
   * @class fabric.Image.filters.Saturate
   * @memberOf fabric.Image.filters
   * @extends fabric.Image.filters.BaseFilter
   * @see {@link fabric.Image.filters.Saturate#initialize} for constructor definition
   * @see {@link http://fabricjs.com/image-filters|ImageFilters demo}
   * @example
   * var filter = new fabric.Image.filters.Saturate({
   *   saturate: 100
   * });
   * object.filters.push(filter);
   * object.applyFilters(canvas.renderAll.bind(canvas));
   */
  filters.Saturate = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.Saturate.prototype */ {

    /**
     * Filter type
     * @param {String} type
     * @default
     */
    type: 'Saturate',

    /**
     * Constructor
     * @memberOf fabric.Image.filters.Saturate.prototype
     * @param {Object} [options] Options object
     * @param {Number} [options.saturate=0] Value to saturate the image (-100...100)
     */
    initialize: function(options) {
      options = options || { };
      this.saturate = options.saturate || 0;
    },

    /**
     * Applies filter to canvas element
     * @param {Object} canvasEl Canvas element to apply filter to
     */
    applyTo: function(canvasEl) {
      var context = canvasEl.getContext('2d'),
          imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
          data = imageData.data,
          max, adjust = -this.saturate * 0.01;

      for (var i = 0, len = data.length; i < len; i += 4) {
        max = Math.max(data[i], data[i + 1], data[i + 2]);
        data[i] += max !== data[i] ? (max - data[i]) * adjust : 0;
        data[i + 1] += max !== data[i + 1] ? (max - data[i + 1]) * adjust : 0;
        data[i + 2] += max !== data[i + 2] ? (max - data[i + 2]) * adjust : 0;
      }

      context.putImageData(imageData, 0, 0);
    },

    /**
     * Returns object representation of an instance
     * @return {Object} Object representation of an instance
     */
    toObject: function() {
      return extend(this.callSuper('toObject'), {
        saturate: this.saturate
      });
    }
  });

  /**
   * Returns filter instance from an object representation
   * @static
   * @param {Object} object Object to create an instance from
   * @param {Function} [callback] to be invoked after filter creation
   * @return {fabric.Image.filters.Saturate} Instance of fabric.Image.filters.Saturate
   */
  fabric.Image.filters.Saturate.fromObject = fabric.Image.filters.BaseFilter.fromObject;

})(typeof exports !== 'undefined' ? exports : this);
