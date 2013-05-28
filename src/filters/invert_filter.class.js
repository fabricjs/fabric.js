/**
 * @namespace fabric.Image.filters
 * @memberOf fabric.Image
 */
fabric.Image.filters = fabric.Image.filters || { };

/**
 * Invert filter class
 * @class fabric.Image.filters.Invert
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.Invert = fabric.util.createClass(/** @lends fabric.Image.filters.Invert.prototype */ {

  /**
   * Filter type
   * @param {String} type
   * @default
   */
  type: 'Invert',

  /**
   * Applies filter to canvas element
   * @memberOf fabric.Image.filters.Invert.prototype
   * @param {Object} canvasEl Canvas element to apply filter to
   */
  applyTo: function(canvasEl) {
    var context = canvasEl.getContext('2d'),
        imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
        data = imageData.data,
        iLen = data.length, i;

    for (i = 0; i < iLen; i+=4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }

    context.putImageData(imageData, 0, 0);
  },

  /**
   * Returns json representation of filter
   * @return {String} json representation of filter
   */
  toJSON: function() {
    return { type: this.type };
  }
});

/**
 * Returns filter instance from an object representation
 * @static
 * @return {fabric.Image.filters.Invert} Instance of fabric.Image.filters.Invert
 */
fabric.Image.filters.Invert.fromObject = function() {
  return new fabric.Image.filters.Invert();
};
