// @ts-nocheck

import { SHARED_ATTRIBUTES } from '../parser/attributes';
import { parseAttributes } from '../parser/parseAttributes';
import { TSize } from '../typedefs';
import { uid } from '../util/internals/uid';
import { findScaleToCover, findScaleToFit } from '../util/misc/findScaleTo';
import { loadImage, LoadImageOptions } from '../util/misc/objectEnlive';
import { parsePreserveAspectRatioAttribute } from '../util/misc/svgParsing';
import { classRegistry } from '../ClassRegistry';
import type { TProps } from './Object/types';
import {
  ImageSource,
  ImageSourceElement,
  SerializedImageProps,
} from './ImageSource';

export class Image extends ImageSource {
  declare preserveAspectRatio: string;

  setElement(element: ImageSourceElement, size?: Partial<TSize>): void {
    super.setElement(element, size);
    // TODO: change to data attribute
    element.classList.add(ImageSource.CSS_CANVAS);
  }

  /**
   * Alias for getSrc
   * @param filtered
   * @deprecated
   */
  getSvgSrc(filtered?: boolean) {
    return this.getSrc(filtered);
  }

  /**
   * Loads and sets source of an image\
   * **IMPORTANT**: It is recommended to abort loading tasks before calling this method to prevent race conditions and unnecessary networking
   * @param {String} src Source string (URL)
   * @param {LoadImageOptions} [options] Options object
   */
  setSrc(src: string, { crossOrigin, signal }: LoadImageOptions = {}) {
    return loadImage(src, { crossOrigin, signal }).then((img) => {
      typeof crossOrigin !== 'undefined' && this.set({ crossOrigin });
      this.setElement(img);
    });
  }

  /**
   * Returns string representation of an instance
   * @return {String} String representation of an instance
   */
  toString() {
    return `#<Image: { src: "${this.getSrc()}" }>`;
  }

  /**
   * Default CSS class name for canvas
   * @static
   * @type String
   * @default
   */
  static CSS_CANVAS = 'canvas-img';

  /**
   * Creates an instance of Image from its object representation
   * @static
   * @param {Object} object Object to create an instance from
   * @param {object} [options] Options object
   * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns {Promise<Image>}
   */
  static async fromObject<T extends TProps<SerializedImageProps>>(
    { src, crossOrigin: x = null, ...object }: T,
    { crossOrigin = x, ...options }: LoadImageOptions = {}
  ) {
    return this._fromObject<Image>(
      {
        ...object,
        src,
        crossOrigin,
        imageSource: await loadImage(src, { ...options, crossOrigin }),
      },
      options
    );
  }

  /**
   * Creates an instance of Image from an URL string
   * @static
   * @deprecated use {@link fromObject}
   * @param {String} url URL to create an image from
   * @param {LoadImageOptions} [options] Options object
   * @returns {Promise<Image>}
   */
  static async fromURL<T extends TProps<SerializedImageProps>>(
    url: string,
    options: Partial<T & LoadImageOptions> = {}
  ) {
    return this.fromObject({ ...options, src: url }, options);
  }

  /**
   * Returns svg representation of an instance
   * @return {string[]} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const imageMarkup = [],
      element = this._element,
      x = -this.width / 2,
      y = -this.height / 2;
    let svgString = [],
      strokeSvg,
      clipPath = '',
      imageRendering = '';
    if (!element) {
      return [];
    }
    if (this.hasCrop()) {
      const clipPathId = uid();
      svgString.push(
        '<clipPath id="imageCrop_' + clipPathId + '">\n',
        '\t<rect x="' +
          x +
          '" y="' +
          y +
          '" width="' +
          this.width +
          '" height="' +
          this.height +
          '" />\n',
        '</clipPath>\n'
      );
      clipPath = ' clip-path="url(#imageCrop_' + clipPathId + ')" ';
    }
    if (!this.imageSmoothing) {
      imageRendering = '" image-rendering="optimizeSpeed';
    }
    imageMarkup.push(
      '\t<image ',
      'COMMON_PARTS',
      'xlink:href="',
      this.getSvgSrc(true),
      '" x="',
      x - this.cropX,
      '" y="',
      y - this.cropY,
      // we're essentially moving origin of transformation from top/left corner to the center of the shape
      // by wrapping it in container <g> element with actual transformation, then offsetting object to the top/left
      // so that object's center aligns with container's left/top
      '" width="',
      element.width || element.naturalWidth,
      '" height="',
      element.height || element.naturalHeight,
      imageRendering,
      '"',
      clipPath,
      '></image>\n'
    );

    if (this.stroke || this.strokeDashArray) {
      const origFill = this.fill;
      this.fill = null;
      strokeSvg = [
        '\t<rect ',
        'x="',
        x,
        '" y="',
        y,
        '" width="',
        this.width,
        '" height="',
        this.height,
        '" style="',
        this.getSvgStyles(),
        '"/>\n',
      ];
      this.fill = origFill;
    }
    if (this.paintFirst !== 'fill') {
      svgString = svgString.concat(strokeSvg, imageMarkup);
    } else {
      svgString = svgString.concat(imageMarkup, strokeSvg);
    }
    return svgString;
  }

  /**
   * Calculate offset for center and scale factor for the image in order to respect
   * the preserveAspectRatio attribute
   * @private
   */
  parsePreserveAspectRatioAttribute() {
    const pAR = parsePreserveAspectRatioAttribute(
        this.preserveAspectRatio || ''
      ),
      pWidth = this.width,
      pHeight = this.height,
      parsedAttributes = { width: pWidth, height: pHeight };
    let rWidth = this._element.width,
      rHeight = this._element.height,
      scaleX = 1,
      scaleY = 1,
      offsetLeft = 0,
      offsetTop = 0,
      cropX = 0,
      cropY = 0,
      offset;

    if (pAR && (pAR.alignX !== 'none' || pAR.alignY !== 'none')) {
      if (pAR.meetOrSlice === 'meet') {
        scaleX = scaleY = findScaleToFit(this._element, parsedAttributes);
        offset = (pWidth - rWidth * scaleX) / 2;
        if (pAR.alignX === 'Min') {
          offsetLeft = -offset;
        }
        if (pAR.alignX === 'Max') {
          offsetLeft = offset;
        }
        offset = (pHeight - rHeight * scaleY) / 2;
        if (pAR.alignY === 'Min') {
          offsetTop = -offset;
        }
        if (pAR.alignY === 'Max') {
          offsetTop = offset;
        }
      }
      if (pAR.meetOrSlice === 'slice') {
        scaleX = scaleY = findScaleToCover(this._element, parsedAttributes);
        offset = rWidth - pWidth / scaleX;
        if (pAR.alignX === 'Mid') {
          cropX = offset / 2;
        }
        if (pAR.alignX === 'Max') {
          cropX = offset;
        }
        offset = rHeight - pHeight / scaleY;
        if (pAR.alignY === 'Mid') {
          cropY = offset / 2;
        }
        if (pAR.alignY === 'Max') {
          cropY = offset;
        }
        rWidth = pWidth / scaleX;
        rHeight = pHeight / scaleY;
      }
    } else {
      scaleX = pWidth / rWidth;
      scaleY = pHeight / rHeight;
    }
    return {
      width: rWidth,
      height: rHeight,
      scaleX,
      scaleY,
      offsetLeft,
      offsetTop,
      cropX,
      cropY,
    };
  }

  /**
   * List of attribute names to account for when parsing SVG element (used by {@link ImageSource.fromElement})
   * @static
   * @see {@link http://www.w3.org/TR/SVG/struct.html#ImageElement}
   */
  static ATTRIBUTE_NAMES = [
    ...SHARED_ATTRIBUTES,
    'x',
    'y',
    'width',
    'height',
    'preserveAspectRatio',
    'xlink:href',
    'crossOrigin',
    'image-rendering',
  ];

  /**
   * Returns {@link Image} instance from an SVG element
   * @static
   * @param {SVGElement} element Element to parse
   * @param {Object} [options] Options object
   * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @param {Function} callback Callback to execute when Image object is created
   */
  static fromElement(
    element: SVGElement,
    callback: (image: Image) => any,
    options: { signal?: AbortSignal } = {}
  ) {
    const parsedAttributes = parseAttributes(element, this.ATTRIBUTE_NAMES);
    this.fromObject({
      ...options,
      ...parsedAttributes,
      src: parsedAttributes['xlink:href'],
    }).then(callback);
  }
}

classRegistry.setClass(Image);
classRegistry.setSVGClass(Image);
