(function (global) {
  
  "use strict";
  
  if (fabric.Element) {
    fabric.warn('fabric.Element is already defined.');
    return;
  }
  
  var window = global.window,
      document = window.document,
      
      // aliases for faster resolution
      extend = fabric.util.object.extend,
      capitalize = fabric.util.string.capitalize,
      camelize = fabric.util.string.camelize,
      fireEvent = fabric.util.fireEvent,
      getPointer = fabric.util.getPointer,
      getElementOffset = fabric.util.getElementOffset,
      removeFromArray = fabric.util.removeFromArray,
      addListener = fabric.util.addListener,
      removeListener = fabric.util.removeListener,
      
      utilMin = fabric.util.array.min,
      utilMax = fabric.util.array.max,
      
      sqrt = Math.sqrt,
      pow = Math.pow,
      atan2 = Math.atan2,
      abs = Math.abs,
      min = Math.min,
      max = Math.max,
      
      CANVAS_INIT_ERROR = new Error('Could not initialize `canvas` element'),
      FX_DURATION = 500,
      STROKE_OFFSET = 0.5,
      FX_TRANSITION = 'decel',
      
      cursorMap = {
        'tr': 'ne-resize',
        'br': 'se-resize',
        'bl': 'sw-resize',
        'tl': 'nw-resize',
        'ml': 'w-resize',
        'mt': 'n-resize',
        'mr': 'e-resize',
        'mb': 's-resize'
      };
  
  /**
   * @class fabric.Element
   * @constructor
   * @param {HTMLElement | String} el &lt;canvas> element to initialize instance on
   * @param {Object} [options] Options object
   */
  fabric.Element = function (el, options) {
    
    options || (options = { });
    
    /**
     * The object literal containing mouse position if clicked in an empty area (no image)
     * @property _groupSelector
     * @type object
     */
    this._groupSelector = null;

    /**
     * The array literal containing all objects on canvas
     * @property _objects
     * @type array
     */
    this._objects = [];

    /**
     * The element that references the canvas interface implementation
     * @property _context
     * @type object
     */
    this._context = null;

    /**
     * The object literal containing the current x,y params of the transformation
     * @property _currentTransform
     * @type object
     */
    this._currentTransform = null;
    
    /**
     * References instance of fabric.Group - when multiple objects are selected
     * @property _activeGroup
     * @type object
     */
    this._activeGroup = null;
    
    /**
     * X coordinates of a path, captured during free drawing
     */
    this._freeDrawingXPoints = [ ];
    
    /**
     * Y coordinates of a path, captured during free drawing
     */
    this._freeDrawingYPoints = [ ];
    
    this._createUpperCanvas(el);
    this._initOptions(options);
    this._initWrapperElement();
    this._createLowerCanvas();

    this._initEvents();
    
    if (options.overlayImage) {
      this.setOverlayImage(options.overlayImage);
    }
    
    this.calcOffset();
    
    fabric.Element.activeInstance = this;
  };
  
  extend(fabric.Element.prototype, /** @scope fabric.Element.prototype */ {
    
    /**
     * Background color of this canvas instance
     * @property
     * @type String
     */
    backgroundColor:        'rgba(0, 0, 0, 0)',
    
    /**
     * Color of selection
     * @property
     * @type String
     */
    selectionColor:         'rgba(100, 100, 255, 0.3)', // blue
    
    /**
     * Color of the border of selection (usually slightly darker than color of selection itself)
     * @property
     * @type String
     */
    selectionBorderColor:   'rgba(255, 255, 255, 0.3)',
    
    /**
     * Width of a line used in selection
     * @property
     * @type Number
     */
    selectionLineWidth:     1,
    
    /**
     * Color of the line used in free drawing mode
     * @property
     * @type String
     */
    freeDrawingColor:       'rgb(0, 0, 0)',
    
    /**
     * Width of a line used in free drawing mode
     * @property
     * @type Number
     */
    freeDrawingLineWidth:   1,
    
    /**
     * @property
     * @type Boolean
     */
    includeDefaultValues:   true,
    
    /**
     * Indicates whether images loaded via `fabric.Element#loadImageFromUrl` should be cached
     * @property
     * @type Boolean
     */
    shouldCacheImages:      false,
    
    /**
     * Indicates whether objects' state should be saved
     * @property
     * @type Boolean
     */
    stateful:               true,
    
    /**
     * Indicates whether fabric.Element#add should also re-render canvas. 
     * Disabling this option could give a great performance boost when adding a lot of objects to canvas at once 
     * (followed by a manual rendering after addition)
     */
    renderOnAddition:       true,
    
    /**
     * @constant
     * @type Number
     */
    CANVAS_WIDTH:           600,
    
    /**
     * @constant
     * @type Number
     */
    CANVAS_HEIGHT:          600,
    
    /**
     * @constant
     * @type String
     */
    CONTAINER_CLASS:        'canvas-container',
    
    /**
     * Callback; invoked right before object is about to be scaled/rotated
     * @method onBeforeScaleRotate
     * @param {fabric.Object} target Object that's about to be scaled/rotated
     */
    onBeforeScaleRotate: function (target) {
      /* NOOP */
    },
    
    /**
     * Callback; invoked on every redraw of canvas and is being passed a number indicating current fps
     * @method onFpsUpdate
     * @param {Number} fps
     */
    onFpsUpdate: null,
    
    /**
     * Calculates canvas element offset relative to the document
     * This method is also attached as "resize" event handler of window
     * @method calcOffset
     * @return {fabric.Element} instance
     * @chainable
     */
    calcOffset: function () {
      this._offset = getElementOffset(this.upperCanvasEl);
      return this;
    },
    
    /**
     * Sets overlay image for this canvas
     * @method setOverlayImage
     * @param {String} url url of an image to set background to
     * @param {Function} callback callback to invoke when image is loaded and set as an overlay one
     * @return {fabric.Element} thisArg
     * @chainable
     */
    setOverlayImage: function (url, callback) { // TODO (kangax): test callback
      if (url) {
        var _this = this, img = new Image();
        
        /** @ignore */
        img.onload = function () { 
          _this.overlayImage = img;
          if (callback) {
            callback();
          }
          img = img.onload = null;
        };
        img.src = url;
      }
      return this;
    },
    
    /**
     * @private
     * @method _initWrapperElement
     * @param {Number} width
     * @param {Number} height
     */
    _initWrapperElement: function () {
      this.wrapperEl = fabric.util.wrapElement(this.upperCanvasEl, 'div', { 
        'class': this.CONTAINER_CLASS
      });
      fabric.util.setStyle(this.wrapperEl, {
        width: this.getWidth() + 'px',
        height: this.getHeight() + 'px',
        position: 'relative'
      });
      fabric.util.makeElementUnselectable(this.wrapperEl);
    },
    
    /**
     * @private
     * @method _applyCanvasStyle
     * @param {Element} element
     */
    _applyCanvasStyle: function (element) {
      var width = this.getWidth() || element.width,
          height = this.getHeight() || element.height;
          
      fabric.util.setStyle(element, {
        position: 'absolute',
        width: width + 'px',
        height: height + 'px',
        left: 0,
        top: 0
      });
      element.width = width;
      element.height = height;
      fabric.util.makeElementUnselectable(element);
    },
    
    /**
     * @private
     * @method _createCanvasElement
     * @param {Element} element
     */
    _createCanvasElement: function() {
      var element = document.createElement('canvas');
      if (!element) {
        throw CANVAS_INIT_ERROR;
      }
      this._initCanvasElement(element);
      return element;
    },
    
    _initCanvasElement: function(element) {
      if (typeof element.getContext === 'undefined' && 
          typeof G_vmlCanvasManager !== 'undefined' && 
          G_vmlCanvasManager.initElement) {
            
        G_vmlCanvasManager.initElement(element);
      }
      if (typeof element.getContext === 'undefined') {
        throw CANVAS_INIT_ERROR;
      }
    },

    /**
     * @method _initOptions
     * @param {Object} options
     */
    _initOptions: function (options) {
      for (var prop in options) {
        this[prop] = options[prop];
      }
      
      this.width = parseInt(this.upperCanvasEl.width, 10) || 0;
      this.height = parseInt(this.upperCanvasEl.height, 10) || 0;

      this.upperCanvasEl.style.width = this.width + 'px';
      this.upperCanvasEl.style.height = this.height + 'px';
    },

    /**
     * Adds mouse listeners to  canvas
     * @method _initEvents
     * @private
     * See configuration documentation for more details.
     */
    _initEvents: function () {
      
      var _this = this;
      
      this._onMouseDown = function (e) { _this.__onMouseDown(e); };
      this._onMouseUp = function (e) { _this.__onMouseUp(e); };
      this._onMouseMove = function (e) { _this.__onMouseMove(e); };
      this._onResize = function (e) { _this.calcOffset() };
      
      addListener(this.upperCanvasEl, 'mousedown', this._onMouseDown);
      addListener(document, 'mousemove', this._onMouseMove);
      addListener(document, 'mouseup', this._onMouseUp);
      addListener(window, 'resize', this._onResize);
    },
    
    /**
     * @method _createUpperCanvas
     * @param {HTMLElement|String} canvasEl Canvas element
     * @throws {CANVAS_INIT_ERROR} If canvas can not be initialized
     */
    _createUpperCanvas: function (canvasEl) {
      this.upperCanvasEl = fabric.util.getById(canvasEl) || this._createCanvasElement();
      this._initCanvasElement(this.upperCanvasEl);
      
      fabric.util.addClass(this.upperCanvasEl, 'upper-canvas');
      this._applyCanvasStyle(this.upperCanvasEl);
      
      this.contextTop = this.upperCanvasEl.getContext('2d');
    },
    
    /**
     * Creates a secondary canvas
     * @method _createLowerCanvas
     */
    _createLowerCanvas: function () {
      this.lowerCanvasEl = this._createCanvasElement();
      this.lowerCanvasEl.className = 'lower-canvas';
      
      this.wrapperEl.insertBefore(this.lowerCanvasEl, this.upperCanvasEl);
      
      this._applyCanvasStyle(this.lowerCanvasEl);
      this.contextContainer = this.lowerCanvasEl.getContext('2d');
    },
    
    /**
     * Returns canvas width
     * @method getWidth
     * @return {Number}
     */
    getWidth: function () {
      return this.width;
    },
    
    /**
     * Returns canvas height
     * @method getHeight
     * @return {Number}
     */
    getHeight: function () {
      return this.height;
    },
    
    /**
     * Sets width of this canvas instance
     * @method setWidth
     * @param {Number} width value to set width to
     * @return {fabric.Element} instance
     * @chainable true
     */
    setWidth: function (value) {
      return this._setDimension('width', value);
    },
    
    /**
     * Sets height of this canvas instance
     * @method setHeight
     * @param {Number} height value to set height to
     * @return {fabric.Element} instance
     * @chainable true
     */
    setHeight: function (value) {
      return this._setDimension('height', value);
    },
    
    /**
     * Sets dimensions (width, height) of this canvas instance
     * @method setDimensions
     * @param {Object} dimensions
     * @return {fabric.Element} thisArg
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
     * @method _setDimensions
     * @param {String} prop property (width|height)
     * @param {Number} value value to set property to
     * @return {fabric.Element} instance
     * @chainable true
     */
    _setDimension: function (prop, value) {
      this.lowerCanvasEl[prop] = value;
      this.lowerCanvasEl.style[prop] = value + 'px';
      
      this.upperCanvasEl[prop] = value;
      this.upperCanvasEl.style[prop] = value + 'px';
      
      this.wrapperEl.style[prop] = value + 'px';
      
      this[prop] = value;
      
      this.calcOffset();
      this.renderAll();
      
      return this;
    },
    
    /**
     * Method that defines the actions when mouse is released on canvas.
     * The method resets the currentTransform parameters, store the image corner
     * position in the image object and render the canvas on top.
     * @method __onMouseUp
     * @param {Event} e Event object fired on mouseup
     *
     */
    __onMouseUp: function (e) {
      
      if (this.isDrawingMode && this._isCurrentlyDrawing) {
        this._finalizeDrawingPath();
        return;
      }
      
      if (this._currentTransform) {
        
        var transform = this._currentTransform,
            target = transform.target;
            
        if (target._scaling) {
          fireEvent('object:scaled', { target: target });
          target._scaling = false;
        }
        
        // determine the new coords everytime the image changes its position
        var i = this._objects.length;
        while (i--) {
          this._objects[i].setCoords();
        }
        
        // only fire :modified event if target coordinates were changed during mousedown-mouseup
        if (this.stateful && target.hasStateChanged()) {
          target.isMoving = false;
          fireEvent('object:modified', { target: target });
        }
      }
      
      this._currentTransform = null;
      
      if (this._groupSelector) {
        // group selection was completed, determine its bounds
        this._findSelectedObjects(e);
      }
      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        if (this.stateful && activeGroup.hasStateChanged() && 
            activeGroup.containsPoint(this.getPointer(e))) {
          fireEvent('group:modified', { target: activeGroup });
        }
        activeGroup.setObjectsCoords();
        activeGroup.set('isMoving', false);
        this._setCursor('default');
      }
      
      // clear selection
      this._groupSelector = null;
      this.renderAll();
      
      this._setCursorFromEvent(e, target);
      
      // fix for FF
      this._setCursor('');
      
      var _this = this;
      setTimeout(function () {
        _this._setCursorFromEvent(e, target);
      }, 50);
      
      fireEvent('mouse:up');
    },
    
    _shouldClearSelection: function (e) {
      var target = this.findTarget(e),
          activeGroup = this.getActiveGroup();
      return (
        !target || (
          target && 
          activeGroup && 
          !activeGroup.contains(target) && 
          activeGroup !== target && 
          !e.shiftKey
        )
      );
    },

    /**
     * Method that defines the actions when mouse is clic ked on canvas.
     * The method inits the currentTransform parameters and renders all the
     * canvas so the current image can be placed on the top canvas and the rest
     * in on the container one.
     * @method __onMouseDown
     * @param e {Event} Event object fired on mousedown
     *
     */
    __onMouseDown: function (e) {
      
      if (this.isDrawingMode) {
        this._prepareForDrawing(e);
        
        // capture coordinates immediately; this allows to draw dots (when movement never occurs)
        this._captureDrawingPath(e);
        
        return;
      }
      
      // ignore if some object is being transformed at this moment
      if (this._currentTransform) return;
      
      var target = this.findTarget(e),
          pointer = this.getPointer(e),
          activeGroup = this.getActiveGroup(), 
          corner;
      
      if (this._shouldClearSelection(e)) {
        
        this._groupSelector = {
          ex: pointer.x,
          ey: pointer.y,
          top: 0,
          left: 0
        };
        
        this.deactivateAllWithDispatch();
      }
      else {
        // determine if it's a drag or rotate case
        // rotate and scale will happen at the same time
        this.stateful && target.saveState();
        
        if (corner = target._findTargetCorner(e, this._offset)) {
          this.onBeforeScaleRotate(target);
        }
        
        this._setupCurrentTransform(e, target);
        
        var shouldHandleGroupLogic = e.shiftKey && (activeGroup || this.getActiveObject());
        if (shouldHandleGroupLogic) {
          this._handleGroupLogic(e, target);
        }
        else {
          if (target !== this.getActiveGroup()) {
            this.deactivateAll();
          }
          this.setActiveObject(target);
        }
      }
      // we must renderAll so that active image is placed on the top canvas
      this.renderAll();
    },
    
    /**
     * Returns &lt;canvas> element corresponding to this instance
     * @method getElement
     * @return {HTMLCanvasElement}
     */
    getElement: function () {
      return this.upperCanvasEl;
    },
    
    /**
     * Deactivates all objects and dispatches appropriate events
     * @method deactivateAllWithDispatch
     * @return {fabric.Element} thisArg
     */
    deactivateAllWithDispatch: function () {
      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        fireEvent('before:group:destroyed', {
          target: activeGroup
        });
      }
      this.deactivateAll();
      if (activeGroup) {
        fireEvent('after:group:destroyed');
      }
      fireEvent('selection:cleared');
      return this;
    },
    
    /**
     * @private
     * @method _setupCurrentTransform
     */
    _setupCurrentTransform: function (e, target) {
      var action = 'drag', 
          corner,
          pointer = getPointer(e);
      
      if (corner = target._findTargetCorner(e, this._offset)) {
        action = (corner === 'ml' || corner === 'mr') 
          ? 'scaleX' 
          : (corner === 'mt' || corner === 'mb') 
            ? 'scaleY' 
            : 'rotate';
      }
      
      this._currentTransform = {
        target: target,
        action: action,
        scaleX: target.scaleX,
        scaleY: target.scaleY,
        offsetX: pointer.x - target.left,
        offsetY: pointer.y - target.top,
        ex: pointer.x,
        ey: pointer.y,
        left: target.left, 
        top: target.top,
        theta: target.theta,
        width: target.width * target.scaleX
      };
      
      this._currentTransform.original = {
        left: target.left,
        top: target.top
      };
    },
    
    _handleGroupLogic: function (e, target) {
      if (target.isType('group')) {
        // if it's a group, find target again, this time skipping group
        target = this.findTarget(e, true);
        // if even object is not found, bail out
        if (!target || target.isType('group')) {
          return;
        }
      }
      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        if (activeGroup.contains(target)) {
          activeGroup.remove(target);
          target.setActive(false);
          if (activeGroup.size() === 1) {
            // remove group alltogether if after removal it only contains 1 object
            this.removeActiveGroup();
          }
        }
        else {
          activeGroup.add(target);
        }
        fireEvent('group:selected', { target: activeGroup });
        activeGroup.setActive(true);
      }
      else {
        // group does not exist
        if (this._activeObject) {
          // only if there's an active object
          if (target !== this._activeObject) {
            // and that object is not the actual target
            var group = new fabric.Group([ this._activeObject,target ]);
            this.setActiveGroup(group);
            activeGroup = this.getActiveGroup();
          }
        }
        // activate target object in any case
        target.setActive(true);
      }
      
      if (activeGroup) {
        activeGroup.saveCoords();
      }
    },
    
    /**
     * @private
     * @method _prepareForDrawing
     */
    _prepareForDrawing: function(e) {
      
      this._isCurrentlyDrawing = true;
      
      this.removeActiveObject().renderAll();
      
      var pointer = this.getPointer(e);
      
      this._freeDrawingXPoints.length = this._freeDrawingYPoints.length = 0;
      
      this._freeDrawingXPoints.push(pointer.x);
      this._freeDrawingYPoints.push(pointer.y);
      
      this.contextTop.beginPath();
      this.contextTop.moveTo(pointer.x, pointer.y);
      this.contextTop.strokeStyle = this.freeDrawingColor;
      this.contextTop.lineWidth = this.freeDrawingLineWidth;
      this.contextTop.lineCap = this.contextTop.lineJoin = 'round';
    },
    
    /**
     * @private
     * @method _captureDrawingPath
     */
    _captureDrawingPath: function(e) {
      var pointer = this.getPointer(e);
      
      this._freeDrawingXPoints.push(pointer.x);
      this._freeDrawingYPoints.push(pointer.y);
      
      this.contextTop.lineTo(pointer.x, pointer.y);
      this.contextTop.stroke();
    },
    
    /**
     * @private
     * @method _finalizeDrawingPath
     */
    _finalizeDrawingPath: function() {
      
      this.contextTop.closePath();
      
      this._isCurrentlyDrawing = false;
      
      var minX = utilMin(this._freeDrawingXPoints),
          minY = utilMin(this._freeDrawingYPoints),
          maxX = utilMax(this._freeDrawingXPoints),
          maxY = utilMax(this._freeDrawingYPoints),
          ctx = this.contextTop,
          path = [ ],
          xPoint,
          yPoint,
          xPoints = this._freeDrawingXPoints,
          yPoints = this._freeDrawingYPoints;
      
      path.push('M ', xPoints[0] - minX, ' ', yPoints[0] - minY, ' ');
      
      for (var i = 1; xPoint = xPoints[i], yPoint = yPoints[i]; i++) {
        path.push('L ', xPoint - minX, ' ', yPoint - minY, ' ');
      }
      
      // TODO (kangax): maybe remove Path creation from here, to decouple fabric.Element from fabric.Path, 
      // and instead fire something like "drawing:completed" event with path string
      
      path = path.join('');
      
      if (path === "M 0 0 L 0 0 ") {
        // do not create 0 width/height paths, as they are rendered inconsistently across browsers
        // Firefox 4, for example, renders a dot, whereas Chrome 10 renders nothing
        return;
      }

      var p = new fabric.Path(path);
       
      p.fill = null;
      p.stroke = this.freeDrawingColor;
      p.strokeWidth = this.freeDrawingLineWidth;
      this.add(p);
      p.set("left", minX + (maxX - minX) / 2).set("top", minY + (maxY - minY) / 2).setCoords();
      this.renderAll();
      fireEvent('path:created', { path: p });
    },

   /**
    * Method that defines the actions when mouse is hovering the canvas.
    * The currentTransform parameter will definde whether the user is rotating/scaling/translating
    * an image or neither of them (only hovering). A group selection is also possible and would cancel
    * all any other type of action.
    * In case of an image transformation only the top canvas will be rendered.
    * @method __onMouseMove
    * @param e {Event} Event object fired on mousemove
    *
    */
    __onMouseMove: function (e) {
      
      if (this.isDrawingMode) {
        if (this._isCurrentlyDrawing) {
          this._captureDrawingPath(e);
        }
        return;
      }
      
      var groupSelector = this._groupSelector;
      
      // We initially clicked in an empty area, so we draw a box for multiple selection.
      if (groupSelector !== null) {
        var pointer = getPointer(e);
        groupSelector.left = pointer.x - this._offset.left - groupSelector.ex;
        groupSelector.top = pointer.y - this._offset.top - groupSelector.ey;
        this.renderTop();
      }
      else if (!this._currentTransform) {
        
        // alias style to elimintate unnecessary lookup
        var style = this.upperCanvasEl.style;
        
        // Here we are hovering the canvas then we will determine
        // what part of the pictures we are hovering to change the caret symbol.
        // We won't do that while dragging or rotating in order to improve the
        // performance.
        var target = this.findTarget(e);
        
        if (!target) {  
          // image/text was hovered-out from, we remove its borders
          for (var i = this._objects.length; i--; ) {
            if (!this._objects[i].active) {
              this._objects[i].setActive(false);
            }
          }
          style.cursor = 'default';
        }
        else {
          // set proper cursor 
          this._setCursorFromEvent(e, target);
          if (target.isActive()) {
            // display corners when hovering over an image
            target.setCornersVisibility && target.setCornersVisibility(true);
          }
        }
      }
      else {
        // object is being transformed (scaled/rotated/moved/etc.)
        var pointer = getPointer(e), 
            x = pointer.x, 
            y = pointer.y;
        
        this._currentTransform.target.isMoving = true;
        
        if (this._currentTransform.action === 'rotate') {  
          // rotate object only if shift key is not pressed 
          // and if it is not a group we are transforming
          
          if (!e.shiftKey) {
            this._rotateObject(x, y);
          }
          this._scaleObject(x, y);
        }
        else if (this._currentTransform.action === 'scaleX') {
          this._scaleObject(x, y, 'x');
        }
        else if (this._currentTransform.action === 'scaleY') {
          this._scaleObject(x, y, 'y');
        }
        else {
          this._translateObject(x, y);
          
          fireEvent('object:moved', {
            target: this._currentTransform.target
          });
        }
        // only commit here. when we are actually moving the pictures
        this.renderAll();
      }
    },

    /**
     * Translates object by "setting" its left/top
     * @method _translateObject
     * @param x {Number} pointer's x coordinate
     * @param y {Number} pointer's y coordinate
     */
    _translateObject: function (x, y) {
      var target = this._currentTransform.target;
      target.lockMovementX || target.set('left', x - this._currentTransform.offsetX);
      target.lockMovementY || target.set('top', y - this._currentTransform.offsetY);
    },

    /**
     * Scales object by invoking its scaleX/scaleY methods
     * @method _scaleObject
     * @param x {Number} pointer's x coordinate
     * @param y {Number} pointer's y coordinate
     * @param by {String} Either 'x' or 'y' - specifies dimension constraint by which to scale an object. 
     *                    When not provided, an object is scaled by both dimensions equally
     */ 
    _scaleObject: function (x, y, by) {
      var t = this._currentTransform,
          offset = this._offset,
          target = t.target;
      
      if (target.lockScalingX && target.lockScalingY) return;
      
      var lastLen = sqrt(pow(t.ey - t.top - offset.top, 2) + pow(t.ex - t.left - offset.left, 2)),
          curLen = sqrt(pow(y - t.top - offset.top, 2) + pow(x - t.left - offset.left, 2));
      
      target._scaling = true;
      
      if (!by) {
        target.lockScalingX || target.set('scaleX', t.scaleX * curLen/lastLen);
        target.lockScalingY || target.set('scaleY', t.scaleY * curLen/lastLen);
      }
      else if (by === 'x' && !target.lockUniScaling) {
        target.lockScalingX || target.set('scaleX', t.scaleX * curLen/lastLen);
      }
      else if (by === 'y' && !target.lockUniScaling) {
        target.lockScalingY || target.set('scaleY', t.scaleY * curLen/lastLen);
      }
    },

    /**
     * Rotates object by invoking its rotate method
     * @method _rotateObject
     * @param x {Number} pointer's x coordinate
     * @param y {Number} pointer's y coordinate
     */ 
    _rotateObject: function (x, y) {
      
      var t = this._currentTransform, 
          o = this._offset;
      
      if (t.target.lockRotation) return;
      
      var lastAngle = atan2(t.ey - t.top - o.top, t.ex - t.left - o.left),
          curAngle = atan2(y - t.top - o.top, x - t.left - o.left);
          
      t.target.set('theta', (curAngle - lastAngle) + t.theta);
    },
    
    /**
     * @method _setCursor
     */
    _setCursor: function (value) {
      this.upperCanvasEl.style.cursor = value;
    },
    
    /**
     * Sets the cursor depending on where the canvas is being hovered.
     * Note: very buggy in Opera
     * @method _setCursorFromEvent
     * @param e {Event} Event object
     * @param target {Object} Object that the mouse is hovering, if so.
     */
    _setCursorFromEvent: function (e, target) {
      var s = this.upperCanvasEl.style;
      if (!target) {
        s.cursor = 'default';
        return false;
      }
      else {
        var activeGroup = this.getActiveGroup();
        // only show proper corner when group selection is not active
        var corner = !!target._findTargetCorner 
                      && (!activeGroup || !activeGroup.contains(target)) 
                      && target._findTargetCorner(e, this._offset);
        
        if (!corner) {
          s.cursor = 'move';
        }
        else {
          if (corner in cursorMap) {
            s.cursor = cursorMap[corner];
          }
          else {
            s.cursor = 'default';
            return false;
          }
        }
      }
      return true;
    },
    
    /**
     * Given a context, renders an object on that context 
     * @param ctx {Object} context to render object on
     * @param object {Object} object to render
     * @private
     */
    _draw: function (ctx, object) {
      object && object.render(ctx);
    },
    
    /**
     * @method _drawSelection
     * @private
     */
    _drawSelection: function () {
      var groupSelector = this._groupSelector,
          left = groupSelector.left,
          top = groupSelector.top,
          aleft = abs(left),
          atop = abs(top);

      this.contextTop.fillStyle = this.selectionColor;

      this.contextTop.fillRect(
        groupSelector.ex - ((left > 0) ? 0 : -left),
        groupSelector.ey - ((top > 0) ? 0 : -top),
        aleft, 
        atop
      );

      this.contextTop.lineWidth = this.selectionLineWidth;
      this.contextTop.strokeStyle = this.selectionBorderColor;
      
      this.contextTop.strokeRect(
        groupSelector.ex + STROKE_OFFSET - ((left > 0) ? 0 : aleft), 
        groupSelector.ey + STROKE_OFFSET - ((top > 0) ? 0 : atop),
        aleft,
        atop
      );
    },
    
    _findSelectedObjects: function (e) {
      var target, 
          targetRegion,
          group = [ ],
          x1 = this._groupSelector.ex,
          y1 = this._groupSelector.ey,
          x2 = x1 + this._groupSelector.left,
          y2 = y1 + this._groupSelector.top,
          currentObject,
          selectionX1Y1 = new fabric.Point(min(x1, x2), min(y1, y2)),
          selectionX2Y2 = new fabric.Point(max(x1, x2), max(y1, y2));
      
      for (var i = 0, len = this._objects.length; i < len; ++i) {
        currentObject = this._objects[i];
        
        if (currentObject.intersectsWithRect(selectionX1Y1, selectionX2Y2) || 
            currentObject.isContainedWithinRect(selectionX1Y1, selectionX2Y2)) {
          
          if (currentObject.selectable) {
            currentObject.setActive(true);
            group.push(currentObject);
          }
        }
      }
      
      // do not create group for 1 element only
      if (group.length === 1) {
        this.setActiveObject(group[0]);
        fireEvent('object:selected', {
          target: group[0]
        });
      } 
      else if (group.length > 1) {
        var group = new fabric.Group(group);
        this.setActiveGroup(group);
        group.saveCoords();
        fireEvent('group:selected', { target: group });
      }
      
      this.renderAll();
    },
    
    /**
     * Adds objects to canvas, then renders canvas;
     * Objects should be instances of (or inherit from) fabric.Object
     * @method add
     * @return {fabric.Element} thisArg
     * @chainable
     */
    add: function () {
      this._objects.push.apply(this._objects, arguments);
      for (var i = arguments.length; i--; ) {
        this.stateful && arguments[i].setupState();
        arguments[i].setCoords();
      }
      this.renderOnAddition && this.renderAll();
      return this;
    },
    
    /**
     * Inserts an object to canvas at specified index and renders canvas. 
     * An object should be an instance of (or inherit from) fabric.Object
     * @method insertAt
     * @param object {Object} Object to insert
     * @param index {Number} index to insert object at
     * @return {fabric.Element} instance
     */
    insertAt: function (object, index) {
      this._objects.splice(index, 0, object);
      this.stateful && object.setupState();
      object.setCoords();
      this.renderAll();
      return this;
    },
    
    /**
     * Returns an array of objects this instance has
     * @method getObjects
     * @return {Array}
     */
    getObjects: function () {
      return this._objects;
    },
    
    /**
     * Returns topmost canvas context
     * @method getContext
     * @return {CanvasRenderingContext2D}
     */
    getContext: function () {
      return this.contextTop;
    },
    
    /**
     * Clears specified context of canvas element
     * @method clearContext
     * @param context {Object} ctx context to clear
     * @return {fabric.Element} thisArg
     * @chainable
     */
    clearContext: function(ctx) {
      ctx.clearRect(0, 0, this.width, this.height);
      return this;
    },
    
    /**
     * Clears all contexts (background, main, top) of an instance
     * @method clear
     * @return {fabric.Element} thisArg
     * @chainable
     */
    clear: function () {
      this._objects.length = 0;
      this.clearContext(this.contextTop);
      this.clearContext(this.contextContainer);
      this.renderAll();
      return this;
    },

    /**
     * Renders both the top canvas and the secondary container canvas.
     * @method renderAll
     * @param allOnTop {Boolean} optional Whether we want to force all images to be rendered on the top canvas
     * @return {fabric.Element} instance
     * @chainable
     */ 
    renderAll: function (allOnTop) {
      
      var containerCanvas = this[allOnTop ? 'contextTop' : 'contextContainer'];

      this.clearContext(this.contextTop);

      if (!allOnTop) {
        this.clearContext(containerCanvas);
      }
      containerCanvas.fillStyle = this.backgroundColor;
      containerCanvas.fillRect(0, 0, this.width, this.height);
      
      var length = this._objects.length,
          activeGroup = this.getActiveGroup(),
          startTime = new Date();
      
      if (this.clipTo) {
        containerCanvas.beginPath();
        this.clipTo(containerCanvas);
        containerCanvas.clip();
      }
      
      if (length) {
        for (var i = 0; i < length; ++i) {
          if (!activeGroup ||
              (activeGroup &&
              !activeGroup.contains(this._objects[i]))) {
            this._draw(containerCanvas, this._objects[i]);
          }
        }
      }
      
      // delegate rendering to group selection (if one exists)
      if (activeGroup) {
        this._draw(this.contextTop, activeGroup);
      }
      
      if (this.overlayImage) {
        this.contextTop.drawImage(this.overlayImage, 0, 0);
      }
      
      if (this.onFpsUpdate) {
        var elapsedTime = new Date() - startTime;
        this.onFpsUpdate(~~(1000 / elapsedTime));
      }
      
      fireEvent('after:render');
      
      return this;
    },

    /**
     * Method to render only the top canvas.
     * Also used to render the group selection box.
     * @method renderTop
     * @return {fabric.Element} thisArg
     * @chainable
     */
    renderTop: function () {
      
      this.clearContext(this.contextTop);
      if (this.overlayImage) {
        this.contextTop.drawImage(this.overlayImage, 0, 0);
      }
      
      // we render the top context - last object
      if (this._groupSelector) {
        this._drawSelection();
      }
      
      // delegate rendering to group selection if one exists
      // used for drawing selection borders/corners
      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        activeGroup.render(this.contextTop);
      }
      
      fireEvent('after:render');
      
      return this;
    },
    
    /**
     * Applies one implementation of 'point inside polygon' algorithm
     * @method containsPoint
     * @param e { Event } event object
     * @param target { fabric.Object } object to test against
     * @return {Boolean} true if point contains within area of given object
     */
    containsPoint: function (e, target) {
      var pointer = this.getPointer(e),
          xy = this._normalizePointer(target, pointer),
          x = xy.x, 
          y = xy.y;
      
      // http://www.geog.ubc.ca/courses/klink/gis.notes/ncgia/u32.html
      // http://idav.ucdavis.edu/~okreylos/TAship/Spring2000/PointInPolygon.html
      
      // we iterate through each object. If target found, return it.
      var iLines = target._getImageLines(target.oCoords),
          xpoints = target._findCrossPoints(x, y, iLines);
      
      // if xcount is odd then we clicked inside the object
      // For the specific case of square images xcount === 1 in all true cases
      if ((xpoints && xpoints % 2 === 1) || target._findTargetCorner(e, this._offset)) {
        return true;
      }
      return false;
    },
    
    /**
     * @private
     * @method _normalizePointer
     */
    _normalizePointer: function (object, pointer) {
      
      var activeGroup = this.getActiveGroup(), 
          x = pointer.x, 
          y = pointer.y;
      
      var isObjectInGroup = (
        activeGroup && 
        object.type !== 'group' && 
        activeGroup.contains(object)
      );
      
      if (isObjectInGroup) {
        x -= activeGroup.left;
        y -= activeGroup.top;
      }
      return { x: x, y: y };
    },

    /**
     * Method that determines what object we are clicking on
     * @method findTarget
     * @param {Event} e mouse event
     * @param {Boolean} skipGroup when true, group is skipped and only objects are traversed through
     */ 
    findTarget: function (e, skipGroup) {
      
      var target,
          pointer = this.getPointer(e);
      
      // first check current group (if one exists)
      var activeGroup = this.getActiveGroup();
      
      if (activeGroup && !skipGroup && this.containsPoint(e, activeGroup)) {
        target = activeGroup;
        return target;
      }
      
      // then check all of the objects on canvas
      for (var i = this._objects.length; i--; ) {
        if (this.containsPoint(e, this._objects[i])) {
          target = this._objects[i];
          this.relatedTarget = target;
          break;
        }
      }
      if (target && target.selectable) {
        return target;
      }
    },

    /**
     * Exports canvas element to a dataurl image.
     * @method toDataURL
     * @param {String} format the format of the output image. Either "jpeg" or "png".
     * @return {String}
     */
    toDataURL: function (format) {
      var data;
      if (!format) {
        format = 'png';
      }
      if (format === 'jpeg' || format === 'png') {
        this.renderAll(true);
        data = this.upperCanvasEl.toDataURL('image/' + format);
        this.renderAll();
      }
      return data;
    },
    
    /**
     * Exports canvas element to a dataurl image (allowing to change image size via multiplier).
     * @method toDataURLWithMultiplier
     * @param {String} format (png|jpeg)
     * @param {Number} multiplier
     * @return {String}
     */
    toDataURLWithMultiplier: function (format, multiplier) {
      
      var origWidth = this.getWidth(),
          origHeight = this.getHeight(),
          scaledWidth = origWidth * multiplier,
          scaledHeight = origHeight * multiplier,
          activeObject = this.getActiveObject();
      
      this.setWidth(scaledWidth).setHeight(scaledHeight);
      this.contextTop.scale(multiplier, multiplier);
      
      if (activeObject) {
        this.deactivateAll().renderAll();
      }
      var dataURL = this.toDataURL(format);

      this.contextTop.scale( 1 / multiplier,  1 / multiplier);
      this.setWidth(origWidth).setHeight(origHeight);
      
      if (activeObject) {
        this.setActiveObject(activeObject);
      }
      this.renderAll();
      
      return dataURL;
    },
    
    /**
     * Returns pointer coordinates relative to canvas.
     * @method getPointer
     * @return {Object} object with "x" and "y" number values
     */
    getPointer: function (e) {
      var pointer = getPointer(e);
      return {
        x: pointer.x - this._offset.left,
        y: pointer.y - this._offset.top
      };
    },
    
    /**
     * Returns coordinates of a center of canvas.
     * Returned value is an object with top and left properties
     * @method getCenter
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
     * @method centerObjectH
     * @param {fabric.Object} object Object to center
     * @return {fabric.Element} thisArg
     */
    centerObjectH: function (object) {
      object.set('left', this.getCenter().left);
      this.renderAll();
      return this;
    },
    
    /**
     * Centers object horizontally with animation.
     * @method fxCenterObjectH
     * @param {fabric.Object} object Object to center
     * @param {Object} [callbacks] Callbacks object with optional "onComplete" and/or "onChange" properties
     * @return {fabric.Element} thisArg
     * @chainable
     */
    fxCenterObjectH: function (object, callbacks) {
      callbacks = callbacks || { };

      var empty = function() { },
          onComplete = callbacks.onComplete || empty,
          onChange = callbacks.onChange || empty,
          _this = this;

      fabric.util.animate({
        startValue: object.get('left'),
        endValue: this.getCenter().left,
        duration: this.FX_DURATION,
        onChange: function(value) {
          object.set('left', value);
          _this.renderAll();
          onChange();
        },
        onComplete: function() {
          object.setCoords();
          onComplete();
        }
      });

      return this;
    },
    
    /**
     * Centers object vertically.
     * @method centerObjectH
     * @param {fabric.Object} object Object to center
     * @return {fabric.Element} thisArg
     * @chainable
     */
    centerObjectV: function (object) {
      object.set('top', this.getCenter().top);
      this.renderAll();
      return this;
    },
    
    /**
     * Centers object vertically with animation.
     * @method fxCenterObjectV
     * @param {fabric.Object} object Object to center
     * @param {Object} [callbacks] Callbacks object with optional "onComplete" and/or "onChange" properties
     * @return {fabric.Element} thisArg
     * @chainable
     */
    fxCenterObjectV: function (object, callbacks) {
      callbacks = callbacks || { };

      var empty = function() { },
          onComplete = callbacks.onComplete || empty,
          onChange = callbacks.onChange || empty,
          _this = this;

      fabric.util.animate({
        startValue: object.get('top'),
        endValue: this.getCenter().top,
        duration: this.FX_DURATION,
        onChange: function(value) {
          object.set('top', value);
          _this.renderAll();
          onChange();
        },
        onComplete: function() {
          object.setCoords();
          onComplete();
        }
      });

      return this;
    },
    
    /**
     * Straightens object, then rerenders canvas
     * @method straightenObject
     * @param {fabric.Object} object Object to straighten
     * @return {fabric.Element} thisArg
     * @chainable
     */
    straightenObject: function (object) {
      object.straighten();
      this.renderAll();
      return this;
    },
    
    /**
     * Same as `fabric.Element#straightenObject`, but animated
     * @method fxStraightenObject
     * @param {fabric.Object} object Object to straighten
     * @return {fabric.Element} thisArg
     * @chainable
     */
    fxStraightenObject: function (object) {
      object.fxStraighten({
        onChange: this.renderAll.bind(this)
      });
      return this;
    },
    
    /**
     * Returs dataless JSON representation of canvas
     * @method toDatalessJSON
     * @return {String} json string
     */
    toDatalessJSON: function () {
      return this.toDatalessObject();
    },
    
    /**
     * Returns object representation of canvas
     * @method toObject
     * @return {Object}
     */
    toObject: function () {
      return this._toObjectMethod('toObject');
    },
    
    /**
     * Returns dataless object representation of canvas
     * @method toDatalessObject
     * @return {Object}
     */
    toDatalessObject: function () {
      return this._toObjectMethod('toDatalessObject');
    },
    
    /**
     * @private
     * @method _toObjectMethod
     */
    _toObjectMethod: function (methodName) {
      return { 
        objects: this._objects.map(function (instance){
          // TODO (kangax): figure out how to clean this up
          if (!this.includeDefaultValues) {
            var originalValue = instance.includeDefaultValues;
            instance.includeDefaultValues = false;
          }
          var object = instance[methodName]();
          if (!this.includeDefaultValues) {
            instance.includeDefaultValues = originalValue;
          }
          return object;
        }, this),
        background: this.backgroundColor
      }
    },

    /**
     * Returns true if canvas contains no objects
     * @method isEmpty
     * @return {Boolean} true if canvas is empty
     */
    isEmpty: function () {
      return this._objects.length === 0;
    },
    
    /**
     * Populates canvas with data from the specified JSON
     * JSON format must conform to the one of `fabric.Element#toJSON`
     * @method loadFromJSON
     * @param {String} json JSON string
     * @param {Function} callback Callback, invoked when json is parsed 
     *                            and corresponding objects (e.g: fabric.Image) 
     *                            are initialized
     * @return {fabric.Element} instance
     * @chainable
     */
    loadFromJSON: function (json, callback) {
      if (!json) return;
      
      var serialized = JSON.parse(json);
      if (!serialized || (serialized && !serialized.objects)) return;
      
      this.clear();
      var _this = this;
      this._enlivenObjects(serialized.objects, function () {
        _this.backgroundColor = serialized.background;
        if (callback) {
          callback();
        }
      });
      
      return this;
    },
    
    /**
     * @method _enlivenObjects
     * @param {Array} objects
     * @param {Function} callback
     */
    _enlivenObjects: function (objects, callback) {
      var numLoadedImages = 0,
          // get length of all images 
          numTotalImages = objects.filter(function (o) {
            return o.type === 'image';
          }).length;
      
      var _this = this;
      
      objects.forEach(function (o, index) {
        if (!o.type) {
          return;
        }
        switch (o.type) {
          case 'image':
          case 'font':
            fabric[capitalize(o.type)].fromObject(o, function (o) {
              _this.insertAt(o, index);
              if (++numLoadedImages === numTotalImages) {
                if (callback) {
                  callback();
                }
              }
            });
            break;
          default:
            var klass = fabric[camelize(capitalize(o.type))];
            if (klass && klass.fromObject) {
              _this.insertAt(klass.fromObject(o), index);
            }
            break;
        }
      });
      
      if (numTotalImages === 0 && callback) {
        callback();
      }
    },
    
    /**
     * Populates canvas with data from the specified dataless JSON
     * JSON format must conform to the one of `fabric.Element#toDatalessJSON`
     * @method loadFromDatalessJSON
     * @param {String} json JSON string
     * @param {Function} callback Callback, invoked when json is parsed 
     *                            and corresponding objects (e.g: fabric.Image) 
     *                            are initialized
     * @return {fabric.Element} instance
     * @chainable
     */
    loadFromDatalessJSON: function (json, callback) {
      
      if (!json) {
        return;
      }

      // serialize if it wasn't already
      var serialized = (typeof json === 'string')
        ? JSON.parse(json)
        : json;
      
      if (!serialized || (serialized && !serialized.objects)) return;
      
      this.clear();

      // TODO: test this
      this.backgroundColor = serialized.background;
      this._enlivenDatalessObjects(serialized.objects, callback);
    },
    
    /**
     * @method _enlivenDatalessObjects
     * @param {Array} objects
     * @param {Function} callback
     */
    _enlivenDatalessObjects: function (objects, callback) {
      
      /** @ignore */
      function onObjectLoaded(object, index) {
        _this.insertAt(object, index);
        object.setCoords();
        if (++numLoadedObjects === numTotalObjects) {
          callback && callback();
        }
      }
      
      var _this = this,
          numLoadedObjects = 0,
          numTotalObjects = objects.length;
      
      if (numTotalObjects === 0 && callback) {
        callback();
      }
      
      try {
        objects.forEach(function (obj, index) {
          
          var pathProp = obj.paths ? 'paths' : 'path';
          var path = obj[pathProp];

          delete obj[pathProp];
          
          if (typeof path !== 'string') {
            switch (obj.type) {
              case 'image':
              case 'text':
                fabric[capitalize(obj.type)].fromObject(obj, function (o) {
                  onObjectLoaded(o, index);
                });
                break;
              default:
                var klass = fabric[camelize(capitalize(obj.type))];
                if (klass && klass.fromObject) {
                  // restore path
                  if (path) {
                    obj[pathProp] = path;
                  }
                  onObjectLoaded(klass.fromObject(obj), index);
                }
                break;
            }
          }
          else {
            if (obj.type === 'image') {
              _this.loadImageFromURL(path, function (image) {
                image.setSourcePath(path);

                extend(image, obj);
                image.setAngle(obj.angle);

                onObjectLoaded(image, index);
              });
            }
            else if (obj.type === 'text') {
              
              obj.path = path;
              var object = fabric.Text.fromObject(obj);
              var onscriptload = function () {
                // TODO (kangax): find out why Opera refuses to work without this timeout
                if (Object.prototype.toString.call(window.opera) === '[object Opera]') {
                  setTimeout(function () {
                    onObjectLoaded(object, index);
                  }, 500);
                }
                else {
                  onObjectLoaded(object, index);
                }
              }
              
              fabric.util.getScript(path, onscriptload);
            }
            else {
              _this.loadSVGFromURL(path, function (elements, options) {
                if (elements.length > 1) {
                  var object = new fabric.PathGroup(elements, obj);
                }
                else {
                  var object = elements[0];
                }
                object.setSourcePath(path);

                // copy parameters from serialied json to object (left, top, scaleX, scaleY, etc.)
                // skip this step if an object is a PathGroup, since we already passed it options object before
                if (!(object instanceof fabric.PathGroup)) {
                  extend(object, obj);
                  if (typeof obj.angle !== 'undefined') {
                    object.setAngle(obj.angle);
                  }
                }

                onObjectLoaded(object, index);
              });
            }
          }
        }, this);
      } 
      catch(e) {
        fabric.log(e.message);
      }
    },
    
    /**
     * Loads an image from URL, creates an instance of fabric.Image and passes it to a callback
     * @function
     * @method loadImageFromURL
     * @param url {String} url of image to load
     * @param callback {Function} calback, invoked when image is loaded
     */
    loadImageFromURL: (function () {
      var imgCache = { };

      return function (url, callback) {
        // check cache first
        
        var _this = this;
        
        function checkIfLoaded() {
          var imgEl = document.getElementById(imgCache[url]);
          if (imgEl.width && imgEl.height) {
            callback(new fabric.Image(imgEl));
          }
          else {
            setTimeout(checkIfLoaded, 50);
          }
        }

        // get by id from cache
        if (imgCache[url]) {
          // id can be cached but image might still not be loaded, so we poll here
          checkIfLoaded();
        }
        // else append a new image element
        else {
          var imgEl = new Image();
          
          /** @ignore */
          imgEl.onload = function () {
            imgEl.onload = null;
            
            if (imgEl.width && imgEl.height) {
              callback(new fabric.Image(imgEl));
            }
          };
          
          imgEl.className = 'canvas-img-clone';
          imgEl.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
          imgEl.src = url;
          
          if (this.shouldCacheImages) {
            // TODO (kangax): replace Element.identify w. fabric -based alternative
            imgCache[url] = Element.identify(imgEl);
          }
          document.body.appendChild(imgEl);
        }
      }
    })(),
    
    /**
     * Takes url corresponding to an SVG document, and parses it to a set of objects
     * @method loadSVGFromURL
     * @param {String} url
     * @param {Function} callback
     */
    loadSVGFromURL: function (url, callback) {
      
      var _this = this;
      
      url = url.replace(/^\n\s*/, '').replace(/\?.*$/, '').trim();
      
      this.cache.has(url, function (hasUrl) {
        if (hasUrl) {
          _this.cache.get(url, function (value) {
            var enlivedRecord = _this._enlivenCachedObject(value);
            callback(enlivedRecord.objects, enlivedRecord.options);
          });
        }
        else {
          new fabric.util.request(url, {
            method: 'get',
            onComplete: onComplete
          });
        }
      });
      
      function onComplete(r) {
        
        var xml = r.responseXML;
        if (!xml) return;
        
        var doc = xml.documentElement;
        if (!doc) return;
        
        fabric.parseSVGDocument(doc, function (results, options) {
          _this.cache.set(url, {
            objects: fabric.util.array.invoke(results, 'toObject'),
            options: options
          });
          callback(results, options);
        });
      }
    },
    
    /**
     * @method _enlivenCachedObject
     */
    _enlivenCachedObject: function (cachedObject) {
      
      var objects = cachedObject.objects,
          options = cachedObject.options;
      
      objects = objects.map(function (o) {
        return fabric[capitalize(o.type)].fromObject(o);
      });
      
      return ({ objects: objects, options: options });
    },
    
    /**
     * Removes an object from canvas and returns it
     * @method remove
     * @param object {Object} Object to remove
     * @return {Object} removed object
     */
    remove: function (object) {
      removeFromArray(this._objects, object);
      if (this.getActiveObject() === object) {
        this.removeActiveObject();
      }
      this.renderAll();
      return object;
    },
    
    /**
     * Same as `fabric.Element#remove` but animated
     * @method fxRemove
     * @param {fabric.Object} object Object to remove
     * @param {Function} callback Callback, invoked on effect completion
     * @return {fabric.Element} thisArg
     * @chainable
     */
    fxRemove: function (object, callback) {
      var _this = this;
      object.fxRemove({
        onChange: this.renderAll.bind(this),
        onComplete: function () {
          _this.remove(object);
          if (typeof callback === 'function') {
            callback();
          }
        }
      });
      return this;
    },
    
    /**
     * Moves an object to the bottom of the stack of drawn objects
     * @method sendToBack
     * @param object {fabric.Object} Object to send to back
     * @return {fabric.Element} thisArg
     * @chainable
     */
    sendToBack: function (object) {
      removeFromArray(this._objects, object);
      this._objects.unshift(object);
      return this.renderAll();
    },
    
    /**
     * Moves an object to the top of the stack of drawn objects
     * @method bringToFront
     * @param object {fabric.Object} Object to send
     * @return {fabric.Element} thisArg
     * @chainable
     */
    bringToFront: function (object) {
      removeFromArray(this._objects, object);
      this._objects.push(object);
      return this.renderAll();
    },
    
    /**
     * Moves an object one level down in stack of drawn objects
     * @method sendBackwards
     * @param object {fabric.Object} Object to send
     * @return {fabric.Element} thisArg
     * @chainable
     */
    sendBackwards: function (object) {
      var idx = this._objects.indexOf(object),
          nextIntersectingIdx = idx;
      
      // if object is not on the bottom of stack
      if (idx !== 0) {
        
        // traverse down the stack looking for the nearest intersecting object
        for (var i=idx-1; i>=0; --i) {
          if (object.intersectsWithObject(this._objects[i])) {
            nextIntersectingIdx = i;
            break;
          }
        }
        removeFromArray(this._objects, object);
        this._objects.splice(nextIntersectingIdx, 0, object);
      }
      return this.renderAll();
    },
    
    /**
     * Moves an object one level up in stack of drawn objects
     * @method sendForward
     * @param object {fabric.Object} Object to send
     * @return {fabric.Element} thisArg
     * @chainable
     */
    bringForward: function (object) {
      var objects = this.getObjects(),
          idx = objects.indexOf(object),
          nextIntersectingIdx = idx;

      
      // if object is not on top of stack (last item in an array)
      if (idx !== objects.length-1) {
        
        // traverse up the stack looking for the nearest intersecting object
        for (var i = idx + 1, l = this._objects.length; i < l; ++i) {
          if (object.intersectsWithObject(objects[i])) {
            nextIntersectingIdx = i;
            break;
          }
        }
        removeFromArray(objects, object);
        objects.splice(nextIntersectingIdx, 0, object);
      }
      this.renderAll();
    },
    
    /**
     * Sets given object as active
     * @method setActiveObject
     * @param object {fabric.Object} Object to set as an active one
     * @return {fabric.Element} thisArg
     * @chainable
     */
    setActiveObject: function (object) {
      if (this._activeObject) {
        this._activeObject.setActive(false);
      }
      this._activeObject = object;
      object.setActive(true);
      
      this.renderAll();
      
      fireEvent('object:selected', { target: object });
      return this;
    },
    
    /**
     * Returns currently active object
     * @method getActiveObject
     * @return {fabric.Object} active object
     */
    getActiveObject: function () {
      return this._activeObject;
    },
    
    /**
     * Removes currently active object
     * @method removeActiveObject
     * @return {fabric.Element} thisArg
     * @chainable
     */
    removeActiveObject: function () {
      if (this._activeObject) {
        this._activeObject.setActive(false);
      }
      this._activeObject = null;
      return this;
    },
    
    /**
     * Sets active group to a speicified one
     * @method setActiveGroup
     * @param {fabric.Group} group Group to set as a current one 
     * @return {fabric.Element} thisArg
     * @chainable
     */
    setActiveGroup: function (group) {
      this._activeGroup = group;
      return this;
    },
    
    /**
     * Returns currently active group
     * @method getActiveGroup
     * @return {fabric.Group} Current group
     */
    getActiveGroup: function () {
      return this._activeGroup;
    },
    
    /**
     * Removes currently active group
     * @method removeActiveGroup
     * @return {fabric.Element} thisArg
     */
    removeActiveGroup: function () {
      var g = this.getActiveGroup();
      if (g) {
        g.destroy();
      }
      return this.setActiveGroup(null);
    },
    
    /**
     * Returns object at specified index
     * @method item
     * @param {Number} index
     * @return {fabric.Object}
     */
    item: function (index) {
      return this.getObjects()[index];
    },
    
    /**
     * Deactivates all objects by calling their setActive(false)
     * @method deactivateAll
     * @return {fabric.Element} thisArg
     */
    deactivateAll: function () {
      var allObjects = this.getObjects(),
          i = 0,
          len = allObjects.length;
      for ( ; i < len; i++) {
        allObjects[i].setActive(false);
      }
      this.removeActiveGroup();
      this.removeActiveObject();
      return this;
    },
    
    /**
     * Returns number representation of an instance complexity
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function () {
      return this.getObjects().reduce(function (memo, current) {
        memo += current.complexity ? current.complexity() : 0;
        return memo;
      }, 0);
    },
    
    /**
     * Iterates over all objects, invoking callback for each one of them
     * @method forEachObject
     * @return {fabric.Element} thisArg
     */
    forEachObject: function(callback, context) {
      var objects = this.getObjects(),
          i = objects.length;
      while (i--) {
        callback.call(context, objects[i], i, objects);
      }
      return this;
    },
    
    /**
     * Clears a canvas element and removes all event handlers.
     * @method dispose
     * @return {fabric.Element} thisArg
     * @chainable
     */
    dispose: function () {
      this.clear();
      removeListener(this.upperCanvasEl, 'mousedown', this._onMouseDown);
      removeListener(document, 'mouseup', this._onMouseUp);
      removeListener(document, 'mousemove', this._onMouseMove);
      removeListener(window, 'resize', this._onResize);
      return this;
    },
    
    /**
     * Clones canvas instance
     * @method clone
     * @param {Object} [callback] Expects `onBeforeClone` and `onAfterClone` functions
     * @return {fabric.Element} Clone of this instance
     */
    clone: function (callback) {
      var el = document.createElement('canvas');
      
      el.width = this.getWidth();
      el.height = this.getHeight();
          
      // cache
      var clone = this.__clone || (this.__clone = new fabric.Element(el));
      
      return clone.loadFromJSON(JSON.stringify(this.toJSON()), function () {
        if (callback) {
          callback(clone);
        }
      });
    },
    
    /**
     * @private
     * @method _toDataURL
     * @param {String} format
     * @param {Function} callback
     */
    _toDataURL: function (format, callback) {
      this.clone(function (clone) {
        callback(clone.toDataURL(format));
      });
    },
    
    /**
     * @private
     * @method _toDataURLWithMultiplier
     * @param {String} format
     * @param {Number} multiplier
     * @param {Function} callback
     */
    _toDataURLWithMultiplier: function (format, multiplier, callback) {
      this.clone(function (clone) {
        callback(clone.toDataURLWithMultiplier(format, multiplier));
      });
    },
    
    /**
     * @private
     * @method _resizeImageToFit
     * @param {HTMLImageElement} imgEl
     */
    _resizeImageToFit: function (imgEl) {
      
      var imageWidth = imgEl.width || imgEl.offsetWidth,
          widthScaleFactor = this.getWidth() / imageWidth;
      
      // scale image down so that it has original dimensions when printed in large resolution
      if (imageWidth) {
        imgEl.width = imageWidth * widthScaleFactor;
      }
    },
    
    /**
     * Used for caching SVG documents (loaded via `fabric.Element#loadSVGFromURL`)
     * @property
     * @namespace
     */
    cache: {
      
      /**
       * @method has
       * @param {String} name
       * @param {Function} callback
       */
      has: function (name, callback) { 
        callback(false);
      },
      
      /**
       * @method get
       * @param {String} url
       * @param {Function} callback
       */
      get: function (url, callback) {
        /* NOOP */
      },
      
      /**
       * @method set
       * @param {String} url
       * @param {Object} object
       */
      set: function (url, object) {
        /* NOOP */
      }
    }
  });
  
  /**
   * Returns a string representation of an instance
   * @method toString
   * @return {String} string representation of an instance
   */
  fabric.Element.prototype.toString = function () { // Assign explicitly since `extend` doesn't take care of DontEnum bug yet
    return '#<fabric.Element (' + this.complexity() + '): '+
           '{ objects: ' + this.getObjects().length + ' }>';
  };
  
  extend(fabric.Element, /** @scope fabric.Element */ {
    
    /**
     * @static
     * @property EMPTY_JSON
     * @type String
     */
    EMPTY_JSON: '{"objects": [], "background": "white"}',
    
    /**
     * Takes &lt;canvas> element and transforms its data in such way that it becomes grayscale
     * @static
     * @method toGrayscale
     * @param {HTMLCanvasElement} canvasEl
     */
    toGrayscale: function (canvasEl) {
       var context = canvasEl.getContext('2d'),
           imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
           data = imageData.data, 
           iLen = imageData.width,
           jLen = imageData.height,
           index, average, i, j;

       for (i = 0; i < iLen; i++) {
         for (j = 0; j < jLen; j++) {

           index = (i * 4) * jLen + (j * 4);
           average = (data[index] + data[index + 1] + data[index + 2]) / 3;

           data[index]     = average;
           data[index + 1] = average;
           data[index + 2] = average;
         }
       }

       context.putImageData(imageData, 0, 0);
     },
    
    /**
     * Provides a way to check support of some of the canvas methods 
     * (either those of HTMLCanvasElement itself, or rendering context)
     *
     * @method supports
     * @param methodName {String} Method to check support for; 
     *                            Could be one of "getImageData" or "toDataURL"
     * @return {Boolean | null} `true` if method is supported (or at least exists), 
     *                          `null` if canvas element or context can not be initialized
     */
    supports: function (methodName) {
      var el = document.createElement('canvas');
      
      if (typeof G_vmlCanvasManager !== 'undefined') {
        G_vmlCanvasManager.initElement(el);
      }
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
          
        case 'toDataURL':
          return typeof el.toDataURL !== 'undefined';
          
        default:
          return null;
      }
    }
  });
  
  /**
   * Returs JSON representation of canvas
   * @function
   * @method toJSON
   * @return {String} json string
   */
  fabric.Element.prototype.toJSON = fabric.Element.prototype.toObject;
})(this);