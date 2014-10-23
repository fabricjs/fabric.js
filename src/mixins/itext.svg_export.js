/* _TO_SVG_START_ */
fabric.util.object.extend(fabric.IText.prototype, /** @lends fabric.IText.prototype */ {

  /**
   * @private
   */
  _setSVGTextLineText: function(textLine, lineIndex, textSpans, lineHeight, lineTopOffsetMultiplier, textBgRects) {
    if (!this.styles[lineIndex]) {
      this.callSuper('_setSVGTextLineText',
        textLine, lineIndex, textSpans, lineHeight, lineTopOffsetMultiplier);
    }
    else {
      this._setSVGTextLineChars(
        textLine, lineIndex, textSpans, lineHeight, lineTopOffsetMultiplier, textBgRects);
    }
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

    for (var i = 0, len = chars.length; i < len; i++) {
      var styleDecl = this.styles[lineIndex][i] || { };

      textSpans.push(
        this._createTextCharSpan(
          chars[i], styleDecl, lineLeftOffset, lineTopOffset, yProp, charOffset));

      var charWidth = this._getWidthOfChar(this.ctx, chars[i], lineIndex, i);

      if (styleDecl.textBackgroundColor) {
        textBgRects.push(
          this._createTextCharBg(
            styleDecl, lineLeftOffset, lineTopOffset, heightOfLine, charWidth, charOffset));
      }

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
    return lineTopOffset - this.height / 2;
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

    var fillStyles = this.getSvgStyles.call(fabric.util.object.extend({
      visible: true,
      fill: this.fill,
      stroke: this.stroke,
      type: 'text'
    }, styleDecl));

    return [
      //jscs:disable validateIndentation
      '<tspan x="', lineLeftOffset + charOffset, '" ',
        yProp, '="', lineTopOffset, '" ',

        (styleDecl.fontFamily ? 'font-family="' + styleDecl.fontFamily.replace(/"/g, '\'') + '" ': ''),
        (styleDecl.fontSize ? 'font-size="' + styleDecl.fontSize + '" ': ''),
        (styleDecl.fontStyle ? 'font-style="' + styleDecl.fontStyle + '" ': ''),
        (styleDecl.fontWeight ? 'font-weight="' + styleDecl.fontWeight + '" ': ''),
        (styleDecl.textDecoration ? 'text-decoration="' + styleDecl.textDecoration + '" ': ''),
        'style="', fillStyles, '">',

        fabric.util.string.escapeXml(_char),
      '</tspan>'
      //jscs:enable validateIndentation
    ].join('');
  }
});
/* _TO_SVG_END_ */
