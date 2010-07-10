//= require "object.class"

(function(){
  
  var fabric = this.fabric || (this.fabric = { });
  if (fabric.Line) {
    return;
  }
  
  fabric.Line = fabric.util.createClass(fabric.Object, {
    
    type: 'line',
    
    /**
     * @constructor
     * @method initialize
     * @param points {Array} array of points
     * @param options {Object} options object
     * @return {Object} thisArg
     */
    initialize: function(points, options) {
      if (!points) {
        points = [0, 0, 0, 0];
      }
      
      this.callSuper('initialize', options);
      
      this.set('x1', points[0]);
      this.set('y1', points[1]);
      this.set('x2', points[2]);
      this.set('y2', points[3]);
      
      this.set('width', this.x2 - this.x1);
      this.set('height', this.y2 - this.y1);
      this.set('left', this.x1 + this.width / 2);
      this.set('top', this.y1 + this.height / 2);
    },
    
    /**
     * @private
     * @method _render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      ctx.beginPath();
      // move from center (of virtual box) to its left/top corner
      ctx.moveTo(-this.width / 2, -this.height / 2);
      ctx.lineTo(this.width / 2, this.height / 2);
      ctx.stroke();
    },
    
    /**
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return 1;
    },
    
    /**
     * @methd toObject
     * @return {Object}
     */
    toObject: function() {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        x1: this.get('x1'),
        y1: this.get('y1'),
        x2: this.get('x2'),
        y2: this.get('y2')
      });
    }
  });
  
  // http://www.w3.org/TR/SVG/shapes.html#LineElement
  fabric.Element.ATTRIBUTE_NAMES = 'x1 y1 x2 y2 stroke stroke-width transform'.split(' ');
  
  /**
   * @static
   * @method fabric.Line.fromElement
   * @param element {SVGElement} element to parse
   * @param options {Object} options object
   * @return {Object} instance of fabric.Line
   */
  fabric.Line.fromElement = function(element, options) {
    var parsedAttributes = fabric.parseAttributes(element, fabric.Element.ATTRIBUTE_NAMES);
    var points = [
      parsedAttributes.x1 || 0,
      parsedAttributes.y1 || 0,
      parsedAttributes.x2 || 0,
      parsedAttributes.y2 || 0
    ];
    return new fabric.Line(points, fabric.util.object.extend(parsedAttributes, options));
  };
  
  /**
   * @static
   * @method fabric.Line.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of fabric.Line
   */
  fabric.Line.fromObject = function(object) {
    var points = [object.x1, object.y1, object.x2, object.y2];
    return new fabric.Line(points, object);
  };
})();