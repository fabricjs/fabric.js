/**
 * Pattern class
 * @class fabric.Pattern
 * @see {@link http://fabricjs.com/patterns/|Pattern demo}
 * @see {@link http://fabricjs.com/dynamic-patterns/|DynamicPattern demo}
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
   * Constructor
   * @param {Object} [options] Options object
   * @return {fabric.Pattern} thisArg
   */
  initialize: function(options) {
    options || (options = { });

    this.id = fabric.Object.__uid++;

    if (options.source) {
      if (typeof options.source === 'string') {
        // function string
        if (typeof fabric.util.getFunctionBody(options.source) !== 'undefined') {
          this.source = new Function(fabric.util.getFunctionBody(options.source));
        }
        else {
          // img src string
          var _this = this;
          this.source = fabric.util.createImage();
          fabric.util.loadImage(options.source, function(img) {
            _this.source = img;
          });
        }
      }
      else {
        // img element
        this.source = options.source;
      }
    }
    if (options.repeat) {
      this.repeat = options.repeat;
    }
    if (options.offsetX) {
      this.offsetX = options.offsetX;
    }
    if (options.offsetY) {
      this.offsetY = options.offsetY;
    }
  },

  /**
   * Returns object representation of a pattern
   * @return {Object} Object representation of a pattern instance
   */
  toObject: function() {

    var source;

    // callback
    if (typeof this.source === 'function') {
      source = String(this.source);
    }
    // <img> element
    else if (typeof this.source.src === 'string') {
      source = this.source.src;
    }

    return {
      source: source,
      repeat: this.repeat,
      offsetX: this.offsetX,
      offsetY: this.offsetY
    };
  },

  /* _TO_SVG_START_ */
  /**
   * Returns SVG representation of a pattern
   * @param {fabric.Object} object
   * @return {String} SVG representation of a pattern
   */
  toSVG: function(object) {
    var patternSource = typeof this.source === 'function' ? this.source() : this.source;
    var patternWidth = patternSource.width / object.getWidth();
    var patternHeight = patternSource.height / object.getHeight();
    var patternImgSrc = '';

    if (patternSource.src) {
      patternImgSrc = patternSource.src;
    }
    else if (patternSource.toDataURL) {
      patternImgSrc = patternSource.toDataURL();
    }

    return '<pattern id="SVGID_' + this.id +
                  '" x="' + this.offsetX +
                  '" y="' + this.offsetY +
                  '" width="' + patternWidth +
                  '" height="' + patternHeight + '">' +
             '<image x="0" y="0"' +
                    ' width="' + patternSource.width +
                    '" height="' + patternSource.height +
                    '" xlink:href="' + patternImgSrc +
             '"></image>' +
           '</pattern>';
  },
  /* _TO_SVG_END_ */

  /**
   * Returns an instance of CanvasPattern
   * @param {CanvasRenderingContext2D} ctx Context to create pattern
   * @return {CanvasPattern}
   */
  toLive: function(ctx) {
    var source = typeof this.source === 'function' ? this.source() : this.source;
    // if an image
    if (typeof source.src !== 'undefined') {
      if (!source.complete) return '';
      if (source.naturalWidth === 0 || source.naturalHeight === 0) return '';
    }
    return ctx.createPattern(source, this.repeat);
  }
});
