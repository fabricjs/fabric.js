(function() {

  'use strict';

  var toFixed = fabric.util.toFixed;

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
     * Pattern rotation angle, relative to center of object where the pattern is applied
     * @type Number
     * @default
     */
    angle: 0,

    /**
     * Pattern scale factor on X axis
     * @type Number
     * @default
     */
    scaleX: 1,

    /**
     * Pattern scale factor on Y axis
     * @type Number
     * @default
     */
    scaleY: 1,

    /**
     * Determines if a pattern scale with object container
     * @type Boolean
     * @default
     */
    scaleWithObject: true,

    /**
     * pattern transformation matrix, imported from SVGs file
     * @type [Array] array of 6 numbers
     * @default
     */
    patternTransform: null,

    /**
     * Constructor
     * @param {Object} [options] Options object
     * @param {Function} [callback] function to invoke after callback init.
     * @return {fabric.Pattern} thisArg
     */
    initialize: function(options, callback) {
      options || (options = { });

      this.id = fabric.Object.__uid++;
      this.setOptions(options);
      if (!options.source || (options.source && options.source !== 'string')) {
        callback && callback(this);
        return;
      }
      // function string
      if (typeof fabric.util.getFunctionBody(options.source) !== 'undefined') {
        this.source = new Function(fabric.util.getFunctionBody(options.source));
        callback && callback(this);
      }
      else {
        // img src string
        var _this = this;
        this.source = fabric.util.createImage();
        fabric.util.loadImage(options.source, function(img) {
          _this.source = img;
          callback && callback(_this);
        });
      }
    },

    /**
     * Returns object representation of a pattern
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of a pattern instance
     */
    toObject: function(propertiesToInclude) {
      var NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS,
          source, object;

      // callback
      if (typeof this.source === 'function') {
        source = String(this.source);
      }
      // <img> element
      else if (typeof this.source.src === 'string') {
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
        offsetX: toFixed(this.offsetX, NUM_FRACTION_DIGITS),
        offsetY: toFixed(this.offsetY, NUM_FRACTION_DIGITS),
        angle: toFixed(this.angle, NUM_FRACTION_DIGITS),
        scaleX: toFixed(this.scaleX, NUM_FRACTION_DIGITS),
        scaleY: toFixed(this.scaleY, NUM_FRACTION_DIGITS),
        scaleWithObject: this.scaleWithObject,
        patternTransform: this.patternTransform ? this.patternTransform.concat() : null,
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
          patternWidth = patternSource.width / object.getWidth(),
          patternHeight = patternSource.height / object.getHeight(),
          patternOffsetX = this.offsetX / object.getWidth(),
          patternOffsetY = this.offsetY / object.getHeight(),
          patternImgSrc = '';
      if (this.repeat === 'repeat-x' || this.repeat === 'no-repeat') {
        patternHeight = 1;
      }
      if (this.repeat === 'repeat-y' || this.repeat === 'no-repeat') {
        patternWidth = 1;
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
     * @param {Object} object for wich the pattern is created for
     * @param {Boolean} enforceTransform enforce transform on the pattern source ( used for fillText )
     * @return {CanvasPattern}
     */
    toLive: function(ctx, object, enforceTransform) {
      var source = typeof this.source === 'function' ? this.source() : this.source;

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
      if (!enforceTransform) {
        return ctx.createPattern(source, this.repeat);
      }

      var width = source.width, height = source.height, options,
          scaleX = this.scaleX, scaleY = this.scaleY,
          canvas = fabric.util.createCanvasElement(),
          ctx = canvas.getContext('2d');
      if (this.patternTransform) {
        var options = fabric.util.qrDecompose(this.patternTransform);
        scaleX *= Math.abs(options.scaleX);
        scaleY *= Math.abs(options.scaleY);
      }
      if (!this.scaleWithObject) {
        scaleX /= object.scaleX;
        scaleY /= object.scaleY;
      }
      // in case of pattern rotation we create a pattern as big as the object
      // because we cannot really find a repetable pattern after rotating the original pattern
      canvas.width = this.angle ? object.width : Math.min(width * scaleX, object.width);
      canvas.height = this.angle ? object.height : Math.min(height * scaleY, object.height);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(canvas.width, 0);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.lineTo(0, 0);
      ctx.translate(object.width / 2, object.height / 2);
      fabric.Object.prototype._applyPatternGradientTransform.call(object, ctx, this);
      ctx.fillStyle = ctx.createPattern(source, this.repeat);
      ctx.fill();
      return ctx.createPattern(canvas, this.repeat);
    }
  });

  fabric.util.object.extend(fabric.Pattern, {

    /* _FROM_SVG_START_ */
    /**
     * Returns {@link fabric.Pattern} instance from an SVG element
     * @static
     * @memberOf fabric.Pattern
     * @param {SVGPatternElement} el SVG pattern element with childnodes
     * @param {fabric.Object} instance object that is stroked/filled with pattern
     * @param {function} callback to invoke when the pattern is loaded
     * @see http://www.w3.org/TR/SVG/pservers.html#PatternElement
     */
    fromElement: function(el, instance, callback) {

      /**
       *  @example:
       *
       *  <linearGradient id="linearGrad1">
       *    <stop offset="0%" stop-color="white"/>
       *    <stop offset="100%" stop-color="black"/>
       *  </linearGradient>
       *
       *  OR
       */

      var pattern = new fabric.Pattern({ }, callback);
    }
    /* _FROM_SVG_END_ */
  });
})();
