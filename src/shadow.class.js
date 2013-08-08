/**
 * Shadow class
 * @class fabric.Shadow
 */
fabric.Shadow = fabric.util.createClass(/** @lends fabric.Shadow.prototype */ {

  /**
   * Shadow color
   * @type String
   * @default
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
   * @default
   */
  offsetX: 0,

  /**
   * Shadow vertical offset
   * @type Number
   * @default
   */
  offsetY: 0,

  /**
   * Whether the shadow should affect stroke operations
   * @type Boolean
   * @default
   */
  affectStroke: false,

  /**
   * Constructor
   * @param {Object} [options] Options object with any of color, blur, offsetX, offsetX properties
   * @return {fabric.Shadow} thisArg
   */
  initialize: function(options) {
    for (var prop in options) {
      this[prop] = options[prop];
    }

    this.id = fabric.Object.__uid++;
  },

  /* _TO_SVG_START_ */
  /**
   * Returns SVG representation of a shadow
   * @param {Object} object
   * @return {String} SVG representation of a shadow
   */
  toSVG: function(object) {
    var mode = 'SourceAlpha';

    if (object.fill === this.color || object.stroke === this.color) {
      mode = 'SourceGraphic';
    }

    return (
      '<filter id="SVGID_' + this.id + '" y="-40%" height="180%">' +
        '<feGaussianBlur in="' + mode + '" stdDeviation="' +
          (this.blur ? this.blur / 3 : 0) +
        '"></feGaussianBlur>' +
        '<feOffset dx="' + this.offsetX + '" dy="' + this.offsetY + '"></feOffset>' +
        '<feMerge>' +
          '<feMergeNode></feMergeNode>' +
          '<feMergeNode in="SourceGraphic"></feMergeNode>' +
        '</feMerge>' +
      '</filter>');
  },
  /* _TO_SVG_END_ */

  /**
   * Returns object representation of a shadow
   * @return {Object} Object representation of a shadow instance
   */
  toObject: function() {
    return {
      color: this.color,
      blur: this.blur,
      offsetX: this.offsetX,
      offsetY: this.offsetY
    };
  }
});
