(function(global) {

  "use strict";


  /**
   * fabric.Textbox A class to create TextBoxes, with or without images as their boxes
   */
  
  var fabric = global.fabric || (global.fabric = { }), extend = fabric.util.object.extend, clone = fabric.util.object.clone, toFixed = fabric.util.toFixed;

  if (fabric.Textbox) {
    fabric.warn('fabric.Textbox is already defined');
    return;
  }
  if (!fabric.Object) {
    fabric.warn('fabric.Textbox requires fabric.Object');
    return;
  }

  var stateProperties = fabric.Object.prototype.stateProperties.concat();
  // properties for the box and the text
  var newProperties = [
  	'fontFamily',
    'fontWeight',
    'fontSize',
    'path',
    'text',
    'textDecoration',
    'textShadow',
    'textAlign',
    'fontStyle',
    'lineHeight',
    'backgroundColor',
    'textBackgroundColor',
    'useNative',
    'originalText',
    'textPadding',
    'boxPath',
    'vAlign',
    'boxImageScaleX',
    'boxImageScaleY'
  ];
  
  stateProperties = stateProperties.concat(newProperties);
  
  /**
   * Textbox class
   * @class fabric.Textbox
   * @classdesc Permits the creation of text boxes
   * @extends fabric.Object
   * @borrows fabric.Text as textObject
   * @borrows fabric.Pathgroup as boxImage
   * @return {fabric.Textbox} thisArg
   */
  fabric.Textbox = fabric.util.createClass(fabric.Object, /** @lends fabric.Textbox.prototype */
  {
  	/**
     * Type of an object
     * @type String
     * @default
     */
    type:                 'textbox',

    /**
     * Font size (in pixels)
     * @type Number
     * @default
     */
    fontSize:             40,

    /**
     * Font weight (e.g. bold, normal, 400, 600, 800)
     * @type Number
     * @default
     */
    fontWeight:           'normal',

    /**
     * Font family
     * @type String
     * @default
     */
    fontFamily:           'Times New Roman',

    /**
     * Text decoration Possible values: "", "underline", "overline" or "line-through".
     * @type String
     * @default
     */
    textDecoration:       '',

    /**
     * Text shadow
     * @type String | null
     * @default
     */
    textShadow:           '',

    /**
     * Text alignment. Possible values: "left", "center", or "right".
     * @type String
     * @default
     */
    textAlign:            'left',

    /**
     * Font style . Possible values: "", "normal", "italic" or "oblique".
     * @type String
     * @default
     */
    fontStyle:            '',

    /**
     * Line height
     * @type Number
     * @default
     */
    lineHeight:           1.3,

    /**
     * Background color of an entire text box
     * @type String
     * @default
     */
    backgroundColor:      '',

    /**
     * Background color of text lines
     * @type String
     * @default
     */
    textBackgroundColor:  '',

    /**
     * URL of a font file, when using Cufon
     * @type String | null
     * @default
     */
    path:                 null,

    /**
     * Indicates whether canvas native text methods should be used to render text (otherwise, Cufon is used)
     * @type Boolean
     * @default
     */
    useNative:           true,

    /**
     * List of properties to consider when checking if state of an object is changed ({@link fabric.Object#hasStateChanged})
     * as well as for history (undo/redo) purposes
     * @type Array
     */
    stateProperties:     stateProperties,

    /**
     * The text that was setted when the object was instantiated
     * @type String
     * @default
     */
    originalText: '',

    /**
     * The padding of the text, relative to the "box"
     * @type Integer
     * @default
     */
    textPadding: 10,

    /**
     * Defines if the textPadding must be scaled with the box
     * @type Boolean
     * @default
     */
    scaleTextPadding: true,

    /**
     * The fabric.Pathgroup object that holds the box image
     * @type fabric.Pathgroup
     * @default
     */
    boxImage: null,

    /**
     * The path of the image of the box
     * @type String
     * @default
     */
    boxPath: '',

    /**
     * Vertical alignment of the text relative to the box. Possible values: top, center, bottom
     * @type String
     * @default
     */
    vAlign: 'center',

    /**
     * Original scales of the box. Used when rendering the text
     * @private
     * @type Array
     */
    originalScales: null,

    /**
     * The scaleX property that needed to be applied to the box
     * @type Integer
     * @default
     */
    boxImageScaleX: 1,

    /**
     * The scaleY property that needed to be applied to the box
     * @type Integer
     * @default
     */
    boxImageScaleY: 1,

    /**
     * The fabric.Text object that holds the text
     * @type fabric.Text
     */
    textObject: null,

    /**
     * Color of object's fill
     * @type String
     * @default
     */
    fill: "rgba(221,204,197,0.6)",

    /**
     * @method initialize
     * @param {String} text
     * @param {Object} options
     * @param {Function} cb callback to be called when the box image is loaded
     */
    initialize: function(text, options, cb) 
    {
      this.callSuper('initialize', options);
      this.setOptions(options);
      this.setCoords();
      this.originalText = text;

      var _this = this;

      var createBox = function(objects, options) {
        var boxImage = {};
        if (objects.length > 1) {
          var opts = clone(options);
          boxImage = new fabric.PathGroup(objects, opts);
        } else {
          if (Object.prototype.toString.call(objects) === "[object Array]") {
            boxImage = objects[0];
          } else {
            boxImage = objects;
          }
        }

        var sx = (_this.get('width') / boxImage.get('width')), 
          sy = ((_this.get('height') + 20) / boxImage.get('height'));

        _this.boxImageScaleX = sx;
        _this.boxImageScaleY = sy;

        boxImage.set({
          angle : 0,
          scaleX : sx,
          scaleY : sy,
          hasRotatingPoint : false,
          lockScalingX: true,
          lockScalingY: true,
          selectable: false,
          useNative : true
        });

        boxImage.setSourcePath(_this.boxPath);
        boxImage.set('_id', _this._id);

        _this.boxImage = boxImage;
        createText(text, options);
      };

      var createText = function(text, options) {
        _this.textObject = new fabric.Text(text, options);
        _this.textObject.originalText = text;
        _this._applyPropertiesToText(options);

        //_this.boxImage && _this.boxImage.sendBackwards();
        if (cb) {
          cb();
        }
      };

      // loads the box image, if set
      if (this.boxPath) {
        if (this.boxPath.match(/svg$/)) {
          fabric.loadSVGFromURL(this.boxPath, createBox);
        } else {
          fabric.Image.fromURL(this.boxPath, createBox);
        }
      } else {
        createText(text, options);
      }
    },

    /**
     * Returns object representation of an instance
     * @method toObject
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      if (!propertiesToInclude){
        propertiesToInclude = [];
      }

      propertiesToInclude = propertiesToInclude.concat(newProperties);

      return fabric.util.object.extend(this.callSuper('toObject', propertiesToInclude));
    },

    /**
     * Toggles specified property from `true` to `false` or from `false` to `true` in the Textbox object and the refered fabric.Pathgroup child object
     * @method toggle
     * @param {String} property property to toggle
     * @return {fabric.Object} thisArg
     * @chainable
     */
    toggle: function(property) {
      this.boxImage.toggle(prop);
      return this.callSuper('toggle', prop);
    },

    /**
     * Calculate and return the textScale, based on the scaling of the object
     * @method getTextPadding
     * @param {String} scale The type of the scale. Possible values are "y" and "x"
     * @return Number
     */
    getTextPadding: function(scale) {
      if (!scale) scale = "x";
      else scale = scale.toLowerCase();

      if (!this.boxImage || !this.scaleTextPadding) {
      	return this.textPadding;
      } else {
        var scales = {}, originalScales = this.originalScales;
        if (originalScales) {
          scales.x = originalScales[0];
          scales.y = originalScales[1];
        } else {
          scales.x = this.get("scaleX");
          scales.y = this.get("scaleY");
        }
        return this.textPadding * scales[scale];
      }
    },

    /**
     * Copied from fabric.Object.render, but with little modifications
     * @method render
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Boolean} noTransform
     */
    render: function(ctx, noTransform) {
      // do not render if width or height are zeros
      if (this.width === 0 || this.height === 0) return;

      ctx.save();

      this._preRenderTransform(ctx, noTransform, false);

      this._render(ctx, noTransform);

      if (this.active && !noTransform) {
        this.drawBorders(ctx);
        this.drawControls(ctx);
      }
      ctx.restore();

      if (this.boxImage) {
        // move and render the box image
        this._moveImageBox(ctx);
        this.boxImage.render(ctx, true);
      }

      if (this.textObject) {
        ctx.save();
        this._preRenderTransform(ctx, noTransform, true);
        this._applyPropertiesToText();
        // move and render text
        this._moveText(ctx);
        this.textObject.render(ctx, true);
        if (!noTransform) {
          this.scaleX = this.originalScales[0];
          this.scaleY = this.originalScales[1];
          this.originalScales = null;
        }
        ctx.restore();
      }
    },

    /**
     * Transforms context before to render an object
     * @method _preRenderTransform
     * @param {CanvasRenderingContext2D} ctx Context
     * @param {Boolean} noTransform If transform shouldn't be applyed
     * @param {Boolean} noScale True if scale(x|y) must be reseted to 1, false if not
     */
    _preRenderTransform: function(ctx, noTransform, noScale) {
    	var m = this.transformMatrix;
      if (m && !this.group) {
        ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
      }

      if (!noTransform) {
      	if (noScale) {
	        this.originalScales = [this.scaleX, this.scaleY];
	        this.scaleX = 1;
	        this.scaleY = 1;
	      }
        this.transform(ctx);
      }

      if (m && this.group) {
        ctx.translate(-this.group.width/2, -this.group.height/2);
        ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
      }
    },

    /**
     * Apply a background in the text if no box selected
     * @method _render
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(ctx) 
    {
      // show a background in the text, if selected
      if (this.isActive() && !this.boxImage) {
        ctx.save();

        var x = -this.width / 2,
          y = -this.height / 2,
          w = this.width,
          h = this.height;

        ctx.fillStyle = this.fill.toLive
          ? this.fill.toLive(ctx)
          : this.fill;

        ctx.fillRect(x, y, w, h);

        ctx.restore();
      }
    },

    /**
     * Adjust the text position in the canvas
     * @method _moveText
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _moveText: function(ctx) {
      this.textObject.set('text', this._wrapText(
        ctx,
        this.textObject.get('originalText')
      ));

      var scaleX = this.originalScales ? this.originalScales[0] : this.scaleX;
      var scaleY = this.originalScales ? this.originalScales[1] : this.scaleY;


      var x = 0, y = 0;

      // horizontal alignment
      if (this.textAlign == 'left') {
        x = x - ((this.get("width") * scaleX) / 2) + (this.textObject.get('width') / 2) + (this.getTextPadding('x'));
      } else if (this.textAlign == 'right') {
        x = x + ((this.get("width") * scaleX) / 2) - (this.textObject.get('width') / 2) - (this.getTextPadding('x'));
      }

      // vertical alignment
      if (this.vAlign == "top") {
        y = y + ((this.textObject.get('height') / 2)
            - ((this.get('height')*scaleY)/2)
          ) + (this.getTextPadding('y'));
      } else if (this.vAlign == 'bottom') {
        y = y - ((this.textObject.get('height') / 2)
            - ((this.get('height')*scaleY)/2)
          ) - (this.getTextPadding('y'));
      }

      // left and top are related to current context transform (the transform of textbox object)
      this.textObject.set("left", x);
      this.textObject.set("top", y);
    },

    /**
     * Break the text accordingly to the width of Textbox. Based on the code of Darren Nolan (@darrennolan)
     * @method _wrapText
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} Text to wrap
     * @return {Array} Array with the lines of the text
     */
    _wrapText: function (ctx, text) {
      var scaleX = (this.originalScales ? this.originalScales[0] : this.scaleX);
      var maxWidth = (this.width * scaleX),
        lines = text.split("\n"),
        wrapped_text = [];

      var maximum=0;

      // pass the text properties to the canvas context
      this._setTextStyles(ctx);

      for (var l = 0; l < lines.length; l++) {
        var line = "";
        var words = lines[l].split(" ");
        for (var w = 0; w < words.length; w++) {
          var testLine = line + words[w] + " ";
          var metrics = ctx.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > (maxWidth - (this.getTextPadding('x') * 2))) {
            wrapped_text.push(line);
            line = words[w] + " ";
          } else {
            line = testLine;
            maximum = Math.max(testWidth, maximum);
          }
        }
        wrapped_text.push(line);
      }

      return wrapped_text.join("\n");
    },

    /**
     * Set the text properties. Copied from fabric.Text
     * @method _setTextStyles
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _setTextStyles: function(ctx) {
      ctx.fillStyle = this.fill.toLive?
        this.fill.toLive(ctx)
        : this.fill;
      ctx.strokeStyle = this.strokeStyle;
      ctx.lineWidth = this.strokeWidth;
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = this.textAlign;
      ctx.font = this._getFontDeclaration();
    },

    /**
     * Get the font declaration accordingly to the canvas way. Copied from fabric.Text
     * @method _getFontDeclaration
     * @return {String} Font properties declarations
     */
    _getFontDeclaration: function() {
      return [
        // node-canvas needs "weight style", while browsers need "style weight"
        (fabric.isLikelyNode ? this.fontWeight : this.fontStyle),
        (fabric.isLikelyNode ? this.fontStyle : this.fontWeight),
        this.fontSize + 'px',
        (fabric.isLikelyNode ? ('"' + this.fontFamily + '"') : this.fontFamily)
      ].join(' ');
    },

    /**
     * Apply the text properties to the fabric.Text object
     * @method _applyPropertiesToText
     * @param {Array} Properties
     * @return {Array} Options applied to text object
     */
    _applyPropertiesToText: function(options) {
      var text_opts = {};
      if (options) {
        text_opts = fabric.util.object.clone(options);
      } else {
        for (var i = 0; i < newProperties.length; i++) {
          text_opts[newProperties[i]] = this.get(newProperties[i]);
        }
      }
      // locks the text object
      text_opts.lockScalingX = true;
      text_opts.lockScalingY = true;
      text_opts.selectable = false;
      text_opts.scaleX = 1;
      text_opts.scaleY = 1;
      text_opts.text = this.originalText;

      if (this.textObject)
        this.textObject.setOptions(text_opts);
      return text_opts;
    },

    /**
     * Applyes the coordinates and dimensions to the box image
     * @method _moveImageBox
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _moveImageBox: function(ctx) {
      var x = (this.get('left') + (this.get('width') / 2)),
        y = (this.get('top'));

      this.boxImage.left = x - (this.get('width')/2);
      this.boxImage.top = y;

      this.boxImage.angle = this.get('angle');

      var w = (this.get('width') * this.get('scaleX')), 
        h = (this.get('height') * this.get('scaleY'));

      var sx = (w / this.boxImage.width), 
        sy = ((h) / this.boxImage.height);
      
      this.boxImage.scaleX = sx;
      this.boxImage.scaleY = sy;

      this.boxImageScaleX = sx;
      this.boxImageScaleY = sy;
    }
  });
  
  /**
   * @method fromObject
   * @static
   * @param {Object} object
   * @return {fabric.Textbox}
   */
  fabric.Textbox.fromObject = function(object) {
    var instance = new fabric.Textbox(object.originalText, clone(object), function() {
      return instance && instance.canvas && instance.canvas.renderAll();
    });
    return instance;
  };
})( typeof exports != 'undefined' ? exports : this);
