//= require "object.class"

(function(){
  
  var fabric = this.fabric || (this.fabric = { }),
      extend = fabric.util.object.extend,
      min = fabric.util.array.min,
      max = fabric.util.array.max;
  
  if (fabric.Polygon) {
    console.warn('fabric.Polygon is already defined');
    return;
  }
  
  function byX(p) { return p.x; }
  function byY(p) { return p.y; }
  
  fabric.Polygon = fabric.util.createClass(fabric.Object, {
    
    type: 'polygon',
    
    /**
     * @constructor
     * @method initialize
     * @param points {Array} array of points
     * @param options {Object} options object
     * @return thisArg
     */
    initialize: function(points, options) {
      options = options || { };
      this.points = points;
      this.callSuper('initialize', options);
      this._calcDimensions();
    },
    
    /**
     * @private
     * @method _calcDimensions
     */
    _calcDimensions: function() {
      
      var points = this.points,
          minX = min(points, 'x'),
          minY = min(points, 'y'),
          maxX = max(points, 'x'),
          maxY = max(points, 'y');
      
      this.width = maxX - minX;
      this.height = maxY - minY;
      this.minX = minX;
      this.minY = minY;
    },
    
    /**
     * Returns object representation of an instance
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      return extend(this.callSuper('toObject'), {
        points: this.points.concat()
      });
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
        ctx.closePath();
        ctx.stroke();
      }
    },
    
    /**
     * Returns complexity of an instance
     * @method complexity
     * @return {Number} complexity of this instance
     */
    complexity: function() {
      return this.points.length;
    }
  });
  
  // http://www.w3.org/TR/SVG/shapes.html#PolygonElement
  fabric.Polygon.ATTRIBUTE_NAMES = 'fill fill-opacity stroke stroke-width transform'.split(' ');
  
  /**
   * @static
   * @method fabric.Polygon.fromElement
   * @param element {SVGElement} element to parse
   * @param options {Object} options object
   * @return {Object} instance of fabric.Polygon
   */
  fabric.Polygon.fromElement = function(element, options) {
    if (!element) {
      return null;
    }
    options || (options = { });
    
    var points = fabric.parsePointsAttribute(element.getAttribute('points')),
        parsedAttributes = fabric.parseAttributes(element, fabric.Polygon.ATTRIBUTE_NAMES);
    
    for (var i = 0, len = points.length; i < len; i++) {
      // normalize coordinates, according to containing box (dimensions of which are passed via `options`)
      points[i].x -= (options.width / 2) || 0;
      points[i].y -= (options.height / 2) || 0;
    }
        
    return new fabric.Polygon(points, extend(parsedAttributes, options));
  };
  
  /**
   * @static
   * @method fabric.Polygon.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of fabric.Polygon
   */
  fabric.Polygon.fromObject = function(object) {
    return new fabric.Polygon(object.points, object);
  }
})();