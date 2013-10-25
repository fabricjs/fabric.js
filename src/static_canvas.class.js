(function () {

  "use strict";

  if (fabric.StaticCanvas) {
    fabric.warn('fabric.StaticCanvas is already defined.');
    return;
  }

  // aliases for faster resolution
  var extend = fabric.util.object.extend,
      getElementOffset = fabric.util.getElementOffset,
      removeFromArray = fabric.util.removeFromArray,
      removeListener = fabric.util.removeListener,

      CANVAS_INIT_ERROR = new Error('Could not initialize `canvas` element');

  /**
   * Static canvas class
   * @class fabric.StaticCanvas
   * @mixes fabric.Collection
   * @mixes fabric.Observable
   * @see {@link http://fabricjs.com/static_canvas/|StaticCanvas demo}
   * @see {@link fabric.StaticCanvas#initialize} for constructor definition
   * @fires before:render
   * @fires after:render
   * @fires canvas:cleared
   * @fires object:added
   * @fires object:removed
   */
  fabric.StaticCanvas = fabric.util.createClass(/** @lends fabric.StaticCanvas.prototype */ {

    /**
     * Constructor
     * @param {HTMLElement | String} el &lt;canvas> element to initialize instance on
     * @param {Object} [options] Options object
     * @return {Object} thisArg
     */
    initialize: function(el, options) {
      options || (options = { });

      this._initStatic(el, options);
      fabric.StaticCanvas.activeInstance = this;
    },

    /**
     * Background color of canvas instance
     * @type String
     * @default
     */
    backgroundColor: '',

    /**
     * Background image of canvas instance
     * Should be set via {@link fabric.StaticCanvas#setBackgroundImage}
     * @type String
     * @default
     */
    backgroundImage: '',

    /**
     * Opacity of the background image of the canvas instance
     * @type Float
     * @default
     */
    backgroundImageOpacity: 1,

    /**
     * Indicates whether the background image should be stretched to fit the
     * dimensions of the canvas instance.
     * @type Boolean
     * @default
     */
    backgroundImageStretch: true,

    /**
     * Overlay image of canvas instance
     * Should be set via {@link fabric.StaticCanvas#setOverlayImage}
     * @type String
     * @default
     */
    overlayImage: '',

    /**
     * Left offset of overlay image (if present)
     * @type Number
     * @default
     */
    overlayImageLeft: 0,

    /**
     * Top offset of overlay image (if present)
     * @type Number
     * @default
     */
    overlayImageTop: 0,

    /**
     * Indicates whether toObject/toDatalessObject should include default values
     * @type Boolean
     * @default
     */
    includeDefaultValues: true,

    /**
     * Indicates whether objects' state should be saved
     * @type Boolean
     * @default
     */
    stateful: true,

    /**
     * Indicates whether {@link fabric.Collection.add}, {@link fabric.Collection.insertAt} and {@link fabric.Collection.remove} should also re-render canvas.
     * Disabling this option could give a great performance boost when adding/removing a lot of objects to/from canvas at once
     * (followed by a manual rendering after addition/deletion)
     * @type Boolean
     * @default
     */
    renderOnAddRemove: true,

    /**
     * Function that determines clipping of entire canvas area
     * Being passed context as first argument. See clipping canvas area in {@link https://github.com/kangax/fabric.js/wiki/FAQ}
     * @type Function
     * @default
     */
    clipTo: null,

    /**
     * Indicates whether object controls (borders/controls) are rendered above overlay image
     * @type Boolean
     * @default
     */
    controlsAboveOverlay: false,

    /**
     * Indicates whether the browser can be scrolled when using a touchscreen and dragging on the canvas
     * @type Boolean
     * @default
     */
     allowTouchScrolling: false,

    /**
     * Callback; invoked right before object is about to be scaled/rotated
     * @param {fabric.Object} target Object that's about to be scaled/rotated
     */
    onBeforeScaleRotate: function () {
      /* NOOP */
    },

    /**
     * @private
     * @param {HTMLElement | String} el &lt;canvas> element to initialize instance on
     * @param {Object} [options] Options object
     */
    _initStatic: function(el, options) {
      this._objects = [];

      this._createLowerCanvas(el);
      this._initOptions(options);

      if (options.overlayImage) {
        this.setOverlayImage(options.overlayImage, this.renderAll.bind(this));
      }
      if (options.backgroundImage) {
        this.setBackgroundImage(options.backgroundImage, this.renderAll.bind(this));
      }
      if (options.backgroundColor) {
        this.setBackgroundColor(options.backgroundColor, this.renderAll.bind(this));
      }
      this.calcOffset();
    },

    /**
     * Calculates canvas element offset relative to the document
     * This method is also attached as "resize" event handler of window
     * @return {fabric.Canvas} instance
     * @chainable
     */
    calcOffset: function () {
      this._offset = getElementOffset(this.lowerCanvasEl);
      return this;
    },

    /**
     * Sets {@link fabric.StaticCanvas#overlayImage|overlay image} for this canvas
     * @param {String} url url of an image to set overlay to
     * @param {Function} callback callback to invoke when image is loaded and set as an overlay
     * @param {Object} [options] Optional options to set for the overlay image
     * @param {Number} [options.overlayImageLeft] {@link fabric.StaticCanvas#overlayImageLeft|Left offset} of overlay image
     * @param {Number} [options.overlayImageTop] {@link fabric.StaticCanvas#overlayImageTop|Top offset} of overlay image
     * @return {fabric.Canvas} thisArg
     * @chainable
     * @see {@link http://jsfiddle.net/fabricjs/MnzHT/|jsFiddle demo}
     * @example <caption>Normal overlayImage</caption>
     * canvas.setOverlayImage('http://fabricjs.com/assets/jail_cell_bars.png', canvas.renderAll.bind(canvas));
     * @example <caption>Displaced overlayImage (left and top != 0)</caption>
     * canvas.setOverlayImage('http://fabricjs.com/assets/jail_cell_bars.png', canvas.renderAll.bind(canvas), {
     *   overlayImageLeft: 100,
     *   overlayImageTop: 100
     * });
     */
    setOverlayImage: function (url, callback, options) { // TODO (kangax): test callback
      fabric.util.loadImage(url, function(img) {
        this.overlayImage = img;
        if (options && ('overlayImageLeft' in options)) {
          this.overlayImageLeft = options.overlayImageLeft;
        }
        if (options && ('overlayImageTop' in options)) {
          this.overlayImageTop = options.overlayImageTop;
        }
        callback && callback();
      }, this);

      return this;
    },

    /**
     * Sets {@link fabric.StaticCanvas#backgroundImage|background image} for this canvas
     * @param {String} url URL of an image to set background to
     * @param {Function} callback callback to invoke when image is loaded and set as background
     * @param {Object} [options] Optional options to set for the background image
     * @param {Float} [options.backgroundImageOpacity] {@link fabric.StaticCanvas#backgroundImageOpacity|Opacity} of the background image of the canvas instance
     * @param {Boolean} [options.backgroundImageStretch] Indicates whether the background image should be {@link fabric.StaticCanvas#backgroundImageStretch|strechted} to fit the canvas
     * @return {fabric.Canvas} thisArg
     * @chainable
     * @see {@link http://jsfiddle.net/fabricjs/YH9yD/|jsFiddle demo}
     * @example <caption>Normal backgroundImage</caption>
     * canvas.setBackgroundImage('http://fabricjs.com/assets/jail_cell_bars.png', canvas.renderAll.bind(canvas));
     * @example <caption>Stretched backgroundImage with opacity</caption>
     * canvas.setBackgroundImage('http://fabricjs.com/assets/jail_cell_bars.png', canvas.renderAll.bind(canvas), {
     *   backgroundImageOpacity: 0.5,
     *   backgroundImageStretch: true
     * });
     */
    setBackgroundImage: function (url, callback, options) {
      fabric.util.loadImage(url, function(img) {
        this.backgroundImage = img;
        if (options && ('backgroundImageOpacity' in options)) {
          this.backgroundImageOpacity = options.backgroundImageOpacity;
        }
        if (options && ('backgroundImageStretch' in options)) {
          this.backgroundImageStretch = options.backgroundImageStretch;
        }
        callback && callback();
      }, this);

      return this;
    },

    /**
     * Sets {@link fabric.StaticCanvas#backgroundColor|background color} for this canvas
     * @param {String|fabric.Pattern} backgroundColor Color or pattern to set background color to
     * @param {Function} callback callback to invoke when background color is set
     * @return {fabric.Canvas} thisArg
     * @chainable
     * @see {@link http://jsfiddle.net/fabricjs/hXzvk/|jsFiddle demo}
     * @example <caption>Normal backgroundColor - color value</caption>
     * canvas.setBackgroundColor('rgba(255, 73, 64, 0.6)', canvas.renderAll.bind(canvas));
     * @example <caption>fabric.Pattern used as backgroundColor</caption>
     * canvas.setBackgroundColor({
     *   source: 'http://fabricjs.com/assets/escheresque_ste.png'
     * }, canvas.renderAll.bind(canvas));
     */
    setBackgroundColor: function(backgroundColor, callback) {
      if (backgroundColor.source) {
        var _this = this;
        fabric.util.loadImage(backgroundColor.source, function(img) {
          _this.backgroundColor = new fabric.Pattern({
            source: img,
            repeat: backgroundColor.repeat
          });
          callback && callback();
        });
      }
      else {
        this.backgroundColor = backgroundColor;
        callback && callback();
      }

      return this;
    },

    /**
     * @private
     */
    _createCanvasElement: function() {
      var element = fabric.document.createElement('canvas');
      if (!element.style) {
        element.style = { };
      }
      if (!element) {
        throw CANVAS_INIT_ERROR;
      }
      this._initCanvasElement(element);
      return element;
    },

    /**
     * @private
     * @param {HTMLElement} element
     */
    _initCanvasElement: function(element) {
      fabric.util.createCanvasElement(element);

      if (typeof element.getContext === 'undefined') {
        throw CANVAS_INIT_ERROR;
      }
    },

    /**
     * @private
     * @param {Object} [options] Options object
     */
    _initOptions: function (options) {
      for (var prop in options) {
        this[prop] = options[prop];
      }

      this.width = parseInt(this.lowerCanvasEl.width, 10) || 0;
      this.height = parseInt(this.lowerCanvasEl.height, 10) || 0;

      if (!this.lowerCanvasEl.style) return;

      this.lowerCanvasEl.style.width = this.width + 'px';
      this.lowerCanvasEl.style.height = this.height + 'px';
    },

    /**
     * Creates a bottom canvas
     * @private
     * @param {HTMLElement} [canvasEl]
     */
    _createLowerCanvas: function (canvasEl) {
      this.lowerCanvasEl = fabric.util.getById(canvasEl) || this._createCanvasElement();
      this._initCanvasElement(this.lowerCanvasEl);

      fabric.util.addClass(this.lowerCanvasEl, 'lower-canvas');

      if (this.interactive) {
        this._applyCanvasStyle(this.lowerCanvasEl);
      }

      this.contextContainer = this.lowerCanvasEl.getContext('2d');
    },

    /**
     * Returns canvas width (in px)
     * @return {Number}
     */
    getWidth: function () {
      return this.width;
    },

    /**
     * Returns canvas height (in px)
     * @return {Number}
     */
    getHeight: function () {
      return this.height;
    },

    /**
     * Sets width of this canvas instance
     * @param {Number} width value to set width to
     * @return {fabric.Canvas} instance
     * @chainable true
     */
    setWidth: function (value) {
      return this._setDimension('width', value);
    },

    /**
     * Sets height of this canvas instance
     * @param {Number} height value to set height to
     * @return {fabric.Canvas} instance
     * @chainable true
     */
    setHeight: function (value) {
      return this._setDimension('height', value);
    },

    /**
     * Sets dimensions (width, height) of this canvas instance
     * @param {Object} dimensions Object with width/height properties
     * @param {Number} [dimensions.width] Width of canvas element
     * @param {Number} [dimensions.height] Height of canvas element
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    setDimensions: function(dimensions) {
      for (var prop in dimensions) {
        this._setDimension(prop, dimensions[prop]);
      }
      return this;
    },

    /**
     * Helper for setting width/height
     * @private
     * @param {String} prop property (width|height)
     * @param {Number} value value to set property to
     * @return {fabric.Canvas} instance
     * @chainable true
     */
    _setDimension: function (prop, value) {
      this.lowerCanvasEl[prop] = value;
      this.lowerCanvasEl.style[prop] = value + 'px';

      if (this.upperCanvasEl) {
        this.upperCanvasEl[prop] = value;
        this.upperCanvasEl.style[prop] = value + 'px';
      }

      if (this.cacheCanvasEl) {
        this.cacheCanvasEl[prop] = value;
      }

      if (this.wrapperEl) {
        this.wrapperEl.style[prop] = value + 'px';
      }

      this[prop] = value;

      this.calcOffset();
      this.renderAll();

      return this;
    },

    /**
     * Returns &lt;canvas> element corresponding to this instance
     * @return {HTMLCanvasElement}
     */
    getElement: function () {
      return this.lowerCanvasEl;
    },

    /**
     * Returns currently selected object, if any
     * @return {fabric.Object}
     */
    getActiveObject: function() {
      return null;
    },

    /**
     * Returns currently selected group of object, if any
     * @return {fabric.Group}
     */
    getActiveGroup: function() {
      return null;
    },

    /**
     * Given a context, renders an object on that context
     * @param {CanvasRenderingContext2D} ctx Context to render object on
     * @param {fabric.Object} object Object to render
     * @private
     */
    _draw: function (ctx, object) {
      if (!object) return;

      if (this.controlsAboveOverlay) {
        var hasBorders = object.hasBorders, hasControls = object.hasControls;
        object.hasBorders = object.hasControls = false;
        object.render(ctx);
        object.hasBorders = hasBorders;
        object.hasControls = hasControls;
      }
      else {
        object.render(ctx);
      }
    },

    /**
     * @private
     * @param {fabric.Object} obj Object that was added
     */
    _onObjectAdded: function(obj) {
      this.stateful && obj.setupState();
      obj.setCoords();
      obj.canvas = this;
      this.fire('object:added', { target: obj });
      obj.fire('added');
    },

    /**
     * @private
     * @param {fabric.Object} obj Object that was removed
     */
    _onObjectRemoved: function(obj) {
      this.fire('object:removed', { target: obj });
      obj.fire('removed');
    },

    /**
     * Returns an array of objects this instance has
     * @return {Array}
     */
    getObjects: function () {
      return this._objects;
    },

    /**
     * Clears specified context of canvas element
     * @param {CanvasRenderingContext2D} ctx Context to clear
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    clearContext: function(ctx) {
      ctx.clearRect(0, 0, this.width, this.height);
      return this;
    },

    /**
     * Returns context of canvas where objects are drawn
     * @return {CanvasRenderingContext2D}
     */
    getContext: function () {
      return this.contextContainer;
    },

    /**
     * Clears all contexts (background, main, top) of an instance
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    clear: function () {
      this._objects.length = 0;
      if (this.discardActiveGroup) {
        this.discardActiveGroup();
      }
      if (this.discardActiveObject) {
        this.discardActiveObject();
      }
      this.clearContext(this.contextContainer);
      if (this.contextTop) {
        this.clearContext(this.contextTop);
      }
      this.fire('canvas:cleared');
      this.renderAll();
      return this;
    },

    /**
     * Renders both the top canvas and the secondary container canvas.
     * @param {Boolean} [allOnTop] Whether we want to force all images to be rendered on the top canvas
     * @return {fabric.Canvas} instance
     * @chainable
     */
    renderAll: function (allOnTop) {

      var canvasToDrawOn = this[(allOnTop === true && this.interactive) ? 'contextTop' : 'contextContainer'];
      var activeGroup = this.getActiveGroup();

      if (this.contextTop && this.selection && !this._groupSelector) {
        this.clearContext(this.contextTop);
      }

      if (!allOnTop) {
        this.clearContext(canvasToDrawOn);
      }

      this.fire('before:render');

      if (this.clipTo) {
        fabric.util.clipContext(this, canvasToDrawOn);
      }

      this._renderBackground();
      this._renderObjects(canvasToDrawOn, activeGroup);
      this._renderActiveGroup(canvasToDrawOn, activeGroup);

      if (this.clipTo) {
        canvasToDrawOn.restore();
      }

      if (this.overlayImage) {
        canvasToDrawOn.drawImage(this.overlayImage, this.overlayImageLeft, this.overlayImageTop);
      }

      if (this.controlsAboveOverlay && this.interactive) {
        this.drawControls(canvasToDrawOn);
      }

      this.fire('after:render');

      return this;
    },

    _renderObjects: function(canvasToDrawOn, activeGroup) {
      for (var i = 0, length = this._objects.length; i < length; ++i) {
        if (!activeGroup ||
            (activeGroup && this._objects[i] && !activeGroup.contains(this._objects[i]))) {
          this._draw(canvasToDrawOn, this._objects[i]);
        }
      }
    },

    _renderActiveGroup: function(canvasToDrawOn, activeGroup) {

      // delegate rendering to group selection (if one exists)
      if (activeGroup) {

        //Store objects in group preserving order, then replace
        var sortedObjects = [];
        this.forEachObject(function (object) {
          if (activeGroup.contains(object)) {
            sortedObjects.push(object);
          }
        });
        activeGroup._set('objects', sortedObjects);
        this._draw(canvasToDrawOn, activeGroup);
      }
    },

    _renderBackground: function(canvasToDrawOn) {
      if (this.backgroundColor) {
        canvasToDrawOn.fillStyle = this.backgroundColor.toLive
          ? this.backgroundColor.toLive(canvasToDrawOn)
          : this.backgroundColor;

        canvasToDrawOn.fillRect(
          this.backgroundColor.offsetX || 0,
          this.backgroundColor.offsetY || 0,
          this.width,
          this.height);
      }
      if (typeof this.backgroundImage === 'object') {
        this._renderBackroundImage(canvasToDrawOn);
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} canvasToDrawOn Context to render on
     */
    _renderBackroundImage: function(canvasToDrawOn) {
      canvasToDrawOn.save();
      canvasToDrawOn.globalAlpha = this.backgroundImageOpacity;

      if (this.backgroundImageStretch) {
        canvasToDrawOn.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
      }
      else {
        canvasToDrawOn.drawImage(this.backgroundImage, 0, 0);
      }
      canvasToDrawOn.restore();
    },

    /**
     * Method to render only the top canvas.
     * Also used to render the group selection box.
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    renderTop: function () {
      var ctx = this.contextTop || this.contextContainer;
      this.clearContext(ctx);

      // we render the top context - last object
      if (this.selection && this._groupSelector) {
        this._drawSelection();
      }

      // delegate rendering to group selection if one exists
      // used for drawing selection borders/controls
      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        activeGroup.render(ctx);
      }

      if (this.overlayImage) {
        ctx.drawImage(this.overlayImage, this.overlayImageLeft, this.overlayImageTop);
      }

      this.fire('after:render');

      return this;
    },

    /**
     * Returns coordinates of a center of canvas.
     * Returned value is an object with top and left properties
     * @return {Object} object with "top" and "left" number values
     */
    getCenter: function () {
      return {
        top: this.getHeight() / 2,
        left: this.getWidth() / 2
      };
    },

    /**
     * Centers object horizontally.
     * You might need to call `setCoords` on an object after centering, to update controls area.
     * @param {fabric.Object} object Object to center
     * @return {fabric.Canvas} thisArg
     */
    centerObjectH: function (object) {
      object.set('left', this.getCenter().left);
      this.renderAll();
      return this;
    },

    /**
     * Centers object vertically.
     * You might need to call `setCoords` on an object after centering, to update controls area.
     * @param {fabric.Object} object Object to center
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    centerObjectV: function (object) {
      object.set('top', this.getCenter().top);
      this.renderAll();
      return this;
    },

    /**
     * Centers object vertically and horizontally.
     * You might need to call `setCoords` on an object after centering, to update controls area.
     * @param {fabric.Object} object Object to center
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    centerObject: function (object) {
      return this.centerObjectH(object).centerObjectV(object);
    },

    /**
     * Returs dataless JSON representation of canvas
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {String} json string
     */
    toDatalessJSON: function (propertiesToInclude) {
      return this.toDatalessObject(propertiesToInclude);
    },

    /**
     * Returns object representation of canvas
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function (propertiesToInclude) {
      return this._toObjectMethod('toObject', propertiesToInclude);
    },

    /**
     * Returns dataless object representation of canvas
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toDatalessObject: function (propertiesToInclude) {
      return this._toObjectMethod('toDatalessObject', propertiesToInclude);
    },

    /**
     * @private
     */
    _toObjectMethod: function (methodName, propertiesToInclude) {

      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        this.discardActiveGroup();
      }
      var data = {
        objects: this.getObjects().map(function (instance) {
          // TODO (kangax): figure out how to clean this up
          var originalValue;
          if (!this.includeDefaultValues) {
            originalValue = instance.includeDefaultValues;
            instance.includeDefaultValues = false;
          }
          var object = instance[methodName](propertiesToInclude);
          if (!this.includeDefaultValues) {
            instance.includeDefaultValues = originalValue;
          }
          return object;
        }, this),
        background: (this.backgroundColor && this.backgroundColor.toObject)
                      ? this.backgroundColor.toObject()
                      : this.backgroundColor
      };
      if (this.backgroundImage) {
        data.backgroundImage = this.backgroundImage.src;
        data.backgroundImageOpacity = this.backgroundImageOpacity;
        data.backgroundImageStretch = this.backgroundImageStretch;
      }
      if (this.overlayImage) {
        data.overlayImage = this.overlayImage.src;
        data.overlayImageLeft = this.overlayImageLeft;
        data.overlayImageTop = this.overlayImageTop;
      }
      fabric.util.populateWithProperties(this, data, propertiesToInclude);
      if (activeGroup) {
        this.setActiveGroup(new fabric.Group(activeGroup.getObjects()));
        activeGroup.forEachObject(function(o) { o.set('active', true) });
      }
      return data;
    },

    /* _TO_SVG_START_ */
    /**
     * Returns SVG representation of canvas
     * @function
     * @param {Object} [options] Options object for SVG output
     * @param {Boolean} [options.suppressPreamble=false] If true xml tag is not included
     * @param {Object} [options.viewBox] SVG viewbox object
     * @param {Number} [options.viewBox.x] x-cooridnate of viewbox
     * @param {Number} [options.viewBox.y] y-coordinate of viewbox
     * @param {Number} [options.viewBox.width] Width of viewbox
     * @param {Number} [options.viewBox.height] Height of viewbox
     * @param {String} [options.encoding=UTF-8] Encoding of SVG output
     * @param {Function} [reviver] Method for further parsing of svg elements, called after each fabric object converted into svg representation.
     * @return {String} SVG string
     * @tutorial {@link http://fabricjs.com/fabric-intro-part-3/#serialization}
     * @see {@link http://jsfiddle.net/fabricjs/jQ3ZZ/|jsFiddle demo}
     * @example <caption>Normal SVG output</caption>
     * var svg = canvas.toSVG();
     * @example <caption>SVG output without preamble (without &lt;?xml ../>)</caption>
     * var svg = canvas.toSVG({suppressPreamble: true});
     * @example <caption>SVG output with viewBox attribute</caption>
     * var svg = canvas.toSVG({
     *   viewBox: {
     *     x: 100,
     *     y: 100,
     *     width: 200,
     *     height: 300
     *   }
     * });
     * @example <caption>SVG output with different encoding (default: UTF-8)</caption>
     * var svg = canvas.toSVG({encoding: 'ISO-8859-1'});
     * @example <caption>Modify SVG output with reviver function</caption>
     * var svg = canvas.toSVG(null, function(svg) {
     *   return svg.replace('stroke-dasharray: ; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; ', '');
     * });
     */
    toSVG: function(options, reviver) {
      options || (options = { });

      var markup = [];

      this._setSVGPreamble(markup, options);
      this._setSVGHeader(markup, options);
      this._setSVGBackgroundColor(markup);
      this._setSVGBackgroundImage(markup);
      this._setSVGOverlayImage(markup);
      this._setSVGObjects(markup, reviver);

      return markup.join('');
    },

    _setSVGPreamble: function(markup, options) {
      if (!options.suppressPreamble) {
        markup.push(
          '<?xml version="1.0" encoding="', (options.encoding || 'UTF-8'), '" standalone="no" ?>',
            '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ',
              '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n'
        );
      }
    },

    _setSVGHeader: function(markup, options) {
      markup.push(
        '<svg ',
          'xmlns="http://www.w3.org/2000/svg" ',
          'xmlns:xlink="http://www.w3.org/1999/xlink" ',
          'version="1.1" ',
          'width="', (options.viewBox ? options.viewBox.width : this.width), '" ',
          'height="', (options.viewBox ? options.viewBox.height : this.height), '" ',
          (this.backgroundColor && !this.backgroundColor.source
            ? 'style="background-color: ' + this.backgroundColor +'" '
            : null),
          (options.viewBox
              ? 'viewBox="' +
                options.viewBox.x + ' ' +
                options.viewBox.y + ' ' +
                options.viewBox.width + ' ' +
                options.viewBox.height + '" '
              : null),
          'xml:space="preserve">',
        '<desc>Created with Fabric.js ', fabric.version, '</desc>',
        '<defs>',
          fabric.createSVGFontFacesMarkup(this.getObjects()),
          fabric.createSVGRefElementsMarkup(this),
        '</defs>'
      );
    },

    _setSVGBackgroundColor: function(markup) {
      if (this.backgroundColor && this.backgroundColor.source) {
        markup.push(
          '<rect x="0" y="0" ',
            'width="', (this.backgroundColor.repeat === 'repeat-y' || this.backgroundColor.repeat === 'no-repeat' ? this.backgroundColor.source.width : this.width),
            '" height="', (this.backgroundColor.repeat === 'repeat-x' || this.backgroundColor.repeat === 'no-repeat' ? this.backgroundColor.source.height : this.height),
            '" fill="url(#backgroundColorPattern)"',
          '></rect>'
        );
      }
    },

    _setSVGBackgroundImage: function(markup) {
      if (this.backgroundImage) {
        markup.push(
          '<image x="0" y="0" ',
            'width="', (this.backgroundImageStretch ? this.width : this.backgroundImage.width),
            '" height="', (this.backgroundImageStretch ? this.height : this.backgroundImage.height),
            '" preserveAspectRatio="', (this.backgroundImageStretch ? 'none' : 'defer'),
            '" xlink:href="', this.backgroundImage.src,
            '" style="opacity:', this.backgroundImageOpacity,
          '"></image>'
        );
      }
    },

    _setSVGOverlayImage: function(markup) {
      if (this.overlayImage) {
        markup.push(
          '<image x="', this.overlayImageLeft,
            '" y="', this.overlayImageTop,
            '" width="', this.overlayImage.width,
            '" height="', this.overlayImage.height,
            '" xlink:href="', this.overlayImage.src,
          '"></image>'
        );
      }
    },

    _setSVGObjects: function(markup, reviver) {
      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        this.discardActiveGroup();
      }
      for (var i = 0, objects = this.getObjects(), len = objects.length; i < len; i++) {
        markup.push(objects[i].toSVG(reviver));
      }
      if (activeGroup) {
        this.setActiveGroup(new fabric.Group(activeGroup.getObjects()));
        activeGroup.forEachObject(function(o) {
          o.set('active', true);
        });
      }
      markup.push('</svg>');
    },
    /* _TO_SVG_END_ */

    /**
     * Removes an object from canvas and returns it
     * @param {fabric.Object} object Object to remove
     * @return {fabric.Object} removed object
     */
    remove: function (object) {
      // removing active object should fire "selection:cleared" events
      if (this.getActiveObject() === object) {
        this.fire('before:selection:cleared', { target: object });
        this.discardActiveObject();
        this.fire('selection:cleared');
      }

      return fabric.Collection.remove.call(this, object);
    },

    /**
     * Moves an object to the bottom of the stack of drawn objects
     * @param {fabric.Object} object Object to send to back
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    sendToBack: function (object) {
      removeFromArray(this._objects, object);
      this._objects.unshift(object);
      return this.renderAll && this.renderAll();
    },

    /**
     * Moves an object to the top of the stack of drawn objects
     * @param {fabric.Object} object Object to send
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    bringToFront: function (object) {
      removeFromArray(this._objects, object);
      this._objects.push(object);
      return this.renderAll && this.renderAll();
    },

    /**
     * Moves an object down in stack of drawn objects
     * @param {fabric.Object} object Object to send
     * @param {Boolean} [intersecting] If `true`, send object behind next lower intersecting object
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    sendBackwards: function (object, intersecting) {
      var idx = this._objects.indexOf(object);

      // if object is not on the bottom of stack
      if (idx !== 0) {
        var newIdx;

        if (intersecting) {
          newIdx = idx;

          // traverse down the stack looking for the nearest intersecting object
          for (var i=idx-1; i>=0; --i) {

            var isIntersecting = object.intersectsWithObject(this._objects[i]) ||
                                 object.isContainedWithinObject(this._objects[i]) ||
                                 this._objects[i].isContainedWithinObject(object);

            if (isIntersecting) {
              newIdx = i;
              break;
            }
          }
        }
        else {
          newIdx = idx-1;
        }

        removeFromArray(this._objects, object);
        this._objects.splice(newIdx, 0, object);
        this.renderAll && this.renderAll();
      }
      return this;
    },

    /**
     * Moves an object up in stack of drawn objects
     * @param {fabric.Object} object Object to send
     * @param {Boolean} [intersecting] If `true`, send object in front of next upper intersecting object
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    bringForward: function (object, intersecting) {
      var idx = this._objects.indexOf(object);

      // if object is not on top of stack (last item in an array)
      if (idx !== this._objects.length-1) {
        var newIdx;

        if (intersecting) {
          newIdx = idx;

          // traverse up the stack looking for the nearest intersecting object
          for (var i = idx + 1; i < this._objects.length; ++i) {

            var isIntersecting = object.intersectsWithObject(this._objects[i]) ||
                                 object.isContainedWithinObject(this._objects[i]) ||
                                 this._objects[i].isContainedWithinObject(object);

            if (isIntersecting) {
              newIdx = i;
              break;
            }
          }
        }
        else {
          newIdx = idx+1;
        }

        removeFromArray(this._objects, object);
        this._objects.splice(newIdx, 0, object);
        this.renderAll && this.renderAll();
      }
      return this;
    },

    /**
     * Moves an object to specified level in stack of drawn objects
     * @param {fabric.Object} object Object to send
     * @param {Number} index Position to move to
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    moveTo: function (object, index) {
      removeFromArray(this._objects, object);
      this._objects.splice(index, 0, object);
      return this.renderAll && this.renderAll();
    },

    /**
     * Clears a canvas element and removes all event handlers.
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    dispose: function () {
      this.clear();

      if (!this.interactive) return this;

      removeListener(fabric.window, 'resize', this._onResize);

      if (fabric.isTouchSupported) {
        removeListener(this.upperCanvasEl, 'touchstart', this._onMouseDown);
        removeListener(this.upperCanvasEl, 'touchmove', this._onMouseMove);
        if (typeof Event !== 'undefined' && 'remove' in Event) {
          Event.remove(this.upperCanvasEl, 'gesture', this._onGesture);
          Event.remove(this.upperCanvasEl, 'drag', this._onDrag);
          Event.remove(this.upperCanvasEl, 'orientation', this._onOrientationChange);
          Event.remove(this.upperCanvasEl, 'shake', this._onShake);
        }
      }
      else {
        removeListener(this.upperCanvasEl, 'mousedown', this._onMouseDown);
        removeListener(this.upperCanvasEl, 'mousemove', this._onMouseMove);
        removeListener(this.upperCanvasEl, 'mousewheel', this._onMouseWheel);
      }
      return this;
    },

    /**
     * Returns a string representation of an instance
     * @return {String} string representation of an instance
     */
    toString: function () {
      return '#<fabric.Canvas (' + this.complexity() + '): '+
               '{ objects: ' + this.getObjects().length + ' }>';
    }
  });

  extend(fabric.StaticCanvas.prototype, fabric.Observable);
  extend(fabric.StaticCanvas.prototype, fabric.Collection);
  extend(fabric.StaticCanvas.prototype, fabric.DataURLExporter);

  extend(fabric.StaticCanvas, /** @lends fabric.StaticCanvas */ {

    /**
     * @static
     * @type String
     * @default
     */
    EMPTY_JSON: '{"objects": [], "background": "white"}',

    /**
     * Provides a way to check support of some of the canvas methods
     * (either those of HTMLCanvasElement itself, or rendering context)
     *
     * @param methodName {String} Method to check support for;
     *                            Could be one of "getImageData", "toDataURL", "toDataURLWithQuality" or "setLineDash"
     * @return {Boolean | null} `true` if method is supported (or at least exists),
     *                          `null` if canvas element or context can not be initialized
     */
    supports: function (methodName) {
      var el = fabric.util.createCanvasElement();

      if (!el || !el.getContext) {
        return null;
      }

      var ctx = el.getContext('2d');
      if (!ctx) {
        return null;
      }

      switch (methodName) {

        case 'getImageData':
          return typeof ctx.getImageData !== 'undefined';

        case 'setLineDash':
          return typeof ctx.setLineDash !== 'undefined';

        case 'toDataURL':
          return typeof el.toDataURL !== 'undefined';

        case 'toDataURLWithQuality':
          try {
            el.toDataURL('image/jpeg', 0);
            return true;
          }
          catch (e) { }
          return false;

        default:
          return null;
      }
    }
  });

  /**
   * Returns JSON representation of canvas
   * @function
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {String} JSON string
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-3/#serialization}
   * @see {@link http://jsfiddle.net/fabricjs/pec86/|jsFiddle demo}
   * @example <caption>JSON without additional properties</caption>
   * var json = canvas.toJSON();
   * @example <caption>JSON with additional properties included</caption>
   * var json = canvas.toJSON(['lockMovementX', 'lockMovementY', 'lockRotation', 'lockScalingX', 'lockScalingY', 'lockUniScaling']);
   * @example <caption>JSON without default values</caption>
   * canvas.includeDefaultValues = false;
   * var json = canvas.toJSON();
   */
  fabric.StaticCanvas.prototype.toJSON = fabric.StaticCanvas.prototype.toObject;

})();
