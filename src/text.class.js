(function(global) {

  "use strict";

  var fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend,
      clone = fabric.util.object.clone,
      toFixed = fabric.util.toFixed;

  if (fabric.Text) {
    fabric.warn('fabric.Text is already defined');
    return;
  }

  var dimensionAffectingProps = {
    fontSize: true,
    fontWeight: true,
    fontFamily: true,
    textDecoration: true,
    fontStyle: true,
    lineHeight: true,
    strokeStyle: true,
    strokeWidth: true,
    text: true
  };

  var stateProperties = fabric.Object.prototype.stateProperties.concat();
  stateProperties.push(
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
    'strokeStyle',
    'strokeWidth',
    'backgroundColor',
    'textBackgroundColor',
    'useNative'
  );

  /**
   * Text class
   * @class Text
   * @extends fabric.Object
   */
  fabric.Text = fabric.util.createClass(fabric.Object, /** @scope fabric.Text.prototype */ {

    /**
     * Font size (in pixels)
     * @property
     * @type Number
     */
    fontSize:             40,

    /**
     * Font weight (e.g. bold, normal, 400, 600, 800)
     * @property
     * @type Number
     */
    fontWeight:           'normal',

    /**
     * Font family
     * @property
     * @type String
     */
    fontFamily:           'Times New Roman',

    /**
     * Text decoration (e.g. underline, overline)
     * @property
     * @type String
     */
    textDecoration:       '',

    /**
     * Text shadow
     * @property
     * @type String | null
     */
    textShadow:           '',

    /**
     * Text alignment. Possible values: "left", "center", or "right".
     * @property
     * @type String
     */
    textAlign:            'left',

    /**
     * Font style (e.g. italic)
     * @property
     * @type String
     */
    fontStyle:            '',

    /**
     * Line height
     * @property
     * @type Number
     */
    lineHeight:           1.3,

    /**
     * Stroke style. When specified, text is rendered with stroke
     * @property
     * @type String
     */
    strokeStyle:          '',

    /**
     * Stroke width
     * @property
     * @type Number
     */
    strokeWidth:          1,

    /**
     * Background color of an entire text box
     * @property
     * @type String
     */
    backgroundColor:      '',

    /**
     * Background color of text lines
     * @property
     * @type String
     */
    textBackgroundColor:  '',

    /**
     * URL of a font file, when using Cufon
     * @property
     * @type String | null
     */
    path:                 null,

    /**
     * Type of an object
     * @property
     * @type String
     */
    type:                 'text',

    /**
     * Indicates whether canvas native text methods should be used to render text (otherwise, Cufon is used)
     * @property
     * @type Boolean
     */
     useNative:           true,

     /**
      * List of properties to consider when checking if state of an object is changed (fabric.Object#hasStateChanged)
      * as well as for history (undo/redo) purposes
      * @property
      * @type Array
      */
     stateProperties:     stateProperties,

    /**
     * Constructor
     * @method initialize
     * @param {String} text
     * @param {Object} [options]
     * @return {fabric.Text} thisArg
     */
    initialize: function(text, options) {
      options = options || { };

      this.text = text;
      this.setOptions(options);
      this._initDimensions();
      this.setCoords();
    },

    /**
     * Renders text object on offscreen canvas, so that it would get dimensions
     * @private
     * @method _initDimensions
     */
    _initDimensions: function() {
      var canvasEl = fabric.util.createCanvasElement();
      this._render(canvasEl.getContext('2d'));
    },

    /**
     * Returns string representation of an instance
     * @method toString
     * @return {String} String representation of text object
     */
    toString: function() {
      return '#<fabric.Text (' + this.complexity() +
        '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '" }>';
    },

    /**
     * @private
     * @method _render
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(ctx) {
      if (typeof Cufon === 'undefined' || this.useNative === true) {
        this._renderViaNative(ctx);
      }
      else {
        this._renderViaCufon(ctx);
      }
    },

    /**
     * @private
     * @method _renderViaCufon
     */
    _renderViaCufon: function(ctx) {
      var o = Cufon.textOptions || (Cufon.textOptions = { });

      // export options to be used by cufon.js
      o.left = this.left;
      o.top = this.top;
      o.context = ctx;
      o.color = this.fill;

      var el = this._initDummyElementForCufon();

      // set "cursor" to top/left corner
      this.transform(ctx);

      // draw text
      Cufon.replaceElement(el, {
        engine: 'canvas',
        separate: 'none',
        fontFamily: this.fontFamily,
        fontWeight: this.fontWeight,
        textDecoration: this.textDecoration,
        textShadow: this.textShadow,
        textAlign: this.textAlign,
        fontStyle: this.fontStyle,
        lineHeight: this.lineHeight,
        strokeStyle: this.strokeStyle,
        strokeWidth: this.strokeWidth,
        backgroundColor: this.backgroundColor,
        textBackgroundColor: this.textBackgroundColor
      });

      // update width, height
      this.width = o.width;
      this.height = o.height;

      this._totalLineHeight = o.totalLineHeight;
      this._fontAscent = o.fontAscent;
      this._boundaries = o.boundaries;
      this._shadowOffsets = o.shadowOffsets;
      this._shadows = o.shadows || [ ];

      el = null;

      // need to set coords _after_ the width/height was retreived from Cufon
      this.setCoords();
    },

    /**
     * @private
     * @method _render_native
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderViaNative: function(ctx) {

      this.transform(ctx);
      this._setTextStyles(ctx);

      var textLines = this.text.split(/\r?\n/);

      this.width = this._getTextWidth(ctx, textLines);
      this.height = this._getTextHeight(ctx, textLines);

      this._renderTextBackground(ctx, textLines);

      if (this.textAlign !== 'left' && this.textAlign !== 'justify') {
        ctx.save();
        ctx.translate(this.textAlign === 'center' ? (this.width / 2) : this.width, 0);
      }

      this._setTextShadow(ctx);
      this.clipTo && fabric.util.clipContext(this, ctx);
      this._renderTextFill(ctx, textLines);
      this._renderTextStroke(ctx, textLines);
      this.clipTo && ctx.restore();
      this.textShadow && ctx.restore();

      if (this.textAlign !== 'left' && this.textAlign !== 'justify') {
        ctx.restore();
      }

      this._renderTextDecoration(ctx, textLines);
      this._setBoundaries(ctx, textLines);
      this._totalLineHeight = 0;

      this.setCoords();
    },

    /**
     * @private
     * @method _setBoundaries
     */
    _setBoundaries: function(ctx, textLines) {
      this._boundaries = [ ];

      for (var i = 0, len = textLines.length; i < len; i++) {

        var lineWidth = this._getLineWidth(ctx, textLines[i]);
        var lineLeftOffset = this._getLineLeftOffset(lineWidth);

        this._boundaries.push({
          height: this.fontSize * this.lineHeight,
          width: lineWidth,
          left: lineLeftOffset
        });
      }
    },

    /**
     * @private
     * @method _setTextStyles
     */
    _setTextStyles: function(ctx) {
      ctx.fillStyle = this.fill.toLive
          ? this.fill.toLive(ctx)
          : this.fill;
      ctx.strokeStyle = this.strokeStyle;
      ctx.lineWidth = this.strokeWidth;
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = this.textAlign;
      ctx.font = this._getFontDeclaration();
    },

    /**
     * @private
     * @method _getTextHeight
     */
    _getTextHeight: function(ctx, textLines) {
      return this.fontSize * textLines.length * this.lineHeight;
    },

    /**
     * @private
     * @method _getTextWidth
     */
    _getTextWidth: function(ctx, textLines) {
      var maxWidth = ctx.measureText(textLines[0]).width;

      for (var i = 1, len = textLines.length; i < len; i++) {
        var currentLineWidth = ctx.measureText(textLines[i]).width;
        if (currentLineWidth > maxWidth) {
          maxWidth = currentLineWidth;
        }
      }
      return maxWidth;
    },

    /**
     * @private
     * @method _setTextShadow
     */
    _setTextShadow: function(ctx) {
      if (this.textShadow) {

        // "rgba(0,0,0,0.2) 2px 2px 10px"
        // "rgb(0, 100, 0) 0 0 5px"
        // "red 2px 2px 1px"
        // "#f55 123 345 567"
        var reOffsetsAndBlur = /\s+(-?\d+)(?:px)?\s+(-?\d+)(?:px)?\s+(\d+)(?:px)?\s*/;

        var shadowDeclaration = this.textShadow;
        var offsetsAndBlur = reOffsetsAndBlur.exec(this.textShadow);
        var shadowColor = shadowDeclaration.replace(reOffsetsAndBlur, '');

        ctx.save();
        ctx.shadowColor = shadowColor;
        ctx.shadowOffsetX = parseInt(offsetsAndBlur[1], 10);
        ctx.shadowOffsetY = parseInt(offsetsAndBlur[2], 10);
        ctx.shadowBlur = parseInt(offsetsAndBlur[3], 10);

        this._shadows = [{
          blur: ctx.shadowBlur,
          color: ctx.shadowColor,
          offX: ctx.shadowOffsetX,
          offY: ctx.shadowOffsetY
        }];

        this._shadowOffsets = [[
          parseInt(ctx.shadowOffsetX, 10), parseInt(ctx.shadowOffsetY, 10)
        ]];
      }
    },

    /**
     * @private
     * @method _drawTextLine
     * @param method
     * @param ctx
     * @param line
     * @param left
     * param top
     */
    _drawTextLine: function(method, ctx, line, left, top) {

      // short-circuit
      if (this.textAlign !== 'justify') {
        ctx[method](line, left, top);
        return;
      }

      var lineWidth = ctx.measureText(line).width;
      var totalWidth = this.width;

      if (totalWidth > lineWidth) {
        // stretch the line

        var words = line.split(/\s+/);
        var wordsWidth = ctx.measureText(line.replace(/\s+/g, '')).width;
        var widthDiff = totalWidth - wordsWidth;
        var numSpaces = words.length - 1;
        var spaceWidth = widthDiff / numSpaces;

        var leftOffset = 0;
        for (var i = 0, len = words.length; i < len; i++) {
          ctx[method](words[i], left + leftOffset, top);
          leftOffset += ctx.measureText(words[i]).width + spaceWidth;
        }
      }
      else {
        ctx[method](line, left, top);
      }
    },

    /**
     * @private
     * @method _renderTextFill
     */
    _renderTextFill: function(ctx, textLines) {
      this._boundaries = [ ];
      for (var i = 0, len = textLines.length; i < len; i++) {
        this._drawTextLine(
          'fillText',
          ctx,
          textLines[i],
          -this.width / 2,
          (-this.height / 2) + (i * this.fontSize * this.lineHeight) + this.fontSize
        );
      }
    },

    /**
     * @private
     * @method _renderTextStroke
     */
    _renderTextStroke: function(ctx, textLines) {
      if (this.strokeStyle) {
        ctx.beginPath();
        for (var i = 0, len = textLines.length; i < len; i++) {
          this._drawTextLine(
            'strokeText',
            ctx,
            textLines[i],
            -this.width / 2,
            (-this.height / 2) + (i * this.fontSize * this.lineHeight) + this.fontSize
          );
        }
        ctx.closePath();
      }
    },

    /**
     * @private
     * @method _renderTextBackground
     */
    _renderTextBackground: function(ctx, textLines) {
      this._renderTextBoxBackground(ctx);
      this._renderTextLinesBackground(ctx, textLines);
    },

    /**
     * @private
     * @method _renderTextBoxBackground
     */
    _renderTextBoxBackground: function(ctx) {
      if (this.backgroundColor) {
        ctx.save();
        ctx.fillStyle = this.backgroundColor;

        ctx.fillRect(
          (-this.width / 2),
          (-this.height / 2),
          this.width,
          this.height
        );

        ctx.restore();
      }
    },

    /**
     * @private
     * @method _renderTextLinesBackground
     */
    _renderTextLinesBackground: function(ctx, textLines) {
      if (this.textBackgroundColor) {
        ctx.save();
        ctx.fillStyle = this.textBackgroundColor;

        for (var i = 0, len = textLines.length; i < len; i++) {

          if (textLines[i] !== '') {

            var lineWidth = this._getLineWidth(ctx, textLines[i]);
            var lineLeftOffset = this._getLineLeftOffset(lineWidth);

            ctx.fillRect(
              (-this.width / 2) + lineLeftOffset,
              (-this.height / 2) + (i * this.fontSize * this.lineHeight),
              lineWidth,
              this.fontSize * this.lineHeight
            );
          }
        }
        ctx.restore();
      }
    },

    /**
     * @private
     * @method _getLineLeftOffset
     */
    _getLineLeftOffset: function(lineWidth) {
      if (this.textAlign === 'center') {
        return (this.width - lineWidth) / 2;
      }
      if (this.textAlign === 'right') {
        return this.width - lineWidth;
      }
      return 0;
    },

    /**
     * @private
     * @method _getLineWidth
     * @param ctx
     * @param line
     */
    _getLineWidth: function(ctx, line) {
      return this.textAlign === 'justify'
        ? this.width
        : ctx.measureText(line).width;
    },

    /**
     * @private
     * @method _renderTextDecoration
     */
    _renderTextDecoration: function(ctx, textLines) {

      var halfOfVerticalBox = this._getTextHeight(ctx, textLines) / 2;
      var _this = this;

      /** @ignore */
      function renderLinesAtOffset(offset) {
        for (var i = 0, len = textLines.length; i < len; i++) {

          var lineWidth = _this._getLineWidth(ctx, textLines[i]);
          var lineLeftOffset = _this._getLineLeftOffset(lineWidth);

          ctx.fillRect(
            (-_this.width / 2) + lineLeftOffset,
            (offset + (i * _this.fontSize * _this.lineHeight)) - halfOfVerticalBox,
            lineWidth,
            1);
        }
      }

      if (this.textDecoration.indexOf('underline') > -1) {
        renderLinesAtOffset(this.fontSize);
      }
      if (this.textDecoration.indexOf('line-through') > -1) {
        renderLinesAtOffset(this.fontSize / 2);
      }
      if (this.textDecoration.indexOf('overline') > -1) {
        renderLinesAtOffset(0);
      }
    },

    /**
     * @private
     * @method _getFontDeclaration
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
     * @private
     * @method _initDummyElement
     */
    _initDummyElementForCufon: function() {
      var el = fabric.document.createElement('pre'),
          container = fabric.document.createElement('div');

      // Cufon doesn't play nice with textDecoration=underline if element doesn't have a parent
      container.appendChild(el);

      if (typeof G_vmlCanvasManager === 'undefined') {
        el.innerHTML = this.text;
      }
      else {
        // IE 7 & 8 drop newlines and white space on text nodes
        // see: http://web.student.tuwien.ac.at/~e0226430/innerHtmlQuirk.html
        // see: http://www.w3schools.com/dom/dom_mozilla_vs_ie.asp
        el.innerText =  this.text.replace(/\r?\n/gi, '\r');
      }

      el.style.fontSize = this.fontSize + 'px';
      el.style.letterSpacing = 'normal';

      return el;
    },

    /**
     * Renders text instance on a specified context
     * @method render
     * @param ctx {CanvasRenderingContext2D} context to render on
     */
    render: function(ctx, noTransform) {
      ctx.save();
      this._render(ctx);
      if (!noTransform && this.active) {
        this.drawBorders(ctx);
        this.drawControls(ctx);
      }
      ctx.restore();
    },

    /**
     * Returns object representation of an instance
     * @method toObject
     * @param {Array} propertiesToInclude
     * @return {Object} object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      return extend(this.callSuper('toObject', propertiesToInclude), {
        text:                 this.text,
        fontSize:             this.fontSize,
        fontWeight:           this.fontWeight,
        fontFamily:           this.fontFamily,
        fontStyle:            this.fontStyle,
        lineHeight:           this.lineHeight,
        textDecoration:       this.textDecoration,
        textShadow:           this.textShadow,
        textAlign:            this.textAlign,
        path:                 this.path,
        strokeStyle:          this.strokeStyle,
        strokeWidth:          this.strokeWidth,
        backgroundColor:      this.backgroundColor,
        textBackgroundColor:  this.textBackgroundColor,
        useNative:            this.useNative
      });
    },

    /**
     * Returns SVG representation of an instance
     * @method toSVG
     * @return {String} svg representation of an instance
     */
    toSVG: function() {

      var textLines = this.text.split(/\r?\n/),
          lineTopOffset = this.useNative
            ? this.fontSize * this.lineHeight
            : (-this._fontAscent - ((this._fontAscent / 5) * this.lineHeight)),

          textLeftOffset = -(this.width/2),
          textTopOffset = this.useNative
            ? this.fontSize - 1
            : (this.height/2) - (textLines.length * this.fontSize) - this._totalLineHeight,

          textAndBg = this._getSVGTextAndBg(lineTopOffset, textLeftOffset, textLines),
          shadowSpans = this._getSVGShadows(lineTopOffset, textLines);

      // move top offset by an ascent
      textTopOffset += (this._fontAscent ? ((this._fontAscent / 5) * this.lineHeight) : 0);

      return [
        '<g transform="', this.getSvgTransform(), '">',
          textAndBg.textBgRects.join(''),
          '<text ',
            (this.fontFamily ? 'font-family="\'' + this.fontFamily + '\'" ': ''),
            (this.fontSize ? 'font-size="' + this.fontSize + '" ': ''),
            (this.fontStyle ? 'font-style="' + this.fontStyle + '" ': ''),
            (this.fontWeight ? 'font-weight="' + this.fontWeight + '" ': ''),
            (this.textDecoration ? 'text-decoration="' + this.textDecoration + '" ': ''),
            'style="', this.getSvgStyles(), '" ',
            /* svg starts from left/bottom corner so we normalize height */
            'transform="translate(', toFixed(textLeftOffset, 2), ' ', toFixed(textTopOffset, 2), ')">',
            shadowSpans.join(''),
            textAndBg.textSpans.join(''),
          '</text>',
        '</g>'
      ].join('');
    },

    /**
     * @private
     * @method _getSVGShadows
     */
    _getSVGShadows: function(lineTopOffset, textLines) {
      var shadowSpans = [], j, i, jlen, ilen, lineTopOffsetMultiplier = 1;

      if (!this._shadows || !this._boundaries) {
        return shadowSpans;
      }

      for (j = 0, jlen = this._shadows.length; j < jlen; j++) {
        for (i = 0, ilen = textLines.length; i < ilen; i++) {
          if (textLines[i] !== '') {
            var lineLeftOffset = (this._boundaries && this._boundaries[i]) ? this._boundaries[i].left : 0;
            shadowSpans.push(
              '<tspan x="',
              toFixed((lineLeftOffset + lineTopOffsetMultiplier) + this._shadowOffsets[j][0], 2),
              ((i === 0 || this.useNative) ? '" y' : '" dy'), '="',
              toFixed(this.useNative
                ? ((lineTopOffset * i) - this.height / 2 + this._shadowOffsets[j][1])
                : (lineTopOffset + (i === 0 ? this._shadowOffsets[j][1] : 0)), 2),
              '" ',
              this._getFillAttributes(this._shadows[j].color), '>',
              fabric.util.string.escapeXml(textLines[i]),
            '</tspan>');
            lineTopOffsetMultiplier = 1;
          } else {
            // in some environments (e.g. IE 7 & 8) empty tspans are completely ignored, using a lineTopOffsetMultiplier
            // prevents empty tspans
            lineTopOffsetMultiplier++;
          }
        }
      }
      return shadowSpans;
    },

    /**
     * @private
     * @method _getSVGTextAndBg
     */
    _getSVGTextAndBg: function(lineTopOffset, textLeftOffset, textLines) {
      var textSpans = [ ], textBgRects = [ ], i, lineLeftOffset, len, lineTopOffsetMultiplier = 1;

      // bounding-box background
      if (this.backgroundColor && this._boundaries) {
        textBgRects.push(
          '<rect ',
            this._getFillAttributes(this.backgroundColor),
            ' x="',
            toFixed(-this.width / 2, 2),
            '" y="',
            toFixed(-this.height / 2, 2),
            '" width="',
            toFixed(this.width, 2),
            '" height="',
            toFixed(this.height, 2),
          '"></rect>');
      }

      // text and text-background
      for (i = 0, len = textLines.length; i < len; i++) {
        if (textLines[i] !== '') {
          lineLeftOffset = (this._boundaries && this._boundaries[i]) ? toFixed(this._boundaries[i].left, 2) : 0;
          textSpans.push(
            '<tspan x="',
              lineLeftOffset, '" ',
              (i === 0 || this.useNative ? 'y' : 'dy'), '="',
              toFixed(this.useNative ? ((lineTopOffset * i) - this.height / 2) : (lineTopOffset * lineTopOffsetMultiplier), 2) , '" ',
              // doing this on <tspan> elements since setting opacity on containing <text> one doesn't work in Illustrator
              this._getFillAttributes(this.fill), '>',
              fabric.util.string.escapeXml(textLines[i]),
            '</tspan>'
          );
          lineTopOffsetMultiplier = 1;
        }
        else {
          // in some environments (e.g. IE 7 & 8) empty tspans are completely ignored, using a lineTopOffsetMultiplier
          // prevents empty tspans
          lineTopOffsetMultiplier++;
        }

        if (!this.textBackgroundColor || !this._boundaries) continue;

        textBgRects.push(
          '<rect ',
            this._getFillAttributes(this.textBackgroundColor),
            ' x="',
            toFixed(textLeftOffset + this._boundaries[i].left, 2),
            '" y="',
            /* an offset that seems to straighten things out */
            toFixed((lineTopOffset * i) - this.height / 2, 2),
            '" width="',
            toFixed(this._boundaries[i].width, 2),
            '" height="',
            toFixed(this._boundaries[i].height, 2),
          '"></rect>');
      }
      return {
        textSpans: textSpans,
        textBgRects: textBgRects
      };
    },

    /**
     * Adobe Illustrator (at least CS5) is unable to render rgba()-based fill values
     * we work around it by "moving" alpha channel into opacity attribute and setting fill's alpha to 1
     *
     * @private
     * @method _getFillAttributes
     */
    _getFillAttributes: function(value) {
      var fillColor = value ? new fabric.Color(value) : '';
      if (!fillColor || !fillColor.getSource() || fillColor.getAlpha() === 1) {
        return 'fill="' + value + '"';
      }
      return 'opacity="' + fillColor.getAlpha() + '" fill="' + fillColor.setAlpha(1).toRgb() + '"';
    },

    /**
     * Sets "color" of an instance (alias of `set('fill', &hellip;)`)
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
     * Returns actual text value of an instance
     * @method getText
     * @return {String}
     */
    getText: function() {
      return this.text;
    },

    /**
     * Sets specified property to a specified value
     * @method set
     * @param {String} name
     * @param {Any} value
     * @return {fabric.Text} thisArg
     * @chainable
     */
    _set: function(name, value) {
      if (name === 'fontFamily' && this.path) {
        this.path = this.path.replace(/(.*?)([^\/]*)(\.font\.js)/, '$1' + value + '$3');
      }
      this.callSuper('_set', name, value);

      if (name in dimensionAffectingProps) {
        this._initDimensions();
        this.setCoords();
      }
    }
  });

  /**
   * List of attribute names to account for when parsing SVG element (used by {@link fabric.Text.fromElement})
   * @static
   */
  fabric.Text.ATTRIBUTE_NAMES =
    ('x y fill fill-opacity opacity stroke stroke-width transform ' +
     'font-family font-style font-weight font-size text-decoration').split(' ');

  /**
   * Returns fabric.Text instance from an object representation
   * @static
   * @method fromObject
   * @param {Object} object to create an instance from
   * @return {fabric.Text} an instance
   */
  fabric.Text.fromObject = function(object) {
    return new fabric.Text(object.text, clone(object));
  };

  /**
   * Returns fabric.Text instance from an SVG element (<b>not yet implemented</b>)
   * @static
   * @method fabric.Text.fromElement
   * @param element
   * @param options
   * @return {fabric.Text} an instance
   */
  fabric.Text.fromElement = function(element, options) {

    if (!element) {
      return null;
    }

    var parsedAttributes = fabric.parseAttributes(element, fabric.Text.ATTRIBUTE_NAMES);
    options = fabric.util.object.extend((options ? fabric.util.object.clone(options) : { }), parsedAttributes);

    var text = new fabric.Text(element.textContent, options);

    /*
      Adjust positioning:
        x/y attributes in SVG correspond to the bottom-left corner of text bounding box
        top/left properties in Fabric correspond to center point of text bounding box
    */

    text.set({
      left: text.getLeft() + text.getWidth() / 2,
      top: text.getTop() - text.getHeight() / 2
    });

    return text;
  };

  fabric.util.createAccessors(fabric.Text);

})(typeof exports !== 'undefined' ? exports : this);