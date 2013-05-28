/**
 * @namespace fabric.Image.filters
 * @memberOf fabric.Image
 */
fabric.Image.filters = fabric.Image.filters || { };

/**
 * Grayscale image filter class
 * @class fabric.Image.filters.Grayscale
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.Grayscale = fabric.util.createClass(/** @lends fabric.Image.filters.Grayscale.prototype */ {

  /**
   * Filter type
   * @param {String} type
   * @default
   */
  type: 'Grayscale',

  /**
   * Applies filter to canvas element
   * @memberOf fabric.Image.filters.Grayscale.prototype
   * @param {Object} canvasEl Canvas element to apply filter to
   */
  applyTo: function(canvasEl) {
    var context = canvasEl.getContext('2d'),
        imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
        data = imageData.data,
        len = imageData.width * imageData.height * 4,
        index = 0,
        average;

    while (index < len) {
      average = (data[index] + data[index + 1] + data[index + 2]) / 3;
      data[index]     = average;
      data[index + 1] = average;
      data[index + 2] = average;
      index += 4;
    }

    context.putImageData(imageData, 0, 0);
  },

  /**
   * Returns json representation of filter
   * @return {Object} JSON representation of filter
   */
  toJSON: function() {
    return { type: this.type };
  }
});

/**
 * Returns filter instance from an object representation
 * @static
 * @return {fabric.Image.filters.Grayscale} Instance of fabric.Image.filters.Grayscale
 */
fabric.Image.filters.Grayscale.fromObject = function() {
  return new fabric.Image.filters.Grayscale();
};
