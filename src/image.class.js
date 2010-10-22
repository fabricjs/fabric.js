//= require "object.class"

(function(global) {
  
  "use strict";
  
  var extend = fabric.util.object.extend;
  
  if (!global.fabric) {
    global.fabric = { };
  }
  
  if (global.fabric.Image) {
    fabric.warn('fabric.Image is already defined.');
    return;
  };
  
  if (!fabric.Object) {
    fabric.warn('fabric.Object is required for fabric.Image initialization');
    return;
  }
  
  /** 
   * @class Image
   * @extends fabric.Object
   */
  fabric.Image = fabric.util.createClass(fabric.Object, /** @scope fabric.Image.prototype */ {
    
    /**
     * @property
     * @type Number
     */
    maxwidth: null,
    
    /**
     * @property
     * @type Number
     */
    maxheight: null,
    
    /**
     * @property
     * @type Boolean
     */
    active: false,
    
    /**
     * @property
     * @type Boolean
     */
    bordervisibility: false,
    
    /**
     * @property
     * @type Boolean
     */
    cornervisibility: false,
    
    /**
     * @property
     * @type String
     */
    type: 'image',
    
    __isGrayscaled: false,
    
    /**
     * Constructor
     * @param {HTMLImageElement | String} element Image element
     * @param {Object} options optional
     */
    initialize: function(element, options) {
      this.callSuper('initialize', options);
      this._initElement(element);
      this._initConfig(options || { });
    },
    
    /**
     * Returns image element which this instance if based on
     * @method getElement
     * @return {HTMLImageElement} image element
     */
    getElement: function() {
      return this._element;
    },
    
    /**
     * Sets image element for this instance to a specified one
     * @method setElement
     * @param {HTMLImageElement} element
     * @return {fabric.Image} thisArg
     * @chainable
     */
    setElement: function(element) {
      this._element = element;
      return this;
    },
    
    /**
     * Resizes an image depending on whether maxwidth and maxheight are set up;
     * Width and height have to mantain the same proportion in the final image as it was in the initial one.
     * @method getNormalizedSize
     * @param {Object} oImg
     * @param {Number} maxwidth maximum width of the image (in px)
     * @param {Number} maxheight maximum height of the image (in px)
     */ 
    getNormalizedSize: function(oImg, maxwidth, maxheight) {
      if (maxheight && maxwidth && (oImg.width > oImg.height && (oImg.width / oImg.height) < (maxwidth / maxheight))) {
        // height is the constraining dimension.
        normalizedWidth = ~~((oImg.width * maxheight) / oImg.height);
        normalizedHeight = maxheight;
      }
      else if (maxheight && ((oImg.height == oImg.width) || (oImg.height > oImg.width) || (oImg.height > maxheight))) {
        // height is the constraining dimension.
        normalizedWidth = ~~((oImg.width * maxheight) / oImg.height);
        normalizedHeight = maxheight;
      }
      else if (maxwidth && (maxwidth < oImg.width)) {
        // width is the constraining dimension.
        normalizedHeight = ~~((oImg.height * maxwidth) / oImg.width);
        normalizedWidth = maxwidth;
      }
      else {
        normalizedWidth = oImg.width;
        normalizedHeight = oImg.height;
      }
      
      return { 
        width: normalizedWidth, 
        height: normalizedHeight 
      };
    },
    
    /**
     * Returns original size of an image
     * @method getOriginalSize
     * @return {Object} object with "width" and "height" properties
     */
    getOriginalSize: function() {
      var element = this.getElement();
      return { 
        width: element.width, 
        height: element.height
      };
    },
    
    /**
     * Sets border visibility
     * @method setBorderVisibility
     * @param {Boolean} visible When true, border is set to be visible
     */
    setBorderVisibility: function(visible) {
      this._resetWidthHeight();
      this._adjustWidthHeightToBorders(showBorder);
      this.setCoords();
    },
    
    /**
     * Sets corner visibility
     * @method setCornersVisibility
     * @param {Boolean} visible When true, corners are set to be visible
     */
    setCornersVisibility: function(visible) {
      this.cornervisibility = !!visible;
    },
    
    /**
     * Renders image on a specified context
     * @method render
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    render: function(ctx, noTransform) {
      ctx.save();
      if (!noTransform) {
        this.transform(ctx);
      }
      this._render(ctx);
      if (this.active && !noTransform) {
        this.drawBorders(ctx);
        this.hideCorners || this.drawCorners(ctx);
      }
      ctx.restore();
    },
    
    /**
     * Returns object representation of an instance
     * @method toObject
     * @return {Object} Object representation of an instance
     */
    toObject: function() {
      return extend(this.callSuper('toObject'), {
        src: this.getSrc()
      });
    },
    
    /**
     * Returns source of an image
     * @method getSrc
     * @return {String} Source of an image
     */
    getSrc: function() {
      return this.getElement().src;
    },
    
    /**
     * Returns string representation of an instance
     * @method toString
     * @return {String} String representation of an instance
     */
    toString: function() {        
      return '#<fabric.Image: { src: "' + this.getSrc() + '" }>';
    },
    
    /**
     * Returns a clone of an instance
     * @mthod clone
     * @param {Function} callback Callback is invoked with a clone as a first argument
     */
    clone: function(callback) {
      this.constructor.fromObject(this.toObject(), callback);
    },
    
    /**
     * Makes image grayscale
     * @mthod toGrayscale
     * @param {Function} callback
     */
    toGrayscale: function(callback) {
      
      if (this.__isGrayscaled) {
        return;
      }
      
      var imgEl = this.getElement(),
          canvasEl = document.createElement('canvas'),
          replacement = document.createElement('img'),
          _this = this;

      canvasEl.width = imgEl.width;
      canvasEl.height = imgEl.height;

      canvasEl.getContext('2d').drawImage(imgEl, 0, 0);
      fabric.Element.toGrayscale(canvasEl);
      
      /** @ignore */
      replacement.onload = function() {
        _this.setElement(replacement);
        callback && callback();
        replacement.onload = canvasEl = imgEl = imageData = null;
      };
      replacement.width = imgEl.width;
      replacement.height = imgEl.height;
      
      replacement.src = canvasEl.toDataURL('image/png');
      
      this.__isGrayscaled = true;
      
      return this;
    },
    
    /**
     * @private
     */
    _render: function(ctx) {
      var originalImgSize = this.getOriginalSize();
      ctx.drawImage(
        this.getElement(),
        - originalImgSize.width / 2,
        - originalImgSize.height / 2,
        originalImgSize.width,
        originalImgSize.height
      );
    },
    
    /**
     * @private
     */
    _adjustWidthHeightToBorders: function(showBorder) {
      if (showBorder) {
        this.currentBorder = this.borderwidth;
        this.width += (2 * this.currentBorder);
        this.height += (2 * this.currentBorder);
      }
      else {
        this.currentBorder = 0;
      }
    },
    
    /**
     * @private
     */
    _resetWidthHeight: function() {
      var element = this.getElement();
      
      this.set('width', element.width);
      this.set('height', element.height);
    },
    
    /**
     * The Image class's initialization method. This method is automatically 
     * called by the constructor.
     * @method _initElement
     * @param {HTMLImageElement|String} el The element representing the image
     */
    _initElement: function(element) {
      this.setElement(fabric.util.getById(element));
      fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS);
    },
    
    /**
     * @method _initConfig
     * @param {Object} options Options object
     */
    _initConfig: function(options) {
      this.setOptions(options);
      this._setBorder();
      this._setWidthHeight(options);
    },
    
    /**
     * @private
     */
    _setBorder: function() {
      if (this.bordervisibility) {
        this.currentBorder = this.borderwidth;
      }
      else {
        this.currentBorder = 0;
      }
    },
    
    /**
     * @private
     */
    _setWidthHeight: function(options) {
      var sidesBorderWidth = 2 * this.currentBorder;
      this.width = (this.getElement().width || 0) + sidesBorderWidth;
      this.height = (this.getElement().height || 0) + sidesBorderWidth;
    },
    
    /**
     * Returns complexity of an instance
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return 1;
    }
  });
  
  /**
   * Default CSS class name for canvas
   * @static
   * @type String
   */
  fabric.Image.CSS_CANVAS = "canvas-img";
  
  /**
   * Creates an instance of fabric.Image from its object representation
   * @static
   * @method fromObject
   * @param object {Object}
   * @param callback {Function} optional
   */
  fabric.Image.fromObject = function(object, callback) {
    var img = document.createElement('img'),
        src = object.src;
        
    if (object.width) {
      img.width = object.width;
    }
    if (object.height) {
      img.height = object.height;
    }
    
    /** @ignore */
    img.onload = function() {
      if (callback) {
        callback(new fabric.Image(img, object));
      }
      img = img.onload = null;
    };
    img.src = src;
  };
  
  /**
   * Creates an instance of fabric.Image from an URL string
   * @static
   * @method fromURL
   * @param {String} url URL to create an image from
   * @param {Function} [callback] Callback to invoke when image is created (newly created image is passed as a first argument)
   * @param {Object} [imgOptions] Options object
   */
  fabric.Image.fromURL = function(url, callback, imgOptions) {
    var img = document.createElement('img');
    
    /** @ignore */
    img.onload = function() {
      if (callback) {
        callback(new fabric.Image(img, imgOptions));
      }
      img = img.onload = null;
    };
    img.src = url;
  };
})(this);