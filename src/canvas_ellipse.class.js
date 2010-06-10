(function(){
  
  var Canvas = this.Canvas || (this.Canvas = { });
  
  if (Canvas.Ellipse) {
    console.warn('Canvas.Ellipse is already defined.');
    return;
  }
  
  Canvas.Ellipse = Class.create(Canvas.Object, {
    
    type: 'ellipse',
    
    /**
     * @constructor
     * @method initialize
     * @param options {Object} options object
     * @return {Object} thisArg
     */
    initialize: function(options) {
      options = options || { };
      
      this.callSuper('initialize', options);
      
      this.set('rx', options.rx || 0);
      this.set('ry', options.ry || 0);
      
      this.set('width', this.get('rx') * 2);
      this.set('height', this.get('ry') * 2);
    },
    
    /**
     * Returns object representation of an instance
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      return Object.extend(this.callSuper('toObject'), {
        rx: this.get('rx'),
        ry: this.get('ry')
      })
    },
    
    /**
     * @method render
     * @param ctx {CanvasRenderingContext2D} context to render on
     * @param noTransform {Boolean} context is not transformed when set to true
     */
    render: function(ctx, noTransform) {
      // do not use `get` for perf. reasons
      if (this.rx === 0 || this.ry === 0) return;
      return this.callSuper('render', ctx, noTransform);
    },
    
    /**
     * @private
     * @method _render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    _render: function(ctx) {
      ctx.beginPath();
      ctx.save();
      ctx.transform(1, 0, 0, this.ry/this.rx, 0, 0);
      ctx.arc(0, 0, this.rx, 0, Math.PI * 2, false);
      ctx.restore();
      if (this.stroke) {
        ctx.stroke();
      }
      if (this.fill) {
        ctx.fill();
      }
    },
    
    /**
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return 1;
    }
  });
  
  Canvas.Ellipse.ATTRIBUTE_NAMES = $w('cx cy rx ry fill fill-opacity stroke stroke-width transform');
  
  /**
   * @static
   * @method Canvas.Ellipse.fromElement
   * @param element {SVGElement} element to parse
   * @param options {Object} options object
   * @return {Object} instance of Canvas.Ellipse
   */
  Canvas.Ellipse.fromElement = function(element, options) {
    var parsedAttributes = Canvas.parseAttributes(element, Canvas.Ellipse.ATTRIBUTE_NAMES);
    return new Canvas.Ellipse(Object.extend(parsedAttributes, options));
  };
  
  /**
   * @static
   * @method Canvas.Ellipse.fromObject
   * @param object {Object} object to create an instance from
   * @return {Object} instance of Canvas.Ellipse
   */
  Canvas.Ellipse.fromObject = function(object) {
    return new Canvas.Ellipse(object);
  }
})();