(function(global) {

  'use strict';

  var fabric  = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend,
      filters = fabric.Image.filters,
      createClass = fabric.util.createClass;

  /**
   * Contrast filter class
   * @class fabric.Image.filters.Contrast
   * @memberOf fabric.Image.filters
   * @extends fabric.Image.filters.BaseFilter
   * @see {@link fabric.Image.filters.Contrast#initialize} for constructor definition
   * @see {@link http://fabricjs.com/image-filters|ImageFilters demo}
   * @example
   * var filter = new fabric.Image.filters.Contrast({
   *   contrast: 40
   * });
   * object.filters.push(filter);
   * object.applyFilters(canvas.renderAll.bind(canvas));
   */
  filters.Contrast = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.Contrast.prototype */ {

    /**
     * Filter type
     * @param {String} type
     * @default
     */
    type: 'Contrast',

    /**
     * Constructor
     * @memberOf fabric.Image.filters.Contrast.prototype
     * @param {Object} [options] Options object
     * @param {Number} [options.contrast=0] Value to contrast the image up (-255...255)
     */
    initialize: function(options) {
      options = options || { };
      this.contrast = options.contrast || 0;
    },

    /**
     * Applies filter to canvas element
     * @param {Object} canvasEl Canvas element to apply filter to
     */
    applyTo: function(canvasEl) {
      var context = canvasEl.getContext('2d'),
          imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
          data = imageData.data,
          contrastF = 259 * (this.contrast + 255) / (255 * (259 - this.contrast));

      for (var i = 0, len = data.length; i < len; i += 4) {
        data[i] = contrastF * (data[i] - 128) + 128;
        data[i + 1] = contrastF * (data[i + 1] - 128) + 128;
        data[i + 2] = contrastF * (data[i + 2] - 128) + 128;
      }

      context.putImageData(imageData, 0, 0);
    },

    /**
     * Returns object representation of an instance
     * @return {Object} Object representation of an instance
     */
    toObject: function() {
      return extend(this.callSuper('toObject'), {
        contrast: this.contrast
      });
    }
  });

  /**
   * Returns filter instance from an object representation
   * @static
   * @param {Object} object Object to create an instance from
   * @param {function} [callback] to be invoked after filter creation
   * @return {fabric.Image.filters.Contrast} Instance of fabric.Image.filters.Contrast
   */
  fabric.Image.filters.Contrast.fromObject = fabric.Image.filters.BaseFilter.fromObject;

})(typeof exports !== 'undefined' ? exports : this);
