//= require "object.class"

(function(){
  
  var fabric = this.fabric || (this.fabric = { });
  
  if (fabric.Polyline) {
    console.warn('fabric.Polyline is already defined');
    return;
  }
  
  fabric.Polyline = fabric.util.createClass(fabric.Object, {
    
    type: 'polyline',
    
    /**
     * @constructor
     * @method initialize
     * @param points {Array} array of points
     * @param options {Object} options object
     * @return {Object} thisArg
     */
    initialize: function(points, options) {
      options = options || { };
      this.set('points', points);
      this.callSuper('initialize', options);
      this._calcDimensions();
    },
    
    /**
     * @private
     * @method _calcDimensions
     */
    _calcDimensions: function() {
      return fabric.Polygon.prototype._calcDimensions.call(this);
    },
    
    /**
     * @private
     * @method _toOrigin
     */
    _toOrigin: function() {
      return fabric.Polygon.prototype._toOrigin.call(this);
    },
    
    /**
     * Returns object representation of an instance
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      return fabric.Polygon.prototype.toObject.call(this);
    },
    
    /**
     * @private
     * @method _render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      var point;
      ctx.beginPath();
      for (var i = 0, len = this.points.length; i < len; i++) {
        point = this.points[i];
        ctx.lineTo(point.x, point.y);
      }
      if (this.fill) {
        ctx.fill();
      }
      if (this.stroke) {
        ctx.stroke();
      }
    },
    
    /**
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return this.get('points').length;
    }
  });
  
  // http://www.w3.org/TR/SVG/shapes.html#PolylineElement
  var ATTRIBUTE_NAMES = 'fill fill-opacity stroke stroke-width transform'.split(' ');
  
  /**
   * @static
   * @method fabric.Polyline.fromElement
   * @param element {SVGElement} element to parse
   * @param options {Object} options object
   * @return {Object} instance of fabric.Polyline
   */
  fabric.Polyline.fromElement = function(element, options) {
    if (!element) {
      return null;
    }
    var points = fabric.parsePointsAttribute(element.getAttribute('points')),
        parsedAttributes = fabric.parseAttributes(element, ATTRIBUTE_NAMES);
        
    return new fabric.Polyline(points, fabric.util.object.extend(parsedAttributes, options));
  };
  
  /**
   * @static
   * @method fabric.Polyline.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of fabric.Polyline
   */
  fabric.Polyline.fromObject = function(object) {
    var points = object.points;
    return new fabric.Polyline(points, object);
  }
})();