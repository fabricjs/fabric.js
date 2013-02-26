/**
 * @namespace Image filters
 */
fabric.Image.filters = { };

/**
 * Grayscale image filter class
 * @class fabric.Image.filters.Grayscale
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.Grayscale = fabric.util.createClass( /** @scope fabric.Image.filters.Grayscale.prototype */ {

  /**
   * Filter type
   * @param {String} type
   */
  type: "Grayscale",

  /**
   * Applies filter to canvas element
   * @method applyTo
   * @memberOf fabric.Image.filters.Grayscale.prototype
   * @param {Object} canvasEl Canvas element to apply filter to
   */
  applyTo: function(canvasEl) {
    var context = canvasEl.getContext('2d'),
        imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
        data = imageData.data,
        iLen = imageData.width,
        jLen = imageData.height,
        index, average, i, j;

     for (i = 0; i < iLen; i++) {
       for (j = 0; j < jLen; j++) {

         index = (i * 4) * jLen + (j * 4);
         average = (data[index] + data[index + 1] + data[index + 2]) / 3;

         data[index]     = average;
         data[index + 1] = average;
         data[index + 2] = average;
       }
     }

     context.putImageData(imageData, 0, 0);
  },

  /**
   * Returns json representation of filter
   * @method toJSON
   * @return {String} json representation of filter
   */
  toJSON: function() {
    return { type: this.type };
  }
});

/**
 * Returns filter instance from an object representation
 * @static
 * @method fabric.Image.filters.Grayscale.fromObject
 * @return {fabric.Image.filters.Grayscale}
 */
fabric.Image.filters.Grayscale.fromObject = function() {
  return new fabric.Image.filters.Grayscale();
};

/**
 * Remove white filter class
 * @class fabric.Image.filters.RemoveWhite
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.RemoveWhite = fabric.util.createClass( /** @scope fabric.Image.filters.RemoveWhite.prototype */ {

  /**
   * Filter type
   * @param {String} type
   */
  type: "RemoveWhite",

  /**
   * Constructor
   * @memberOf fabric.Image.filters.RemoveWhite.prototype
   * @param {Object} [options] Options object
   */
  initialize: function(options) {
    options || (options = { });
    this.threshold = options.threshold || 30;
    this.distance = options.distance || 20;
  },

  /**
   * Applies filter to canvas element
   * @method applyTo
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
          abs(g-b) < distance) {

        data[i+3] = 1;
      }
    }

    context.putImageData(imageData, 0, 0);
  },

  /**
   * Returns json representation of filter
   * @method toJSON
   * @return {String} json representation of filter
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
 * @method fabric.Image.filters.RemoveWhite.fromObject
 * @return {fabric.Image.filters.RemoveWhite}
 */
fabric.Image.filters.RemoveWhite.fromObject = function(object) {
  return new fabric.Image.filters.RemoveWhite(object);
};

/**
 * Invert filter class
 * @class fabric.Image.filters.Invert
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.Invert = fabric.util.createClass( /** @scope fabric.Image.filters.Invert.prototype */ {

  /**
   * Filter type
   * @param {String} type
   */
  type: "Invert",

  /**
   * Applies filter to canvas element
   * @method applyTo
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
   * @method toJSON
   * @return {String} json representation of filter
   */
  toJSON: function() {
    return { type: this.type };
  }
});

/**
 * Returns filter instance from an object representation
 * @static
 * @method fabric.Image.filters.Invert.fromObject
 * @return {fabric.Image.filters.Invert}
 */
fabric.Image.filters.Invert.fromObject = function() {
  return new fabric.Image.filters.Invert();
};

/**
 * Sepia filter class
 * @class fabric.Image.filters.Sepia
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.Sepia = fabric.util.createClass( /** @scope fabric.Image.filters.Sepia.prototype */ {

  /**
   * Filter type
   * @param {String} type
   */
  type: "Sepia",

  /**
   * Applies filter to canvas element
   * @method applyTo
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
   * @method toJSON
   * @return {String} json representation of filter
   */
  toJSON: function() {
    return { type: this.type };
  }
});

/**
 * Returns filter instance from an object representation
 * @static
 * @method fabric.Image.filters.Sepia.fromObject
 * @return {fabric.Image.filters.Sepia}
 */
fabric.Image.filters.Sepia.fromObject = function() {
  return new fabric.Image.filters.Sepia();
};

/**
 * Sepia2 filter class
 * @class fabric.Image.filters.Sepia2
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.Sepia2 = fabric.util.createClass( /** @scope fabric.Image.filters.Sepia2.prototype */ {

  /**
   * Filter type
   * @param {String} type
   */
  type: "Sepia2",

  /**
   * Applies filter to canvas element
   * @method applyTo
   * @memberOf fabric.Image.filters.Sepia.prototype
   * @param {Object} canvasEl Canvas element to apply filter to
   */
  applyTo: function(canvasEl) {
    var context = canvasEl.getContext('2d'),
        imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
        data = imageData.data,
        iLen = data.length, i, r, g, b;

     for (i = 0; i < iLen; i+=4) {

        r = data[i];
        g = data[i + 1];
        b = data[i + 2];

        data[i] = (r * 0.393 + g * 0.769 + b * 0.189 ) / 1.351;
        data[i + 1] = (r * 0.349 + g * 0.686 + b * 0.168 ) / 1.203;
        data[i + 2] = (r * 0.272 + g * 0.534 + b * 0.131 ) / 2.140;
     }

     context.putImageData(imageData, 0, 0);
  },

  /**
   * Returns json representation of filter
   * @method toJSON
   * @return {String} json representation of filter
   */
  toJSON: function() {
    return { type: this.type };
  }
});

/**
 * Returns filter instance from an object representation
 * @static
 * @method fabric.Image.filters.Sepia2.fromObject
 * @return {fabric.Image.filters.Sepia2}
 */
fabric.Image.filters.Sepia2.fromObject = function() {
  return new fabric.Image.filters.Sepia2();
};

/**
 * Brightness filter class
 * @class fabric.Image.filters.Brightness
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.Brightness = fabric.util.createClass( /** @scope fabric.Image.filters.Brightness.prototype */ {

  /**
   * Filter type
   * @param {String} type
   */
  type: "Brightness",

  /**
   * Constructor
   * @memberOf fabric.Image.filters.Brightness.prototype
   * @param {Object} [options] Options object
   */
  initialize: function(options) {
    options || (options = { });
    this.brightness = options.brightness || 100;
  },

  /**
   * Applies filter to canvas element
   * @method applyTo
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
   * Returns json representation of filter
   * @method toJSON
   * @return {String} json representation of filter
   */
  toJSON: function() {
    return {
      type: this.type,
      brightness: this.brightness
    };
  }
});

/**
 * Returns filter instance from an object representation
 * @static
 * @method fabric.Image.filters.Brightness.fromObject
 * @return {fabric.Image.filters.Brightness}
 */
fabric.Image.filters.Brightness.fromObject = function(object) {
  return new fabric.Image.filters.Brightness(object);
};

/**
 * Noise filter class
 * @class fabric.Image.filters.Noise
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.Noise = fabric.util.createClass( /** @scope fabric.Image.filters.Noise.prototype */ {

  /**
   * Filter type
   * @param {String} type
   */
  type: "Noise",

  /**
   * Constructor
   * @memberOf fabric.Image.filters.Noise.prototype
   * @param {Object} [options] Options object
   */
  initialize: function(options) {
    options || (options = { });
    this.noise = options.noise || 100;
  },

  /**
   * Applies filter to canvas element
   * @method applyTo
   * @param {Object} canvasEl Canvas element to apply filter to
   */
  applyTo: function(canvasEl) {
    var context = canvasEl.getContext('2d'),
        imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
        data = imageData.data,
        noise = this.noise, rand;

    for (var i = 0, len = data.length; i < len; i += 4) {

      rand = (0.5 - Math.random()) * noise;

      data[i] += rand;
      data[i + 1] += rand;
      data[i + 2] += rand;
    }

    context.putImageData(imageData, 0, 0);
  },

  /**
   * Returns json representation of filter
   * @method toJSON
   * @return {String} json representation of filter
   */
  toJSON: function() {
    return {
      type: this.type,
      noise: this.noise
    };
  }
});

/**
 * Returns filter instance from an object representation
 * @static
 * @method fabric.Image.filters.Noise.fromObject
 * @return {fabric.Image.filters.Noise}
 */
fabric.Image.filters.Noise.fromObject = function(object) {
  return new fabric.Image.filters.Noise(object);
};

/**
 * GradientTransparency filter class
 * @class fabric.Image.filters.GradientTransparency
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.GradientTransparency = fabric.util.createClass( /** @scope fabric.Image.filters.GradientTransparency.prototype */ {

  /**
   * Filter type
   * @param {String} type
   */
  type: "GradientTransparency",

  /**
   * Constructor
   * @memberOf fabric.Image.filters.GradientTransparency
   * @param {Object} [options] Options object
   */
  initialize: function(options) {
    options || (options = { });
    this.threshold = options.threshold || 100;
  },

  /**
   * Applies filter to canvas element
   * @method applyTo
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
   * @method toJSON
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
 * @method fabric.Image.filters.GradientTransparency.fromObject
 * @return {fabric.Image.filters.GradientTransparency}
 */
fabric.Image.filters.GradientTransparency.fromObject = function(object) {
  return new fabric.Image.filters.GradientTransparency(object);
};

/**
 * Tint filter class
 * @class fabric.Image.filters.Tint
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.Tint = fabric.util.createClass( /** @scope fabric.Image.filters.Tint.prototype */ {

  /**
   * Filter type
   * @param {String} type
   */
  type: "Tint",

  /**
   * Constructor
   * @memberOf fabric.Image.filters.Tint.prototype
   * @param {Object} [options] Options object
   */
  initialize: function(options) {
    options || (options = { });
    this.color = options.color || 0;
  },

  /**
   * Applies filter to canvas element
   * @method applyTo
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
   * @method toJSON
   * @return {String} json representation of filter
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
 * @method fabric.Image.filters.Tint.fromObject
 * @return {fabric.Image.filters.Tint}
 */
fabric.Image.filters.Tint.fromObject = function(object) {
  return new fabric.Image.filters.Tint(object);
};

/**
 * Adapted from <a href="http://www.html5rocks.com/en/tutorials/canvas/imagefilters/">html5rocks article</a>
 * @class fabric.Image.filters.Convolute
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.Convolute = fabric.util.createClass(/** @scope fabric.Image.filters.Convolute.prototype */ {

  /**
   * Filter type
   * @param {String} type
   */
  type: 'Convolute',

  /**
   * Constructor
   * @memberOf fabric.Image.filters.Convolute.prototype
   * @param {Object} [options] Options object
   */
  initialize: function(options) {
    options || (options = { });

    this.opaque = options.opaque;
    this.matrix = options.matrix || [ 0, 0, 0,
                                      0, 1, 0,
                                      0, 0, 0 ];

    var canvasEl = fabric.util.createCanvasElement();
    this.tmpCtx = canvasEl.getContext('2d');
  },

  /**
   * @private
   * @method _createImageData
   */
  _createImageData: function(w, h) {
    return this.tmpCtx.createImageData(w, h);
  },

  /**
   * Applies filter to canvas element
   * @method applyTo
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
   * @method toJSON
   * @return {String} json representation of filter
   */
  toJSON: function() {
    return {
      type: this.type,
      matrix: this.matrix
    };
  }
});

/**
 * Returns filter instance from an object representation
 * @static
 * @method fabric.Image.filters.Convolute.fromObject
 * @return {fabric.Image.filters.Convolute}
 */
fabric.Image.filters.Convolute.fromObject = function(object) {
  return new fabric.Image.filters.Convolute(object);
};

/**
 * Pixelate filter class
 * @class fabric.Image.filters.Pixelate
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.Pixelate = fabric.util.createClass(/** @scope fabric.Image.filters.Pixelate.prototype */ {

  /**
   * Filter type
   * @param {String} type
   */
  type: 'Pixelate',

  /**
   * Constructor
   * @memberOf fabric.Image.filters.Pixelate.prototype
   * @param {Object} [options] Options object
   */
  initialize: function(options) {
    options || (options = { });
    this.blocksize = options.blocksize || 4;
  },

  /**
   * Applies filter to canvas element
   * @method applyTo
   * @param {Object} canvasEl Canvas element to apply filter to
   */
  applyTo: function(canvasEl) {

    var context = canvasEl.getContext('2d'),
        imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
        data = imageData.data,
        iLen = imageData.width,
        jLen = imageData.height,
        index, i, j, r, g, b, a;

    for (i = 0; i < iLen; i += this.blocksize) {
      for (j = 0; j < jLen; j += this.blocksize) {

        index = (i * 4) * jLen + (j * 4);

        r = data[index];
        g = data[index+1];
        b = data[index+2];
        a = data[index+3];

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
   * Returns json representation of filter
   * @method toJSON
   * @return {String} json representation of filter
   */
  toJSON: function() {
    return {
      type: this.type,
      blocksize: this.blocksize
    };
  }
});

/**
 * Returns filter instance from an object representation
 * @static
 * @method fabric.Image.filters.Pixelate.fromObject
 * @return {fabric.Image.filters.Pixelate}
 */
fabric.Image.filters.Pixelate.fromObject = function(object) {
  return new fabric.Image.filters.Pixelate(object);
};