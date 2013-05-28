/**
 * @namespace fabric.Image.filters
 * @memberOf fabric.Image
 */
fabric.Image.filters = fabric.Image.filters || { };

/**
 * Adapted from <a href="http://www.html5rocks.com/en/tutorials/canvas/imagefilters/">html5rocks article</a>
 * @class fabric.Image.filters.Convolute
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.Convolute = fabric.util.createClass(/** @lends fabric.Image.filters.Convolute.prototype */ {

  /**
   * Filter type
   * @param {String} type
   * @default
   */
  type: 'Convolute',

  /**
   * Constructor
   * @memberOf fabric.Image.filters.Convolute.prototype
   * @param {Object} [options] Options object
   */
  initialize: function(options) {
    options = options || { };

    this.opaque = options.opaque;
    this.matrix = options.matrix || [ 0, 0, 0,
      0, 1, 0,
      0, 0, 0 ];

    var canvasEl = fabric.util.createCanvasElement();
    this.tmpCtx = canvasEl.getContext('2d');
  },

  /**
   * @private
   */
  _createImageData: function(w, h) {
    return this.tmpCtx.createImageData(w, h);
  },

  /**
   * Applies filter to canvas element
   * @param {Object} canvasEl Canvas element to apply filter to
   */
  applyTo: function(canvasEl) {
    var weights = this.matrix;
    var context = canvasEl.getContext('2d');
    var pixels = context.getImageData(0, 0, canvasEl.width, canvasEl.height);

    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side/2);
    var src = pixels.data;
    var sw = pixels.width;
    var sh = pixels.height;

    // pad output by the convolution matrix
    var w = sw;
    var h = sh;
    var output = this._createImageData(w, h);

    var dst = output.data;

    // go through the destination image pixels
    var alphaFac = this.opaque ? 1 : 0;
    for (var y=0; y<h; y++) {
      for (var x=0; x<w; x++) {
        var sy = y;
        var sx = x;
        var dstOff = (y*w+x)*4;
        // calculate the weighed sum of the source image pixels that
        // fall under the convolution matrix
        var r=0, g=0, b=0, a=0;
        for (var cy=0; cy<side; cy++) {
          for (var cx=0; cx<side; cx++) {
            var scy = sy + cy - halfSide;
            var scx = sx + cx - halfSide;
            if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
              var srcOff = (scy*sw+scx)*4;
              var wt = weights[cy*side+cx];
              r += src[srcOff] * wt;
              g += src[srcOff+1] * wt;
              b += src[srcOff+2] * wt;
              a += src[srcOff+3] * wt;
            }
          }
        }
        dst[dstOff] = r;
        dst[dstOff+1] = g;
        dst[dstOff+2] = b;
        dst[dstOff+3] = a + alphaFac*(255-a);
      }
    }

    context.putImageData(output, 0, 0);
  },

  /**
   * Returns json representation of filter
   * @return {String} json representation of filter
   */
  toJSON: function() {
    return {
      type: this.type,
      opaque: this.opaque,
      matrix: this.matrix
    };
  }
});

/**
 * Returns filter instance from an object representation
 * @static
 * @param {Object} object Object to create an instance from
 * @return {fabric.Image.filters.Convolute} Instance of fabric.Image.filters.Convolute
 */
fabric.Image.filters.Convolute.fromObject = function(object) {
    return new fabric.Image.filters.Convolute(object);
};
