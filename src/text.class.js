//= require "object.class"

(function(global) {
  
  "use strict";
  
  var fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend,
      clone = fabric.util.object.clone;

  if (fabric.Text) {    
    fabric.warn('fabric.Text is already defined');
    return;
  }
  if (!fabric.Object) {
    fabric.warn('fabric.Text requires fabric.Object');
    return;
  }
  
  /** 
   * @class Text
   * @extends fabric.Object
   */
  fabric.Text = fabric.util.createClass(fabric.Object, /** @scope fabric.Text.prototype */ {
    
    /**
     * @property
     * @type Number
     */
    fontSize:         20,
    
    /**
     * @property
     * @type Number
     */
    fontWeight:       100,
    
    /**
     * @property
     * @type String
     */
    fontFamily:       'Times_New_Roman',
    
    /**
     * @property
     * @type String
     */
    textDecoration:   '',
    
    /**
     * @property
     * @type String | null
     */
    textShadow:       null,
    
    /**
     * Determines text alignment. Possible values: "left", "center", or "right".
     * @property
     * @type String
     */
    textAlign:        'left',
    
    /**
     * @property
     * @type String
     */
    fontStyle:        '',
    
    /**
     * @property
     * @type Number
     */
    lineHeight:       1.6,
    
    /**
     * @property
     * @type String
     */
    strokeStyle:      '',
    
    /**
     * @property
     * @type Number
     */
    strokeWidth:      1,
    
    /**
     * @property
     * @type String
     */
    backgroundColor:  '',
    
    
    /**
     * @property
     * @type String | null
     */
    path:             null,
    
    /**
     * @property
     * @type String
     */
    type:             'text',
    
    /**
     * Constructor
     * @method initialize
     * @param {String} text
     * @param {Object} [options]
     * @return {fabric.Text} thisArg
     */
    initialize: function(text, options) {
      this._initStateProperties();
      this.text = text;
      this.setOptions(options);
      this.theta = this.angle * Math.PI / 180;
      this.width = this.getWidth();
      this.setCoords();
    },
    
    /**
     * Creates `stateProperties` list on an instance, and adds `fabric.Text` -specific ones to it 
     * (such as "fontFamily", "fontWeight", etc.)
     * @private
     * @method _initStateProperties
     */
    _initStateProperties: function() {
      this.stateProperties = this.stateProperties.concat();
      this.stateProperties.push(
        'fontFamily', 
        'fontWeight', 
        'path', 
        'text', 
        'textDecoration', 
        'textShadow', 
        'textAlign',
        'fontStyle',
        'lineHeight',
        'strokeStyle',
        'strokeWidth',
        'backgroundColor'
      );
      fabric.util.removeFromArray(this.stateProperties, 'width');
    },
    
    /**
     * Returns string representation of an instance
     * @method toString
     * @return {String} String representation of text object
     */
    toString: function() {
      return '#<fabric.Text (' + this.complexity() +
        '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '" }>';
    },
    
    /**
     * @private
     * @method _render
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(ctx) {
      var o = Cufon.textOptions || (Cufon.textOptions = { });
      
      // export options to be used by cufon.js
      o.left = this.left;
      o.top = this.top;
      o.context = ctx;
      o.color = this.fill;
      
      var el = this._initDummyElement();
      
      // set "cursor" to top/left corner
      this.transform(ctx);
      
      // draw text
      Cufon.replaceElement(el, {
        separate: 'none', 
        fontFamily: this.fontFamily,
        enableTextDecoration: true,
        textDecoration: this.textDecoration,
        textShadow: this.textShadow,
        textAlign: this.textAlign,
        fontStyle: this.fontStyle,
        lineHeight: this.lineHeight,
        strokeStyle: this.strokeStyle,
        strokeWidth: this.strokeWidth,
        backgroundColor: this.backgroundColor
      });
      
      // update width, height
      this.width = o.width;
      this.height = o.height;
      
      // need to set coords _after_ the width/height was retreived from Cufon
      this.setCoords();
    },
    
    // _render: function(context) {
    //       context.fillStyle = this.fill;
    //       context.font = this.fontSize + 'px ' + this.fontFamily;
    //       this.transform(context);
    //       this.width = context.measureText(this.text).width;
    //       this.height = this.fontSize;
    //       context.fillText(this.text, -this.width / 2, 0);
    //       this.setCoords();
    //     },
    
    /**
     * @private
     * @method _initDummyElement
     */
    _initDummyElement: function() {
      var el = document.createElement('div'),
          container = document.createElement('div');
      
      // Cufon doesn't play nice with textDecoration=underline if element doesn't have a parent
      container.appendChild(el);
      el.innerHTML = this.text;
      
      // need to specify these manually, since Jaxer doesn't support retrieving computed style
      el.style.fontSize = '40px';
      el.style.fontWeight = '400';
      el.style.letterSpacing = 'normal';
      el.style.color = '#000000';
      el.style.fontWeight = '600';
      el.style.fontFamily = 'Verdana';
      
      return el;
    },
    
    /**
     * Renders text instance on a specified context
     * @method render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    render: function(ctx, noTransform) {
      ctx.save();
      this._render(ctx);
      if (!noTransform && this.active) {
        this.drawBorders(ctx);
        this.hideCorners || this.drawCorners(ctx);
      }
      ctx.restore();
    },
    
    /**
     * Returns object representation of an instance
     * @method toObject
     * @return {Object} Object representation of text object
     */
    toObject: function() {
      return extend(this.callSuper('toObject'), {
        text:           this.text,
        fontSize:       this.fontSize,
        fontWeight:     this.fontWeight,
        fontFamily:     this.fontFamily,
        fontStyle:      this.fontStyle,
        lineHeight:     this.lineHeight,
        textDecoration: this.textDecoration,
        textShadow:     this.textShadow,
        textAlign:      this.textAlign,
        path:           this.path,
        strokeStyle:    this.strokeStyle,
        strokeWidth:    this.strokeWidth,
        backgroundColor: this.backgroundColor
      });
    },
    
    /**
     * Sets "color" of an instance (alias of `set('fill', &hellip;)`)
     * @method setColor
     * @param {String} value
     * @return {fabric.Text} thisArg
     * @chainable
     */
    setColor: function(value) {
      this.set('fill', value);
      return this;
    },
    
    /**
     * Sets fontSize of an instance and updates its coordinates
     * @method setFontsize
     * @param {Number} value
     * @return {fabric.Text} thisArg
     * @chainable
     */
    setFontsize: function(value) {
      this.set('fontSize', value);
      this.setCoords();
      return this;
    },
    
    /**
     * Returns actual text value of an instance
     * @method getText
     * @return {String}
     */
    getText: function() {
      return this.text;
    },
    
    /**
     * Sets text of an instance, and updates its coordinates
     * @method setText
     * @param {String} value
     * @return {fabric.Text} thisArg
     * @chainable
     */
    setText: function(value) {
      this.set('text', value);
      this.setCoords();
      return this;
    },
    
    /**
     * Sets specified property to a specified value
     * @method set
     * @param {String} name
     * @param {Any} value
     * @return {fabric.Text} thisArg
     * @chainable
     */
    set: function(name, value) {
      this[name] = value;
      if (name === 'fontFamily' && this.path) {
        this.path = this.path.replace(/(.*?)([^\/]*)(\.font\.js)/, '$1' + value + '$3');
      }
      return this;
    }
  });
  
  /**
   * Returns fabric.Text instance from an object representation
   * @static
   * @method fromObject
   * @param {Object} object to create an instance from
   * @return {fabric.Text} an instance
   */
  fabric.Text.fromObject = function(object) {
    return new fabric.Text(object.text, clone(object));
  };
  
  /**
   * Returns fabric.Text instance from an SVG element (<b>not yet implemented</b>)
   * @static
   * @method fabric.Text.fromElement
   * @return {fabric.Text} an instance
   */
  fabric.Text.fromElement = function(element) {
    // TODO (kangax): implement this
  };
  
})(typeof exports != 'undefined' ? exports : this);