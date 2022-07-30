(function(global) {
  var fabric = global.fabric, toFixed = fabric.util.toFixed;

  /**
   * Pattern class
   * @class fabric.Pattern
   * @see {@link http://fabricjs.com/patterns|Pattern demo}
   * @see {@link http://fabricjs.com/dynamic-patterns|DynamicPattern demo}
   * @see {@link fabric.Pattern#initialize} for constructor definition
   */


  fabric.Pattern = fabric.util.createClass(/** @lends fabric.Pattern.prototype */ {

    /**
     * Repeat property of a pattern (one of repeat, repeat-x, repeat-y or no-repeat)
     * @type String
     * @default
     */
    repeat: 'repeat',

    /**
     * Pattern horizontal offset from object's left/top corner
     * @type Number
     * @default
     */
    offsetX: 0,

    /**
     * Pattern vertical offset from object's left/top corner
     * @type Number
     * @default
     */
    offsetY: 0,

    /**
     * crossOrigin value (one of "", "anonymous", "use-credentials")
     * @see https://developer.mozilla.org/en-US/docs/HTML/CORS_settings_attributes
     * @type String
     * @default
     */
    crossOrigin: '',

    /**
     * transform matrix to change the pattern, imported from svgs.
     * @type Array
     * @default
     */
    patternTransform: null,

    type: 'pattern',

    /**
     * Constructor
     * @param {Object} [options] Options object
     * @param {option.source} [source] the pattern source, eventually empty or a drawable
     * @return {fabric.Pattern} thisArg
     */
    initialize: function(options) {
      options || (options = { });
      this.id = fabric.Object.__uid++;
      this.setOptions(options);
    },

    /**
     * Returns object representation of a pattern
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of a pattern instance
     */
    toObject: function(propertiesToInclude) {
      var NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS,
          source, object;

      // <img> element
      if (typeof this.source.src === 'string') {
        source = this.source.src;
      }
      // <canvas> element
      else if (typeof this.source === 'object' && this.source.toDataURL) {
        source = this.source.toDataURL();
      }

      object = {
        type: 'pattern',
        source: source,
        repeat: this.repeat,
        crossOrigin: this.crossOrigin,
        offsetX: toFixed(this.offsetX, NUM_FRACTION_DIGITS),
        offsetY: toFixed(this.offsetY, NUM_FRACTION_DIGITS),
        patternTransform: this.patternTransform ? this.patternTransform.concat() : null
      };
      fabric.util.populateWithProperties(this, object, propertiesToInclude);

      return object;
    },

    /* _TO_SVG_START_ */
    /**
     * Returns SVG representation of a pattern
     * @param {fabric.Object} object
     * @return {String} SVG representation of a pattern
     */
    toSVG: function(object) {
      var patternSource = typeof this.source === 'function' ? this.source() : this.source,
          patternWidth = patternSource.width / object.width,
          patternHeight = patternSource.height / object.height,
          patternOffsetX = this.offsetX / object.width,
          patternOffsetY = this.offsetY / object.height,
          patternImgSrc = '';
      if (this.repeat === 'repeat-x' || this.repeat === 'no-repeat') {
        patternHeight = 1;
        if (patternOffsetY) {
          patternHeight += Math.abs(patternOffsetY);
        }
      }
      if (this.repeat === 'repeat-y' || this.repeat === 'no-repeat') {
        patternWidth = 1;
        if (patternOffsetX) {
          patternWidth += Math.abs(patternOffsetX);
        }

      }
      if (patternSource.src) {
        patternImgSrc = patternSource.src;
      }
      else if (patternSource.toDataURL) {
        patternImgSrc = patternSource.toDataURL();
      }

      return '<pattern id="SVGID_' + this.id +
                    '" x="' + patternOffsetX +
                    '" y="' + patternOffsetY +
                    '" width="' + patternWidth +
                    '" height="' + patternHeight + '">\n' +
               '<image x="0" y="0"' +
                      ' width="' + patternSource.width +
                      '" height="' + patternSource.height +
                      '" xlink:href="' + patternImgSrc +
               '"></image>\n' +
             '</pattern>\n';
    },
    /* _TO_SVG_END_ */

    setOptions: function(options) {
      for (var prop in options) {
        this[prop] = options[prop];
      }
    },

    /**
     * Returns an instance of CanvasPattern
     * @param {CanvasRenderingContext2D} ctx Context to create pattern
     * @return {CanvasPattern}
     */
    toLive: function(ctx) {
      var source = this.source;
      // if the image failed to load, return, and allow rest to continue loading
      if (!source) {
        return '';
      }

      // if an image
      if (typeof source.src !== 'undefined') {
        if (!source.complete) {
          return '';
        }
        if (source.naturalWidth === 0 || source.naturalHeight === 0) {
          return '';
        }
      }
      return ctx.createPattern(source, this.repeat);
    }
  });

  /**
   *
   * @param {object} object
   * @param {object} [options]
   * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns
   */
  fabric.Pattern.fromObject = function(object, options) {
    var patternOptions = Object.assign({}, object),
        imageOptions = Object.assign({}, options, { crossOrigin: object.crossOrigin });
    return fabric.util.loadImage(object.source, imageOptions)
      .then(function(img) {
        patternOptions.source = img;
        return new fabric.Pattern(patternOptions);
      });
  };
})(typeof exports !== 'undefined' ? exports : window);
