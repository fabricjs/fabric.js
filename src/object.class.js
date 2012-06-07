(function(global) {

  "use strict";

  var fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend,
      clone = fabric.util.object.clone,
      toFixed = fabric.util.toFixed,
      capitalize = fabric.util.string.capitalize,
      getPointer = fabric.util.getPointer,
      degreesToRadians = fabric.util.degreesToRadians,
      slice = Array.prototype.slice;

  if (fabric.Object) {
    return;
  }

  /**
   * @class Object
   * @memberOf fabric
   */
  fabric.Object = fabric.util.createClass(/** @scope fabric.Object.prototype */ {

    /**
     * Type of an object (rect, circle, path, etc)
     * @property
     * @type String
     */
    type:                       'object',

    /**
     * @property
     * @type Boolean
     */
    includeDefaultValues:       true,

    /**
     * @constant
     * @type Number
     */
    NUM_FRACTION_DIGITS:        2,

    /**
     * @constant
     * @type Number
     */
    MIN_SCALE_LIMIT:            0.1,

    /**
     * List of properties to consider when checking if state of an object is changed (fabric.Object#hasStateChanged);
     * as well as for history (undo/redo) purposes
     * @property
     * @type Array
     */
    stateProperties:  ('top left width height scaleX scaleY flipX flipY ' +
                      'theta angle opacity cornersize fill overlayFill stroke ' +
                      'strokeWidth fillRule borderScaleFactor transformMatrix ' +
                      'selectable').split(' '),

    top:                      0,
    left:                     0,
    width:                    0,
    height:                   0,
    scaleX:                   1,
    scaleY:                   1,
    flipX:                    false,
    flipY:                    false,
    theta:                    0,
    opacity:                  1,
    angle:                    0,
    cornersize:               12,
    padding:                  0,
    borderColor:              'rgba(102,153,255,0.75)',
    cornerColor:              'rgba(102,153,255,0.5)',
    fill:                     'rgb(0,0,0)',
    fillRule:                 'source-over',
    overlayFill:              null,
    stroke:                   null,
    strokeWidth:              1,
    borderOpacityWhenMoving:  0.4,
    borderScaleFactor:        1,
    transformMatrix:          null,

    /**
     * When set to `false`, an object can not be selected for modification (using either point-click-based or group-based selection)
     * @property
     * @type Boolean
     */
    selectable:               true,

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
    hasRotatingPoint:         false,

    /**
     * @method callSuper
     * @param {String} methodName
     */
    callSuper: function(methodName) {
      var fn = this.constructor.superclass.prototype[methodName];
      return (arguments.length > 1)
        ? fn.apply(this, slice.call(arguments, 1))
        : fn.call(this);
    },

    /**
     * Constructor
     * @method initialize
     * @param {Object} [options] Options object
     */
    initialize: function(options) {
      options && this.setOptions(options);
    },

    /**
     * @method setOptions
     * @param {Object} [options]
     */
    setOptions: function(options) {
      var i = this.stateProperties.length, prop;
      while (i--) {
        prop = this.stateProperties[i];
        if (prop in options) {
          this.set(prop, options[prop]);
        }
      }
    },

    /**
     * @method transform
     * @param {CanvasRenderingContext2D} ctx Context
     */
    transform: function(ctx) {
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.left, this.top);
      ctx.rotate(this.theta);
      ctx.scale(
        this.scaleX * (this.flipX ? -1 : 1),
        this.scaleY * (this.flipY ? -1 : 1)
      );
    },

    /**
     * Returns an object representation of an instance
     * @method toObject
     * @return {Object}
     */
    toObject: function() {

      var object = {
        type:             this.type,
        left:             toFixed(this.left, this.NUM_FRACTION_DIGITS),
        top:              toFixed(this.top, this.NUM_FRACTION_DIGITS),
        width:            toFixed(this.width, this.NUM_FRACTION_DIGITS),
        height:           toFixed(this.height, this.NUM_FRACTION_DIGITS),
        fill:             this.fill,
        overlayFill:      this.overlayFill,
        stroke:           this.stroke,
        strokeWidth:      this.strokeWidth,
        scaleX:           toFixed(this.scaleX, this.NUM_FRACTION_DIGITS),
        scaleY:           toFixed(this.scaleY, this.NUM_FRACTION_DIGITS),
        angle:            toFixed(this.getAngle(), this.NUM_FRACTION_DIGITS),
        flipX:            this.flipX,
        flipY:            this.flipY,
        opacity:          toFixed(this.opacity, this.NUM_FRACTION_DIGITS),
        selectable:       this.selectable,
        hasControls:      this.hasControls,
        hasBorders:       this.hasBorders,
        hasRotatingPoint: this.hasRotatingPoint
      };

      if (!this.includeDefaultValues) {
        object = this._removeDefaultValues(object);
      }

      return object;
    },

    /**
     * Returns (dataless) object representation of an instance
     * @method toDatalessObject
     */
    toDatalessObject: function() {
      // will be overwritten by subclasses
      return this.toObject();
    },

    /**
     * Returns styles-string for svg-export
     * @method getSvgStyles
     * @return {string}
     */
    getSvgStyles: function() {
      return [
        "stroke: ", (this.stroke ? this.stroke : 'none'), "; ",
        "stroke-width: ", (this.strokeWidth ? this.strokeWidth : '0'), "; ",
        "fill: ", (this.fill ? this.fill : 'none'), "; ",
        "opacity: ", (this.opacity ? this.opacity : '1'), ";"
      ].join("");
    },

    /**
     * Returns transform-string for svg-export
     * @method getSvgTransform
     * @return {string}
     */
    getSvgTransform: function() {
      var angle = this.getAngle();
      return [
        "translate(", toFixed(this.left, 2), " ", toFixed(this.top, 2), ")",
        angle !== 0 ? (" rotate(" + toFixed(angle, 2) + ")") : '',
        (this.scaleX === 1 && this.scaleY === 1) ? '' : (" scale(" + toFixed(this.scaleX, 2) + " " + toFixed(this.scaleY, 2) + ")")
      ].join('');
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
     * Basic setter
     * @param {Any} property
     * @param {Any} value
     * @return {fabric.Object} thisArg
     * @chainable
     */
    set: function(property, value) {
      var shouldConstrainValue = (property === 'scaleX' || property === 'scaleY') && value < this.MIN_SCALE_LIMIT;
      if (shouldConstrainValue) {
        value = this.MIN_SCALE_LIMIT;
      }
      if (typeof property == 'object') {
        for (var prop in property) {
          this.set(prop, property[prop]);
        }
      }
      else {
        if (property === 'angle') {
          this.setAngle(value);
        }
        else {
          this[property] = value;
        }
      }

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
     * Basic getter
     * @method get
     * @param {Any} property
     * @return {Any} value of a property
     */
    get: function(property) {
      return (property === 'angle')
        ? this.getAngle()
        : this[property];
    },

    /**
     * @method render
     * @param {CanvasRenderingContext2D} ctx context to render on
     * @param {Boolean} noTransform
     */
    render: function(ctx, noTransform) {

      // do not render if width or height are zeros
      if (this.width === 0 || this.height === 0) return;

      ctx.save();

      var m = this.transformMatrix;
      if (m) {
        ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
      }

      if (!noTransform) {
        this.transform(ctx);
      }

      if (this.stroke) {
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.stroke;
      }

      if (this.overlayFill) {
        ctx.fillStyle = this.overlayFill;
      }
      else if (this.fill) {
        ctx.fillStyle = this.fill;
      }

      // TODO: this breaks some shapes, need to look into it
      // if (this.group) {
        // ctx.translate(
        //    -this.group.width / 2 + this.width / 2,
        //    -this.group.height / 2 + this.height / 2
        // );
      // }
      this._render(ctx, noTransform);

      if (this.active && !noTransform) {
        this.drawBorders(ctx);
        this.hideCorners || this.drawCorners(ctx);
      }
      ctx.restore();
    },

    /**
     * Returns width of an object
     * @method getWidth
     * @return {Number} width value
     */
    getWidth: function() {
      return this.width * this.scaleX;
    },

    /**
     * Returns height of an object
     * @method getHeight
     * @return {Number} height value
     */
    getHeight: function() {
      return this.height * this.scaleY;
    },

    /**
     * Scales an object (equally by x and y)
     * @method scale
     * @param value {Number} scale factor
     * @return {fabric.Object} thisArg
     * @chainable
     */
    scale: function(value) {
      this.scaleX = value;
      this.scaleY = value;
      return this;
    },

    /**
     * Scales an object to a given width (scaling by x/y equally)
     * @method scaleToWidth
     * @param value {Number} new width value
     * @return {fabric.Object} thisArg
     * @chainable
     */
    scaleToWidth: function(value) {
      return this.scale(value / this.width);
    },

    /**
     * Scales an object to a given height (scaling by x/y equally)
     * @method scaleToHeight
     * @param value {Number} new height value
     * @return {fabric.Object} thisArg
     * @chainable
     */
    scaleToHeight: function(value) {
      return this.scale(value / this.height);
    },

    /**
     * Sets object opacity
     * @method setOpacity
     * @param value {Number} value 0-1
     * @return {fabric.Object} thisArg
     * @chainable
     */
    setOpacity: function(value) {
      this.set('opacity', value);
      return this;
    },

    /**
     * Returns object's angle value
     * @method getAngle
     * @return {Number} angle value
     */
    getAngle: function() {
      return this.theta * 180 / Math.PI;
    },

    /**
     * Sets object's angle
     * @method setAngle
     * @param value {Number} angle value
     * @return {Object} thisArg
     */
    setAngle: function(value) {
      this.theta = value / 180 * Math.PI;
      this.angle = value;
      return this;
    },

    /**
     * Sets corner position coordinates based on current angle, width and height.
     * @method setCoords
     * return {fabric.Object} thisArg
     * @chainable
     */
    setCoords: function() {

      this.currentWidth = this.width * this.scaleX;
      this.currentHeight = this.height * this.scaleY;

      this._hypotenuse = Math.sqrt(
        Math.pow(this.currentWidth / 2, 2) +
        Math.pow(this.currentHeight / 2, 2));

      this._angle = Math.atan(this.currentHeight / this.currentWidth);

      // offset added for rotate and scale actions
      var offsetX = Math.cos(this._angle + this.theta) * this._hypotenuse,
          offsetY = Math.sin(this._angle + this.theta) * this._hypotenuse,
          theta = this.theta,
          sinTh = Math.sin(theta),
          cosTh = Math.cos(theta);

      var tl = {
        x: this.left - offsetX,
        y: this.top - offsetY
      };
      var tr = {
        x: tl.x + (this.currentWidth * cosTh),
        y: tl.y + (this.currentWidth * sinTh)
      };
      var br = {
        x: tr.x - (this.currentHeight * sinTh),
        y: tr.y + (this.currentHeight * cosTh)
      };
      var bl = {
        x: tl.x - (this.currentHeight * sinTh),
        y: tl.y + (this.currentHeight * cosTh)
      };
      var ml = {
        x: tl.x - (this.currentHeight/2 * sinTh),
        y: tl.y + (this.currentHeight/2 * cosTh)
      };
      var mt = {
        x: tl.x + (this.currentWidth/2 * cosTh),
        y: tl.y + (this.currentWidth/2 * sinTh)
      };
      var mr = {
        x: tr.x - (this.currentHeight/2 * sinTh),
        y: tr.y + (this.currentHeight/2 * cosTh)
      };
      var mb = {
        x: bl.x + (this.currentWidth/2 * cosTh),
        y: bl.y + (this.currentWidth/2 * sinTh)
      };
      var mtr = {
        x: tl.x + (this.currentWidth/2 * cosTh),
        y: tl.y + (this.currentWidth/2 * sinTh)
      };
      var mbr = {
        x: tl.x + (this.currentWidth/2 * cosTh),
        y: tl.y + (this.currentWidth/2 * sinTh)
      };

      // debugging

      // setTimeout(function() {
      //         canvas.contextTop.fillStyle = 'green';
      //         canvas.contextTop.fillRect(mb.x, mb.y, 3, 3);
      //         canvas.contextTop.fillRect(bl.x, bl.y, 3, 3);
      //         canvas.contextTop.fillRect(br.x, br.y, 3, 3);
      //         canvas.contextTop.fillRect(tl.x, tl.y, 3, 3);
      //         canvas.contextTop.fillRect(tr.x, tr.y, 3, 3);
      //         canvas.contextTop.fillRect(ml.x, ml.y, 3, 3);
      //         canvas.contextTop.fillRect(mr.x, mr.y, 3, 3);
      //         canvas.contextTop.fillRect(mt.x, mt.y, 3, 3);
      //       }, 50);

      // clockwise
      this.oCoords = { tl: tl, tr: tr, br: br, bl: bl, ml: ml, mt: mt, mr: mr, mb: mb, mtr: mtr, mbr: mbr };

      // set coordinates of the draggable boxes in the corners used to scale/rotate the image
      this._setCornerCoords();

      return this;
    },

     /**
     * Returns width of an object's bounding rectangle
     * @method getBoundingRectWidth
     * @return {Number} width value
     */
    getBoundingRectWidth: function() {
      var xCoords = [this.oCoords.tl.x, this.oCoords.tr.x, this.oCoords.br.x, this.oCoords.bl.x];
      var minX = fabric.util.array.min(xCoords);
      var maxX = fabric.util.array.max(xCoords);
      return Math.abs(minX - maxX);
    },

    /**
     * Returns height of an object's bounding rectangle
     * @method getBoundingRectHeight
     * @return {Number} height value
     */
    getBoundingRectHeight: function() {
      var yCoords = [this.oCoords.tl.y, this.oCoords.tr.y, this.oCoords.br.y, this.oCoords.bl.y];
      var minY = fabric.util.array.min(yCoords);
      var maxY = fabric.util.array.max(yCoords);
      return Math.abs(minY - maxY);
    },

    /**
     * Draws borders of an object's bounding box.
     * Requires public properties: width, height
     * Requires public options: padding, borderColor
     * @method drawBorders
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @return {fabric.Object} thisArg
     * @chainable
     */
    drawBorders: function(ctx) {
      if (!this.hasBorders) return;

      var padding = this.padding,
          padding2 = padding * 2;

      ctx.save();

      ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
      ctx.strokeStyle = this.borderColor;

      var scaleX = 1 / (this.scaleX < this.MIN_SCALE_LIMIT ? this.MIN_SCALE_LIMIT : this.scaleX),
          scaleY = 1 / (this.scaleY < this.MIN_SCALE_LIMIT ? this.MIN_SCALE_LIMIT : this.scaleY);

      ctx.lineWidth = 1 / this.borderScaleFactor;

      ctx.scale(scaleX, scaleY);

      var w = this.getWidth(),
          h = this.getHeight();

      ctx.strokeRect(
        ~~(-(w / 2) - padding) + 0.5, // offset needed to make lines look sharper
        ~~(-(h / 2) - padding) + 0.5,
        ~~(w + padding2),
        ~~(h + padding2)
      );

      if (this.hasRotatingPoint && !this.hideCorners && !this.lockRotation) {
        var rotateHeight = (-h/2);
        var rotateWidth = (-w/2);

        ctx.beginPath();
        ctx.moveTo(0, rotateHeight);
        ctx.lineTo(0, rotateHeight - 40);
        ctx.closePath();
        ctx.stroke();
      }

      ctx.restore();
      return this;
    },

    /**
     * Draws corners of an object's bounding box.
     * Requires public properties: width, height, scaleX, scaleY
     * Requires public options: cornersize, padding
     * @method drawCorners
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @return {fabric.Object} thisArg
     * @chainable
     */
    drawCorners: function(ctx) {
      if (!this.hasControls) return;

      var size = this.cornersize,
          size2 = size / 2,
          padding = this.padding,
          left = -(this.width / 2),
          top = -(this.height / 2),
          _left,
          _top,
          sizeX = size / this.scaleX,
          sizeY = size / this.scaleY,
          scaleOffsetY = (padding + size2) / this.scaleY,
          scaleOffsetX = (padding + size2) / this.scaleX,
          scaleOffsetSizeX = (padding + size2 - size) / this.scaleX,
          scaleOffsetSizeY = (padding + size2 - size) / this.scaleY,
          height = this.height;

      ctx.save();

      ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
      ctx.fillStyle = this.cornerColor;

      // top-left
      _left = left - scaleOffsetX;
      _top = top - scaleOffsetY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      // top-right
      _left = left + this.width - scaleOffsetX;
      _top = top - scaleOffsetY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      // bottom-left
      _left = left - scaleOffsetX;
      _top = top + height + scaleOffsetSizeY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      // bottom-right
      _left = left + this.width + scaleOffsetSizeX;
      _top = top + height + scaleOffsetSizeY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      // middle-top
      _left = left + this.width/2 - scaleOffsetX;
      _top = top - scaleOffsetY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      // middle-bottom
      _left = left + this.width/2 - scaleOffsetX;
      _top = top + height + scaleOffsetSizeY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      // middle-right
      _left = left + this.width + scaleOffsetSizeX;
      _top = top + height/2 - scaleOffsetY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      // middle-left
      _left = left - scaleOffsetX;
      _top = top + height/2 - scaleOffsetY;
      ctx.fillRect(_left, _top, sizeX, sizeY);

      // middle-top-rotate
      if (this.hasRotatingPoint) {
        // _left = left + this.width/2;
        // _top = top - (45 / this.scaleY) + scaleOffsetY;

        // ctx.save();
        // ctx.beginPath();
        // ctx.arc(_left, _top, sizeX / 2, 0, Math.PI * 2, false);
        // ctx.fill();
        // ctx.restore();
        _left = left + this.width/2 - scaleOffsetX;
        _top = top - (45 / this.scaleY);
        ctx.fillRect(_left, _top, sizeX, sizeY);
      }

      ctx.restore();

      return this;
    },

    /**
     * Clones an instance
     * @method clone
     * @param {Object} options object
     * @return {fabric.Object} clone of an instance
     */
    clone: function(options) {
      if (this.constructor.fromObject) {
        return this.constructor.fromObject(this.toObject(), options);
      }
      return new fabric.Object(this.toObject());
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
          angle: this.get('angle'),
          flipX: this.get('flipX'),
          flipY: this.get('flipY')
        };

        // normalize angle
        this.set('angle', 0).set('flipX', false).set('flipY', false);
        this.toDataURL(function(dataURL) {
          i.src = dataURL;
        });
      }
      return this;
    },

    /**
     * Converts an object into a data-url-like string
     * @method toDataURL
     * @return {String} string of data
     */
    toDataURL: function(callback) {
      var el = fabric.document.createElement('canvas');
      if (!el.getContext && typeof G_vmlCanvasManager != 'undefined') {
        G_vmlCanvasManager.initElement(el);
      }

      this.setCoords();
      el.width  = this.getBoundingRectWidth();
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
        var data = canvas.toDataURL('png');

        canvas.dispose();
        canvas = clone = null;

        callback && callback(data);
      }
    },

    /**
     * @method hasStateChanged
     * @return {Boolean} true if instance' state has changed
     */
    hasStateChanged: function() {
      return this.stateProperties.some(function(prop) {
        return this[prop] !== this.originalState[prop];
      }, this);
    },

    /**
     * @method saveState
     * @return {fabric.Object} thisArg
     * @chainable
     */
    saveState: function() {
      this.stateProperties.forEach(function(prop) {
        this.originalState[prop] = this.get(prop);
      }, this);
      return this;
    },

    /**
     * @method setupState
     */
    setupState: function() {
      this.originalState = { };
      this.saveState();
    },

    /**
     * Returns true if object intersects with an area formed by 2 points
     * @method intersectsWithRect
     * @param {Object} selectionTL
     * @param {Object} selectionBR
     * @return {Boolean}
     */
    intersectsWithRect: function(selectionTL, selectionBR) {
      var oCoords = this.oCoords,
          tl = new fabric.Point(oCoords.tl.x, oCoords.tl.y),
          tr = new fabric.Point(oCoords.tr.x, oCoords.tr.y),
          bl = new fabric.Point(oCoords.bl.x, oCoords.bl.y),
          br = new fabric.Point(oCoords.br.x, oCoords.br.y);

      var intersection = fabric.Intersection.intersectPolygonRectangle(
        [tl, tr, br, bl],
        selectionTL,
        selectionBR
      );
      return (intersection.status === 'Intersection');
    },

    /**
     * Returns true if object intersects with another object
     * @method intersectsWithObject
     * @param {Object} other Object to test
     * @return {Boolean}
     */
    intersectsWithObject: function(other) {
      // extracts coords
      function getCoords(oCoords) {
        return {
          tl: new fabric.Point(oCoords.tl.x, oCoords.tl.y),
          tr: new fabric.Point(oCoords.tr.x, oCoords.tr.y),
          bl: new fabric.Point(oCoords.bl.x, oCoords.bl.y),
          br: new fabric.Point(oCoords.br.x, oCoords.br.y)
        }
      }
      var thisCoords = getCoords(this.oCoords),
          otherCoords = getCoords(other.oCoords);

      var intersection = fabric.Intersection.intersectPolygonPolygon(
        [thisCoords.tl, thisCoords.tr, thisCoords.br, thisCoords.bl],
        [otherCoords.tl, otherCoords.tr, otherCoords.br, otherCoords.bl]
      );

      return (intersection.status === 'Intersection');
    },

    /**
     * Returns true if object is fully contained within area of another object
     * @method isContainedWithinObject
     * @param {Object} other Object to test
     * @return {Boolean}
     */
    isContainedWithinObject: function(other) {
      return this.isContainedWithinRect(other.oCoords.tl, other.oCoords.br);
    },

    /**
     * Returns true if object is fully contained within area formed by 2 points
     * @method isContainedWithinRect
     * @param {Object} selectionTL
     * @param {Object} selectionBR
     * @return {Boolean}
     */
    isContainedWithinRect: function(selectionTL, selectionBR) {
      var oCoords = this.oCoords,
          tl = new fabric.Point(oCoords.tl.x, oCoords.tl.y),
          tr = new fabric.Point(oCoords.tr.x, oCoords.tr.y),
          bl = new fabric.Point(oCoords.bl.x, oCoords.bl.y),
          br = new fabric.Point(oCoords.br.x, oCoords.br.y);

      return tl.x > selectionTL.x
        && tr.x < selectionBR.x
        && tl.y > selectionTL.y
        && bl.y < selectionBR.y;
    },

    /**
     * @method isType
     * @param type {String} type to check against
     * @return {Boolean} true if specified type is identical to the type of instance
     */
    isType: function(type) {
      return this.type === type;
    },

    /**
     * Determines which one of the four corners has been clicked
     * @method _findTargetCorner
     * @private
     * @param e {Event} event object
     * @param offset {Object} canvas offset
     * @return {String|Boolean} corner code (tl, tr, bl, br, etc.), or false if nothing is found
     */
    _findTargetCorner: function(e, offset) {
      if (!this.hasControls) return false;

      var pointer = getPointer(e),
          ex = pointer.x - offset.left,
          ey = pointer.y - offset.top,
          xpoints,
          lines;

      for (var i in this.oCoords) {
        lines = this._getImageLines(this.oCoords[i].corner, i);
        // debugging
        // canvas.contextTop.fillRect(lines.bottomline.d.x, lines.bottomline.d.y, 2, 2);
        //         canvas.contextTop.fillRect(lines.bottomline.o.x, lines.bottomline.o.y, 2, 2);
        //
        //         canvas.contextTop.fillRect(lines.leftline.d.x, lines.leftline.d.y, 2, 2);
        //         canvas.contextTop.fillRect(lines.leftline.o.x, lines.leftline.o.y, 2, 2);
        //
        //         canvas.contextTop.fillRect(lines.topline.d.x, lines.topline.d.y, 2, 2);
        //         canvas.contextTop.fillRect(lines.topline.o.x, lines.topline.o.y, 2, 2);
        //
        //         canvas.contextTop.fillRect(lines.rightline.d.x, lines.rightline.d.y, 2, 2);
        //         canvas.contextTop.fillRect(lines.rightline.o.x, lines.rightline.o.y, 2, 2);

        xpoints = this._findCrossPoints(ex, ey, lines);
        if (xpoints % 2 == 1 && xpoints != 0) {
          this.__corner = i;
          return i;
        }
      }
      return false;
    },

    /**
     * Helper method to determine how many cross points are between the 4 image edges
     * and the horizontal line determined by the position of our mouse when clicked on canvas
     * @method _findCrossPoints
     * @private
     * @param ex {Number} x coordinate of the mouse
     * @param ey {Number} y coordinate of the mouse
     * @param oCoords {Object} Coordinates of the image being evaluated
     */
    _findCrossPoints: function(ex, ey, oCoords) {
      var b1, b2, a1, a2, xi, yi,
          xcount = 0,
          iLine;

      for (var lineKey in oCoords) {
        iLine = oCoords[lineKey];
        // optimisation 1: line below dot. no cross
        if ((iLine.o.y < ey) && (iLine.d.y < ey)) {
          continue;
        }
        // optimisation 2: line above dot. no cross
        if ((iLine.o.y >= ey) && (iLine.d.y >= ey)) {
          continue;
        }
        // optimisation 3: vertical line case
        if ((iLine.o.x == iLine.d.x) && (iLine.o.x >= ex)) {
          xi = iLine.o.x;
          yi = ey;
        }
        // calculate the intersection point
        else {
          b1 = 0;
          b2 = (iLine.d.y-iLine.o.y)/(iLine.d.x-iLine.o.x);
          a1 = ey-b1*ex;
          a2 = iLine.o.y-b2*iLine.o.x;

          xi = - (a1-a2)/(b1-b2);
          yi = a1+b1*xi;
        }
        // dont count xi < ex cases
        if (xi >= ex) {
          xcount += 1;
        }
        // optimisation 4: specific for square images
        if (xcount == 2) {
          break;
        }
      }
      return xcount;
    },

    /**
     * Method that returns an object with the image lines in it given the coordinates of the corners
     * @method _getImageLines
     * @private
     * @param oCoords {Object} coordinates of the image corners
     */
    _getImageLines: function(oCoords, i) {
      return {
        topline: {
          o: oCoords.tl,
          d: oCoords.tr
        },
        rightline: {
          o: oCoords.tr,
          d: oCoords.br
        },
        bottomline: {
          o: oCoords.br,
          d: oCoords.bl
        },
        leftline: {
          o: oCoords.bl,
          d: oCoords.tl
        }
      }
    },

    /**
     * Sets the coordinates of the draggable boxes in the corners of
     * the image used to scale/rotate it.
     * @method _setCornerCoords
     * @private
     */
    _setCornerCoords: function() {
      var coords = this.oCoords,
          theta = degreesToRadians(45 - this.getAngle()),
          cornerHypotenuse = Math.sqrt(2 * Math.pow(this.cornersize, 2)) / 2,
          cosHalfOffset = cornerHypotenuse * Math.cos(theta),
          sinHalfOffset = cornerHypotenuse * Math.sin(theta),
          sinTh = Math.sin(this.theta),
          cosTh = Math.cos(this.theta);

      coords.tl.corner = {
        tl: {
          x: coords.tl.x - sinHalfOffset,
          y: coords.tl.y - cosHalfOffset
        },
        tr: {
          x: coords.tl.x + cosHalfOffset,
          y: coords.tl.y - sinHalfOffset
        },
        bl: {
          x: coords.tl.x - cosHalfOffset,
          y: coords.tl.y + sinHalfOffset
        },
        br: {
          x: coords.tl.x + sinHalfOffset,
          y: coords.tl.y + cosHalfOffset
        }
      };

      coords.tr.corner = {
        tl: {
          x: coords.tr.x - sinHalfOffset,
          y: coords.tr.y - cosHalfOffset
        },
        tr: {
          x: coords.tr.x + cosHalfOffset,
          y: coords.tr.y - sinHalfOffset
        },
        br: {
          x: coords.tr.x + sinHalfOffset,
          y: coords.tr.y + cosHalfOffset
        },
        bl: {
          x: coords.tr.x - cosHalfOffset,
          y: coords.tr.y + sinHalfOffset
        }
      };

      coords.bl.corner = {
        tl: {
          x: coords.bl.x - sinHalfOffset,
          y: coords.bl.y - cosHalfOffset
        },
        bl: {
          x: coords.bl.x - cosHalfOffset,
          y: coords.bl.y + sinHalfOffset
        },
        br: {
          x: coords.bl.x + sinHalfOffset,
          y: coords.bl.y + cosHalfOffset
        },
        tr: {
          x: coords.bl.x + cosHalfOffset,
          y: coords.bl.y - sinHalfOffset
        }
      };

      coords.br.corner = {
        tr: {
          x: coords.br.x + cosHalfOffset,
          y: coords.br.y - sinHalfOffset
        },
        bl: {
          x: coords.br.x - cosHalfOffset,
          y: coords.br.y + sinHalfOffset
        },
        br: {
          x: coords.br.x + sinHalfOffset,
          y: coords.br.y + cosHalfOffset
        },
        tl: {
          x: coords.br.x - sinHalfOffset,
          y: coords.br.y - cosHalfOffset
        }
      };

      coords.ml.corner = {
        tl: {
          x: coords.ml.x - sinHalfOffset,
          y: coords.ml.y - cosHalfOffset
        },
        tr: {
          x: coords.ml.x + cosHalfOffset,
          y: coords.ml.y - sinHalfOffset
        },
        bl: {
          x: coords.ml.x - cosHalfOffset,
          y: coords.ml.y + sinHalfOffset
        },
        br: {
          x: coords.ml.x + sinHalfOffset,
          y: coords.ml.y + cosHalfOffset
        }
      };

      coords.mt.corner = {
        tl: {
          x: coords.mt.x - sinHalfOffset,
          y: coords.mt.y - cosHalfOffset
        },
        tr: {
          x: coords.mt.x + cosHalfOffset,
          y: coords.mt.y - sinHalfOffset
        },
        bl: {
          x: coords.mt.x - cosHalfOffset,
          y: coords.mt.y + sinHalfOffset
        },
        br: {
          x: coords.mt.x + sinHalfOffset,
          y: coords.mt.y + cosHalfOffset
        }
      };

      coords.mr.corner = {
        tl: {
          x: coords.mr.x - sinHalfOffset,
          y: coords.mr.y - cosHalfOffset
        },
        tr: {
          x: coords.mr.x + cosHalfOffset,
          y: coords.mr.y - sinHalfOffset
        },
        bl: {
          x: coords.mr.x - cosHalfOffset,
          y: coords.mr.y + sinHalfOffset
        },
        br: {
          x: coords.mr.x + sinHalfOffset,
          y: coords.mr.y + cosHalfOffset
        }
      };

      coords.mb.corner = {
        tl: {
          x: coords.mb.x - sinHalfOffset,
          y: coords.mb.y - cosHalfOffset
        },
        tr: {
          x: coords.mb.x + cosHalfOffset,
          y: coords.mb.y - sinHalfOffset
        },
        bl: {
          x: coords.mb.x - cosHalfOffset,
          y: coords.mb.y + sinHalfOffset
        },
        br: {
          x: coords.mb.x + sinHalfOffset,
          y: coords.mb.y + cosHalfOffset
        }
      };

      var rotationPointDistance = 40;
      coords.mtr.corner = {
        tl: {
          x: coords.mtr.x - sinHalfOffset + (sinTh * rotationPointDistance),
          y: coords.mtr.y - cosHalfOffset - (cosTh * rotationPointDistance)
        },
        tr: {
          x: coords.mtr.x + cosHalfOffset + (sinTh * rotationPointDistance),
          y: coords.mtr.y - sinHalfOffset - (cosTh * rotationPointDistance)
        },
        bl: {
          x: coords.mtr.x - cosHalfOffset + (sinTh * rotationPointDistance),
          y: coords.mtr.y + sinHalfOffset - (cosTh * rotationPointDistance)
        },
        br: {
          x: coords.mtr.x + sinHalfOffset + (sinTh * rotationPointDistance),
          y: coords.mtr.y + cosHalfOffset - (cosTh * rotationPointDistance)
        }
      };

      var bottomRotationPointDistance = (-rotationPointDistance - this.currentHeight);

      coords.mbr.corner = {
        tl: {
          x: coords.mbr.x - sinHalfOffset + (sinTh * bottomRotationPointDistance),
          y: coords.mbr.y - cosHalfOffset - (cosTh * bottomRotationPointDistance)
        },
        tr: {
          x: coords.mbr.x + cosHalfOffset + (sinTh * bottomRotationPointDistance),
          y: coords.mbr.y - sinHalfOffset - (cosTh * bottomRotationPointDistance)
        },
        bl: {
          x: coords.mbr.x - cosHalfOffset + (sinTh * bottomRotationPointDistance),
          y: coords.mbr.y + sinHalfOffset - (cosTh * bottomRotationPointDistance)
        },
        br: {
          x: coords.mbr.x + sinHalfOffset + (sinTh * bottomRotationPointDistance),
          y: coords.mbr.y + cosHalfOffset - (cosTh * bottomRotationPointDistance)
        }
      };
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
     * @method complexity
     * @return {Number}
     */
    complexity: function() {
      return 0;
    },

    /**
     * Returns a JSON representation of an instance
     * @method toJSON
     * @return {String} json
     */
    toJSON: function() {
      // delegate, not alias
      return this.toObject();
    },

    setGradientFill: function(ctx, options) {
      this.set('fill', fabric.Gradient.forObject(this, ctx, options));
    },

    animate: function(property, to, options) {
      var obj = this;

      if (!('from' in options)) {
        options.from = this.get(property);
      }

      if (/[+-]/.test(to.charAt(0))) {
        to = this.get(property) + parseFloat(to);
      }

      fabric.util.animate({
        startValue: options.from,
        endValue: to,
        byValue: options.by,
        easing: options.easing,
        duration: options.duration,
        onChange: function(value) {
          obj.set(property, value);
          options.onChange && options.onChange();
        },
        onComplete: function() {
          obj.setCoords();
          options.onComplete && options.onComplete();
        }
      });
    }
  });

  /**
   * @alias rotate -> setAngle
   */
  fabric.Object.prototype.rotate = fabric.Object.prototype.setAngle;

  var proto = fabric.Object.prototype;
  for (var i = proto.stateProperties.length; i--; ) {

    var propName = proto.stateProperties[i],
        capitalizedPropName = propName.charAt(0).toUpperCase() + propName.slice(1),
        setterName = 'set' + capitalizedPropName,
        getterName = 'get' + capitalizedPropName;

    // using `new Function` for better introspection
    if (!proto[getterName]) {
      proto[getterName] = (function(property) {
        return new Function('return this.get("' + property + '")');
      })(propName);
    }
    if (!proto[setterName]) {
      proto[setterName] = (function(property) {
        return new Function('value', 'return this.set("' + property + '", value)');
      })(propName);
    }
  }

})(typeof exports != 'undefined' ? exports : this);
