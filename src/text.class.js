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
  if (!fabric.Object) {
    fabric.warn('fabric.Text requires fabric.Object');
    return;
  }

  /**
   * @class Text
   * @extends fabric.Object
   */
  fabric.Text = fabric.util.createClass(fabric.Object, /** @scope fabric.Text.prototype */ {

    /**
     * @property
     * @type Number
     */
    fontSize:         40,

    /**
     * @property
     * @type Number
     */
    fontWeight:       100,

    /**
     * @property
     * @type String
     */
    fontFamily:       'Times_New_Roman',

    /**
     * @property
     * @type String
     */
    textDecoration:   '',

    /**
     * @property
     * @type String | null
     */
    textShadow:       null,

    /**
     * Determines text alignment. Possible values: "left", "center", or "right".
     * @property
     * @type String
     */
    textAlign:        'left',

    /**
     * @property
     * @type String
     */
    fontStyle:        '',

    /**
     * @property
     * @type Number
     */
    lineHeight:       1.6,

    /**
     * @property
     * @type String
     */
    strokeStyle:      '',

    /**
     * @property
     * @type Number
     */
    strokeWidth:      1,

    /**
     * @property
     * @type String
     */
    backgroundColor:  '',


    /**
     * @property
     * @type String | null
     */
    path:             null,

    /**
     * @property
     * @type String
     */
    type:             'text',

    /**
     * If true then text will be rendered using native methods even if Cufon is found on the page.
     * @property
     * @type Boolean
     */
    useNative:        false,

    /**
     * Constructor
     * @method initialize
     * @param {String} text
     * @param {Object} [options]
     * @return {fabric.Text} thisArg
     */
    initialize: function(text, options) {
      this._initStateProperties();
      this.text = text;
      this.setOptions(options);
      this.theta = this.angle * Math.PI / 180;
      this.width = this.getWidth();
      this.setCoords();
    },

    /**
     * Creates `stateProperties` list on an instance, and adds `fabric.Text` -specific ones to it
     * (such as "fontFamily", "fontWeight", etc.)
     * @private
     * @method _initStateProperties
     */
    _initStateProperties: function() {
      this.stateProperties = this.stateProperties.concat();
      this.stateProperties.push(
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
        'backgroundColor'
      );
      fabric.util.removeFromArray(this.stateProperties, 'width');
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
      // Run the native method if there is no Cufon
      if(typeof Cufon === 'undefined' || this.useNative === true) {
        this._render_native(ctx);
      }
      else {
        var o = Cufon.textOptions || (Cufon.textOptions = { });

        // export options to be used by cufon.js
        o.left = this.left;
        o.top = this.top;
        o.context = ctx;
        o.color = this.fill;

        var el = this._initDummyElement();

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
          backgroundColor: this.backgroundColor
        });

        // update width, height
        this.width = o.width;
        this.height = o.height;
        this._totalLineHeight = o.totalLineHeight;
        this._fontAscent = o.fontAscent;
        this._boundaries = o.boundaries;
        this._shadowOffsets = o.shadowOffsets;
        this._shadows = o.shadows || [ ];

        // need to set coords _after_ the width/height was retreived from Cufon
        this.setCoords();
      }
    },

    /**
     * Renders text with the native drawing methods, not Cufon.
     * This method will not listen to textDecoration, textShadow, background or path settings. They are just not possible in native methods.
     * Background may be possible by overlaying it on another rectangle.
     * @private
     * @method _render
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render_native: function(ctx) {
      // Create the font string
      var font = [
        this.fontStyle,
        this.fontWeight,
        this.fontSize + 'px/' + this.lineHeight,
        this.fontFamily
      ];

      ctx.fillStyle = this.fill;
      ctx.strokeStyle = this.strokeStyle;
      ctx.lineWidth = this.strokeWidth;

      ctx.font = font.join(' ');
      ctx.textAlign = this.textAlign;

      this.transform(ctx);
      this.width = ctx.measureText(this.text).width;
      this.height = this.fontSize;

      ctx.fillText(this.text, -this.width / 2, 0);

      if(this.strokeStyle) {
        ctx.strokeText(this.text, -this.width / 2, 0);
      }

      this.setCoords();
    },

    /**
     * @private
     * @method _initDummyElement
     */
    _initDummyElement: function() {
      var el = fabric.document.createElement('pre'),
          container = fabric.document.createElement('div');

      // Cufon doesn't play nice with textDecoration=underline if element doesn't have a parent
      container.appendChild(el);

      if (typeof G_vmlCanvasManager == 'undefined') {
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
        this.hideCorners || this.drawCorners(ctx);
      }
      ctx.restore();
    },

    /**
     * Returns object representation of an instance
     * @method toObject
     * @return {Object} Object representation of text object
     */
    toObject: function() {
      return extend(this.callSuper('toObject'), {
        text:           this.text,
        fontSize:       this.fontSize,
        fontWeight:     this.fontWeight,
        fontFamily:     this.fontFamily,
        fontStyle:      this.fontStyle,
        lineHeight:     this.lineHeight,
        textDecoration: this.textDecoration,
        textShadow:     this.textShadow,
        textAlign:      this.textAlign,
        path:           this.path,
        strokeStyle:    this.strokeStyle,
        strokeWidth:    this.strokeWidth,
        backgroundColor: this.backgroundColor
      });
    },

    /**
     * Returns svg representation of an instance
     * @method toSVG
     * @return {string} svg representation of an instance
     */
    toSVG: function() {

      var textLines = this.text.split(/\r?\n/),
          lineTopOffset = -this._fontAscent - ((this._fontAscent / 5) * this.lineHeight),

          textLeftOffset = -(this.width/2),
          textTopOffset = (this.height/2) - (textLines.length * this.fontSize) - this._totalLineHeight,

          textAndBg = this._getSVGTextAndBg(lineTopOffset, textLeftOffset, textLines),
          shadowSpans = this._getSVGShadows(lineTopOffset, textLines);

      // move top offset by an ascent
      textTopOffset += ((this._fontAscent / 5) * this.lineHeight);

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

    _getSVGShadows: function(lineTopOffset, textLines) {
      var shadowSpans = [], j, i, jlen, ilen, lineTopOffsetMultiplier = 1;

      for (j = 0, jlen = this._shadows.length; j < jlen; j++) {
        for (i = 0, ilen = textLines.length; i < ilen; i++) {
          if (textLines[i] !== '') {
            var lineLeftOffset = (this._boundaries && this._boundaries[i]) ? this._boundaries[i].left : 0;
            shadowSpans.push(
              '<tspan x="',
              toFixed((lineLeftOffset + lineTopOffsetMultiplier) + this._shadowOffsets[j][0], 2),
              (i === 0 ? '" y' : '" dy'), '="',
              toFixed(lineTopOffset + (i === 0 ? this._shadowOffsets[j][1] : 0), 2),
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

    _getSVGTextAndBg: function(lineTopOffset, textLeftOffset, textLines) {
      var textSpans = [ ], textBgRects = [ ], i, lineLeftOffset, len, lineTopOffsetMultiplier = 1;

      // text and background
      for (i = 0, len = textLines.length; i < len; i++) {
        if (textLines[i] !== '') {
          lineLeftOffset = (this._boundaries && this._boundaries[i]) ? toFixed(this._boundaries[i].left, 2) : 0;
          textSpans.push(
            '<tspan x="',
            lineLeftOffset, '" ',
            (i === 0 ? 'y' : 'dy'), '="',
            toFixed(lineTopOffset * lineTopOffsetMultiplier, 2) , '" ',
            // doing this on <tspan> elements since setting opacity on containing <text> one doesn't work in Illustrator
            this._getFillAttributes(this.fill), '>',
            fabric.util.string.escapeXml(textLines[i]),
            '</tspan>'
          );
          lineTopOffsetMultiplier = 1;
        } else {
          // in some environments (e.g. IE 7 & 8) empty tspans are completely ignored, using a lineTopOffsetMultiplier
          // prevents empty tspans
          lineTopOffsetMultiplier++;
        }

        if (!this.backgroundColor) continue;

        textBgRects.push(
          '<rect ',
            this._getFillAttributes(this.backgroundColor),
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

    // Adobe Illustrator (at least CS5) is unable to render rgba()-based fill values
    // we work around it by "moving" alpha channel into opacity attribute and setting fill's alpha to 1
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
     * Sets fontSize of an instance and updates its coordinates
     * @method setFontsize
     * @param {Number} value
     * @return {fabric.Text} thisArg
     * @chainable
     */
    setFontsize: function(value) {
      this.set('fontSize', value);
      this.setCoords();
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
     * Sets text of an instance, and updates its coordinates
     * @method setText
     * @param {String} value
     * @return {fabric.Text} thisArg
     * @chainable
     */
    setText: function(value) {
      this.set('text', value);
      this.setCoords();
      return this;
    },

    /**
     * Sets specified property to a specified value
     * @method set
     * @param {String} name
     * @param {Any} value
     * @return {fabric.Text} thisArg
     * @chainable
     */
    set: function(name, value) {
      if (typeof name == 'object') {
        for (var prop in name) {
          this.set(prop, name[prop]);
        }
      }
      else {
        this[name] = value;
        if (name === 'fontFamily' && this.path) {
          this.path = this.path.replace(/(.*?)([^\/]*)(\.font\.js)/, '$1' + value + '$3');
        }
      }
      return this;
    }
  });

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
   * @return {fabric.Text} an instance
   */
  fabric.Text.fromElement = function(element) {
    // TODO (kangax): implement this
  };

  fabric.Text.async = true;

})(typeof exports != 'undefined' ? exports : this);