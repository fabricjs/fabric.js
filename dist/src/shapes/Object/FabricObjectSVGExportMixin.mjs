import { uid } from '../../util/internals/uid.mjs';
import { colorPropToSVG, matrixToSVG } from '../../util/misc/svgParsing.mjs';
import { NONE, FILL, STROKE } from '../../constants.mjs';
import { isFiller } from '../../util/typeAssertions.mjs';

class FabricObjectSVGExportMixin {
  /**
   * When an object is being exported as SVG as a clippath, a reference inside the SVG is needed.
   * This reference is a UID in the fabric namespace and is temporary stored here.
   * @type {String}
   */

  /**
   * Returns styles-string for svg-export
   * @param {Boolean} skipShadow a boolean to skip shadow filter output
   * @return {String}
   */
  getSvgStyles(skipShadow) {
    const fillRule = this.fillRule ? this.fillRule : 'nonzero',
      strokeWidth = this.strokeWidth ? this.strokeWidth : '0',
      strokeDashArray = this.strokeDashArray ? this.strokeDashArray.join(' ') : NONE,
      strokeDashOffset = this.strokeDashOffset ? this.strokeDashOffset : '0',
      strokeLineCap = this.strokeLineCap ? this.strokeLineCap : 'butt',
      strokeLineJoin = this.strokeLineJoin ? this.strokeLineJoin : 'miter',
      strokeMiterLimit = this.strokeMiterLimit ? this.strokeMiterLimit : '4',
      opacity = typeof this.opacity !== 'undefined' ? this.opacity : '1',
      visibility = this.visible ? '' : ' visibility: hidden;',
      filter = skipShadow ? '' : this.getSvgFilter(),
      fill = colorPropToSVG(FILL, this.fill),
      stroke = colorPropToSVG(STROKE, this.stroke);
    return [stroke, 'stroke-width: ', strokeWidth, '; ', 'stroke-dasharray: ', strokeDashArray, '; ', 'stroke-linecap: ', strokeLineCap, '; ', 'stroke-dashoffset: ', strokeDashOffset, '; ', 'stroke-linejoin: ', strokeLineJoin, '; ', 'stroke-miterlimit: ', strokeMiterLimit, '; ', fill, 'fill-rule: ', fillRule, '; ', 'opacity: ', opacity, ';', filter, visibility].join('');
  }

  /**
   * Returns filter for svg shadow
   * @return {String}
   */
  getSvgFilter() {
    return this.shadow ? "filter: url(#SVGID_".concat(this.shadow.id, ");") : '';
  }

  /**
   * Returns id attribute for svg output
   * @return {String}
   */
  getSvgCommons() {
    return [this.id ? "id=\"".concat(this.id, "\" ") : '', this.clipPath ? "clip-path=\"url(#".concat(this.clipPath.clipPathId, ")\" ") : ''].join('');
  }

  /**
   * Returns transform-string for svg-export
   * @param {Boolean} use the full transform or the single object one.
   * @return {String}
   */
  getSvgTransform(full) {
    let additionalTransform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    const transform = full ? this.calcTransformMatrix() : this.calcOwnMatrix(),
      svgTransform = "transform=\"".concat(matrixToSVG(transform));
    return "".concat(svgTransform).concat(additionalTransform, "\" ");
  }

  /**
   * Returns svg representation of an instance
   * This function is implemented in each subclass
   * This is just because typescript otherwise cryies all the time
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG(_reviver) {
    return [''];
  }

  /**
   * Returns svg representation of an instance
   * @param {TSVGReviver} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  toSVG(reviver) {
    return this._createBaseSVGMarkup(this._toSVG(reviver), {
      reviver
    });
  }

  /**
   * Returns svg clipPath representation of an instance
   * @param {TSVGReviver} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  toClipPathSVG(reviver) {
    return '\t' + this._createBaseClipPathSVGMarkup(this._toSVG(reviver), {
      reviver
    });
  }

  /**
   * @private
   */
  _createBaseClipPathSVGMarkup(objectMarkup) {
    let {
      reviver,
      additionalTransform = ''
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const commonPieces = [this.getSvgTransform(true, additionalTransform), this.getSvgCommons()].join(''),
      // insert commons in the markup, style and svgCommons
      index = objectMarkup.indexOf('COMMON_PARTS');
    objectMarkup[index] = commonPieces;
    return reviver ? reviver(objectMarkup.join('')) : objectMarkup.join('');
  }

  /**
   * @private
   */
  _createBaseSVGMarkup(objectMarkup) {
    let {
      noStyle,
      reviver,
      withShadow,
      additionalTransform
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const styleInfo = noStyle ? '' : "style=\"".concat(this.getSvgStyles(), "\" "),
      shadowInfo = withShadow ? "style=\"".concat(this.getSvgFilter(), "\" ") : '',
      clipPath = this.clipPath,
      vectorEffect = this.strokeUniform ? 'vector-effect="non-scaling-stroke" ' : '',
      absoluteClipPath = clipPath && clipPath.absolutePositioned,
      stroke = this.stroke,
      fill = this.fill,
      shadow = this.shadow,
      markup = [],
      // insert commons in the markup, style and svgCommons
      index = objectMarkup.indexOf('COMMON_PARTS');
    let clipPathMarkup;
    if (clipPath) {
      clipPath.clipPathId = "CLIPPATH_".concat(uid());
      clipPathMarkup = "<clipPath id=\"".concat(clipPath.clipPathId, "\" >\n").concat(clipPath.toClipPathSVG(reviver), "</clipPath>\n");
    }
    if (absoluteClipPath) {
      markup.push('<g ', shadowInfo, this.getSvgCommons(), ' >\n');
    }
    markup.push('<g ', this.getSvgTransform(false), !absoluteClipPath ? shadowInfo + this.getSvgCommons() : '', ' >\n');
    const commonPieces = [styleInfo, vectorEffect, noStyle ? '' : this.addPaintOrder(), ' ', additionalTransform ? "transform=\"".concat(additionalTransform, "\" ") : ''].join('');
    objectMarkup[index] = commonPieces;
    if (isFiller(fill)) {
      markup.push(fill.toSVG(this));
    }
    if (isFiller(stroke)) {
      markup.push(stroke.toSVG(this));
    }
    if (shadow) {
      markup.push(shadow.toSVG(this));
    }
    if (clipPath) {
      markup.push(clipPathMarkup);
    }
    markup.push(objectMarkup.join(''));
    markup.push('</g>\n');
    absoluteClipPath && markup.push('</g>\n');
    return reviver ? reviver(markup.join('')) : markup.join('');
  }
  addPaintOrder() {
    return this.paintFirst !== FILL ? " paint-order=\"".concat(this.paintFirst, "\" ") : '';
  }
}

export { FabricObjectSVGExportMixin };
//# sourceMappingURL=FabricObjectSVGExportMixin.mjs.map
