//= require "canvas_object.class"

(function(){
  
  var fabric = this.fabric || (this.fabric = { });

  if (fabric.Text) {    
    console.warn('fabric.Text is already defined');
    return;
  }
  if (!fabric.Object) {
    console.warn('fabric.Text requires fabric.Object');
    return;
  }
  
  fabric.Text = fabric.base.createClass(fabric.Object, {
    
    options: {
      top:         10,
      left:        10,
      fontsize:    20,
      fontweight:  100,
      fontfamily:  'Modernist_One_400',
      path:        null
    },
    
    type: 'text',
    
    initialize: function(text, options) {
      this.originalState = { };
      this.initStateProperties();
      this.text = text;
      this.setOptions(options);
      fabric.base.object.extend(this, this.options);
      this.theta = this.angle * (Math.PI/180);
      this.width = this.getWidth();
      this.setCoords();
    },
    
    initStateProperties: function() {
      var o;
      if ((o = this.constructor) && 
          (o = o.superclass) &&
          (o = o.prototype) &&
          (o = o.stateProperties) &&
          o.clone) {
        this.stateProperties = o.clone();
        this.stateProperties.push('fontfamily', 'fontweight', 'path');
      }
    },
    
    toString: function() {
      return '#<fabric.Text ('+ this.complexity() +'): ' + 
        JSON.stringify({ text: this.text, fontfamily: this.fontfamily }) + '>';
    },
    
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
        fontFamily: this.fontfamily
      });
      
      // update width, height
      this.width = o.width;
      this.height = o.height;
    },
    
    _initDummyElement: function() {
      var el = document.createElement('div');
      el.innerHTML = this.text;
      
      // need to specify these manually, since Jaxer doesn't support retrieving computed style
      el.style.fontSize = '40px';
      el.style.fontWeight = '400';
      el.style.fontStyle = 'normal';
      el.style.letterSpacing = 'normal';
      el.style.color = '#000000';
      el.style.fontWeight = '600';
      el.style.fontFamily = 'Verdana';
      
      return el;
    },
    
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
  	 * @method toObject
  	 * @return {Object} object representation of an instance
  	 */
  	toObject: function() {
  	  return fabric.base.object.extend(this.callSuper('toObject'), {
  	    text:         this.text,
  	    fontsize:     this.fontsize,
  	    fontweight:   this.fontweight,
  	    fontfamily:   this.fontfamily,
  	    path:         this.path
  	  });
  	},
  	
  	/**
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
  	 * @method getText
  	 * @return {String}
  	 */
  	getText: function() {
  	  return this.text;
  	},
  	
  	/**
  	 * @method setText
  	 * @param {String} value
  	 * @return {fabric.Text} thisArg
  	 */
  	setText: function(value) {
  	  this.set('text', value);
  	  this.setCoords();
  	  return this;
  	},
  	
  	set: function(name, value) {
  	  this[name] = value;
  	  if (name === 'fontfamily') {
  	    this.path = this.path.replace(/(.*?)([^\/]*)(\.font\.js)/, '$1' + value + '$3');
  	  }
  	  return this;
  	}
  });
	
	/**
   * @static
   * @method fromObject
   * @param {Object} object to create an instance from
   * @return {fabric.Text} an instance
   */
	fabric.Text.fromObject = function(object) {
	  return new fabric.Text(object.text, fabric.base.object.clone(object));
	};
	
	/**
   * @static
   * @method fabric.Text.fromElement
   * @return {fabric.Text} an instance
   */
	fabric.Text.fromElement = function(element) {
	  // TODO (kangax): implement this
	};
})();