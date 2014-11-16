/* _TO_SVG_START_ */
function isDefault(prop, defaultValue) {
  return typeof this[prop] !== 'undefined' && this[prop] === defaultValue;
}

fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

  /**
   * Returns styles-string for svg-export
   * @return {String}
   */
  getSvgStyles: function() {

    var fill = 'fill: none; ', stroke = '', fillRule = '', strokeWidth = '', strokeDashArray = '', strokeLineCap = '',
        strokeLineJoin = '', strokeMiterLimit = '', opacity = '', visibility = '', filter = '';

    if (!isDefault('fill', '')) {
      if (this.fill) {
        fill = 'fill: ' + (this.fill && this.fill.toLive ? 'url(#SVGID_' + this.fill.id + ')' : this.fill) + '; ';
      }
    }
    if (!isDefault('stroke', '')) {
      if (this.stroke) {
        stroke = 'stroke: ' + (this.stroke && this.stroke.toLive ? 'url(#SVGID_' + this.stroke.id + ')' : this.stroke) + '; ';
      }
    }
    if (!isDefault('fillRule', 'nonzero')) {
      fillRule = 'fill-rule: ' + this.fillRule + '; ';
    }
    if (!isDefault('strokeWidth', '1')) {
      strokeWidth = 'stroke-width: ' + this.strokeWidth + '; ';
    }
    if (!isDefault('strokeDashArray', '')) {
      strokeDashArray = 'stroke-dasharray: ' + this.strokeDashArray.join(' ') + '; ';
    }
    if (!isDefault('strokeLineCap', 'butt')) {
      strokeLineCap = 'stroke-linecap: ' + this.strokeLineCap + '; ';
    }
    if (!isDefault('strokeLineJoin', 'miter')) {
      strokeLineJoin = 'stroke-linejoin: ' + this.strokeLineJoin + '; ';
    }
    if (!isDefault('strokeMiterLimit', '4')) {
      strokeMiterLimit = 'stroke-miterlimit: ' + this.strokeMiterLimit + '; ';
    }
    if (!isDefault('opacity', '1')) {
      opacity = 'opacity: ' + this.opacity + '; ';
    }
    if (!isDefault('visible', true)) {
      visibility = 'visibility: hidden; ';
    }
    if (this.shadow && this.type !== 'text') {
      filter = 'filter: url(#SVGID_' + this.shadow.id + '); ';
    }
    return [fill, fillRule, stroke, strokeWidth, strokeDashArray, strokeLineCap,
            strokeLineJoin, strokeMiterLimit, opacity, visibility, filter].join('');
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
        vpt = !this.canvas || this.canvas.svgViewportTransformation ? this.getViewportTransform() : [1, 0, 0, 1, 0, 0],
        center = fabric.util.transformPoint(this.getCenterPoint(), vpt),

        NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS,

        translatePart = this.type === 'path-group' ? '' : 'translate(' +
                          toFixed(center.x, NUM_FRACTION_DIGITS) +
                          ' ' +
                          toFixed(center.y, NUM_FRACTION_DIGITS) +
                        ')',

        anglePart = angle !== 0
          ? (' rotate(' + toFixed(angle, NUM_FRACTION_DIGITS) + ')')
          : '',

        scalePart = (this.scaleX === 1 && this.scaleY === 1 && vpt[0] === 1 && vpt[3] === 1)
          ? '' :
          (' scale(' +
            toFixed(this.scaleX * vpt[0], NUM_FRACTION_DIGITS) +
            ' ' +
            toFixed(this.scaleY * vpt[3], NUM_FRACTION_DIGITS) +
          ')'),

        addTranslateX = this.type === 'path-group' ? this.width * vpt[0] : 0,

        flipXPart = this.flipX ? ' matrix(-1 0 0 1 ' + addTranslateX + ' 0) ' : '',

        addTranslateY = this.type === 'path-group' ? this.height * vpt[3] : 0,

        flipYPart = this.flipY ? ' matrix(1 0 0 -1 0 ' + addTranslateY + ')' : '';

    return [
      translatePart, anglePart, scalePart, flipXPart, flipYPart
    ].join('');
  },

  /**
   * Returns transform-string for svg-export from the transform matrix of single elements
   * @return {String}
   */
  getSvgTransformMatrix: function() {
    return this.transformMatrix ? ' matrix(' + this.transformMatrix.join(' ') + ')' : '';
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
