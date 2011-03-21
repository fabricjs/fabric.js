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
    
    fontsize:       20,
    fontweight:     100,
    fontfamily:     'Modernist_One_400',
    textDecoration: '',
    textShadow:     null,
    fontStyle:      '',
    path:           null,
    
    /**
     * @property
     * @type String
     */
    type: 'text',
    
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
     * (such as "fontfamily", "fontweight", etc.)
     * @private
     * @method _initStateProperties
     */
    _initStateProperties: function() {
      this.stateProperties = this.stateProperties.concat();
      this.stateProperties.push(
        'fontfamily', 
        'fontweight', 
        'path', 
        'text', 
        'textDecoration', 
        'textShadow', 
        'fontStyle'
      );
      fabric.util.removeFromArray(this.stateProperties, 'width');
    },
    
    /**
     * Returns string representation of an instance
     * @method toString
     * @return {String} String representation of text object
     */
    toString: function() {
      return '#<fabric.Text ('+ this.complexity() +'): ' + 
        JSON.stringify({ text: this.text, fontfamily: this.fontfamily }) + '>';
    },
    
    /**
     * @private
     * @method _render
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(context) {
      var o = Cufon.textOptions || (Cufon.textOptions = { });
      
      // export options to be used by cufon.js
      o.left = this.left;
      o.top = this.top;
      o.context = context;
      o.color = this.fill;
      
      var el = this._initDummyElement();
      
      // set "cursor" to top/left corner
      this.transform(context);
      
      // draw text
      Cufon.replaceElement(el, {
        separate: 'none', 
        fontFamily: this.fontfamily,
        enableTextDecoration: true,
        textDecoration: this.textDecoration,
        textShadow: this.textShadow,
        fontStyle: this.fontStyle
      });
      
      // update width, height
      this.width = o.width;
      this.height = o.height;
      
      // need to set coords _after_ the width/height was retreived from Cufon
      this.setCoords();
    },
    
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
    render: function(context) {
      context.save();
      this._render(context);
      if (this.active) {
        this.drawBorders(context);
        this.drawCorners(context);
      }
      context.restore();
    },
  	
  	/**
  	 * Returns object representation of an instance
  	 * @method toObject
  	 * @return {Object} Object representation of text object
  	 */
  	toObject: function() {
  	  return extend(this.callSuper('toObject'), {
  	    text:           this.text,
  	    fontsize:       this.fontsize,
  	    fontweight:     this.fontweight,
  	    fontfamily:     this.fontfamily,
  	    fontStyle:      this.fontStyle,
  	    textDecoration: this.textDecoration,
  	    textShadow:     this.textShadow,
  	    path:           this.path
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
  	 * Sets fontsize of an instance and updates its coordinates
  	 * @method setFontsize
  	 * @param {Number} value
  	 * @return {fabric.Text} thisArg
  	 * @chainable
  	 */
  	setFontsize: function(value) {
  	  this.set('fontsize', value);
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
  	  if (name === 'fontfamily') {
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
})(this);