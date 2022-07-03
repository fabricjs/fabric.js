(function (global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = {});

  if (fabric.Arrow) {
    fabric.warn('fabric.Arrow is already defined');
    return;
  }

  /**
   * Arrow class
   * @class fabric.Arrow
   * @extends fabric.Polyline
   * @see {@link fabric.Arrow#initialize} for varructor definition
   */
  fabric.Arrow = fabric.util.createClass(fabric.Polyline, /** @lends fabric.Arrow.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'arrow',

    stroke: 'black',

    arrowSize: 17.5,

    endArrow: true,

    startArrow: false,

    mainPoints: [],

    initialize: function (points, options) {
      options = options || {};
      !this.mainPoints.length && (this.mainPoints = points.slice(0));
      this.callSuper('initialize', points, options);
      this._setPositionDimensions(options);
      this.building = 0;
      return this;
    },

    _set: function (key, value) {
      this.callSuper('_set', key, value);
      if (!this.building && ['startArrow', 'endArrow', 'arrowSize'].includes(key)) {
        this._setPositionDimensions({ left: this.left, top: this.top, });
      }
      return this;
    },

    _setPositionDimensions: function (options) {
      var ps = this.mainPoints.slice(0);
      var es;
      if (this.endArrow && this.arrowSize > 0) {
        var p0 = ps[ps.length - 2];
        var p1 = ps[ps.length - 1];
        es = this._getArrowPoints(p0.x, p0.y, p1.x, p1.y, this.arrowSize, this.arrowSize).concat(p1);
      }
      var ss;
      if (this.startArrow && this.arrowSize > 0) {
        var p0 = ps[1];
        var p1 = ps[0];
        ss = [p1].concat(this._getArrowPoints(p0.x, p0.y, p1.x, p1.y, this.arrowSize, this.arrowSize));
      }
      this.set('points', (ss || []).concat(ps).concat(es || []));
      this.callSuper('_setPositionDimensions', options);
    },

    _getArrowPoints: function (x1, y1, x2, y2, s1, s2) {
      var angle = Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI
        , angle1 = (angle + s1) * Math.PI / 180
        , angle2 = (angle - s1) * Math.PI / 180
        , _x1 = s2 * Math.cos(angle1)
        , _y1 = s2 * Math.sin(angle1)
        , _x2 = s2 * Math.cos(angle2)
        , _y2 = s2 * Math.sin(angle2);
      var _x = x1 - _x1
        , _y = y1 - _y1;

      var path = [];
      _x = x2 + _x1;
      _y = y2 + _y1;
      path.push(new fabric.Point(_x, _y));
      path.push(new fabric.Point(x2, y2));
      _x = x2 + _x2;
      _y = y2 + _y2;
      path.push(new fabric.Point(_x, _y));
      return path;
    }


  });

  /* _FROM_SVG_START_ */
  /**
   * List of attribute names to account for when parsing SVG element (used by `fabric.Arrow.fromElement`)
   * @static
   * @memberOf fabric.Arrow
   * @see: http://www.w3.org/TR/SVG/shapes.html#ArrowElement
   */
  fabric.Arrow.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat();

  /**
   * Returns {@link fabric.Arrow} instance from an SVG element
   * @static
   * @memberOf fabric.Arrow
   * @param {SVGElement} element Element to parse
   * @param {Function} callback callback function invoked after parsing
   * @param {Object} [options] Options object
   */
  fabric.Arrow.fromElement = fabric.Polyline.fromElementGenerator('Arrow');
  /* _FROM_SVG_END_ */

  /**
   * Returns fabric.Arrow instance from an object representation
   * @static
   * @memberOf fabric.Arrow
   * @param {Object} object Object to create an instance from
   * @param {Function} [callback] Callback to invoke when an fabric.Path instance is created
   * @return {void}
   */
  fabric.Arrow.fromObject = function (object, callback) {
    fabric.Object._fromObject('Arrow', object, callback, 'points');
  };

})(typeof exports !== 'undefined' ? exports : this);
