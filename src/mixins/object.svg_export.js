/* _TO_SVG_START_ */
(function() {
  function getSvgColorString(prop, value) {
    if (!value) {
      return prop + ': none; ';
    }
    else if (value.toLive) {
      return prop + ': url(#SVGID_' + value.id + '); ';
    }
    else {
      var color = new fabric.Color(value),
          str = prop + ': ' + color.toRgb() + '; ',
          opacity = color.getAlpha();
      if (opacity !== 1) {
        //change the color in rgb + opacity
        str += prop + '-opacity: ' + opacity.toString() + '; ';
      }
      return str;
    }
  }

  var toFixed = fabric.util.toFixed;

  fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {
    /**
     * Returns styles-string for svg-export
     * @param {Boolean} skipShadow a boolean to skip shadow filter output
     * @return {String}
     */
    getSvgStyles: function(skipShadow) {

      var fillRule = this.fillRule,
          strokeWidth = this.strokeWidth ? this.strokeWidth : '0',
          strokeDashArray = this.strokeDashArray ? this.strokeDashArray.join(' ') : 'none',
          strokeLineCap = this.strokeLineCap ? this.strokeLineCap : 'butt',
          strokeLineJoin = this.strokeLineJoin ? this.strokeLineJoin : 'miter',
          strokeMiterLimit = this.strokeMiterLimit ? this.strokeMiterLimit : '4',
          opacity = typeof this.opacity !== 'undefined' ? this.opacity : '1',
          visibility = this.visible ? '' : ' visibility: hidden;',
          filter = skipShadow ? '' : this.getSvgFilter(),
          fill = getSvgColorString('fill', this.fill),
          stroke = getSvgColorString('stroke', this.stroke);

      return [
        stroke,
        'stroke-width: ', strokeWidth, '; ',
        'stroke-dasharray: ', strokeDashArray, '; ',
        'stroke-linecap: ', strokeLineCap, '; ',
        'stroke-linejoin: ', strokeLineJoin, '; ',
        'stroke-miterlimit: ', strokeMiterLimit, '; ',
        fill,
        'fill-rule: ', fillRule, '; ',
        'opacity: ', opacity, ';',
        filter,
        visibility
      ].join('');
    },

    /**
     * Returns styles-string for svg-export
     * @param {Object} style the object from which to retrieve style properties
     * @param {Boolean} useWhiteSpace a boolean to include an additional attribute in the style.
     * @return {String}
     */
    getSvgSpanStyles: function(style, useWhiteSpace) {
      var term = '; ';
      var fontFamily = style.fontFamily ?
        'font-family: ' + (((style.fontFamily.indexOf('\'') === -1 && style.fontFamily.indexOf('"') === -1) ?
          '\'' + style.fontFamily  + '\'' : style.fontFamily)) + term : '';
      var strokeWidth = style.strokeWidth ? 'stroke-width: ' + style.strokeWidth + term : '',
          fontFamily = fontFamily,
          fontSize = style.fontSize ? 'font-size: ' + style.fontSize + 'px' + term : '',
          fontStyle = style.fontStyle ? 'font-style: ' + style.fontStyle + term : '',
          fontWeight = style.fontWeight ? 'font-weight: ' + style.fontWeight + term : '',
          fill = style.fill ? getSvgColorString('fill', style.fill) : '',
          stroke = style.stroke ? getSvgColorString('stroke', style.stroke) : '',
          textDecoration = this.getSvgTextDecoration(style),
          deltaY = style.deltaY ? 'baseline-shift: ' + (-style.deltaY) + '; ' : '';
      if (textDecoration) {
        textDecoration = 'text-decoration: ' + textDecoration + term;
      }

      return [
        stroke,
        strokeWidth,
        fontFamily,
        fontSize,
        fontStyle,
        fontWeight,
        textDecoration,
        fill,
        deltaY,
        useWhiteSpace ? 'white-space: pre; ' : ''
      ].join('');
    },

    /**
     * Returns text-decoration property for svg-export
     * @param {Object} style the object from which to retrieve style properties
     * @return {String}
     */
    getSvgTextDecoration: function(style) {
      if ('overline' in style || 'underline' in style || 'linethrough' in style) {
        return (style.overline ? 'overline ' : '') +
          (style.underline ? 'underline ' : '') + (style.linethrough ? 'line-through ' : '');
      }
      return '';
    },

    /**
     * Returns filter for svg shadow
     * @return {String}
     */
    getSvgFilter: function() {
      return this.shadow ? 'filter: url(#SVGID_' + this.shadow.id + ');' : '';
    },

    /**
     * Returns id attribute for svg output
     * @return {String}
     */
    getSvgId: function() {
      return this.id ? 'id="' + this.id + '" ' : '';
    },

    /**
     * Returns transform-string for svg-export
     * @return {String}
     */
    getSvgTransform: function() {
      var angle = this.angle,
          skewX = (this.skewX % 360),
          skewY = (this.skewY % 360),
          center = this.getCenterPoint(),

          NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS,

          translatePart = 'translate(' +
                            toFixed(center.x, NUM_FRACTION_DIGITS) +
                            ' ' +
                            toFixed(center.y, NUM_FRACTION_DIGITS) +
                          ')',

          anglePart = angle !== 0
            ? (' rotate(' + toFixed(angle, NUM_FRACTION_DIGITS) + ')')
            : '',

          scalePart = (this.scaleX === 1 && this.scaleY === 1)
            ? '' :
            (' scale(' +
              toFixed(this.scaleX, NUM_FRACTION_DIGITS) +
              ' ' +
              toFixed(this.scaleY, NUM_FRACTION_DIGITS) +
            ')'),

          skewXPart = skewX !== 0 ? ' skewX(' + toFixed(skewX, NUM_FRACTION_DIGITS) + ')' : '',

          skewYPart = skewY !== 0 ? ' skewY(' + toFixed(skewY, NUM_FRACTION_DIGITS) + ')' : '',

          flipXPart = this.flipX ? ' matrix(-1 0 0 1 0 0) ' : '',

          flipYPart = this.flipY ? ' matrix(1 0 0 -1 0 0)' : '';

      return [
        translatePart, anglePart, scalePart, flipXPart, flipYPart, skewXPart, skewYPart
      ].join('');
    },

    /**
     * Returns transform-string for svg-export from the transform matrix of single elements
     * @return {String}
     */
    getSvgTransformMatrix: function() {
      return this.transformMatrix ? ' matrix(' + this.transformMatrix.join(' ') + ') ' : '';
    },

    _setSVGBg: function(textBgRects) {
      if (this.backgroundColor) {
        var NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS;
        textBgRects.push(
          '\t\t<rect ',
          this._getFillAttributes(this.backgroundColor),
          ' x="',
          toFixed(-this.width / 2, NUM_FRACTION_DIGITS),
          '" y="',
          toFixed(-this.height / 2, NUM_FRACTION_DIGITS),
          '" width="',
          toFixed(this.width, NUM_FRACTION_DIGITS),
          '" height="',
          toFixed(this.height, NUM_FRACTION_DIGITS),
          '"></rect>\n');
      }
    },

    /**
     * @private
     */
    _createBaseSVGMarkup: function() {
      var markup = [];

      if (this.fill && this.fill.toLive) {
        markup.push(this.fill.toSVG(this, false));
      }
      if (this.stroke && this.stroke.toLive) {
        markup.push(this.stroke.toSVG(this, false));
      }
      if (this.shadow) {
        markup.push(this.shadow.toSVG(this));
      }
      return markup;
    },

    addPaintOrder: function() {
      return this.paintFirst !== 'fill' ? ' paint-order="' + this.paintFirst + '" ' : '';
    }
  });
})();
/* _TO_SVG_END_ */
