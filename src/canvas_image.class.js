//= require "canvas_object.class"

(function() {
  
  var global = this;
  
  if (!global.Canvas) {
    global.Canvas = { };
  }
  
  if (global.Canvas.Image) {
    console.warn('Canvas.Image is already defined.');
    return;
  };
  
  if (!Canvas.Object) {
    console.warn('Canvas.Object is required for Canvas.Image initialization');
    return;
  }
  
  
  Canvas.Image = Class.create(Canvas.Object, {
    
    maxwidth: null,
    maxheight: null,
    active: false,
    
    bordervisibility: false,
    cornervisibility: false,
    
    type: 'image',
    
    __isGrayscaled: false,
    
    /**
     * @constructor
     * @param {HTMLImageElement | String} element Image element
     * @param {Object} options optional
     */
    initialize: function(element, options) {
      this.callSuper('initialize', options);
      this._initElement(element);
      this._initConfig(options || { });
    },
    
    /**
     * @method getElement
     * @return {HTMLImageElement} image element
     */
    getElement: function() {
      return this._element;
    },
    
    /**
     * @method setElement
     * @return {Canvas.Image} thisArg
     */
    setElement: function(element) {
      this._element = element;
      return this;
    },
    
    /**
     * Method that resizes an image depending on whether maxwidth and maxheight are set up.
     * Width and height have to mantain the same proportion in the final image as it was in the initial one.
     * @method getNormalizedSize
     * @param {Object} oImg
     * @param {Number} maximum width of the image in px 
     * @param {Number} maximum height of the image in px 
     */ 
    getNormalizedSize: function(oImg, maxwidth, maxheight) {
      if (maxheight && maxwidth && (oImg.width > oImg.height && (oImg.width / oImg.height) < (maxwidth / maxheight))) {
        // height is the constraining dimension.
        normalizedWidth = Math.floor((oImg.width * maxheight) / oImg.height);
        normalizedHeight = maxheight;
      }
      else if (maxheight && ((oImg.height == oImg.width) || (oImg.height > oImg.width) || (oImg.height > maxheight))) {
        // height is the constraining dimension.
        normalizedWidth = Math.floor((oImg.width * maxheight) / oImg.height);
        normalizedHeight = maxheight;
      }
      else if (maxwidth && (maxwidth < oImg.width)){ 
        // width is the constraining dimension.
        normalizedHeight = Math.floor((oImg.height * maxwidth) / oImg.width);
        normalizedWidth = maxwidth;
      }
      else {
        normalizedWidth = oImg.width;
        normalizedHeight = oImg.height;
      }
      
      return { 
        width: normalizedWidth, 
        height: normalizedHeight 
      }
    },
    
    /**
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
     * @method setBorderVisibility
     * @param showBorder {Boolean} when true, border is being set visible
     */
    setBorderVisibility: function(showBorder) {
      this._resetWidthHeight();
      this._adjustWidthHeightToBorders(showBorder);
      this.setCoords();
    },
    
    /**
     * @method setCornersVisibility
     */
    setCornersVisibility: function(visible) {
      this.cornervisibility = !!visible;
    },
    
    /**
     * @method render
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
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      return Object.extend(this.callSuper('toObject'), {
        src: this.getSrc()
      });
    },
    
    /**
     * @method getSrc
     * @return {String} source of an image
     */
    getSrc: function() {
      return this.getElement().src;
    },
    
    /**
     * @method toString
     * @return {String} string representation of an instance
     */
    toString: function() {        
      return '#<Canvas.Image: { src: "' + this.getSrc() + '" }>';
    },
    
    /**
     * @mthod clone
     * @param {Function} callback
     */
    clone: function(callback) {
      this.constructor.fromObject(this.toObject(), callback);
    },
    
    /**
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
      Canvas.Element.toGrayscale(canvasEl);
          
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
      this.setElement($(element));
      this.getElement().addClassName(Canvas.Image.CSS_CANVAS);
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
    }
  });
  
  /**
   * Constant for the default CSS class name that represents a Canvas
   * @property Canvas.Image.CSS_CANVAS
   * @static
   * @final
   * @type String
   */
  Canvas.Image.CSS_CANVAS = "canvas-img";
  
  /**
   * Creates an instance of Canvas.Image from its object representation
   * @method fromObject
   * @param object {Object}
   * @param callback {Function} optional
   * @static
   */
  Canvas.Image.fromObject = function(object, callback) {
    var img = document.createElement('img'),
        src = object.src;
        
    if (object.width) {
      img.width = object.width;
    }
    if (object.height) {
      img.height = object.height;
    }
    img.onload = function() {
      if (callback) {
        callback(new Canvas.Image(img, object));
      }
      img = img.onload = null;
    };
    img.src = src;
  };
  
  /**
   * Creates an instance of Canvas.Image from an URL string
   * @method fromURL
   * @param url {String}
   * @param callback {Function} optional
   * @param imgOptions {Object} optional
   * @static
   */
  Canvas.Image.fromURL = function(url, callback, imgOptions) {
    var img = document.createElement('img');
    img.onload = function() {
      if (callback) {
        callback(new Canvas.Image(img, imgOptions));
      }
      img = img.onload = null;
    };
    img.src = url;
  };
})();