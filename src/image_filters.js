/**
 * @namespace
 */
fabric.Image.filters = { };

/**
 * @class fabric.Image.filters.Grayscale
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.Grayscale = fabric.util.createClass( /** @scope fabric.Image.filters.Grayscale.prototype */ {
  
  /**
   * @param {String} type
   */
  type: "Grayscale",
  
  /** 
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
   * @method toJSON
   * @return {String} json representation of filter
   */
  toJSON: function() {
    return { type: this.type };
  }
});

fabric.Image.filters.Grayscale.fromObject = function() {
  return new fabric.Image.filters.Grayscale();
};
  
/**
 * @class fabric.Image.filters.RemoveWhite
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.RemoveWhite = fabric.util.createClass( /** @scope fabric.Image.filters.RemoveWhite.prototype */ {
  
  /**
   * @param {String} type
   */
  type: "RemoveWhite",
  
  /** 
   * @memberOf fabric.Image.filters.RemoveWhite.prototype
   * @param {Object} [options] Options object
   */
  initialize: function(options) {
    options || (options = { });
    this.threshold = options.threshold || 30;
    this.distance = options.distance || 20;
  },
  
  /** 
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

fabric.Image.filters.RemoveWhite.fromObject = function(object) {
  return new fabric.Image.filters.RemoveWhite(object);
};

/**
 * @class fabric.Image.filters.Invert
 * @memberOf fabric.Image.filters
 */
fabric.Image.filters.Invert = fabric.util.createClass( /** @scope fabric.Image.filters.Invert.prototype */ {
  
  /**
   * @param {String} type
   */
  type: "Invert",
  
  /** 
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
   * @method toJSON
   * @return {String} json representation of filter
   */
  toJSON: function() {
    return { type: this.type };
  }
});

fabric.Image.filters.Invert.fromObject = function() {
  return new fabric.Image.filters.Invert();
};