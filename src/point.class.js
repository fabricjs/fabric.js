(function(global) {

  "use strict";

  /* Adaptation of work of Kevin Lindsey (kevin@kevlindev.com) */

  var fabric = global.fabric || (global.fabric = { });

  if (fabric.Point) {
    fabric.warn('fabric.Point is already defined');
    return;
  }

  fabric.Point = Point;

  /**
   * @name Point
   * @memberOf fabric
   * @constructor
   * @param {Number} x
   * @param {Number} y
   * @return {fabric.Point} thisArg
   */
  function Point(x, y) {
    if (arguments.length > 0) {
      this.init(x, y);
    }
  }

  Point.prototype = /** @scope fabric.Point.prototype */ {

    constructor: Point,

    /**
     * @method init
     * @param {Number} x
     * @param {Number} y
     */
    init: function (x, y) {
      this.x = x;
      this.y = y;
    },

    /**
     * @method add
     * @param {fabric.Point} that
     * @return {fabric.Point} new Point instance with added values
     */
    add: function (that) {
      return new Point(this.x + that.x, this.y + that.y);
    },

    /**
     * @method addEquals
     * @param {fabric.Point} that
     * @return {fabric.Point} thisArg
     */
    addEquals: function (that) {
      this.x += that.x;
      this.y += that.y;
      return this;
    },

    /**
     * @method scalarAdd
     * @param {Number} scalar
     * @return {fabric.Point} new Point with added value
     */
    scalarAdd: function (scalar) {
      return new Point(this.x + scalar, this.y + scalar);
    },

    /**
     * @method scalarAddEquals
     * @param {Number} scalar
     * @param {fabric.Point} thisArg
     */
    scalarAddEquals: function (scalar) {
      this.x += scalar;
      this.y += scalar;
      return this;
    },

    /**
     * @method subtract
     * @param {fabric.Point} that
     * @return {fabric.Point} new Point object with subtracted values
     */
    subtract: function (that) {
      return new Point(this.x - that.x, this.y - that.y);
    },

    /**
     * @method subtractEquals
     * @param {fabric.Point} that
     * @return {fabric.Point} thisArg
     */
    subtractEquals: function (that) {
      this.x -= that.x;
      this.y -= that.y;
      return this;
    },

    scalarSubtract: function (scalar) {
      return new Point(this.x - scalar, this.y - scalar);
    },

    scalarSubtractEquals: function (scalar) {
      this.x -= scalar;
      this.y -= scalar;
      return this;
    },

    multiply: function (scalar) {
      return new Point(this.x * scalar, this.y * scalar);
    },

    multiplyEquals: function (scalar) {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    },

    divide: function (scalar) {
      return new Point(this.x / scalar, this.y / scalar);
    },

    divideEquals: function (scalar) {
      this.x /= scalar;
      this.y /= scalar;
      return this;
    },

    eq: function (that) {
      return (this.x === that.x && this.y === that.y);
    },

    lt: function (that) {
      return (this.x < that.x && this.y < that.y);
    },

    lte: function (that) {
      return (this.x <= that.x && this.y <= that.y);
    },

    gt: function (that) {
      return (this.x > that.x && this.y > that.y);
    },

    gte: function (that) {
      return (this.x >= that.x && this.y >= that.y);
    },

    lerp: function (that, t) {
      return new Point(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
    },

    distanceFrom: function (that) {
      var dx = this.x - that.x,
          dy = this.y - that.y;
      return Math.sqrt(dx * dx + dy * dy);
    },

    /**
     * Return the point between A (x,y) and B (x,y)
     */ 
    midPointFrom: function (that) {
      return new Point(this.x + (that.x - this.x)/2, this.y + (that.y - this.y)/2);
    },

    min: function (that) {
      return new Point(Math.min(this.x, that.x), Math.min(this.y, that.y));
    },

    max: function (that) {
      return new Point(Math.max(this.x, that.x), Math.max(this.y, that.y));
    },

    toString: function () {
      return this.x + "," + this.y;
    },

    setXY: function (x, y) {
      this.x = x;
      this.y = y;
    },

    setFromPoint: function (that) {
      this.x = that.x;
      this.y = that.y;
    },

    swap: function (that) {
      var x = this.x,
          y = this.y;
      this.x = that.x;
      this.y = that.y;
      that.x = x;
      that.y = y;
    }
  };

})(typeof exports !== 'undefined' ? exports : this);
