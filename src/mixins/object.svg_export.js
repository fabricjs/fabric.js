/* _TO_SVG_START_ */
fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

  /**
   * Returns styles-string for svg-export
   * @return {String}
   */
  getSvgStyles: function() {

    var fill = this.fill
          ? (this.fill.toLive ? 'url(#SVGID_' + this.fill.id + ')' : this.fill)
          : 'none',
        fillRule = this.fillRule,
        stroke = this.stroke
          ? (this.stroke.toLive ? 'url(#SVGID_' + this.stroke.id + ')' : this.stroke)
          : 'none',

        strokeWidth = this.strokeWidth ? this.strokeWidth : '0',
        strokeDashArray = this.strokeDashArray ? this.strokeDashArray.join(' ') : 'none',
        strokeLineCap = this.strokeLineCap ? this.strokeLineCap : 'butt',
        strokeLineJoin = this.strokeLineJoin ? this.strokeLineJoin : 'miter',
        strokeMiterLimit = this.strokeMiterLimit ? this.strokeMiterLimit : '4',
        opacity = typeof this.opacity !== 'undefined' ? this.opacity : '1',

        visibility = this.visible ? '' : ' visibility: hidden;',
        filter = this.getSvgFilter();

    return [
      'stroke: ', stroke, '; ',
      'stroke-width: ', strokeWidth, '; ',
      'stroke-dasharray: ', strokeDashArray, '; ',
      'stroke-linecap: ', strokeLineCap, '; ',
      'stroke-linejoin: ', strokeLineJoin, '; ',
      'stroke-miterlimit: ', strokeMiterLimit, '; ',
      'fill: ', fill, '; ',
      'fill-rule: ', fillRule, '; ',
      'opacity: ', opacity, ';',
      filter,
      visibility
    ].join('');
  },

  /**
   * Returns filter for svg shadow
   * @return {String}
   */
  getSvgFilter: function() {
    return this.shadow ? 'filter: url(#SVGID_' + this.shadow.id + ');' : '';
  },

  /**
   * Returns transform-string for svg-export
   * @return {String}
   */
  getSvgTransform: function() {
    if (this.group && this.group.type === 'path-group') {
      return '';
    }
    var toFixed = fabric.util.toFixed,
        angle = this.getAngle(),
        skewX = (this.getSkewX() % 360),
        skewY = (this.getSkewY() % 360),
        center = this.getCenterPoint(),

        NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS,

        translatePart = this.type === 'path-group' ? '' : 'translate(' +
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

        addTranslateX = this.type === 'path-group' ? this.width : 0,

        flipXPart = this.flipX ? ' matrix(-1 0 0 1 ' + addTranslateX + ' 0) ' : '',

        addTranslateY = this.type === 'path-group' ? this.height : 0,

        flipYPart = this.flipY ? ' matrix(1 0 0 -1 0 ' + addTranslateY + ')' : '';

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

  /**
   * @private
   */
  _createBaseSVGMarkup: function() {
    var markup = [ ];

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
  }
});
/* _TO_SVG_END_ */
