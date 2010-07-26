//= require "object.class"

(function() {
  
  var global  = this,
      fabric  = global.fabric || (global.fabric = { }),
      piBy2   = Math.PI * 2,
      extend = fabric.util.object.extend;
  
  if (fabric.Circle) {
    console.warn('fabric.Circle is already defined.');
    return;
  }
  
  fabric.Circle = fabric.util.createClass(fabric.Object, /** @lends fabric.Circle.prototype */ {
    
    /**
     * @field
     */
    type: 'circle',
    
    /**
     * @constructs
     * @method initialize
     * @param options {Object} options object
     * @return {Object} thisArg
     */
    initialize: function(options) {
      options = options || { };
      
      this.set('radius', options.radius || 0);
      this.callSuper('initialize', options);
      
      var radiusBy2ByScale = this.get('radius') * 2 * this.get('scaleX');
      this.set('width', radiusBy2ByScale).set('height', radiusBy2ByScale);
    },
    
    /**
     * Returns object representation of an instance
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      return extend(this.callSuper('toObject'), {
        radius: this.get('radius')
      });
    },
    
    /**
     * @private
     * @method _render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, piBy2, false);
      if (this.fill) {
        ctx.fill();
      }
      if (this.stroke) {
        ctx.stroke();
      }
    },
    
    /**
     * Returns complexity of an instance
     * @method complexity
     * @return {Number} complexity of this instance
     */
    complexity: function() {
      return 1;
    }
  });
  
  /**
   * @see: http://www.w3.org/TR/SVG/shapes.html#CircleElement
   */
  fabric.Circle.ATTRIBUTE_NAMES = 'cx cy r fill fill-opacity stroke stroke-width transform'.split(' ');
  
  /**
   * @static
   * @method fabric.Circle.fromElement
   * @param element {SVGElement} element to parse
   * @param options {Object} options object
   * @throws {Error} If value of `r` attribute is missing or invalid
   * @return {Object} instance of fabric.Circle
   */
  fabric.Circle.fromElement = function(element, options) {
    var parsedAttributes = fabric.parseAttributes(element, fabric.Circle.ATTRIBUTE_NAMES);
    if (!isValidRadius(parsedAttributes)) {
      throw Error('value of `r` attribute is required and can not be negative');
    }
    return new fabric.Circle(extend(parsedAttributes, options));
  };
  
  /**
   * @private
   */
  function isValidRadius(attributes) {
    return (('radius' in attributes) && (attributes.radius > 0));
  }
  
  /**
   * @static
   * @method fabric.Circle.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of fabric.Circle
   */
  fabric.Circle.fromObject = function(object) {
    return new fabric.Circle(object);
  }
})();