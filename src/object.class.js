(function(global) {

  "use strict";

  var fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend,
      toFixed = fabric.util.toFixed,
      capitalize = fabric.util.string.capitalize,
      degreesToRadians = fabric.util.degreesToRadians;

  if (fabric.Object) {
    return;
  }

  var Image = global.Image;
  try {
    var NodeImage = (typeof require !== 'undefined') && require('canvas').Image;
    if (NodeImage) {
      Image = NodeImage;
    }
  }
  catch(err) {
    fabric.log(err);
  }

  /**
   * Root object class from which all 2d shape classes inherit from
   * @class Object
   * @memberOf fabric
   */
  fabric.Object = fabric.util.createClass(/** @scope fabric.Object.prototype */ {

    /**
     * Type of an object (rect, circle, path, etc.)
     * @property
     * @type String
     */
    type:                     'object',

    /**
     * Horizontal origin of transformation of an object (one of "left", "right", "center")
     * @property
     * @type String
     */
    originX:                  'center',

    /**
     * Vertical origin of transformation of an object (one of "top", "bottom", "center")
     * @property
     * @type String
     */
    originY:                  'center',

    /**
     * Top position of an object
     * @property
     * @type Number
     */
    top:                      0,

    /**
     * Left position of an object
     * @property
     * @type Number
     */
    left:                     0,

    /**
     * Object width
     * @property
     * @type Number
     */
    width:                    0,

    /**
     * Object height
     * @property
     * @type Number
     */
    height:                   0,

    /**
     * Object scale factor (horizontal)
     * @property
     * @type Number
     */
    scaleX:                   1,

    /**
     * Object scale factor (vertical)
     * @property
     * @type Number
     */
    scaleY:                   1,

    /**
     * When true, an object is rendered as flipped horizontally
     * @property
     * @type Boolean
     */
    flipX:                    false,

    /**
     * When true, an object is rendered as flipped vertically
     * @property
     * @type Boolean
     */
    flipY:                    false,

    /**
     * Opacity of an object
     * @property
     * @type Number
     */
    opacity:                  1,

    /**
     * Angle of rotation of an object (in degrees)
     * @property
     * @type Number
     */
    angle:                    0,

    /**
     * Size of object's corners (in pixels)
     * @property
     * @type Number
     */
    cornerSize:               12,

    /**
     * When true, object's corners are rendered as transparent inside (i.e. stroke instead of fill)
     * @property
     * @type Boolean
     */
    transparentCorners:       true,

    /**
     * Padding between object and its borders (in pixels)
     * @property
     * @type Number
     */
    padding:                  0,

    /**
     * Border color of an object (when it's active)
     * @property
     * @type String
     */
    borderColor:              'rgba(102,153,255,0.75)',

    /**
     * Corner color of an object (when it's active)
     * @property
     * @type String
     */
    cornerColor:              'rgba(102,153,255,0.5)',

    /**
     * Color of object's fill
     * @property
     * @type String
     */
    fill:                     'rgb(0,0,0)',

    /**
     * Fill rule used to fill an object
     * @property
     * @type String
     */
    fillRule:                 'source-over',

    /**
     * Overlay fill (takes precedence over fill value)
     * @property
     * @type String
     */
    overlayFill:              null,

    /**
     * When `true`, an object is rendered via stroke and this property specifies its color
     * @property
     * @type String
     */
    stroke:                   null,

    /**
     * Width of a stroke used to render this object
     * @property
     * @type Number
     */
    strokeWidth:              1,

    /**
     * Array specifying dash pattern of an object's stroke
     * @property
     * @type Array
     */
    strokeDashArray:          null,

    /**
     * Shadow object representing shadow of this shape
     * @property
     * @type fabric.Shadow
     */
    shadow:                   null,

    /**
     * Border opacity when object is active and moving
     * @property
     * @type Number
     */
    borderOpacityWhenMoving:  0.4,

    /**
     * Border scale factor
     * @property
     * @type Number
     */
    borderScaleFactor:        1,

    /**
     * Transform matrix (similar to SVG's transform matrix)
     * @property
     * @type Array
     */
    transformMatrix:          null,

    /**
     * Minimum allowed scale value of an object
     * @property
     * @type Number
     */
    minScaleLimit:            0.01,

    /**
     * When set to `false`, an object can not be selected for modification (using either point-click-based or group-based selection)
     * @property
     * @type Boolean
     */
    selectable:               true,

    /**
     * When set to `false`, an object is not rendered on canvas
     * @property
     * @type Boolean
     */
    visible:                  true,

    /**
     * When set to `false`, object's controls are not displayed and can not be used to manipulate object
     * @property
     * @type Boolean
     */
    hasControls:              true,

    /**
     * When set to `false`, object's borders are not rendered
     * @property
     * @type Boolean
     */
    hasBorders:               true,

    /**
     * When set to `false`, object's rotating point will not be visible or selectable
     * @property
     * @type Boolean
     */
    hasRotatingPoint:         true,

    /**
     * Offset for object's rotating point (when enabled via `hasRotatingPoint`)
     * @property
     * @type Number
     */
    rotatingPointOffset:      40,

    /**
     * When set to `true`, objects are "found" on canvas on per-pixel basis rather than according to bounding box
     * @property
     * @type Boolean
     */
    perPixelTargetFind:       false,

    /**
     * When `false`, default object's values are not included in its serialization
     * @property
     * @type Boolean
     */
    includeDefaultValues:     true,

    /**
     * Function that determines clipping of an object (context is passed as a first argument)
     * @property
     * @type Function
     */
    clipTo:                   null,

    /**
     * List of properties to consider when checking if state of an object is changed (fabric.Object#hasStateChanged);
     * as well as for history (undo/redo) purposes
     * @property
     * @type Array
     */
    stateProperties:  (
      'top left width height scaleX scaleY flipX flipY ' +
      'angle opacity cornerSize fill overlayFill originX originY ' +
      'stroke strokeWidth strokeDashArray fillRule ' +
      'borderScaleFactor transformMatrix selectable shadow visible'
    ).split(' '),

    /**
     * Constructor
     * @method initialize
     * @param {Object} [options] Options object
     */
    initialize: function(options) {
      if (options) {
        this.setOptions(options);
      }
    },

    /**
     * @private
     * @method _initGradient
     */
    _initGradient: function(options) {
      if (options.fill && options.fill.colorStops && !(options.fill instanceof fabric.Gradient)) {
        this.set('fill', new fabric.Gradient(options.fill));
      }
    },

    /**
     * @private
     * @method _initPattern
     */
    _initPattern: function(options) {
      if (options.fill && options.fill.source && !(options.fill instanceof fabric.Pattern)) {
        this.set('fill', new fabric.Pattern(options.fill));
      }
      if (options.stroke && options.stroke.source && !(options.stroke instanceof fabric.Pattern)) {
        this.set('stroke', new fabric.Pattern(options.stroke));
      }
    },

    /**
     * @private
     * @method _initShadow
     */
    _initShadow: function(options) {
      if (options.shadow && !(options.shadow instanceof fabric.Shadow)) {
        this.setShadow(options.shadow);
      }
    },

    /**
     * Sets object's properties from options
     * @method setOptions
     * @param {Object} [options]
     */
    setOptions: function(options) {
      for (var prop in options) {
        this.set(prop, options[prop]);
      }
      this._initGradient(options);
      this._initPattern(options);
      this._initShadow(options);
    },

    /**
     * Transforms context when rendering an object
     * @method transform
     * @param {CanvasRenderingContext2D} ctx Context
     */
    transform: function(ctx) {
      ctx.globalAlpha = this.opacity;

      var center = this.getCenterPoint();
      ctx.translate(center.x, center.y);
      ctx.rotate(degreesToRadians(this.angle));
      ctx.scale(
        this.scaleX * (this.flipX ? -1 : 1),
        this.scaleY * (this.flipY ? -1 : 1)
      );
    },

    /**
     * Returns an object representation of an instance
     * @method toObject
     * @param {Array} propertiesToInclude
     * @return {Object} object representation of an instance
     */
    toObject: function(propertiesToInclude) {

      var NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS;

      var object = {
        type:               this.type,
        originX:            this.originX,
        originY:            this.originY,
        left:               toFixed(this.left, NUM_FRACTION_DIGITS),
        top:                toFixed(this.top, NUM_FRACTION_DIGITS),
        width:              toFixed(this.width, NUM_FRACTION_DIGITS),
        height:             toFixed(this.height, NUM_FRACTION_DIGITS),
        fill:               (this.fill && this.fill.toObject) ? this.fill.toObject() : this.fill,
        overlayFill:        this.overlayFill,
        stroke:             (this.stroke && this.stroke.toObject) ? this.stroke.toObject() : this.stroke,
        strokeWidth:        this.strokeWidth,
        strokeDashArray:    this.strokeDashArray,
        scaleX:             toFixed(this.scaleX, NUM_FRACTION_DIGITS),
        scaleY:             toFixed(this.scaleY, NUM_FRACTION_DIGITS),
        angle:              toFixed(this.getAngle(), NUM_FRACTION_DIGITS),
        flipX:              this.flipX,
        flipY:              this.flipY,
        opacity:            toFixed(this.opacity, NUM_FRACTION_DIGITS),
        selectable:         this.selectable,
        hasControls:        this.hasControls,
        hasBorders:         this.hasBorders,
        hasRotatingPoint:   this.hasRotatingPoint,
        transparentCorners: this.transparentCorners,
        perPixelTargetFind: this.perPixelTargetFind,
        shadow:             (this.shadow && this.shadow.toObject) ? this.shadow.toObject() : this.shadow,
        visible:            this.visible
      };

      if (!this.includeDefaultValues) {
        object = this._removeDefaultValues(object);
      }
      fabric.util.populateWithProperties(this, object, propertiesToInclude);

      return object;
    },

    /**
     * Returns (dataless) object representation of an instance
     * @method toDatalessObject
     * @param {Array} [propertiesToInclude]
     * @return {Object} object representation of an instance
     */
    toDatalessObject: function(propertiesToInclude) {
      // will be overwritten by subclasses
      return this.toObject(propertiesToInclude);
    },

    /**
     * Returns styles-string for svg-export
     * @method getSvgStyles
     * @return {String}
     */
    getSvgStyles: function() {
      return [
        "stroke: ", (this.stroke ? this.stroke : 'none'), "; ",
        "stroke-width: ", (this.strokeWidth ? this.strokeWidth : '0'), "; ",
        "stroke-dasharray: ", (this.strokeDashArray ? this.strokeDashArray.join(' ') : "; "),
        "fill: ", (this.fill ? (this.fill && this.fill.toLive ? 'url(#SVGID_' + this.fill.id + ')' : this.fill) : 'none'), "; ",
        "opacity: ", (this.opacity ? this.opacity : '1'), ";",
        (this.visible ? '' : " visibility: hidden;")
      ].join("");
    },

    /**
     * Returns transform-string for svg-export
     * @method getSvgTransform
     * @return {String}
     */
    getSvgTransform: function() {
      var angle = this.getAngle();
      var center = this.getCenterPoint();

      var NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS;

      var translatePart = "translate(" +
                            toFixed(center.x, NUM_FRACTION_DIGITS) +
                            " " +
                            toFixed(center.y, NUM_FRACTION_DIGITS) +
                          ")";

      var anglePart = angle !== 0
        ? (" rotate(" + toFixed(angle, NUM_FRACTION_DIGITS) + ")")
        : '';

      var scalePart = (this.scaleX === 1 && this.scaleY === 1)
        ? '' :
        (" scale(" +
          toFixed(this.scaleX, NUM_FRACTION_DIGITS) +
          " " +
          toFixed(this.scaleY, NUM_FRACTION_DIGITS) +
        ")");

      var flipXPart = this.flipX ? "matrix(-1 0 0 1 0 0) " : "";
      var flipYPart = this.flipY ? "matrix(1 0 0 -1 0 0)" : "";

      return [ translatePart, anglePart, scalePart, flipXPart, flipYPart ].join('');
    },

    /**
     * @private
     * @method _removeDefaultValues
     */
    _removeDefaultValues: function(object) {
      var defaultOptions = fabric.Object.prototype.options;
      if (defaultOptions) {
        this.stateProperties.forEach(function(prop) {
          if (object[prop] === defaultOptions[prop]) {
            delete object[prop];
          }
        });
      }
      return object;
    },

    /**
     * Returns true if an object is in its active state
     * @return {Boolean} true if an object is in its active state
     */
    isActive: function() {
      return !!this.active;
    },

    /**
     * Sets state of an object - `true` makes it active, `false` - inactive
     * @param {Boolean} active
     * @return {fabric.Object} thisArg
     * @chainable
     */
    setActive: function(active) {
      this.active = !!active;
      return this;
    },

    /**
     * Returns a string representation of an instance
     * @return {String}
     */
    toString: function() {
      return "#<fabric." + capitalize(this.type) + ">";
    },

    /**
     * Basic getter
     * @method get
     * @param {String} property
     * @return {Any} value of a property
     */
    get: function(property) {
      return this[property];
    },

    /**
     * Sets property to a given value
     * @method set
     * @param {String} name
     * @param {Object|Function} value (if function, the value is passed into it and its return value is used as a new one)
     * @return {fabric.Object} thisArg
     * @chainable
     */
    set: function(key, value) {
      if (typeof key === 'object') {
        for (var prop in key) {
          this._set(prop, key[prop]);
        }
      }
      else {
        if (typeof value === 'function') {
          this._set(key, value(this.get(key)));
        }
        else {
          this._set(key, value);
        }
      }
      return this;
    },

    /**
     * @private
     * @method _set
     * @param key
     * @param value
     */
    _set: function(key, value) {
      var shouldConstrainValue = (key === 'scaleX' || key === 'scaleY');

      if (shouldConstrainValue) {
        value = this._constrainScale(value);
      }
      if (key === 'scaleX' && value < 0) {
        this.flipX = !this.flipX;
        value *= -1;
      }
      else if (key === 'scaleY' && value < 0) {
        this.flipY = !this.flipY;
        value *= -1;
      }
      else if (key === 'width' || key === 'height') {
        this.minScaleLimit = toFixed(Math.min(0.1, 1/Math.max(this.width, this.height)), 2);
      }

      this[key] = value;

      return this;
    },

    /**
     * Toggles specified property from `true` to `false` or from `false` to `true`
     * @method toggle
     * @param {String} property property to toggle
     * @return {fabric.Object} thisArg
     * @chainable
     */
    toggle: function(property) {
      var value = this.get(property);
      if (typeof value === 'boolean') {
        this.set(property, !value);
      }
      return this;
    },

    /**
     * Sets sourcePath of an object
     * @method setSourcePath
     * @param {String} value
     * @return {fabric.Object} thisArg
     * @chainable
     */
    setSourcePath: function(value) {
      this.sourcePath = value;
      return this;
    },

    /**
     * Renders an object on a specified context
     * @method render
     * @param {CanvasRenderingContext2D} ctx context to render on
     * @param {Boolean} noTransform
     */
    render: function(ctx, noTransform) {

      // do not render if width/height are zeros or object is not visible
      if (this.width === 0 || this.height === 0 || !this.visible) return;

      ctx.save();

      var m = this.transformMatrix;
      if (m && !this.group) {
        ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
      }

      if (!noTransform) {
        this.transform(ctx);
      }

      if (this.stroke || this.strokeDashArray) {
        ctx.lineWidth = this.strokeWidth;
        if (this.stroke && this.stroke.toLive) {
          ctx.strokeStyle = this.stroke.toLive(ctx);
        }
        else {
          ctx.strokeStyle = this.stroke;
        }
      }

      if (this.overlayFill) {
        ctx.fillStyle = this.overlayFill;
      }
      else if (this.fill) {
        ctx.fillStyle = this.fill.toLive
          ? this.fill.toLive(ctx)
          : this.fill;
      }

      if (m && this.group) {
        ctx.translate(-this.group.width/2, -this.group.height/2);
        ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
      }

      this._setShadow(ctx);
      this.clipTo && fabric.util.clipContext(this, ctx);
      this._render(ctx, noTransform);
      this.clipTo && ctx.restore();
      this._removeShadow(ctx);

      if (this.active && !noTransform) {
        this.drawBorders(ctx);
        this.drawControls(ctx);
      }
      ctx.restore();
    },

    /**
     * @private
     * @method _setShadow
     */
    _setShadow: function(ctx) {
      if (!this.shadow) return;

      ctx.shadowColor = this.shadow.color;
      ctx.shadowBlur = this.shadow.blur;
      ctx.shadowOffsetX = this.shadow.offsetX;
      ctx.shadowOffsetY = this.shadow.offsetY;
    },

    /**
     * @private
     * @method _removeShadow
     */
    _removeShadow: function(ctx) {
      ctx.shadowColor = '';
      ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
    },

    /**
     * Clones an instance
     * @method clone
     * @param {Function} callback Callback is invoked with a clone as a first argument
     * @param {Array} propertiesToInclude
     * @return {fabric.Object} clone of an instance
     */
    clone: function(callback, propertiesToInclude) {
      if (this.constructor.fromObject) {
        return this.constructor.fromObject(this.toObject(propertiesToInclude), callback);
      }
      return new fabric.Object(this.toObject(propertiesToInclude));
    },

    /**
     * Creates an instance of fabric.Image out of an object
     * @method cloneAsImage
     * @param callback {Function} callback, invoked with an instance as a first argument
     * @return {fabric.Object} thisArg
     * @chainable
     */
    cloneAsImage: function(callback) {
      if (fabric.Image) {
        var i = new Image();

        /** @ignore */
        i.onload = function() {
          if (callback) {
            callback(new fabric.Image(i), orig);
          }
          i = i.onload = null;
        };

        var orig = {
          angle: this.getAngle(),
          flipX: this.getFlipX(),
          flipY: this.getFlipY()
        };

        // normalize angle
        this.set({ angle: 0, flipX: false, flipY: false });
        this.toDataURL(function(dataURL) {
          i.src = dataURL;
        });
      }
      return this;
    },

    /**
     * Converts an object into a data-url-like string
     * @method toDataURL
     * @param callback {Function} callback that recieves resulting data-url string
     */
    toDataURL: function(callback) {
      var el = fabric.util.createCanvasElement();

      el.width = this.getBoundingRectWidth();
      el.height = this.getBoundingRectHeight();

      fabric.util.wrapElement(el, 'div');

      var canvas = new fabric.Canvas(el);
      canvas.backgroundColor = 'transparent';
      canvas.renderAll();

      if (this.constructor.async) {
        this.clone(proceed);
      }
      else {
        proceed(this.clone());
      }

      function proceed(clone) {
        clone.left = el.width / 2;
        clone.top = el.height / 2;

        clone.setActive(false);

        canvas.add(clone);
        var data = canvas.toDataURL();

        canvas.dispose();
        canvas = clone = null;

        callback && callback(data);
      }
    },

    /**
     * Returns true if object state (one of its state properties) was changed
     * @method hasStateChanged
     * @return {Boolean} true if instance' state has changed
     */
    hasStateChanged: function() {
      return this.stateProperties.some(function(prop) {
        return this[prop] !== this.originalState[prop];
      }, this);
    },

    /**
     * Saves state of an object
     * @method saveState
     * @param {Object} [options] Object with additional `stateProperties` array to include when saving state
     * @return {fabric.Object} thisArg
     * @chainable
     */
    saveState: function(options) {
      this.stateProperties.forEach(function(prop) {
        this.originalState[prop] = this.get(prop);
      }, this);

      if (options && options.stateProperties) {
        options.stateProperties.forEach(function(prop) {
          this.originalState[prop] = this.get(prop);
        }, this);
      }

      return this;
    },

    /**
     * Setups state of an object
     * @method setupState
     */
    setupState: function() {
      this.originalState = { };
      this.saveState();
    },

    /**
     * Returns true if specified type is identical to the type of an instance
     * @method isType
     * @param type {String} type to check against
     * @return {Boolean}
     */
    isType: function(type) {
      return this.type === type;
    },

    /**
     * Makes object's color grayscale
     * @method toGrayscale
     * @return {fabric.Object} thisArg
     */
    toGrayscale: function() {
      var fillValue = this.get('fill');
      if (fillValue) {
        this.set('overlayFill', new fabric.Color(fillValue).toGrayscale().toRgb());
      }
      return this;
    },

    /**
     * Returns complexity of an instance
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return 0;
    },

    /**
     * Returns a JSON representation of an instance
     * @method toJSON
     * @param {Array} propertiesToInclude Any properties that you might want to additionally include in the output
     * @return {String} json
     */
    toJSON: function(propertiesToInclude) {
      // delegate, not alias
      return this.toObject(propertiesToInclude);
    },

    /**
     * Sets gradient (fill or stroke) of an object
     * @method setGradient
     * @param {String} property Property name 'stroke' or 'fill'
     * @param {Object} [options] Options object
     */
    setGradient: function(property, options) {
      options || (options = { });

      var gradient = {colorStops: []};

      gradient.type = options.type || (options.r1 || options.r2 ? 'radial' : 'linear');
      gradient.coords = {
        x1: options.x1,
        y1: options.y1,
        x2: options.x2,
        y2: options.y2
      };

      if (options.r1 || options.r2) {
        gradient.coords.r1 = options.r1;
        gradient.coords.r2 = options.r2;
      }

      for (var position in options.colorStops) {
        var color = new fabric.Color(options.colorStops[position]);
        gradient.colorStops.push({offset: position, color: color.toRgb(), opacity: color.getAlpha()});
      }

      this.set(property, fabric.Gradient.forObject(this, gradient));
    },

    /**
     * Sets pattern fill of an object
     * @method setPatternFill
     * @param {Object} options
     */
    setPatternFill: function(options) {
      this.set('fill', new fabric.Pattern(options));
    },

    /**
     * Sets shadow of an object
     * @method setShadow
     * @param {Object} options
     */
    setShadow: function(options) {
      this.set('shadow', new fabric.Shadow(options));
    },

    /**
     * Animates object's properties
     * @method animate
     *
     * As object — multiple properties
     *
     * object.animate({ left: ..., top: ... });
     * object.animate({ left: ..., top: ... }, { duration: ... });
     *
     * As string — one property
     *
     * object.animate('left', ...);
     * object.animate('left', { duration: ... });
     *
     */
    animate: function() {
      if (arguments[0] && typeof arguments[0] === 'object') {
        for (var prop in arguments[0]) {
          this._animate(prop, arguments[0][prop], arguments[1]);
        }
      }
      else {
        this._animate.apply(this, arguments);
      }
      return this;
    },

    /**
     * @private
     * @method _animate
     */
    _animate: function(property, to, options) {
      var obj = this, propPair;

      to = to.toString();

      if (!options) {
        options = { };
      }
      else {
        options = fabric.util.object.clone(options);
      }

      if (~property.indexOf('.')) {
        propPair = property.split('.');
      }

      var currentValue = propPair
        ? this.get(propPair[0])[propPair[1]]
        : this.get(property);

      if (!('from' in options)) {
        options.from = currentValue;
      }

      if (~to.indexOf('=')) {
        to = currentValue + parseFloat(to.replace('=', ''));
      }
      else {
        to = parseFloat(to);
      }

      fabric.util.animate({
        startValue: options.from,
        endValue: to,
        byValue: options.by,
        easing: options.easing,
        duration: options.duration,
        onChange: function(value) {
          if (propPair) {
            obj[propPair[0]][propPair[1]] = value;
          }
          else {
            obj.set(property, value);
          }
          options.onChange && options.onChange();
        },
        onComplete: function() {
          obj.setCoords();
          options.onComplete && options.onComplete();
        }
      });
    },

    /**
     * Centers object horizontally on canvas to which it was added last
     * @method centerH
     * @return {fabric.Object} thisArg
     */
    centerH: function () {
      this.canvas.centerObjectH(this);
      return this;
    },

    /**
     * Centers object vertically on canvas to which it was added last
     * @method centerV
     * @return {fabric.Object} thisArg
     * @chainable
     */
    centerV: function () {
      this.canvas.centerObjectV(this);
      return this;
    },

    /**
     * Centers object vertically and horizontally on canvas to which is was added last
     * @method center
     * @return {fabric.Object} thisArg
     * @chainable
     */
    center: function () {
      return this.centerH().centerV();
    },

    /**
     * Removes object from canvas to which it was added last
     * @method remove
     * @return {fabric.Object} thisArg
     * @chainable
     */
    remove: function() {
      return this.canvas.remove(this);
    },

    /**
     * Moves an object to the bottom of the stack of drawn objects
     * @method sendToBack
     * @return {fabric.Object} thisArg
     * @chainable
     */
    sendToBack: function() {
      this.canvas.sendToBack(this);
      return this;
    },

    /**
     * Moves an object to the top of the stack of drawn objects
     * @method bringToFront
     * @return {fabric.Object} thisArg
     * @chainable
     */
    bringToFront: function() {
      this.canvas.bringToFront(this);
      return this;
    },

    /**
     * Moves an object one level down in stack of drawn objects
     * @method sendBackwards
     * @return {fabric.Object} thisArg
     * @chainable
     */
    sendBackwards: function() {
      this.canvas.sendBackwards(this);
      return this;
    },

    /**
     * Moves an object one level up in stack of drawn objects
     * @method bringForward
     * @return {fabric.Object} thisArg
     * @chainable
     */
    bringForward: function() {
      this.canvas.bringForward(this);
      return this;
    }
  });

  fabric.util.createAccessors(fabric.Object);

  /**
   * Alias for {@link fabric.Object.prototype.setAngle}
   * @alias rotate -> setAngle
   */
  fabric.Object.prototype.rotate = fabric.Object.prototype.setAngle;

  extend(fabric.Object.prototype, fabric.Observable);

  /**
   * @static
   * @constant
   * @type Number
   */
  fabric.Object.NUM_FRACTION_DIGITS = 2;

  /**
   * @static
   * @type Number
   */
  fabric.Object.__uid = 0;

})(typeof exports !== 'undefined' ? exports : this);
