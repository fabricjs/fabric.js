/* _TO_SVG_START_ */
fabric.util.object.extend(fabric.IText.prototype, /** @lends fabric.IText.prototype */ {

  /**
   * @private
   */
  _setSVGTextLineText: function(textLine, lineIndex, textSpans, lineHeight, lineTopOffsetMultiplier, textBgRects) {
    this._setSVGTextLineChars(textLine, lineIndex, textSpans, lineHeight, lineTopOffsetMultiplier, textBgRects);
  },

  /**
   * @private
   */
  _setSVGTextLineChars: function(textLine, lineIndex, textSpans, lineHeight, lineTopOffsetMultiplier, textBgRects) {
    var yProp = lineIndex === 0 || this.useNative ? 'y' : 'dy',
        chars = textLine.split(''),
        charOffset = 0,
        lineLeftOffset = this._getSVGLineLeftOffset(lineIndex),
        lineTopOffset = this._getSVGLineTopOffset(lineIndex),
        heightOfLine = this._getHeightOfLine(this.ctx, lineIndex);
    // Iterate the characters in the line, pushing tspan elements as necessary.
    for (var i = 0, len = chars.length; i < len; i++) {
      var styleDecl = (this.styles[lineIndex]) ? this.styles[lineIndex][i] || { } : {};
      var charWidth = this._getWidthOfChar(this.ctx, chars[i], lineIndex, i);
      // Push text if requested.
      if (textSpans) {
        var tspanRepresentingSingleCharacter = this._createTextCharSpan(chars[i], styleDecl, lineLeftOffset, lineTopOffset, yProp, charOffset);
        textSpans.push(tspanRepresentingSingleCharacter);
      }
      // Push background if requested.
      if (textBgRects && styleDecl.textBackgroundColor) {
        var tspanRepresentingBackgroundOfSingleCharacter = this._createTextCharBg(styleDecl, lineLeftOffset, lineTopOffset, heightOfLine, charWidth, charOffset);
        textBgRects.push(tspanRepresentingBackgroundOfSingleCharacter);
      }
      // Move to next character.
      charOffset += charWidth;
    }
  },

  /**
   * Push the tspan element(s) that will represent the shadow for the text line.
   * @private
   * @param {String} textLine Line of text to render.
   * @param {Number} lineIndex Line number being rendered.
   * @param {Array} shadowSpans Array to push the tspan elements into.
   * @param {Number} lineHeight Height of line being rendered.
   * @param {Number} lineTopOffsetMultiplier Misnamed adjustment to keep tspan considered non-trivial.
   */
  _setSVGTextLineShadow: function(textLine, lineIndex, shadowSpans, lineHeight, lineTopOffsetMultiplier) {
    // Call something like set text lines with an explicit override for stroke-opacity and fill-opacity.
    var yProp = lineIndex === 0 || this.useNative ? 'y' : 'dy',
        chars = textLine.split(''),
        charOffset = 0,
        lineLeftOffset = this._getSVGLineLeftOffset(lineIndex),
        lineTopOffset = this._getSVGLineTopOffset(lineIndex),
        heightOfLine = this._getHeightOfLine(this.ctx, lineIndex);

    // Iterate the characters in the line, pushing tspan elements as necessary.
    for (var i = 0, len = chars.length; i < len; i++) {
      // Obtain the style for the given character, which may contain a shadow definition.
      var styleDecl = (this.styles[lineIndex]) ? this.styles[lineIndex][i] || { } : {},
          clonedStyleDecl = fabric.util.object.clone(styleDecl),
          shadow = (clonedStyleDecl.shadow) ? clonedStyleDecl.shadow : this.shadow,
          leftAdjustment = 0,
          topAdjustment = 0,
          charWidth = this._getWidthOfChar(this.ctx, chars[i], lineIndex, i);
  
      // If the shadow actually exists, pull out the actual data to be used in the tspan element (x, y, fill color, fill opacity, stroke opacity).
      if (shadow) {
        var value = shadow.color;
        var fillColor = (value && typeof value === 'string') ? new fabric.Color(value) : '';
        if (fillColor !== '') {
          clonedStyleDecl.strokeOpacity = fillColor.getAlpha();
          clonedStyleDecl.fillOpacity = fillColor.getAlpha();
          clonedStyleDecl.fill = fillColor.setAlpha(1).toRgb();
          // Override a colored stroke to cast a flat shadow. Otherwise, enforce a zero stroke width (considering strokes are inward).
          if (clonedStyleDecl.stroke) {
            clonedStyleDecl.stroke = undefined;
          } else {
            clonedStyleDecl.strokeWidth = 0;
          }
        }
        leftAdjustment = shadow.offsetX;
        topAdjustment = shadow.offsetY;
        // Push text if requested.
        if (shadowSpans) {
          var tspanRepresentingShadowOfSingleCharacter = this._createTextCharSpan(chars[i], clonedStyleDecl, lineLeftOffset + leftAdjustment, lineTopOffset + topAdjustment, yProp, charOffset);
          shadowSpans.push(tspanRepresentingShadowOfSingleCharacter);
        }
      }
      // Move to next character.
      charOffset += charWidth;
    }
  },

  /**
   * @private
   */
  _getSVGLineLeftOffset: function(lineIndex) {
    return (this._boundaries && this._boundaries[lineIndex])
      ? fabric.util.toFixed(this._boundaries[lineIndex].left, 2)
      : 0;
  },

  /**
   * @private
   */
  _getSVGLineTopOffset: function(lineIndex) {
    var lineTopOffset = 0;
    for (var j = 0; j <= lineIndex; j++) {
      lineTopOffset += this._getHeightOfLine(this.ctx, j);
    }
    return lineTopOffset - this.height;
  },

  /**
   * @private
   */
  _createTextCharBg: function(styleDecl, lineLeftOffset, lineTopOffset, heightOfLine, charWidth, charOffset) {
    return [
      //jscs:disable validateIndentation
      '<rect fill="', styleDecl.textBackgroundColor,
      '" transform="translate(',
        -this.width / 2, ' ',
        -this.height + heightOfLine, ')',
      '" x="', lineLeftOffset + charOffset,
      '" y="', lineTopOffset + heightOfLine,
      '" width="', charWidth,
      '" height="', heightOfLine,
      '"></rect>'
      //jscs:enable validateIndentation
    ].join('');
  },

  /**
   * @private
   */
  _createTextCharSpan: function(_char, styleDecl, lineLeftOffset, lineTopOffset, yProp, charOffset) {
    var combinedStyleDecl = fabric.util.object.extend({
      visible: true,
      fill: this.fill,
      stroke: this.stroke,
      type: 'text'
    }, styleDecl);
    // Update stroke width in the case that the embedded style is depending on the overall stroke width.
    if (combinedStyleDecl.strokeWidth == null && this.strokeWidth != null) {
      combinedStyleDecl.strokeWidth = this.strokeWidth;
    }
    var fillStyles = this.getSvgStyles.call(combinedStyleDecl);
    return [
      //jscs:disable validateIndentation
<<<<<<< Upstream, based on upstream/master
      '<tspan x="', lineLeftOffset + charOffset, '" ',
        yProp, '="', lineTopOffset, '" ',

        (styleDecl.fontFamily ? 'font-family="' + styleDecl.fontFamily.replace(/"/g, '\'') + '" ': ''),
        (styleDecl.fontSize ? 'font-size="' + styleDecl.fontSize + '" ': ''),
        (styleDecl.fontStyle ? 'font-style="' + styleDecl.fontStyle + '" ': ''),
        (styleDecl.fontWeight ? 'font-weight="' + styleDecl.fontWeight + '" ': ''),
        (styleDecl.textDecoration ? 'text-decoration="' + styleDecl.textDecoration + '" ': ''),
=======
      '<tspan',
        ' ', 'x="', lineLeftOffset + charOffset, '"',
        ' ', yProp, '="', lineTopOffset, '"',
        ' ',
        (combinedStyleDecl.fontFamily ? 'font-family="' + combinedStyleDecl.fontFamily.replace(/"/g,'\'') + '" ': ''),
        (combinedStyleDecl.fontSize ? 'font-size="' + combinedStyleDecl.fontSize + '" ': ''),
        (combinedStyleDecl.fontStyle ? 'font-style="' + combinedStyleDecl.fontStyle + '" ': ''),
        (combinedStyleDecl.fontWeight ? 'font-weight="' + combinedStyleDecl.fontWeight + '" ': ''),
        (combinedStyleDecl.textDecoration ? 'text-decoration="' + combinedStyleDecl.textDecoration + '" ': ''),
        ((combinedStyleDecl.fillOpacity != null) ? 'fill-opacity="' + combinedStyleDecl.fillOpacity + '" ' : ''),
        ((combinedStyleDecl.strokeOpacity != null) ? 'stroke-opacity="' + combinedStyleDecl.strokeOpacity + '" ' : ''),
>>>>>>> 5871ef9 Ability to curve fabric.Text-like's around a fabric.Path for Issue #729.
        'style="', fillStyles, '">',
        fabric.util.string.escapeXml(_char),
      '</tspan>'
      //jscs:enable validateIndentation
    ].join('');
  }
});
/* _TO_SVG_END_ */
