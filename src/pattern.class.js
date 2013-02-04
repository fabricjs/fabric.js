/**
 * Pattern class
 * @class Pattern
 * @memberOf fabric
 */
fabric.Pattern = fabric.util.createClass(/** @scope fabric.Pattern.prototype */ {

  repeat: 'repeat',

  /**
   * Constructor
   * @method initialize
   * @param {Object} [options]
   * @return {fabric.Pattern} thisArg
   */
  initialize: function(options) {
    options || (options = { });

    if (options.source) {
      this.source = typeof options.source === 'string'
        ? new Function(options.source)
        : options.source;
    }
    if (options.repeat) {
      this.repeat = options.repeat;
    }
  },

  /**
   * Returns object representation of a gradient
   * @method toObject
   * @return {Object}
   */
  toObject: function() {

    var source;

    // callback
    if (typeof this.source === 'function') {
      source = String(this.source)
                .match(/function\s+\w*\s*\(.*\)\s+\{([\s\S]*)\}/)[1];
    }
    // <img> element
    else if (typeof this.source.src === 'string') {
      source = this.source.src;
    }

    return {
      source: source,
      repeat: this.repeat
    };
  },

  /**
   * Returns an instance of CanvasGradient
   * @method toLive
   * @param ctx
   * @return {CanvasGradient}
   */
  toLive: function(ctx) {
    var source = typeof this.source === 'function' ? this.source() : this.source;
    return ctx.createPattern(source, this.repeat);
  }
});