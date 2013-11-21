/* _TO_SVG_START_ */
fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

  /**
   * Returns styles-string for svg-export
   * @return {String}
   */
  getSvgStyles: function() {

    var fill = this.fill
      ? (this.fill.toLive ? 'url(#SVGID_' + this.fill.id + ')' : this.fill)
      : 'none';

    var stroke = this.stroke
      ? (this.stroke.toLive ? 'url(#SVGID_' + this.stroke.id + ')' : this.stroke)
      : 'none';

    var strokeWidth = this.strokeWidth ? this.strokeWidth : '0';
    var strokeDashArray = this.strokeDashArray ? this.strokeDashArray.join(' ') : '';
    var strokeLineCap = this.strokeLineCap ? this.strokeLineCap : 'butt';
    var strokeLineJoin = this.strokeLineJoin ? this.strokeLineJoin : 'miter';
    var strokeMiterLimit = this.strokeMiterLimit ? this.strokeMiterLimit : '4';
    var opacity = typeof this.opacity !== 'undefined' ? this.opacity : '1';

    var visibility = this.visible ? '' : " visibility: hidden;";
    var filter = this.shadow && this.type !== 'text' ? 'filter: url(#SVGID_' + this.shadow.id + ');' : '';

    return [
      "stroke: ", stroke, "; ",
      "stroke-width: ", strokeWidth, "; ",
      "stroke-dasharray: ", strokeDashArray, "; ",
      "stroke-linecap: ", strokeLineCap, "; ",
      "stroke-linejoin: ", strokeLineJoin, "; ",
      "stroke-miterlimit: ", strokeMiterLimit, "; ",
      "fill: ", fill, "; ",
      "opacity: ", opacity, ";",
      filter,
      visibility
    ].join('');
  },

  /**
   * Returns transform-string for svg-export
   * @return {String}
   */
  getSvgTransform: function() {
    var toFixed = fabric.util.toFixed;
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
