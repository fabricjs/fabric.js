(function(global) {

  'use strict';

  var fabric  = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend;

  /**
   * Pixelate filter class
   * @class fabric.Image.filters.Pixelate
   * @memberOf fabric.Image.filters
   * @extends fabric.Image.filters.BaseFilter
   * @see {@link fabric.Image.filters.Pixelate#initialize} for constructor definition
   * @see {@link http://fabricjs.com/image-filters/|ImageFilters demo}
   * @example
   * var filter = new fabric.Image.filters.Pixelate({
   *   blocksize: 8
   * });
   * object.filters.push(filter);
   * object.applyFilters(canvas.renderAll.bind(canvas));
   */
  fabric.Image.filters.Pixelate = fabric.util.createClass(fabric.Image.filters.BaseFilter, /** @lends fabric.Image.filters.Pixelate.prototype */ {

    /**
     * Filter type
     * @param {String} type
     * @default
     */
    type: 'Pixelate',

    /**
     * Constructor
     * @memberOf fabric.Image.filters.Pixelate.prototype
     * @param {Object} [options] Options object
     * @param {Number} [options.blocksize=4] Blocksize for pixelate
     */
    initialize: function(options) {
      options = options || { };
      this.blocksize = options.blocksize || 4;
    },

    /**
     * Applies filter to canvas element
     * @param {Object} canvasEl Canvas element to apply filter to
     */
    applyTo: function(canvasEl) {
      var context = canvasEl.getContext('2d'),
          imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
          data = imageData.data,
          iLen = imageData.height,
          jLen = imageData.width,
          index, i, j, r, g, b, a;

      for (i = 0; i < iLen; i += this.blocksize) {
        for (j = 0; j < jLen; j += this.blocksize) {

          index = (i * 4) * jLen + (j * 4);

          r = data[index];
          g = data[index + 1];
          b = data[index + 2];
          a = data[index + 3];

          /*
           blocksize: 4

           [1,x,x,x,1]
           [x,x,x,x,1]
           [x,x,x,x,1]
           [x,x,x,x,1]
           [1,1,1,1,1]
           */

          for (var _i = i, _ilen = i + this.blocksize; _i < _ilen; _i++) {
            for (var _j = j, _jlen = j + this.blocksize; _j < _jlen; _j++) {
              index = (_i * 4) * jLen + (_j * 4);
              data[index] = r;
              data[index + 1] = g;
              data[index + 2] = b;
              data[index + 3] = a;
            }
          }
        }
      }

      context.putImageData(imageData, 0, 0);
    },

    /**
     * Returns object representation of an instance
     * @return {Object} Object representation of an instance
     */
    toObject: function() {
      return extend(this.callSuper('toObject'), {
        blocksize: this.blocksize
      });
    }
  });

  /**
   * Returns filter instance from an object representation
   * @static
   * @param {Object} object Object to create an instance from
   * @return {fabric.Image.filters.Pixelate} Instance of fabric.Image.filters.Pixelate
   */
  fabric.Image.filters.Pixelate.fromObject = function(object) {
    return new fabric.Image.filters.Pixelate(object);
  };

})(typeof exports !== 'undefined' ? exports : this);
