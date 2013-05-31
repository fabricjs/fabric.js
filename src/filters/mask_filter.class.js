/**
 * @namespace fabric.Image.filters
 * @memberOf fabric.Image
 */
fabric.Image.filters = fabric.Image.filters || { };

/**
 * Mask filter class
 * @class fabric.Image.filters.Mask
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.Mask = fabric.util.createClass(/** @lends fabric.Image.filters.Mask.prototype */ {

  /**
   * Filter type
   * @param {String} type
   * @default
   */
  type: 'Mask',

  /**
   * Constructor
   * @memberOf fabric.Image.filters.Mask.prototype
   * @param {Object} [options] Options object
   */
  initialize: function(options) {
    options = options || { };
    this.mask = options.mask || null;
    this.channel = [ 0, 1, 2, 3 ].indexOf( options.channel ) > -1 ? options.channel : 0;
  },

  /**
   * Applies filter to canvas element
   * @param {Object} canvasEl Canvas element to apply filter to
   */
  applyTo: function(canvasEl) {
    if(!this.mask) return;
    var context = canvasEl.getContext('2d'),
      imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
      data = imageData.data,
          maskEl = this.mask._originalImage,
      maskCanvasEl = fabric.util.createCanvasElement(),
      channel = this.channel,
      i;
    maskCanvasEl.width = maskEl.width;
    maskCanvasEl.height = maskEl.height;
    maskCanvasEl.getContext('2d').drawImage(maskEl, 0, 0, maskEl.width, maskEl.height);
    var maskImageData = maskCanvasEl.getContext('2d').getImageData(0, 0, maskEl.width, maskEl.height),
      maskData = maskImageData.data;
    for ( i = 0; i < imageData.width * imageData.height * 4; i += 4 ) {
      data[ i + 3 ] = maskData[ i + channel ];
    }
    context.putImageData( imageData, 0, 0 );
  }

  /**
   * Returns json representation of filter
   * @return {Object} json representation of filter
   */
  toJSON: function() {
    return {
      type: this.type,
      mask: this.mask,
      channel: this.channel
    };
  }
});

/**
 * Returns filter instance from an object representation
 * @static
 * @param {Object} object Object to create an instance from
 * @return {fabric.Image.filters.Mask} Instance of fabric.Image.filters.Mask
 */
fabric.Image.filters.Mask.fromObject = function(object) {
  return new fabric.Image.filters.Mask(object);
};
