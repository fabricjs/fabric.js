/**
 * @namespace fabric.Image.filters
 * @memberOf fabric.Image
 */
fabric.Image.filters = fabric.Image.filters || { };

/**
 * Tint filter class
 * @class fabric.Image.filters.Tint
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.Tint = fabric.util.createClass(/** @lends fabric.Image.filters.Tint.prototype */ {

  /**
   * Filter type
   * @param {String} type
   * @default
   */
  type: 'Tint',

  /**
   * Constructor
   * @memberOf fabric.Image.filters.Tint.prototype
   * @param {Object} [options] Options object
   */
  initialize: function(options) {
    options = options || { };
    this.color = options.color || 0;
  },

  /**
   * Applies filter to canvas element
   * @param {Object} canvasEl Canvas element to apply filter to
   */
  applyTo: function(canvasEl) {
    var context = canvasEl.getContext('2d'),
        imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
        data = imageData.data,
        iLen = data.length, i, a;

    var rgb = parseInt(this.color, 10).toString(16);

    var cr = parseInt('0x' + rgb.substr(0, 2), 16);
    var cg = parseInt('0x' + rgb.substr(2, 2), 16);
    var cb = parseInt('0x' + rgb.substr(4, 2), 16);

    for (i = 0; i < iLen; i+=4) {
      a = data[i+3];

      if (a > 0){
        data[i] = cr;
        data[i+1] = cg;
        data[i+2] = cb;
      }
    }

    context.putImageData(imageData, 0, 0);
  },

  /**
   * Returns json representation of filter
   * @return {Object} json representation of filter
   */
  toJSON: function() {
    return {
      type: this.type,
      color: this.color
    };
  }
});

/**
 * Returns filter instance from an object representation
 * @static
 * @param {Object} object Object to create an instance from
 * @return {fabric.Image.filters.Tint} Instance of fabric.Image.filters.Tint
 */
fabric.Image.filters.Tint.fromObject = function(object) {
  return new fabric.Image.filters.Tint(object);
};
