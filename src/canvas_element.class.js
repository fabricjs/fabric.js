(function () {
  
  var global = this,
      window = global.window,
      document = window.document,
      
      Canvas = global.Canvas || (global.Canvas = { });
      
  if (Canvas.Element) {
    console.warn('Canvas.Element is already defined.');
    return;
  }
  
  var CANVAS_INIT_ERROR = new Error('Could not initialize `canvas` element'),
      FX_DURATION = 500,
      STROKE_OFFSET = 0.5,
      FX_TRANSITION = 'decel',
      
      getCoords = APE.dom.Event.getCoords,
      
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
  
  // WebKit is about 10x faster at clearing canvas with `canvasEl.width = canvasEl.width` rather than `context.clearRect`
  // We feature-test performance of both methods to determine a winner
  var fastestClearingMethod = (function () {
    var el = document.createElement('canvas'), 
        t, t1, t2, i,
        numIterations = 200,
        canvasLength = 300;
        
    el.width = el.height = canvasLength;
    
    if (!el.getContext) {
      return;
    }
    
    var ctx = el.getContext('2d');
    if (!ctx) {
      return;
    }
    
    t = new Date();
    for (i = numIterations; i--; ) {
      ctx.clearRect(0, 0, canvasLength, canvasLength);
    }
    t1 = new Date() - t;
    
    t = new Date();
    for (i = numIterations; i--; ) {
      el.width = el.height;
    }
    t2 = new Date() - t;

    if (t2 < t1) {
      return 'width';
    }
  })();

  function clearContext(ctx) {
    // this sucks, but we can't use `getWidth`/`getHeight` here for perf. reasons
    ctx.clearRect(0, 0, this._oConfig.width, this._oConfig.height);
    return this;
  }
  
  // nightly webkit has some rendering artifacts when using this clearing method, so disable it for now
  /*
  if (fastestClearingMethod === 'width') {
    clearContext = function (ctx) {
      ctx.canvas.width = ctx.canvas.width;
      return this;
    }
  }
  */
  
  var CAN_SET_TRANSPARENT_FILL = (function () {
    
    // FF2.0 (and maybe other equivalents) throw error
    
    var canvasEl = document.createElement('canvas');
    if (!canvasEl || !canvasEl.getContext) {
      return;
    }
    
    var context = canvasEl.getContext('2d');
    if (!context) {
      return;
    }
    
    try { 
      context.fillStyle = 'transparent';
      return true;
    }
    catch(err) { }
    
    return false;
  })();
  
  /**
   * @class Canvas.Element
   * @constructor
   * @param {HTMLElement | String} el Container element for the canvas.
   */
  Canvas.Element = function (el, oConfig) {
    
    /**
     * The object literal containing mouse position if clicked in an empty area (no image)
     * @property _groupSelector
     * @type object
     */
    this._groupSelector = null;

    /**
     * The array literal containing all objects on canvas
     * @property _aObjects
     * @type array
     */
    this._aObjects = [];

    /**
     * The element that references the canvas interface implementation
     * @property _oContext
     * @type object
     */
    this._oContext = null;

    /**
     * The main element that contains the canvas
     * @property _oElement
     * @type object
     */
    this._oElement = null;

    /**
     * The object literal containing the current x,y params of the transformation
     * @property _currentTransform
     * @type object
     */
    this._currentTransform = null;
    
    /**
     * References instance of Canvas.Group - when multiple objects are selected
     * @property _activeGroup
     * @type object
     */
    this._activeGroup = null;
    
     /**
      * An object containing config parameters
      * @property _oConfig
      * @type object
      */
    this._oConfig = { 
      width: 300, 
      height: 150 
    };
    
    oConfig = oConfig || { };
    
    this._initElement(el);
    this._initConfig(oConfig);
    
    if (oConfig.overlayImage) {
      this.setOverlayImage(oConfig.overlayImage);
    }
    
    if (oConfig.afterRender) {
      this.afterRender = oConfig.afterRender;
    }
    
    this._createCanvasBackground();
    this._createCanvasContainer();
    this._initEvents();
    this.calcOffset();
  };
  
  Object.extend(Canvas.Element.prototype, {
    
    selectionColor:         'rgba(100,100,255,0.3)', // blue
    selectionBorderColor:   'rgba(255,255,255,0.3)', // white
    selectionLineWidth:     1,
    backgroundColor:        'rgba(255,255,255,1)', // white
    includeDefaultValues:   true,
    
    shouldCacheImages:      false,
    
    CANVAS_WIDTH:           600,
    CANVAS_HEIGHT:          600,
    
    CANVAS_PRINT_WIDTH:     3000,
    CANVAS_PRINT_HEIGHT:    3000,
    
    onBeforeScaleRotate: function () {
      /* NOOP */
    },
    
    /**
     * Calculates canvas element offset relative to the document
     * This method is also attached as "resize" event handler of window
     * @method calcOffset
     * @return {Canvas.Element} instance
     * @chainable
     */
    calcOffset: function () {
      this._offset = Element.cumulativeOffset(this.getElement());
      return this;
    },
    
    /**
     * @method setOverlayImage
     * @param {String} url url of an image to set background to
     * @param {Function} callback callback to invoke when image is loaded and set as an overlay one
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    // TODO (kangax): test callback
    setOverlayImage: function (url, callback) {
      if (url) {
        var _this = this, img = new Image();
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
     * canvas class's initialization method. This method is automatically 
     * called by constructor, and sets up all DOM references for 
     * pre-existing markup, and creates required markup if it is not 
     * already present.
     * @method _initElement
     * @param canvasEl {HTMLElement|String} canvasEl canvas element
     *
     */
    _initElement: function (canvasEl) {
      if ($(canvasEl)) {
        this._oElement = $(canvasEl);
      }
      else {
        this._oElement = new Element('canvas');
      }
      if (typeof this._oElement.getContext === 'undefined') {
        G_vmlCanvasManager.initElement(this._oElement);
      }
      if (typeof this._oElement.getContext === 'undefined') {
        throw CANVAS_INIT_ERROR;
      }
      if (!(this._oContextTop = this._oElement.getContext('2d'))) {
        throw CANVAS_INIT_ERROR;
      }
      
      var width = this._oElement.width || 0,
          height = this._oElement.height || 0;
      
      this._initWrapperElement(width, height);
      this._setElementStyle(width, height);
    },
    
    /**
     * @private
     * @method _initWrapperElement
     */
    _initWrapperElement: function (width, height) {
      var wrapper = Element.wrap(this.getElement(), 'div', { className: 'canvas_container' });
      wrapper.setStyle({
        width: width + 'px',
        height: height + 'px'
      });
      Element.makeUnselectable(wrapper);
      this.wrapper = wrapper;
    },
    
    /**
     * @private
     * @method _setElementStyle
     */
    _setElementStyle: function (width, height) {
      this.getElement().setStyle({
        position: 'absolute',
        width: width + 'px',
        height: height + 'px',
        left: 0,
        top: 0
      });
    },

    /**
       * For now we use an object literal without methods to store the config params
       * @method _initConfig
       * @param oConfig {Object} userConfig The configuration Object literal 
       * containing the configuration that should be set for this module. 
       * See configuration documentation for more details.
       */
    _initConfig: function (oConfig) {
      Object.extend(this._oConfig, oConfig || { });
      
      this._oConfig.width = parseInt(this._oElement.width, 10) || 0;
      this._oConfig.height = parseInt(this._oElement.height, 10) || 0;

      this._oElement.style.width = this._oConfig.width + 'px';
      this._oElement.style.height = this._oConfig.height + 'px';
    },

    /**
     * Adds main mouse listeners to the whole canvas
     * @method _initEvents
     * @private
     * See configuration documentation for more details.
     */
    _initEvents: function () {
      
      var _this = this;
      
      this._onMouseDown = function (e){ _this.__onMouseDown(e); };
      this._onMouseUp = function (e){ _this.__onMouseUp(e); };
      this._onMouseMove = function (e){ _this.__onMouseMove(e); };
      this._onResize = function (e) { _this.calcOffset() };
      
      Event.observe(this._oElement, 'mousedown', this._onMouseDown);
      Event.observe(document, 'mousemove', this._onMouseMove);
      Event.observe(document, 'mouseup', this._onMouseUp);
      Event.observe(window, 'resize', this._onResize);
    },
    
    /**
     * Creates canvas elements
     * @method _createCanvasElement
     * @private
     */
    _createCanvasElement: function (className) {
        
      var element = document.createElement('canvas');
      if (!element) {
        return;
      }
      
      element.className = className;
      var oContainer = this._oElement.parentNode.insertBefore(element, this._oElement);
      
      oContainer.width = this.getWidth();
      oContainer.height = this.getHeight();
      oContainer.style.width = this.getWidth() + 'px';
      oContainer.style.height = this.getHeight() + 'px';
      oContainer.style.position = 'absolute';
      oContainer.style.left = 0;
      oContainer.style.top = 0;
      
      if (typeof element.getContext === 'undefined') {
        // try augmenting element with excanvas' G_vmlCanvasManager
        G_vmlCanvasManager.initElement(element);
      }
      if (typeof element.getContext === 'undefined') {
        // if that didn't work, throw error
        throw CANVAS_INIT_ERROR;
      }
      Element.makeUnselectable(oContainer);
      return oContainer;
    },

    /**
     * Creates a secondary canvas to contain all the images are not being translated/rotated/scaled
     * @method _createCanvasContainer
     */
    _createCanvasContainer: function () {
      // this context will contain all images that are not on the top
      var canvas = this._createCanvasElement('canvas-container');
      this._oContextContainerEl = canvas;
      this._oContextContainer = canvas.getContext('2d');
    },

    /**
     * Creates a "background" canvas
     * @method _createCanvasBackground
     */
    _createCanvasBackground: function () {
      // this context will contain the background
      var canvas = this._createCanvasElement('canvas-container');
      this._oContextBackgroundEl = canvas;
      this._oContextBackground = canvas.getContext('2d');
    },
    
    /**
     * Returns canvas width
     * @method getWidth
     * @return {Number}
     */
    getWidth: function () {
      return this._oConfig.width;
    },
    
    /**
     * Returns canvas height
     * @method getHeight
     * @return {Number}
     */
    getHeight: function () {
      return this._oConfig.height;
    },
    
    /**
     * @method setWidth
     * @param {Number} width value to set width to
     * @return {Canvas.Element} instance
     * @chainable true
     */
    setWidth: function (value) {
      return this._setDimension('width', value);
    },
    
    /**
     * @method setHeight
     * @param {Number} height value to set height to
     * @return {Canvas.Element} instance
     * @chainable true
     */
    setHeight: function (value) {
      return this._setDimension('height', value);
    },
    
    /**
     * private helper for setting width/height
     * @method _setDimensions
     * @private
     * @param {String} prop property (width|height)
     * @param {Number} value value to set property to
     * @return {Canvas.Element} instance
     * @chainable true
     */
    _setDimension: function (prop, value) {
      this._oContextContainerEl[prop] = value;
      this._oContextContainerEl.style[prop] = value + 'px';
      
      this._oContextBackgroundEl[prop] = value;
      this._oContextBackgroundEl.style[prop] = value + 'px';
      
      this._oElement[prop] = value;
      this._oElement.style[prop] = value + 'px';
      
      // <DIV> container (parent of all <CANVAS> elements)
      this._oElement.parentNode.style[prop] = value + 'px';
      
      this._oConfig[prop] = value;
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
      if (this._currentTransform) {
        
        var transform = this._currentTransform,
            target = transform.target;
            
        if (target.__scaling) {
          document.fire('object:scaled', { target: target });
          target.__scaling = false;
        }
        
        // determine the new coords everytime the image changes its position
        for (var i=0, l=this._aObjects.length; i<l; ++i) {
          this._aObjects[i].setCoords();
        }
        
        // only fire :modified event if target coordinates were changed during mousedown-mouseup
        if (target.hasStateChanged()) {
          target.isMoving = false;
          document.fire('object:modified', { target: target });
        }
      }
      
      this._currentTransform = null;
      
      if (this._groupSelector) {
        // group selection was completed, determine its bounds
        this._findSelectedObjects(e);
      }
      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        if (activeGroup.hasStateChanged() && 
            activeGroup.containsPoint(this.getPointer(e))) {
          document.fire('group:modified', { target: activeGroup });
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
    },
    
    shouldClearSelection: function (e) {
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
      
      // ignore if some object is being transformed at this moment
      if (this._currentTransform) return;
      
      var target = this.findTarget(e),
          pointer = this.getPointer(e),
          activeGroup = this.getActiveGroup(), 
          corner;
      
      if (this.shouldClearSelection(e)) {
        
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
        target.saveState();
        
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
     * @method getElement
     * @return {HTMLCanvasElement}
     */
    getElement: function () {
      return this._oElement;
    },
    
    /**
     * Deactivates all objects and dispatches appropriate events
     * @method deactivateAllWithDispatch
     * @return {Canvas.Element} thisArg
     */
    deactivateAllWithDispatch: function () {
      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        document.fire('before:group:destroyed', {
          target: activeGroup
        });
      }
      this.deactivateAll();
      if (activeGroup) {
        document.fire('after:group:destroyed');
      }
      document.fire('selection:cleared');
      return this;
    },
    
    /**
     * @private
     * @method _setupCurrentTransform
     */
    _setupCurrentTransform: function (e, target) {
      var action = 'drag', 
          corner,
          pointer = getCoords(e);
      
      if (corner = target._findTargetCorner(e, this._offset)) {
        action = /ml|mr/.test(corner) 
          ? 'scaleX' 
          : /mt|mb/.test(corner) 
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
        document.fire('group:selected', { target: activeGroup });
        activeGroup.setActive(true);
      }
      else {
        // group does not exist
        if (this._activeObject) {
          // only if there's an active object
          if (target !== this._activeObject) {
            // and that object is not the actual target
            var group = new Canvas.Group([ this._activeObject,target ]);
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
      
      // We initially clicked in an empty area, so we draw a box for multiple selection.
      if (this._groupSelector !== null) {
        var pointer = getCoords(e);
        this._groupSelector.left = pointer.x - this._offset.left - this._groupSelector.ex;
        this._groupSelector.top = pointer.y - this._offset.top - this._groupSelector.ey;
        this.renderTop();
      }
      else if (!this._currentTransform) {
        
        // alias style to elimintate unnecessary lookup
        var style = this._oElement.style;
        
        // Here we are hovering the canvas then we will determine
        // what part of the pictures we are hovering to change the caret symbol.
        // We won't do that while dragging or rotating in order to improve the
        // performance.
        var target = this.findTarget(e);
        
        if (!target) {  
          // image/text was hovered-out from, we remove its borders
          for (var i = this._aObjects.length; i--; ) {
            if (!this._aObjects[i].active) {
              this._aObjects[i].setActive(false);
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
        var pointer = getCoords(e), 
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
      target.set('left', x - this._currentTransform.offsetX);
      target.set('top', y - this._currentTransform.offsetY);
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
      var lastLen = Math.sqrt(Math.pow(this._currentTransform.ey - this._currentTransform.top - this._offset[1], 2) +
        Math.pow(this._currentTransform.ex - this._currentTransform.left - this._offset[0], 2));
      
      var curLen = Math.sqrt(Math.pow(y - this._currentTransform.top - this._offset[1], 2) +
        Math.pow(x - this._currentTransform.left - this._offset[0], 2));
      
      var target = this._currentTransform.target;
      target.__scaling = true;
      
      if (!by) {
        target.set('scaleX', this._currentTransform.scaleX * curLen/lastLen);
        target.set('scaleY', this._currentTransform.scaleY * curLen/lastLen);
      }
      else if (by === 'x') {
        target.set('scaleX', this._currentTransform.scaleX * curLen/lastLen);
      }
      else if (by === 'y') {
        target.set('scaleY', this._currentTransform.scaleY * curLen/lastLen);
      }
    },

    /**
     * Rotates object by invoking its rotate method
     * @method _rotateObject
     * @param x {Number} pointer's x coordinate
     * @param y {Number} pointer's y coordinate
     */ 
    _rotateObject: function (x, y) {
      var lastAngle = Math.atan2(this._currentTransform.ey - this._currentTransform.top - this._offset[1],
        this._currentTransform.ex - this._currentTransform.left - this._offset[0]); 
      var curAngle = Math.atan2(y - this._currentTransform.top - this._offset[1],
        x - this._currentTransform.left - this._offset[0]);
      this._currentTransform.target.set('theta', (curAngle - lastAngle) + this._currentTransform.theta);
    },
    
    /**
     * @method _setCursor
     */
    _setCursor: function (value) {
      this._oElement.style.cursor = value;
    },
    
    /**
     * Sets the cursor depending on where the canvas is being hovered.
     * Note: very buggy in Opera
     * @method _setCursorFromEvent
     * @param e {Event} Event object
     * @param target {Object} Object that the mouse is hovering, if so.
     */
    _setCursorFromEvent: function (e, target) {
      var s = this._oElement.style;
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
      var left = this._groupSelector.left,
          top = this._groupSelector.top,
          aleft = Math.abs(left),
          atop = Math.abs(top);

      this._oContextTop.fillStyle = this.selectionColor;

      this._oContextTop.fillRect(
        this._groupSelector.ex - ((left > 0) ? 0 : -left),
        this._groupSelector.ey - ((top > 0) ? 0 : -top),
        aleft, 
        atop
      );

      this._oContextTop.lineWidth = this.selectionLineWidth;
      this._oContextTop.strokeStyle = this.selectionBorderColor;
      
      this._oContextTop.strokeRect(
        this._groupSelector.ex + STROKE_OFFSET - ((left > 0) ? 0 : aleft), 
        this._groupSelector.ey + STROKE_OFFSET - ((top > 0) ? 0 : atop),
        aleft,
        atop
      );
    },
    
    _findSelectedObjects: function (e) {
      
      var pointer = getCoords(e),
          target, 
          targetRegion,
          group = [],
          x1 = this._groupSelector.ex,
          y1 = this._groupSelector.ey,
          x2 = x1 + this._groupSelector.left,
          y2 = y1 + this._groupSelector.top,
          currentObject;
      
      var selectionX1Y1 = new Canvas.Point(Math.min(x1, x2), Math.min(y1, y2)),
          selectionX2Y2 = new Canvas.Point(Math.max(x1, x2), Math.max(y1, y2));
      
      for (var i=0, l=this._aObjects.length; i<l; ++i) {
        currentObject = this._aObjects[i];
        
        if (currentObject.intersectsWithRect(selectionX1Y1, selectionX2Y2) || 
            currentObject.isContainedWithinRect(selectionX1Y1, selectionX2Y2)) {
              
          currentObject.setActive(true);
          group.push(currentObject);
        }
      }
      // do not create group for 1 element only
      if (group.length === 1) {
        this.setActiveObject(group[0]);
        document.fire('object:selected', {
          target: group[0]
        });
      } 
      else if (group.length > 1) {
        var group = new Canvas.Group(group);
        this.setActiveGroup(group);
        group.saveCoords();
        document.fire('group:selected', { target: group });
      }
      this.renderAll();
    },
    
    /**
     * Adds an object to canvas and renders canvas
     * An object should be an instance of (or inherit from) Canvas.Object
     * @method add
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    add: function () {
      this._aObjects.push.apply(this._aObjects, arguments);
      this.renderAll();
      return this;
    },
    
    /**
     * Inserts an object to canvas at specified index and renders canvas. 
     * An object should be an instance of (or inherit from) Canvas.Object
     * @method insertAt
     * @param object {Object} Object to insert
     * @param index {Number} index to insert object at
     * @return {Canvas.Element} instance
     */
    insertAt: function (object, index) {
      this._aObjects.splice(index, 0, object);
      this.renderAll();
      return this;
    },
    
    /**
     * Returns an array of objects this instance has
     * @method getObjects
     * @return {Array}
     */
    getObjects: function () {
      return this._aObjects;
    },
    
    /**
     * Returns topmost canvas context
     * @method getContext
     * @return {CanvasRenderingContext2D}
     */
    getContext: function () {
      return this._oContextTop;
    },
    
    /**
     * Clears specified context of canvas element
     * @method clearContext
     * @param context {Object} ctx context to clear
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    clearContext: clearContext,
    
    /**
     * Clears all contexts of canvas element
     * @method clear
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    clear: function () {
      this._aObjects.length = 0;
      this.clearContext(this._oContextTop);
      this.clearContext(this._oContextContainer);
      this.renderAll();
      return this;
    },

    /**
     * Renders both the top canvas and the secondary container canvas.
     * @method renderAll
     * @param allOnTop {Boolean} optional Whether we want to force all images to be rendered on the top canvas
     * @return {Canvas.Element} instance
     * @chainable
     */ 
    renderAll: function (allOnTop) {
      
      // this sucks, but we can't use `getWidth`/`getHeight` here for perf. reasons
      var w = this._oConfig.width,
          h = this._oConfig.height;
          
      // when allOnTop is true all images are rendered in the top canvas.
      // This is used for actions like toDataUrl that needs to take some actions on a unique canvas.
      var containerCanvas = allOnTop ? this._oContextTop : this._oContextContainer;

      this.clearContext(this._oContextTop);

      if (containerCanvas !== this._oContextTop) {
        this.clearContext(containerCanvas);
      }
      
      if (allOnTop) {
        if (!CAN_SET_TRANSPARENT_FILL && this.backgroundColor === 'transparent') {
          var skip = true;
        }
        if (!skip) {
          containerCanvas.fillStyle = this.backgroundColor;
        }
        containerCanvas.fillRect(0, 0, w, h);
      }
      
      var length = this._aObjects.length,
          activeGroup = this.getActiveGroup();
      
      if (length) {  
        for (var i=0; i<length; ++i) {
          
          // only render objects which are not in the group (if one exists)
          if (!activeGroup || 
              (activeGroup && 
              !activeGroup.contains(this._aObjects[i]))) {
            this._draw(containerCanvas, this._aObjects[i]);
          }
        }
      }
      
      // delegate rendering to group selection (if one exists)
      if (activeGroup) {
        this._draw(this._oContextTop, activeGroup);
      }
      
      if (this.overlayImage) {
        this._oContextTop.drawImage(this.overlayImage, 0, 0);
      }
      
      if (this.afterRender) {
        this.afterRender();
      }
      
      return this;
    },

    /**
     * Method to render only the top canvas.
     * Also used to render the group selection box.
     * @method renderTop
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    renderTop: function () {
      
      this.clearContext(this._oContextTop);
      if (this.overlayImage) {
        this._oContextTop.drawImage(this.overlayImage, 0, 0);
      }
      
      // we render the top context - last object
      if (this._groupSelector) {
        this._drawSelection();
      }
      
      // delegate rendering to group selection if one exists
      // used for drawing selection borders/corners
      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        activeGroup.render(this._oContextTop);
      }
      
      if (this.afterRender) {
        this.afterRender();
      }
      
      return this;
    },
    
    /**
     * Applies one implementation of 'point inside polygon' algorithm
     * @method containsPoint
     * @param e { Event } event object
     * @param target { Canvas.Object } object to test against
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
      for (var i = this._aObjects.length; i--; ) {
        if (this.containsPoint(e, this._aObjects[i])) {
          target = this._aObjects[i];
          this.relatedTarget = target;
          break;
        }
      }
      return target;
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
        data = this.getElement().toDataURL('image/' + format);
      }
      return data;
    },
    
    /**
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
      this._oContextTop.scale(multiplier, multiplier);
      
      if (activeObject) {
        this.deactivateAll().renderAll();
      }
      var dataURL = this.toDataURL(format);

      this._oContextTop.scale( 1 / multiplier,  1 / multiplier);
      this.setWidth(origWidth).setHeight(origHeight);
      
      if (activeObject) {
        this.setActiveObject(activeObject);
      }
      this.renderAll();
      
      return dataURL;
    },
    
    /**
     * @method getPointer
     * @return {Object} object with "x" and "y" number values
     */
    getPointer: function (e) {
      var p = getCoords(e);
      return {
        x: p.x - this._offset.left,
        y: p.y - this._offset.top
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
     * Centers object horizontally
     * @method centerObjectH
     * @param {Canvas.Object} object Object to center
     * @return {Canvas.Element} thisArg
     */
    centerObjectH: function (object) {
      object.set('left', this.getCenter().left);
      this.renderAll();
      return this;
    },
    
    /**
     * Centers object horizontally with animation
     * @method fxCenterObjectH
     * @param {Canvas.Object} object
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    fxCenterObjectH: function (object) {
      var _this = this,
          fx = new APE.anim.Animation(),
          startValue = object.get('left'),
          endValue = _this.getCenter().left,
          step = endValue - startValue;

      fx.run = function (percent) {
        object.set('left', startValue + step * percent);
        _this.renderAll();
      };
      
      fx.onend = function () {
        object.setCoords();
      };

      fx.duration = FX_DURATION;
      fx.transition = APE.anim.Transitions[FX_TRANSITION];
      fx.start();
      
      return this;
    },
    
    /**
     * Centers object vertically
     * @method centerObjectH
     * @param object {Canvas.Object} Object to center
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    centerObjectV: function (object) {
      object.set('top', this.getCenter().top);
      this.renderAll();
      return this;
    },
    
    /**
     * Centers object vertically with animation
     * @method fxCenterObjectV
     * @param {Canvas.Object} object
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    fxCenterObjectV: function (object) {
      var _this = this,
          fx = new APE.anim.Animation(),
          startValue = object.get('top'),
          endValue = _this.getCenter().top,
          step = endValue - startValue;

      fx.run = function (percent) {
        object.set('top', startValue + step * percent).setCoords();
        _this.renderAll();
      };
      
      fx.onend = function () {
        object.setCoords();
      };

      fx.duration = FX_DURATION;
      fx.transition = APE.anim.Transitions[FX_TRANSITION];

      fx.start();
    },
    
    /**
     * @method straightenObject
     * @param {Canvas.Object} object Object to straighten
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    straightenObject: function (object) {
      object.straighten();
      this.renderAll();
      return this;
    },
    
    /**
     * @method fxStraightenObject
     * @param {Canvas.Object} object Object to straighten
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    fxStraightenObject: function (object) {
      object.fxStraighten({
        onChange: this.renderAll.bind(this)
      });
      return this;
    },
    
    /**
     * Returs JSON representation of canvas
     * @method toJSON
     * @return {String} json string
     */
    toJSON: function () {
      return Object.toJSON(this.toObject());
    },
    
    /**
     * Returs dataless JSON representation of canvas
     * @method toDatalessJSON
     * @return {String} json string
     */
    toDatalessJSON: function () {
      return Object.toJSON(this.toDatalessObject());
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
        objects: this._aObjects.map(function (instance){
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
      return this._aObjects.length === 0;
    },
    
    /**
     * Populates canvas with data from the specified JSON
     * JSON format must conform to the one of Canvas.Element#toJSON
     * @method loadFromJSON
     * @param json {String} json string
     * @param callback {Function} callback, invoked when json is parsed 
     *                            and corresponding objects (e.g. Canvas.Image) 
     *                            are initialized
     * @return {Canvas.Element} instance
     * @chainable
     */
    loadFromJSON: function (json, callback) {
      if (!json) return;
      
      var serialized = json.evalJSON();
      if (!serialized || (serialized && !serialized.objects)) return;
      
      this.clear();
      this._enlivenObjects(serialized.objects, function () {
        this.backgroundColor = serialized.background;
        if (callback) {
          callback();
        }
      }.bind(this));
      
      return this;
    },
    
    _enlivenObjects: function (objects, callback) {
      var numLoadedImages = 0,
          // get length of all images 
          numTotalImages = objects.findAll(function (o){
            return o.type === 'image';
          }).length;
      
      var _this = this;
      
      objects.each(function (o) {
        if (!o.type) {
          return;
        }
        switch (o.type) {
          case 'image':
          case 'font':
            Canvas[o.type.capitalize()].fromObject(o, function (o) {
              _this.add(o);
              if (++numLoadedImages === numTotalImages) {
                if (callback) callback();
              }
            });
            break;
          default:
            var klass = Canvas[o.type.capitalize().camelize()];
            if (klass && klass.fromObject) {
              _this.add(klass.fromObject(o));
            }
            break;
        }
      });
      
      if (numTotalImages === 0 && callback) {
        callback();
      }
    },
    
    loadFromDatalessJSON: function (json, callback) {
      
      if (!json) {
        return;
      }

      // serialize if it wasn't already
      var serialized = (typeof json === 'string')
        ? json.evalJSON()
        : json;
      
      if (!serialized || (serialized && !serialized.objects)) return;
      
      this.clear();

      this._enlivenDatalessObjects(serialized.objects, callback);
    },
    
    _enlivenDatalessObjects: function (objects, callback) {
      
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
      
      try {
        objects.each(function (obj, index) {
          
          var pathProp = obj.paths ? 'paths' : 'path';
          var path = obj[pathProp];

          delete obj[pathProp];
          
          if (typeof path !== 'string') {
            switch (obj.type) {
              case 'image':
              case 'text':
                Canvas[obj.type.capitalize()].fromObject(obj, function (o) {
                  onObjectLoaded(o);
                });
                break;
              default:
                var klass = Canvas[obj.type.capitalize().camelize()];
                if (klass && klass.fromObject) {
                  onObjectLoaded(klass.fromObject(obj));
                }
                break;
            }
          }
          else {
            if (obj.type === 'image') {
              _this.loadImageFromURL(path, function (image) {
                image.setSourcePath(path);

                Object.extend(image, obj);
                image.setAngle(obj.angle);

                onObjectLoaded(image, index);
              });
            }
            else if (obj.type === 'text') {
              
              obj.path = path;
              var object = Canvas.Text.fromObject(obj);
              window.__context = _this;
              var onscriptload = function () {
                // TODO (kangax): find out why Opera refuses to work without this timeout
                if (Prototype.Browser.Opera) {
                  setTimeout(function () {
                    onObjectLoaded(object, index);
                  }, 500);
                }
                else {
                  onObjectLoaded(object, index);
                }
              }
              
              Prototype.getScript(path, onscriptload);
            }
            else {
              _this.loadSVGFromURL(path, function (elements, options) {
                if (elements.length > 1) {
                  var object = new Canvas.PathGroup(elements, obj);
                }
                else {
                  var object = elements[0];
                }
                object.setSourcePath(path);

                // copy parameters from serialied json to object (left, top, scaleX, scaleY, etc.)
                // skip this step if an object is a PathGroup, since we already passed it options object before
                if (!(object instanceof Canvas.PathGroup)) {
                  Object.extend(object, obj);
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
        console.log(e.message);
      }
    },
    
    /**
     * Loads an image from URL
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
            callback(new Canvas.Image(imgEl));
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
          imgEl.onload = function () {
            imgEl.onload = null;
            
            _this._resizeImageToFit(imgEl);
            
            var oImg = new Canvas.Image(imgEl);
            callback(oImg);
          };
          
          imgEl.className = 'canvas-img-clone';
          imgEl.src = url;
          
          if (this.shouldCacheImages) {
            imgCache[url] = Element.identify(imgEl);
          }
          document.body.appendChild(imgEl);
        }
      }
    })(),
    
    loadSVGFromURL: function (url, callback) {
      
      var _this = this;
      
      url = url.replace(/^\n\s*/, '').replace(/\?.*$/, '').strip();
      
      this.cache.has(url, function (hasUrl) {
        if (hasUrl) {
          _this.cache.get(url, function (value) {
            var enlivedRecord = _this._enlivenCachedObject(value);
            callback(enlivedRecord.objects, enlivedRecord.options);
          });
        }
        else {
          new Ajax.Request(url, {
            method: 'get',
            onComplete: onComplete,
            onFailure: onFailure
          });
        }
      });
      
      function onComplete(r) {
        
        var xml = r.responseXML;
        if (!xml) return;
        
        var doc = xml.documentElement;
        if (!doc) return;
        
        Canvas.parseSVGDocument(doc, function (results, options) {
          _this.cache.set(url, {
            objects: results.invoke('toObject'),
            options: options
          });
          callback(results, options);
        });
      }
      
      function onFailure() {
        console.log('ERROR!');
      }
    },
    
    _enlivenCachedObject: function (cachedObject) {
      
      var objects = cachedObject.objects;
      var options = cachedObject.options;
      
      objects = objects.map(function (o) {
        return Canvas[o.type.capitalize()].fromObject(o);
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
      Canvas.util.removeFromArray(this._aObjects, object);
      this.renderAll();
      return object;
    },
    
    /**
     * Same as `remove` but animated
     * @method fxRemove
     * @param {Canvas.Object} object Object to remove
     * @param {Function} callback callback, invoked on effect completion
     * @return {Canvas.Element} thisArg
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
     * Moves an object to the bottom of the stack
     * @method sendToBack
     * @param object {Canvas.Object} Object to send to back
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    sendToBack: function (object) {
      Canvas.util.removeFromArray(this._aObjects, object);
      this._aObjects.unshift(object);
      return this.renderAll();
    },
    
    /**
     * Moves an object to the top of the stack
     * @method bringToFront
     * @param object {Canvas.Object} Object to send
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    bringToFront: function (object) {
      Canvas.util.removeFromArray(this._aObjects, object);
      this._aObjects.push(object);
      return this.renderAll();
    },
    
    /**
     * Moves an object one level down in stack
     * @method sendBackwards
     * @param object {Canvas.Object} Object to send
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    sendBackwards: function (object) {
      var idx = this._aObjects.indexOf(object),
          nextIntersectingIdx = idx;
      
      // if object is not on the bottom of stack
      if (idx !== 0) {
        
        // traverse down the stack looking for the nearest intersecting object
        for (var i=idx-1; i>=0; --i) {
          if (object.intersectsWithObject(this._aObjects[i])) {
            nextIntersectingIdx = i;
            break;
          }
        }
        Canvas.util.removeFromArray(this._aObjects, object);
        this._aObjects.splice(nextIntersectingIdx, 0, object);
      }
      return this.renderAll();
    },
    
    /**
     * Moves an object one level up in stack
     * @method sendForward
     * @param object {Canvas.Object} Object to send
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    bringForward: function (object) {
      var objects = this.getObjects(),
          idx = objects.indexOf(object),
          nextIntersectingIdx = idx;

      
      // if object is not on top of stack (last item in an array)
      if (idx !== objects.length-1) {
        
        // traverse up the stack looking for the nearest intersecting object
        for (var i=idx+1, l=this._aObjects.length; i<l; ++i) {
          if (object.intersectsWithObject(objects[i])) {
            nextIntersectingIdx = i;
            break;
          }
        }
        Canvas.util.removeFromArray(objects, object);
        objects.splice(nextIntersectingIdx, 0, object);
      }
      this.renderAll();
    },
    
    /**
     * Sets given object as active
     * @method setActiveObject
     * @param object {Canvas.Object} Object to set as an active one
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    setActiveObject: function (object) {
      if (this._activeObject) {
        this._activeObject.setActive(false);
      }
      this._activeObject = object;
      object.setActive(true);
      
      this.renderAll();
      
      document.fire('object:selected', { target: object });
      return this;
    },
    
    /**
     * Returns currently active object
     * @method getActiveObject
     * @return {Canvas.Object} active object
     */
    getActiveObject: function () {
      return this._activeObject;
    },
    
    /**
     * Removes an active object
     * @method removeActiveObject
     * @return {Canvas.Element} thisArg
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
     * Sets current group to a speicified one
     * @method setActiveGroup
     * @param group {Canvas.Group} group to set as a current one 
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    setActiveGroup: function (group) {
      this._activeGroup = group;
      return this;
    },
    
    /**
     * Returns current group
     * @method getActiveGroup
     * @return {Canvas.Group} Current group
     */
    getActiveGroup: function () {
      return this._activeGroup;
    },
    
    /**
     * Removes current group
     * @method removeActiveGroup
     * @return {Canvas.Element} thisArg
     */
    removeActiveGroup: function () {
      var g = this.getActiveGroup();
      if (g) {
        g.destroy();
      }
      return this.setActiveGroup(null);
    },
    
    /**
     * @method item
     * @param {Number} index
     * @return {Canvas.Object}
     */
    item: function (index) {
      return this.getObjects()[index];
    },
    
    /**
     * Deactivates all objects by calling their setActive(false)
     * @method deactivateAll
     * @return {Canvas.Element} thisArg
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
      return this.getObjects().inject(0, function (memo, current) {
        memo += current.complexity ? current.complexity() : 0;
        return memo;
      });
    },
    
    /**
     * Clears a canvas element and removes all event handlers.
     * @method dispose
     * @return {Canvas.Element} thisArg
     * @chainable
     */
    dispose: function () {
      this.clear();
      Event.stopObserving(this.getElement(), 'mousedown', this._onMouseDown);
      Event.stopObserving(document, 'mouseup', this._onMouseUp);
      Event.stopObserving(document, 'mousemove', this._onMouseMove);
      Event.stopObserving(window, 'resize', this._onResize);
      return this;
    },
    
    /**
     * @method clone
     * @param {Object} callback OPTIONAL expects `onBeforeClone` and `onAfterClone` functions
     * @return {Canvas.Element} instance clone
     */
    clone: function (callback) {
      var el = document.createElement('canvas');
      el.width = this.getWidth();
      el.height = this.getHeight();
          
      // cache
      var clone = this.__clone || (this.__clone = new Canvas.Element(el));
      
      return clone.loadFromJSON(this.toJSON(), function () {
        if (callback) {
          callback(clone);
        }
      });
    },
    
    _toDataURL: function (format, callback) {
      this.clone(function (clone) {
        callback(clone.toDataURL(format));
      });
    },
    
    _toDataURLWithMultiplier: function (format, multiplier, callback) {
      this.clone(function (clone) {
        callback(clone.toDataURLWithMultiplier(format, multiplier));
      });
    },
    
    _resizeImageToFit: function (imgEl) {
      
      var widthScaleFactor = 1, //this.CANVAS_WIDTH / this.CANVAS_PRINT_WIDTH,
          heightScaleFactor = 1, //this.CANVAS_HEIGHT / this.CANVAS_PRINT_HEIGHT,
          imageWidth = imgEl.width || imgEl.offsetWidth,
          imageHeight = imgEl.height || imgEl.offsetHeight;
      
      
      // scale image down so that it has original dimensions when printed in large resolution
      if (imageWidth && imageHeight) {
        imgEl.width = imageWidth * widthScaleFactor;
        imgEl.height = imageHeight * heightScaleFactor;
      }
    },
    
    /* stubs */
    cache: {
      has: function (name, callback){ callback(false) },
      get: function () { },
      set: function () { }
    }
  });
  
  /**
   * Returns a string representation of an instance
   * @method toString
   * @return {String} string representation of an instance
   */
   // Assign explicitly since `Object.extend` doesn't take care of DontEnum bug yet
  Canvas.Element.prototype.toString = function () {
    return '#<Canvas.Element (' + this.complexity() + '): '+
           '{ objects: ' + this.getObjects().length + ' }>';
  };
  
  Object.extend(Canvas.Element, {
    
    /**
     * @property EMPTY_JSON
     */
    EMPTY_JSON: '{"objects": [], "background": "white"}',
    
    /**
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
           index, average;

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
     * @method supports
     * @param methodName {String} method to check support for
     * @return {Boolean | null} `true` if method is supported (or at least exists), 
     * `null` if canvas element or context can not be initialized
     */
    supports: function (methodName) {
      var el = document.createElement('canvas');
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
})();