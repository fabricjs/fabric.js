(function(){
  
  /**
   * @constructor
   * @param {String} color (optional) in hex or rgb(a) format
   */
  function Color(color) {
    if (!color) {
      this.setSource([0, 0, 0, 1]);
    }
    else {
      this._tryParsingColor(color);
    }
  }
  
  /**
   * @private
   * @method _tryParsingColor
   */
  Color.prototype._tryParsingColor = function(color) {
    var source = Color.sourceFromHex(color);
    if (!source) {
      source = Color.sourceFromRgb(color);
    }
    if (source) {
      this.setSource(source);
    }
  }
  
  /**
   * @method getSource
   * @return {Array}
   */
  Color.prototype.getSource = function() {
    return this._source;
  };
  
  /**
   * @method setSource
   * @param {Array} source
   */
  Color.prototype.setSource = function(source) {
    this._source = source;
  };
  
  /**
   * @method toRgb
   * @return {String} ex: rgb(0-255,0-255,0-255)
   */
  Color.prototype.toRgb = function() {
    var source = this.getSource();
    return 'rgb(' + source[0] + ',' + source[1] + ',' + source[2] + ')';
  };
  
  /**
   * @method toRgba
   * @return {String} ex: rgba(0-255,0-255,0-255,0-1)
   */
  Color.prototype.toRgba = function() {
    var source = this.getSource();
    return 'rgba(' + source[0] + ',' + source[1] + ',' + source[2] + ',' + source[3] + ')';
  };
  
  /**
   * @method toHex
   * @return {String} ex: FF5555
   */
  Color.prototype.toHex = function() {
    var source = this.getSource();
    
    var r = source[0].toString(16);
    r = (r.length == 1) ? ('0' + r) : r;
    var g = source[1].toString(16);
    g = (g.length == 1) ? ('0' + g) : g;
    var b = source[2].toString(16);
    b = (b.length == 1) ? ('0' + b) : b;
    
    return r.toUpperCase() + g.toUpperCase() + b.toUpperCase();
  };
  
  /**
   * @method getAlpha
   * @return {Number} 0-1
   */
  Color.prototype.getAlpha = function() {
    return this.getSource()[3];
  };
  
  /**
   * @method setAlpha
   * @param {Number} 0-1
   * @return {Color} thisArg
   */
  Color.prototype.setAlpha = function(alpha) {
    var source = this.getSource();
    source[3] = alpha;
    this.setSource(source);
    return this;
  };
  
  /**
   * Transforms color to its grayscale representation
   * @method toGrayscale
   * @return {Color} thisArg
   */
  Color.prototype.toGrayscale = function() {
    var source = this.getSource(),
        average = parseInt((source[0] * 0.3 + source[1] * 0.59 + source[2] * 0.11).toFixed(0), 10),
        currentAlpha = source[3];
    this.setSource([average, average, average, currentAlpha]);
    return this;
  };
  
  /**
   * Transforms color to its black and white representation
   * @method toGrayscale
   * @return {Color} thisArg
   */
  Color.prototype.toBlackWhite = function(threshold) {
    var source = this.getSource(),
        average = (source[0] * 0.3 + source[1] * 0.59 + source[2] * 0.11).toFixed(0),
        currentAlpha = source[3],
        threshold = threshold || 127;
    
    average = (Number(average) < Number(threshold)) ? 0 : 255;
    this.setSource([average, average, average, currentAlpha]);
    return this;
  };
  
  /**
   * Overlays color with another color
   * @method overlayWith
   * @param {Color} otherColor
   * @return {Color} thisArg
   */
  Color.prototype.overlayWith = function(otherColor) {
    otherColor = new Color(otherColor);
    
    var result = [],
        alpha = this.getAlpha(),
        otherAlpha = 0.5,
        source = this.getSource(),
        otherSource = otherColor.getSource();
        
    for (var i = 0; i < 3; i++) {
      result.push(Math.round((source[i] * (1 - otherAlpha)) + (otherSource[i] * otherAlpha)));
    }
    
    result[4] = alpha;
    this.setSource(result);
    return this;
  };
  
  /**
   * @static
   * @field reRGBa
   */
  Color.reRGBa = /^rgba?\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d+(?:\.\d+)?))?\)$/;
  
  /**
   * @static
   * @field reHex
   */
  Color.reHex = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i;

  /**
   * @method fromRgb
   * @param {String} color ex: rgb(0-255,0-255,0-255)
   * @return {Color}
   */
  Color.fromRgb = function(color) {
    return Color.fromSource(Color.sourceFromRgb(color));
  };
  
  /**
   * @method sourceFromRgb
   * @param {String} color ex: rgb(0-255,0-255,0-255)
   * @return {Array} source
   */
  Color.sourceFromRgb = function(color) {
    var match = color.match(Color.reRGBa);
    if (match) {
      return [
        parseInt(match[1], 10),
        parseInt(match[2], 10),
        parseInt(match[3], 10),
        match[4] ? parseFloat(match[4]) : 1
      ];
    }
  };

  /**
   * @static
   * @method fromRgba
   * @return {Color}
   */
  Color.fromRgba = Color.fromRgb;

  /**
   * @static
   * @method fromHex
   * @return {Color}
   */
  Color.fromHex = function(color) {
    return Color.fromSource(Color.sourceFromHex(color));
  };
  
  /**
   * @static
   * @method sourceFromHex
   * @param {String} ex: FF5555
   * @return {Array} source
   */
  Color.sourceFromHex = function(color) {
    if (color.match(Color.reHex)) {
      var value = color.slice(color.indexOf('#') + 1),
          isShortNotation = (value.length === 3),
          r = isShortNotation ? (value.charAt(0) + value.charAt(0)) : value.substring(0, 2),
          g = isShortNotation ? (value.charAt(1) + value.charAt(1)) : value.substring(2, 4),
          b = isShortNotation ? (value.charAt(2) + value.charAt(2)) : value.substring(4, 6);

      return [
        parseInt(r, 16),
        parseInt(g, 16),
        parseInt(b, 16),
        1
      ]
    }
  };
  
  /**
   * @static
   * @method fromSource
   * @return {Color}
   */
  Color.fromSource = function(source) {
    var oColor = new Color();
    oColor.setSource(source);
    return oColor;
  };
  
  if (this.Canvas && !this.Canvas.Color) {
    this.Canvas.Color = Color;
  }
})();