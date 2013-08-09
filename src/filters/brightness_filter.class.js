/**
 * Brightness filter class
 * @class fabric.Image.filters.Brightness
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.Brightness = fabric.util.createClass(/** @lends fabric.Image.filters.Brightness.prototype */ {

  /**
   * Filter type
   * @param {String} type
   * @default
   */
  type: 'Brightness',

  /**
   * Constructor
   * @memberOf fabric.Image.filters.Brightness.prototype
   * @param {Object} [options] Options object
   */
  initialize: function(options) {
    options = options || { };
    this.brightness = options.brightness || 100;
  },

  /**
   * Applies filter to canvas element
   * @param {Object} canvasEl Canvas element to apply filter to
   */
  applyTo: function(canvasEl) {
    var context = canvasEl.getContext('2d'),
        imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
        data = imageData.data,
        brightness = this.brightness;

    for (var i = 0, len = data.length; i < len; i += 4) {
      data[i] += brightness;
      data[i + 1] += brightness;
      data[i + 2] += brightness;
    }

    context.putImageData(imageData, 0, 0);
  },

  /**
   * Returns object representation of an instance
   * @return {Object} Object representation of an instance
   */
  toObject: function() {
    return {
      type: this.type,
      brightness: this.brightness
    };
  },

  /**
   * Returns a JSON representation of an instance
   * @return {Object} JSON
   */
  toJSON: function() {
    // delegate, not alias
    return this.toObject();
  }
});

/**
 * Returns filter instance from an object representation
 * @static
 * @param {Object} object Object to create an instance from
 * @return {fabric.Image.filters.Brightness} Instance of fabric.Image.filters.Brightness
 */
fabric.Image.filters.Brightness.fromObject = function(object) {
  return new fabric.Image.filters.Brightness(object);
};
