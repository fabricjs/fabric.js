(function(global) {

  'use strict';

  var fabric  = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend,
      filters = fabric.Image.filters,
      createClass = fabric.util.createClass;

  /**
   * GradientTransparency filter class
   * @class fabric.Image.filters.GradientTransparency
   * @memberOf fabric.Image.filters
   * @extends fabric.Image.filters.BaseFilter
   * @see {@link fabric.Image.filters.GradientTransparency#initialize} for constructor definition
   * @see {@link http://fabricjs.com/image-filters|ImageFilters demo}
   * @example
   * var filter = new fabric.Image.filters.GradientTransparency({
   *   threshold: 200
   * });
   * object.filters.push(filter);
   * object.applyFilters(canvas.renderAll.bind(canvas));
   */
   // eslint-disable-next-line max-len
  filters.GradientTransparency = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.GradientTransparency.prototype */ {

    /**
     * Filter type
     * @param {String} type
     * @default
     */
    type: 'GradientTransparency',

    /**
     * Constructor
     * @memberOf fabric.Image.filters.GradientTransparency.prototype
     * @param {Object} [options] Options object
     * @param {Number} [options.threshold=100] Threshold value
     */
    initialize: function(options) {
      options = options || { };
      this.threshold = options.threshold || 100;
    },

    /**
     * Applies filter to canvas element
     * @param {Object} canvasEl Canvas element to apply filter to
     */
    applyTo: function(canvasEl) {
      var context = canvasEl.getContext('2d'),
          imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
          data = imageData.data,
          threshold = this.threshold,
          total = data.length;

      for (var i = 0, len = data.length; i < len; i += 4) {
        data[i + 3] = threshold + 255 * (total - i) / total;
      }

      context.putImageData(imageData, 0, 0);
    },

    /**
     * Returns object representation of an instance
     * @return {Object} Object representation of an instance
     */
    toObject: function() {
      return extend(this.callSuper('toObject'), {
        threshold: this.threshold
      });
    }
  });

  /**
   * Returns filter instance from an object representation
   * @static
   * @param {Object} object Object to create an instance from
   * @param {function} [callback] to be invoked after filter creation
   * @return {fabric.Image.filters.GradientTransparency} Instance of fabric.Image.filters.GradientTransparency
   */
  fabric.Image.filters.GradientTransparency.fromObject = fabric.Image.filters.BaseFilter.fromObject;

})(typeof exports !== 'undefined' ? exports : this);
