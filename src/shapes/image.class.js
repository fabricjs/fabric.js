(function(global) {

  'use strict';

  var extend = fabric.util.object.extend;

  if (!global.fabric) {
    global.fabric = { };
  }

  if (global.fabric.Image) {
    fabric.warn('fabric.Image is already defined.');
    return;
  }

  var stateProperties = fabric.Object.prototype.stateProperties.concat();
  stateProperties.push(
    'cropX',
    'cropY'
  );

  /**
   * Image class
   * @class fabric.Image
   * @extends fabric.Object
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-1#images}
   * @see {@link fabric.Image#initialize} for constructor definition
   */
  fabric.Image = fabric.util.createClass(fabric.Object, /** @lends fabric.Image.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'image',

    /**
     * crossOrigin value (one of "", "anonymous", "use-credentials")
     * @see https://developer.mozilla.org/en-US/docs/HTML/CORS_settings_attributes
     * @type String
     * @default
     */
    crossOrigin: '',

    /**
     * Width of a stroke.
     * For image quality a stroke multiple of 2 gives better results.
     * @type Number
     * @default
     */
    strokeWidth: 0,

    /**
     * private
     * contains last value of scaleX to detect
     * if the Image got resized after the last Render
     * @type Number
     */
    _lastScaleX: 1,

    /**
     * private
     * contains last value of scaleY to detect
     * if the Image got resized after the last Render
     * @type Number
     */
    _lastScaleY: 1,

    /**
     * private
     * contains last value of scaling applied by the apply filter chain
     * @type Number
     */
    _filterScalingX: 1,

    /**
     * private
     * contains last value of scaling applied by the apply filter chain
     * @type Number
     */
    _filterScalingY: 1,

    /**
     * minimum scale factor under which any resizeFilter is triggered to resize the image
     * 0 will disable the automatic resize. 1 will trigger automatically always.
     * number bigger than 1 are not implemented yet.
     * @type Number
     */
    minimumScaleTrigger: 0.5,

    /**
     * List of properties to consider when checking if
     * state of an object is changed ({@link fabric.Object#hasStateChanged})
     * as well as for history (undo/redo) purposes
     * @type Array
     */
    stateProperties: stateProperties,

    /**
     * When `true`, object is cached on an additional canvas.
     * default to false for images
     * since 1.7.0
     * @type Boolean
     * @default
     */
    objectCaching: false,

    /**
     * key used to retrieve the texture representing this image
     * since 2.0.0
     * @type String
     * @default
     */
    cacheKey: '',

    /**
     * Image crop in pixels from original image size.
     * since 2.0.0
     * @type Number
     * @default
     */
    cropX: 0,

    /**
     * Image crop in pixels from original image size.
     * since 2.0.0
     * @type Number
     * @default
     */
    cropY: 0,

    /**
     * Constructor
     * @param {HTMLImageElement | String} element Image element
     * @param {Object} [options] Options object
     * @param {function} [callback] callback function to call after eventual filters applied.
     * @return {fabric.Image} thisArg
     */
    initialize: function(element, options) {
      options || (options = { });
      this.filters = [];
      this.callSuper('initialize', options);
      this._initElement(element, options);
      this.cacheKey = 'texture' + fabric.Object.__uid++;
    },

    /**
     * Returns image element which this instance if based on
     * @return {HTMLImageElement} Image element
     */
    getElement: function() {
      return this._element;
    },

    /**
     * Sets image element for this instance to a specified one.
     * If filters defined they are applied to new image.
     * You might need to call `canvas.renderAll` and `object.setCoords` after replacing, to render new image and update controls area.
     * @param {HTMLImageElement} element
     * @param {Object} [options] Options object
     * @return {fabric.Image} thisArg
     * @chainable
     */
    setElement: function(element, options) {
      this._element = element;
      this._originalElement = element;
      this._initConfig(options);
      if (this.resizeFilter) {
        this.applyResizeFilters();
      }
      if (this.filters.length !== 0) {
        this.applyFilters();
      }
      return this;
    },

    /**
     * Sets crossOrigin value (on an instance and corresponding image element)
     * @return {fabric.Image} thisArg
     * @chainable
     */
    setCrossOrigin: function(value) {
      this.crossOrigin = value;
      this._element.crossOrigin = value;

      return this;
    },

    /**
     * Returns original size of an image
     * @return {Object} Object with "width" and "height" properties
     */
    getOriginalSize: function() {
      var element = this.getElement();
      return {
        width: element.width,
        height: element.height
      };
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _stroke: function(ctx) {
      if (!this.stroke || this.strokeWidth === 0) {
        return;
      }
      var w = this.width / 2, h = this.height / 2;
      ctx.beginPath();
      ctx.moveTo(-w, -h);
      ctx.lineTo(w, -h);
      ctx.lineTo(w, h);
      ctx.lineTo(-w, h);
      ctx.lineTo(-w, -h);
      ctx.closePath();
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderDashedStroke: function(ctx) {
      var x = -this.width / 2,
          y = -this.height / 2,
          w = this.width,
          h = this.height;

      ctx.save();
      this._setStrokeStyles(ctx, this);

      ctx.beginPath();
      fabric.util.drawDashedLine(ctx, x, y, x + w, y, this.strokeDashArray);
      fabric.util.drawDashedLine(ctx, x + w, y, x + w, y + h, this.strokeDashArray);
      fabric.util.drawDashedLine(ctx, x + w, y + h, x, y + h, this.strokeDashArray);
      fabric.util.drawDashedLine(ctx, x, y + h, x, y, this.strokeDashArray);
      ctx.closePath();
      ctx.restore();
    },

    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      var filters = [];

      this.filters.forEach(function(filterObj) {
        if (filterObj) {
          filters.push(filterObj.toObject());
        }
      });
      var object = extend(
        this.callSuper(
          'toObject',
          ['crossOrigin', 'cropX', 'cropY'].concat(propertiesToInclude)
        ), {
          src: this.getSrc(),
          filters: filters,
        });
      if (this.resizeFilter) {
        object.resizeFilter = this.resizeFilter.toObject();
      }
      object.width /= this._filterScalingX;
      object.height /= this._filterScalingY;

      return object;
    },

    /* _TO_SVG_START_ */
    /**
     * Returns SVG representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG: function(reviver) {
      var markup = this._createBaseSVGMarkup(), x = -this.width / 2, y = -this.height / 2;
      markup.push(
        '<g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '">\n',
          '\t<image ', this.getSvgId(), 'xlink:href="', this.getSvgSrc(true),
            '" x="', x, '" y="', y,
            '" style="', this.getSvgStyles(),
            // we're essentially moving origin of transformation from top/left corner to the center of the shape
            // by wrapping it in container <g> element with actual transformation, then offsetting object to the top/left
            // so that object's center aligns with container's left/top
            '" width="', this.width,
            '" height="', this.height,
          '"></image>\n'
      );

      if (this.stroke || this.strokeDashArray) {
        var origFill = this.fill;
        this.fill = null;
        markup.push(
          '<rect ',
            'x="', x, '" y="', y,
            '" width="', this.width, '" height="', this.height,
            '" style="', this.getSvgStyles(),
          '"/>\n'
        );
        this.fill = origFill;
      }

      markup.push('</g>\n');

      return reviver ? reviver(markup.join('')) : markup.join('');
    },
    /* _TO_SVG_END_ */

    /**
     * Returns source of an image
     * @param {Boolean} filtered indicates if the src is needed for svg
     * @return {String} Source of an image
     */
    getSrc: function(filtered) {
      var element = filtered ? this._element : this._originalElement;
      if (element) {
        if (element.toDataURL) {
          return element.toDataURL();
        }
        return fabric.isLikelyNode ? element._src : element.src;
      }
      else {
        return this.src || '';
      }
    },

    /**
     * Sets source of an image
     * @param {String} src Source string (URL)
     * @param {Function} [callback] Callback is invoked when image has been loaded (and all filters have been applied)
     * @param {Object} [options] Options object
     * @return {fabric.Image} thisArg
     * @chainable
     */
    setSrc: function(src, callback, options) {
      fabric.util.loadImage(src, function(img) {
        this.setElement(img, options);
        callback(this);
      }, this, options && options.crossOrigin);
      return this;
    },

    /**
     * Returns string representation of an instance
     * @return {String} String representation of an instance
     */
    toString: function() {
      return '#<fabric.Image: { src: "' + this.getSrc() + '" }>';
    },

    applyResizeFilters: function() {
      var filter = this.resizeFilter,
          retinaScaling = this.canvas ? this.canvas.getRetinaScaling() : 1,
          minimumScale = this.minimumScaleTrigger,
          scaleX = this.scaleX < minimumScale ? this.scaleX : 1,
          scaleY = this.scaleY < minimumScale ? this.scaleY : 1;
      if (scaleX * retinaScaling < 1) {
        scaleX *= retinaScaling;
      }
      if (scaleY * retinaScaling < 1) {
        scaleY *= retinaScaling;
      }
      if (!filter || (scaleX >= 1 && scaleY >= 1)) {
        this._element = this._filteredEl;
        return;
      }
      if (!fabric.filterBackend) {
        fabric.filterBackend = fabric.initFilterBackend();
      }
      var elementToFilter = this._filteredEl || this._originalElement, imageData;
      if (this._element === this._originalElement) {
        // if the element is the same we need to create a new element
        var canvasEl = fabric.util.createCanvasElement();
        canvasEl.width = elementToFilter.width;
        canvasEl.height = elementToFilter.height;
        this._element = canvasEl;
      }
      var ctx = this._element.getContext('2d');
      if (elementToFilter.getContext) {
        imageData =
          elementToFilter.getContext('2d').getImageData(0, 0, elementToFilter.width, elementToFilter.height);
      }
      else {
        ctx.drawImage(elementToFilter, 0, 0);
        imageData = ctx.getImageData(0, 0, elementToFilter.width, elementToFilter.height);
      }
      var options = {
        imageData: imageData,
        scaleX: scaleX,
        scaleY: scaleY,
      };
      filter.applyTo2d(options);
      this.width = this._element.width = options.imageData.width;
      this.height = this._element.height = options.imageData.height;
      ctx.putImageData(options.imageData, 0, 0);
    },

    /**
     * Applies filters assigned to this image (from "filters" array) or from filter param
     * @method applyFilters
     * @param {Array} filters to be applied
     * @param {Boolean} forResizing specify if the filter operation is a resize operation
     * @return {thisArg} return the fabric.Image object
     * @chainable
     */
    applyFilters: function(filters) {

      filters = filters || this.filters || [];
      filters = filters.filter(function(filter) { return filter; });
      if (filters.length === 0) {
        this._element = this._originalElement;
        this._filterScalingX = 1;
        this._filterScalingY = 1;
        return this;
      }

      var imgElement = this._originalElement,
          sourceWidth = imgElement.naturalWidth || imgElement.width,
          sourceHeight = imgElement.naturalHeight || imgElement.height;

      if (this._element === this._originalElement) {
        // if the element is the same we need to create a new element
        var canvasEl = fabric.util.createCanvasElement();
        canvasEl.width = imgElement.width;
        canvasEl.height = imgElement.height;
        this._element = canvasEl;
      }
      else {
        // clear the existing element to get new filter data
        this._element.getContext('2d').clearRect(0, 0, sourceWidth, sourceHeight);
      }
      if (!fabric.filterBackend) {
        fabric.filterBackend = fabric.initFilterBackend();
      }
      fabric.filterBackend.applyFilters(
        filters, this._originalElement, sourceWidth, sourceHeight, this._element, this.cacheKey);
      if (this.width !== this._element.width || this.height !== this._element.height) {
        this._filterScalingX = this._element.width / this.width;
        this._filterScalingY = this._element.height / this.height;
        this.width = this._element.width;
        this.height = this._element.height;
      }
      return this;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(ctx) {
      var x = -this.width / 2, y = -this.height / 2, elementToDraw;

      if (this.isMoving === false && this.resizeFilter && this._needsResize()) {
        this._lastScaleX = this.scaleX;
        this._lastScaleY = this.scaleY;
        this.applyResizeFilters();
      }
      elementToDraw = this._element;
      elementToDraw && ctx.drawImage(elementToDraw,
                                     this.cropX, this.cropY, this.width, this.height,
                                     x, y, this.width, this.height);
      this._stroke(ctx);
      this._renderStroke(ctx);
    },

    /**
     * @private, needed to check if image needs resize
     */
    _needsResize: function() {
      return (this.scaleX !== this._lastScaleX || this.scaleY !== this._lastScaleY);
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
     * @private
     * @param {HTMLImageElement|String} element The element representing the image
     * @param {Object} [options] Options object
     */
    _initElement: function(element, options) {
      this.setElement(fabric.util.getById(element), options);
      fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS);
    },

    /**
     * @private
     * @param {Object} [options] Options object
     */
    _initConfig: function(options) {
      options || (options = { });
      this.setOptions(options);
      this._setWidthHeight(options);
      if (this._element && this.crossOrigin) {
        this._element.crossOrigin = this.crossOrigin;
      }
    },

    /**
     * @private
     * @param {Array} filters to be initialized
     * @param {Function} callback Callback to invoke when all fabric.Image.filters instances are created
     */
    _initFilters: function(filters, callback) {
      if (filters && filters.length) {
        fabric.util.enlivenObjects(filters, function(enlivenedObjects) {
          callback && callback(enlivenedObjects);
        }, 'fabric.Image.filters');
      }
      else {
        callback && callback();
      }
    },

    /**
     * @private
     * @param {Object} [options] Object with width/height properties
     */
    _setWidthHeight: function(options) {
      this.width = 'width' in options
        ? options.width
        : (this.getElement()
            ? this.getElement().width || 0
            : 0);

      this.height = 'height' in options
        ? options.height
        : (this.getElement()
            ? this.getElement().height || 0
            : 0);
    },

    parsePreserveAspectRatioAttribute: function() {
      if (!this.preserveAspectRatio) {
        return;
      }
      var pAR = fabric.util.parsePreserveAspectRatioAttribute(this.preserveAspectRatio),
          width = this._element.width, height = this._element.height, scale,
          pWidth = this.width, pHeight = this.height, parsedAttributes = { width: pWidth, height: pHeight };
      if (pAR && (pAR.alignX !== 'none' || pAR.alignY !== 'none')) {
        if (pAR.meetOrSlice === 'meet') {
          this.width = width;
          this.height = height;
          this.scaleX = this.scaleY = scale = fabric.util.findScaleToFit(this._element, parsedAttributes);
          if (pAR.alignX === 'Mid') {
            this.left += (pWidth - width * scale) / 2;
          }
          if (pAR.alignX === 'Max') {
            this.left += pWidth - width * scale;
          }
          if (pAR.alignY === 'Mid') {
            this.top += (pHeight - height * scale) / 2;
          }
          if (pAR.alignY === 'Max') {
            this.top += pHeight - height * scale;
          }
        }
        if (pAR.meetOrSlice === 'slice') {
          this.scaleX = this.scaleY = scale = fabric.util.findScaleToCover(this._element, parsedAttributes);
          this.width = pWidth / scale;
          this.height = pHeight / scale;
          if (pAR.alignX === 'Mid') {
            this.cropX = (width - this.width) / 2;
          }
          if (pAR.alignX === 'Max') {
            this.cropX = width - this.width;
          }
          if (pAR.alignY === 'Mid') {
            this.cropY = (height - this.height) / 2;
          }
          if (pAR.alignY === 'Max') {
            this.cropY = height - this.height;
          }
        }
      }
      else {
        this.scaleX = pWidth / width;
        this.scaleY = pHeight / height;
      }
    }
  });

  /**
   * Default CSS class name for canvas
   * @static
   * @type String
   * @default
   */
  fabric.Image.CSS_CANVAS = 'canvas-img';

  /**
   * Alias for getSrc
   * @static
   */
  fabric.Image.prototype.getSvgSrc = fabric.Image.prototype.getSrc;

  /**
   * Creates an instance of fabric.Image from its object representation
   * @static
   * @param {Object} object Object to create an instance from
   * @param {Function} callback Callback to invoke when an image instance is created
   */
  fabric.Image.fromObject = function(object, callback) {
    fabric.util.loadImage(object.src, function(img, error) {
      if (error) {
        callback && callback(null, error);
        return;
      }
      fabric.Image.prototype._initFilters.call(object, object.filters, function(filters) {
        object.filters = filters || [];
        fabric.Image.prototype._initFilters.call(object, [object.resizeFilter], function(resizeFilters) {
          object.resizeFilter = resizeFilters[0];
          var image = new fabric.Image(img, object);
          callback(image);
        });
      });
    }, null, object.crossOrigin);
  };

  /**
   * Creates an instance of fabric.Image from an URL string
   * @static
   * @param {String} url URL to create an image from
   * @param {Function} [callback] Callback to invoke when image is created (newly created image is passed as a first argument)
   * @param {Object} [imgOptions] Options object
   */
  fabric.Image.fromURL = function(url, callback, imgOptions) {
    fabric.util.loadImage(url, function(img) {
      callback && callback(new fabric.Image(img, imgOptions));
    }, null, imgOptions && imgOptions.crossOrigin);
  };

  /* _FROM_SVG_START_ */
  /**
   * List of attribute names to account for when parsing SVG element (used by {@link fabric.Image.fromElement})
   * @static
   * @see {@link http://www.w3.org/TR/SVG/struct.html#ImageElement}
   */
  fabric.Image.ATTRIBUTE_NAMES =
    fabric.SHARED_ATTRIBUTES.concat('x y width height preserveAspectRatio xlink:href crossOrigin'.split(' '));

  /**
   * Returns {@link fabric.Image} instance from an SVG element
   * @static
   * @param {SVGElement} element Element to parse
   * @param {Object} [options] Options object
   * @param {Function} callback Callback to execute when fabric.Image object is created
   * @return {fabric.Image} Instance of fabric.Image
   */
  fabric.Image.fromElement = function(element, callback, options) {
    var parsedAttributes = fabric.parseAttributes(element, fabric.Image.ATTRIBUTE_NAMES);

    fabric.Image.fromURL(parsedAttributes['xlink:href'], callback,
      extend((options ? fabric.util.object.clone(options) : { }), parsedAttributes));
  };
  /* _FROM_SVG_END_ */

})(typeof exports !== 'undefined' ? exports : this);
