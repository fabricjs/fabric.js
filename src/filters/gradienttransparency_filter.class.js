/**
 * @namespace fabric.Image.filters
 * @memberOf fabric.Image
 */
fabric.Image.filters = fabric.Image.filters || { };

/**
 * GradientTransparency filter class
 * @class fabric.Image.filters.GradientTransparency
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.GradientTransparency = fabric.util.createClass(/** @lends fabric.Image.filters.GradientTransparency.prototype */ {

  /**
   * Filter type
   * @param {String} type
   * @default
   */
  type: 'GradientTransparency',

  /**
   * Constructor
   * @memberOf fabric.Image.filters.GradientTransparency
   * @param {Object} [options] Options object
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
   * Returns json representation of filter
   * @return {String} json representation of filter
   */
  toJSON: function() {
    return {
      type: this.type,
      threshold: this.threshold
    };
  }
});

/**
 * Returns filter instance from an object representation
 * @static
 * @param {Object} object Object to create an instance from
 * @return {fabric.Image.filters.GradientTransparency} Instance of fabric.Image.filters.GradientTransparency
 */
fabric.Image.filters.GradientTransparency.fromObject = function(object) {
  return new fabric.Image.filters.GradientTransparency(object);
};
