(function(){
  
  var Canvas = this.Canvas || (this.Canvas = { });
  if (Canvas.Polygon) return;
  
  function byX(p) { return p.x }
  function byY(p) { return p.y }
  
  Canvas.Polygon = Class.create(Canvas.Object, {
    
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
          minX = points.min(byX),
          minY = points.min(byY),
          maxX = points.max(byX),
          maxY = points.max(byY);
      
      this.width = maxX - minX;
      this.height = maxY - minY;
      this.minX = minX;
      this.minY = minY;
    },
    
    /**
     * @private
     * @method _toOrigin
     */
    _toOrigin: function() {
      this.points = this.points.map(function(point) {
        return {
          x: point.x - this.minX, 
          y: point.y - this.minY
        }
      }, this);
    },
    
    /**
     * Returns object representation of an instance
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      return Object.extend(this.callSuper('toObject'), {
        points: this.points.clone()
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
  Canvas.Polygon.ATTRIBUTE_NAMES = $w('fill fill-opacity stroke stroke-width transform');
  
  /**
   * @static
   * @method Canvas.Polygon.fromElement
   * @param element {SVGElement} element to parse
   * @param options {Object} options object
   * @return {Object} instance of Canvas.Polygon
   */
  Canvas.Polygon.fromElement = function(element, options) {
    if (!element) return null;
    var points = Canvas.parsePointsAttribute(element.getAttribute('points'));
    var parsedAttributes = Canvas.parseAttributes(element, Canvas.Polygon.ATTRIBUTE_NAMES);
    return new Canvas.Polygon(points, Object.extend(parsedAttributes, options));
  };
  
  /**
   * @static
   * @method Canvas.Polygon.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of Canvas.Polygon
   */
  Canvas.Polygon.fromObject = function(object) {
    return new Canvas.Polygon(object.points, object);
  }
})();