// @ts-nocheck
import { TSVGReviver } from '../../typedefs';
import { uid } from '../../util/internals/uid';
import { colorPropToSVG, matrixToSVG } from '../../util/misc/svgParsing';

export class FabricObjectSVGExportMixin {
  /**
   * When an object is being exported as SVG as a clippath, a reference inside the SVG is needed.
   * This reference is a UID in the fabric namespace and is temporary stored here.
   * @type {String}
   */
  declare clipPathId?: string;

  /**
   * Returns styles-string for svg-export
   * @param {Boolean} skipShadow a boolean to skip shadow filter output
   * @return {String}
   */
  getSvgStyles(skipShadow?: boolean) {
    const fillRule = this.fillRule ? this.fillRule : 'nonzero',
      strokeWidth = this.strokeWidth ? this.strokeWidth : '0',
      strokeDashArray = this.strokeDashArray
        ? this.strokeDashArray.join(' ')
        : 'none',
      strokeDashOffset = this.strokeDashOffset ? this.strokeDashOffset : '0',
      strokeLineCap = this.strokeLineCap ? this.strokeLineCap : 'butt',
      strokeLineJoin = this.strokeLineJoin ? this.strokeLineJoin : 'miter',
      strokeMiterLimit = this.strokeMiterLimit ? this.strokeMiterLimit : '4',
      opacity = typeof this.opacity !== 'undefined' ? this.opacity : '1',
      visibility = this.visible ? '' : ' visibility: hidden;',
      filter = skipShadow ? '' : this.getSvgFilter(),
      fill = colorPropToSVG('fill', this.fill),
      stroke = colorPropToSVG('stroke', this.stroke);

    return [
      stroke,
      'stroke-width: ',
      strokeWidth,
      '; ',
      'stroke-dasharray: ',
      strokeDashArray,
      '; ',
      'stroke-linecap: ',
      strokeLineCap,
      '; ',
      'stroke-dashoffset: ',
      strokeDashOffset,
      '; ',
      'stroke-linejoin: ',
      strokeLineJoin,
      '; ',
      'stroke-miterlimit: ',
      strokeMiterLimit,
      '; ',
      fill,
      'fill-rule: ',
      fillRule,
      '; ',
      'opacity: ',
      opacity,
      ';',
      filter,
      visibility,
    ].join('');
  }

  /**
   * Returns styles-string for svg-export
   * @param {Object} style the object from which to retrieve style properties
   * @param {Boolean} useWhiteSpace a boolean to include an additional attribute in the style.
   * @return {String}
   */
  getSvgSpanStyles(style, useWhiteSpace?: boolean) {
    const term = '; ',
      fontFamily = style.fontFamily
        ? `font-family: ${
            style.fontFamily.indexOf("'") === -1 &&
            style.fontFamily.indexOf('"') === -1
              ? `'${style.fontFamily}'`
              : style.fontFamily
          }${term}`
        : '',
      strokeWidth = style.strokeWidth
        ? `stroke-width: ${style.strokeWidth}${term}`
        : '',
      fontSize = style.fontSize ? `font-size: ${style.fontSize}px${term}` : '',
      fontStyle = style.fontStyle
        ? `font-style: ${style.fontStyle}${term}`
        : '',
      fontWeight = style.fontWeight
        ? `font-weight: ${style.fontWeight}${term}`
        : '',
      fill = style.fill ? colorPropToSVG('fill', style.fill) : '',
      stroke = style.stroke ? colorPropToSVG('stroke', style.stroke) : '',
      textDecoration = this.getSvgTextDecoration(style),
      deltaY = style.deltaY ? `baseline-shift: ${-style.deltaY}; ` : '';

    return [
      stroke,
      strokeWidth,
      fontFamily,
      fontSize,
      fontStyle,
      fontWeight,
      textDecoration
        ? `text-decoration: ${textDecoration}${term}`
        : textDecoration,
      fill,
      deltaY,
      useWhiteSpace ? 'white-space: pre; ' : '',
    ].join('');
  }

  /**
   * Returns text-decoration property for svg-export
   * @param {Object} style the object from which to retrieve style properties
   * @return {String}
   */
  getSvgTextDecoration(style) {
    return ['overline', 'underline', 'line-through']
      .filter((decoration) => style[decoration.replace('-', '')])
      .join(' ');
  }

  /**
   * Returns filter for svg shadow
   * @return {String}
   */
  getSvgFilter() {
    return this.shadow ? `filter: url(#SVGID_${this.shadow.id});` : '';
  }

  /**
   * Returns id attribute for svg output
   * @return {String}
   */
  getSvgCommons() {
    return [
      this.id ? `id="${this.id}" ` : '',
      this.clipPath ? `clip-path="url(#${this.clipPath.clipPathId})" ` : '',
    ].join('');
  }

  /**
   * Returns transform-string for svg-export
   * @param {Boolean} use the full transform or the single object one.
   * @return {String}
   */
  getSvgTransform(full?: boolean, additionalTransform = '') {
    const transform = full ? this.calcTransformMatrix() : this.calcOwnMatrix(),
      svgTransform = `transform="${matrixToSVG(transform)}`;
    return `${svgTransform}${additionalTransform}" `;
  }

  /**
   * Returns svg representation of an instance
   * @param {TSVGReviver} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  toSVG(reviver?: TSVGReviver) {
    return this._createBaseSVGMarkup(this._toSVG(reviver), {
      reviver,
    });
  }

  /**
   * Returns svg clipPath representation of an instance
   * @param {TSVGReviver} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  toClipPathSVG(reviver?: TSVGReviver) {
    return (
      '\t' +
      this._createBaseClipPathSVGMarkup(this._toSVG(reviver), {
        reviver,
      })
    );
  }

  /**
   * @private
   */
  _createBaseClipPathSVGMarkup(
    objectMarkup: string[],
    {
      reviver,
      additionalTransform = '',
    }: { reviver?: TSVGReviver; additionalTransform?: string } = {}
  ) {
    const commonPieces = [
        this.getSvgTransform(true, additionalTransform),
        this.getSvgCommons(),
      ].join(''),
      // insert commons in the markup, style and svgCommons
      index = objectMarkup.indexOf('COMMON_PARTS');
    objectMarkup[index] = commonPieces;
    return reviver ? reviver(objectMarkup.join('')) : objectMarkup.join('');
  }

  /**
   * @private
   */
  _createBaseSVGMarkup(
    objectMarkup: string[],
    {
      noStyle,
      reviver,
      withShadow,
      additionalTransform,
    }: {
      noStyle?: boolean;
      reviver?: TSVGReviver;
      withShadow?: boolean;
      additionalTransform?: string;
    } = {}
  ) {
    const styleInfo = noStyle ? '' : `style="${this.getSvgStyles()}" `,
      shadowInfo = withShadow ? `style="${this.getSvgFilter()}" ` : '',
      clipPath = this.clipPath,
      vectorEffect = this.strokeUniform
        ? 'vector-effect="non-scaling-stroke" '
        : '',
      absoluteClipPath = clipPath && clipPath.absolutePositioned,
      stroke = this.stroke,
      fill = this.fill,
      shadow = this.shadow,
      markup = [],
      // insert commons in the markup, style and svgCommons
      index = objectMarkup.indexOf('COMMON_PARTS');
    let clipPathMarkup;
    if (clipPath) {
      clipPath.clipPathId = `CLIPPATH_${uid()}`;
      clipPathMarkup = `<clipPath id="${
        clipPath.clipPathId
      }" >\n${clipPath.toClipPathSVG(reviver)}</clipPath>\n`;
    }
    if (absoluteClipPath) {
      markup.push('<g ', shadowInfo, this.getSvgCommons(), ' >\n');
    }
    markup.push(
      '<g ',
      this.getSvgTransform(false),
      !absoluteClipPath ? shadowInfo + this.getSvgCommons() : '',
      ' >\n'
    );
    const commonPieces = [
      styleInfo,
      vectorEffect,
      noStyle ? '' : this.addPaintOrder(),
      ' ',
      additionalTransform ? `transform="${additionalTransform}" ` : '',
    ].join('');
    objectMarkup[index] = commonPieces;
    if (fill && fill.toLive) {
      markup.push(fill.toSVG(this));
    }
    if (stroke && stroke.toLive) {
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
    return this.paintFirst !== 'fill'
      ? ` paint-order="${this.paintFirst}" `
      : '';
  }
}
