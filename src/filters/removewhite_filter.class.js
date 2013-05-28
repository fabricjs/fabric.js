/**
 * @namespace fabric.Image.filters
 * @memberOf fabric.Image
 */
fabric.Image.filters = fabric.Image.filters || { };

/**
 * Remove white filter class
 * @class fabric.Image.filters.RemoveWhite
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.RemoveWhite = fabric.util.createClass(/** @lends fabric.Image.filters.RemoveWhite.prototype */ {

  /**
   * Filter type
   * @param {String} type
   * @default
   */
  type: 'RemoveWhite',

  /**
   * Constructor
   * @memberOf fabric.Image.filters.RemoveWhite.prototype
   * @param {Object} [options] Options object
   */
  initialize: function(options) {
    options = options || { };
    this.threshold = options.threshold || 30;
    this.distance = options.distance || 20;
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
        distance = this.distance,
        limit = 255 - threshold,
        abs = Math.abs,
        r, g, b;

    for (var i = 0, len = data.length; i < len; i += 4) {
      r = data[i];
      g = data[i+1];
      b = data[i+2];

      if (r > limit &&
          g > limit &&
          b > limit &&
          abs(r-g) < distance &&
          abs(r-b) < distance &&
          abs(g-b) < distance
      ) {
        data[i+3] = 1;
      }
    }

    context.putImageData(imageData, 0, 0);
  },

  /**
   * Returns json representation of filter
   * @return {Object} JSON representation of filter
   */
  toJSON: function() {
    return {
      type: this.type,
      threshold: this.threshold,
      distance: this.distance
    };
  }
});

/**
 * Returns filter instance from an object representation
 * @static
 * @param {Object} object Object to create an instance from
 * @return {fabric.Image.filters.RemoveWhite} Instance of fabric.Image.filters.RemoveWhite
 */
fabric.Image.filters.RemoveWhite.fromObject = function(object) {
  return new fabric.Image.filters.RemoveWhite(object);
};
