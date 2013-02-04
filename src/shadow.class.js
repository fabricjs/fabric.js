/**
 * Shadow class
 * @class Shadow
 * @memberOf fabric
 */
fabric.Shadow = fabric.util.createClass(/** @scope fabric.Shadow.prototype */ {

  /**
   * Shadow color
   * @property
   * @type String
   */
  color: 'rgb(0,0,0)',

  /**
   * Shadow blur
   * @property
   * @type Number
   */
  blur: 0,

  /**
   * Shadow horizontal offset
   * @property
   * @type Number
   */
  offsetX: 0,

  /**
   * Shadow vertical offset
   * @property
   * @type Number
   */
  offsetY: 0,

  /**
   * Constructor
   * @method initialize
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
   * @method toObject
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

  /**
   * Returns SVG representation of a shadow
   * @method toSVG
   * @return {String}
   */
  toSVG: function() {

  }
});