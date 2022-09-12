//@ts-nocheck
(function (global) {
  var fabric = global.fabric || (global.fabric = {});
  /**
   * Triangle class
   * @class fabric.Triangle
   * @extends fabric.Object
   * @return {fabric.Triangle} thisArg
   * @see {@link fabric.Triangle#initialize} for constructor definition
   */
  fabric.Triangle = fabric.util.createClass(
    fabric.Object,
    /** @lends fabric.Triangle.prototype */ {
      /**
       * Type of an object
       * @type String
       * @default
       */
      type: 'triangle',

      /**
       * Width is set to 100 to compensate the old initialize code that was setting it to 100
       * @type Number
       * @default
       */
      width: 100,

      /**
       * Height is set to 100 to compensate the old initialize code that was setting it to 100
       * @type Number
       * @default
       */
      height: 100,

      /**
       * @private
       * @param {CanvasRenderingContext2D} ctx Context to render on
       */
      _render: function (ctx) {
        var widthBy2 = this.width / 2,
          heightBy2 = this.height / 2;

        ctx.beginPath();
        ctx.moveTo(-widthBy2, heightBy2);
        ctx.lineTo(0, -heightBy2);
        ctx.lineTo(widthBy2, heightBy2);
        ctx.closePath();

        this._renderPaintInOrder(ctx);
      },

      /* _TO_SVG_START_ */
      /**
       * Returns svg representation of an instance
       * @return {Array} an array of strings with the specific svg representation
       * of the instance
       */
      _toSVG: function () {
        var widthBy2 = this.width / 2,
          heightBy2 = this.height / 2,
          points = [
            -widthBy2 + ' ' + heightBy2,
            '0 ' + -heightBy2,
            widthBy2 + ' ' + heightBy2,
          ].join(',');
        return ['<polygon ', 'COMMON_PARTS', 'points="', points, '" />'];
      },
      /* _TO_SVG_END_ */
    }
  );

  /**
   * Returns {@link fabric.Triangle} instance from an object representation
   * @static
   * @memberOf fabric.Triangle
   * @param {Object} object Object to create an instance from
   * @returns {Promise<fabric.Triangle>}
   */
  fabric.Triangle.fromObject = function (object) {
    return fabric.Object._fromObject(fabric.Triangle, object);
  };
})(typeof exports !== 'undefined' ? exports : window);
