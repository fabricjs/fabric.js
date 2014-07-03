(function(global) {

  'use strict';

  var fabric  = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend;

  /**
   * Multiply filter class
   * Adapted from <a href="http://www.laurenscorijn.com/articles/colormath-basics">http://www.laurenscorijn.com/articles/colormath-basics</a>
   * @class fabric.Image.filters.Multiply
   * @memberOf fabric.Image.filters
   * @extends fabric.Image.filters.BaseFilter
   * @example <caption>Multiply filter with hex color</caption>
   * var filter = new fabric.Image.filters.Multiply({
   *   color: '#F0F'
   * });
   * object.filters.push(filter);
   * object.applyFilters(canvas.renderAll.bind(canvas));
   * @example <caption>Multiply filter with rgb color</caption>
   * var filter = new fabric.Image.filters.Multiply({
   *   color: 'rgb(53, 21, 176)'
   * });
   * object.filters.push(filter);
   * object.applyFilters(canvas.renderAll.bind(canvas));
   */
  fabric.Image.filters.Multiply = fabric.util.createClass(fabric.Image.filters.BaseFilter, /** @lends fabric.Image.filters.Multiply.prototype */ {

    /**
     * Filter type
     * @param {String} type
     * @default
     */
    type: 'Multiply',

    /**
     * Constructor
     * @memberOf fabric.Image.filters.Multiply.prototype
     * @param {Object} [options] Options object
     * @param {String} [options.color=#000000] Color to multiply the image pixels with
     */
    initialize: function(options) {
      options = options || { };

      this.color = options.color || '#000000';
    },

    /**
     * Applies filter to canvas element
     * @param {Object} canvasEl Canvas element to apply filter to
     */
    applyTo: function(canvasEl) {
      var context = canvasEl.getContext('2d'),
          imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
          data = imageData.data,
          iLen = data.length, i,
          source;

      source = new fabric.Color(this.color).getSource();

      for (i = 0; i < iLen; i+=4) {
        data[i] *= source[0] / 255;
        data[i + 1] *= source[1] / 255;
        data[i + 2] *= source[2] / 255;
      }

      context.putImageData(imageData, 0, 0);
    },

    /**
     * Returns object representation of an instance
     * @return {Object} Object representation of an instance
     */
    toObject: function() {
      return extend(this.callSuper('toObject'), {
        color: this.color
      });
    }
  });

  /**
   * Returns filter instance from an object representation
   * @static
   * @param {Object} object Object to create an instance from
   * @return {fabric.Image.filters.Multiply} Instance of fabric.Image.filters.Multiply
   */
  fabric.Image.filters.Multiply.fromObject = function(object) {
    return new fabric.Image.filters.Multiply(object);
  };

})(typeof exports !== 'undefined' ? exports : this);
