/**
 * Shadow class
 * @class fabric.Shadow
 */
fabric.Shadow = fabric.util.createClass(/** @lends fabric.Shadow.prototype */ {

  /**
   * Shadow color
   * @type String
   */
  color: 'rgb(0,0,0)',

  /**
   * Shadow blur
   * @type Number
   */
  blur: 0,

  /**
   * Shadow horizontal offset
   * @type Number
   */
  offsetX: 0,

  /**
   * Shadow vertical offset
   * @type Number
   */
  offsetY: 0,

  /**
   * Whether the shadow should affect stroke operations
   * @type Boolean
   */
  affectStroke: false,

  /**
   * Constructor
   * @param [options] Options object with any of color, blur, offsetX, offsetX properties
   * @return {fabric.Shadow} thisArg
   */
  initialize: function(options) {
    for (var prop in options) {
      this[prop] = options[prop];
    }
  },

  /**
   * Returns object representation of a shadow
   * @return {Object}
   */
  toObject: function() {
    return {
      color: this.color,
      blur: this.blur,
      offsetX: this.offsetX,
      offsetY: this.offsetY
    };
  },

  /* _TO_SVG_START_ */
  /**
   * Returns SVG representation of a shadow
   * @return {String}
   */
  toSVG: function() {

  }
  /* _TO_SVG_END_ */
});
