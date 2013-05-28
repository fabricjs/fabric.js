/**
 * @namespace fabric.Image.filters
 * @memberOf fabric.Image
 */
fabric.Image.filters = fabric.Image.filters || { };

/**
 * Sepia filter class
 * @class fabric.Image.filters.Sepia
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.Sepia = fabric.util.createClass(/** @lends fabric.Image.filters.Sepia.prototype */ {

  /**
   * Filter type
   * @param {String} type
   * @default
   */
  type: 'Sepia',

  /**
   * Applies filter to canvas element
   * @memberOf fabric.Image.filters.Sepia.prototype
   * @param {Object} canvasEl Canvas element to apply filter to
   */
  applyTo: function(canvasEl) {
    var context = canvasEl.getContext('2d'),
        imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
        data = imageData.data,
        iLen = data.length, i, avg;

    for (i = 0; i < iLen; i+=4) {
      avg = 0.3  * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
      data[i] = avg + 100;
      data[i + 1] = avg + 50;
      data[i + 2] = avg + 255;
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
 * @return {fabric.Image.filters.Sepia} Instance of fabric.Image.filters.Sepia
 */
fabric.Image.filters.Sepia.fromObject = function() {
  return new fabric.Image.filters.Sepia();
};
