import { getFabricDocument, getEnv } from '../env';
import type { BaseFilter } from '../filters/BaseFilter';
import { getFilterBackend } from '../filters/FilterBackend';
import { SHARED_ATTRIBUTES } from '../parser/attributes';
import { parseAttributes } from '../parser/parseAttributes';
import type {
  TClassProperties,
  TCrossOrigin,
  TSize,
  Abortable,
  TOptions,
} from '../typedefs';
import { uid } from '../util/internals/uid';
import { createCanvasElementFor } from '../util/misc/dom';
import { findScaleToCover, findScaleToFit } from '../util/misc/findScaleTo';
import type { LoadImageOptions } from '../util/misc/objectEnlive';
import {
  enlivenObjectEnlivables,
  enlivenObjects,
  loadImage,
} from '../util/misc/objectEnlive';
import { parsePreserveAspectRatioAttribute } from '../util/misc/svgParsing';
import { classRegistry } from '../ClassRegistry';
import { FabricObject, cacheProperties } from './Object/FabricObject';
import type { FabricObjectProps, SerializedObjectProps } from './Object/types';
import type { ObjectEvents } from '../EventTypeDefs';
import { WebGLFilterBackend } from '../filters/WebGLFilterBackend';
import { FILL, NONE } from '../constants';
import { getDocumentFromElement } from '../util/dom_misc';
import type { CSSRules } from '../parser/typedefs';
import type { Resize } from '../filters/Resize';
import type { TCachedFabricObject } from './Object/Object';
import { log } from '../util/internals/console';

// @todo Would be nice to have filtering code not imported directly.

export type ImageSource =
  | HTMLImageElement
  | HTMLVideoElement
  | HTMLCanvasElement;

interface UniqueImageProps {
  srcFromAttribute: boolean;
  minimumScaleTrigger: number;
  cropX: number;
  cropY: number;
  imageSmoothing: boolean;
  filters: BaseFilter<string, Record<string, any>>[];
  resizeFilter?: Resize;
}

export const imageDefaultValues: Partial<TClassProperties<FabricImage>> = {
  strokeWidth: 0,
  srcFromAttribute: false,
  minimumScaleTrigger: 0.5,
  cropX: 0,
  cropY: 0,
  imageSmoothing: true,
};

export interface SerializedImageProps extends SerializedObjectProps {
  src: string;
  crossOrigin: TCrossOrigin;
  filters: any[];
  resizeFilter?: any;
  cropX: number;
  cropY: number;
}

export interface ImageProps extends FabricObjectProps, UniqueImageProps {}

const IMAGE_PROPS = ['cropX', 'cropY'] as const;

/**
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-1#images}
 */
export class FabricImage<
    Props extends TOptions<ImageProps> = Partial<ImageProps>,
    SProps extends SerializedImageProps = SerializedImageProps,
    EventSpec extends ObjectEvents = ObjectEvents,
  >
  extends FabricObject<Props, SProps, EventSpec>
  implements ImageProps
{
  /**
   * When calling {@link FabricImage.getSrc}, return value from element src with `element.getAttribute('src')`.
   * This allows for relative urls as image src.
   * @since 2.7.0
   * @type Boolean
   * @default false
   */
  declare srcFromAttribute: boolean;

  /**
   * private
   * contains last value of scaleX to detect
   * if the Image got resized after the last Render
   * @type Number
   */
  protected _lastScaleX = 1;

  /**
   * private
   * contains last value of scaleY to detect
   * if the Image got resized after the last Render
   * @type Number
   */
  protected _lastScaleY = 1;

  /**
   * private
   * contains last value of scaling applied by the apply filter chain
   * @type Number
   */
  protected _filterScalingX = 1;

  /**
   * private
   * contains last value of scaling applied by the apply filter chain
   * @type Number
   */
  protected _filterScalingY = 1;

  /**
   * minimum scale factor under which any resizeFilter is triggered to resize the image
   * 0 will disable the automatic resize. 1 will trigger automatically always.
   * number bigger than 1 are not implemented yet.
   * @type Number
   */
  declare minimumScaleTrigger: number;

  /**
   * key used to retrieve the texture representing this image
   * @since 2.0.0
   * @type String
   * @default
   */
  declare cacheKey: string;

  /**
   * Image crop in pixels from original image size.
   * @since 2.0.0
   * @type Number
   * @default
   */
  declare cropX: number;

  /**
   * Image crop in pixels from original image size.
   * @since 2.0.0
   * @type Number
   * @default
   */
  declare cropY: number;

  /**
   * Indicates whether this canvas will use image smoothing when painting this image.
   * Also influence if the cacheCanvas for this image uses imageSmoothing
   * @since 4.0.0-beta.11
   * @type Boolean
   * @default
   */
  declare imageSmoothing: boolean;

  declare preserveAspectRatio: string;

  protected declare src: string;

  declare filters: BaseFilter<string, Record<string, any>>[];
  declare resizeFilter: Resize;

  declare _element: ImageSource;
  declare _filteredEl?: HTMLCanvasElement;
  declare _originalElement: ImageSource;

  static type = 'Image';

  static cacheProperties = [...cacheProperties, ...IMAGE_PROPS];

  static ownDefaults = imageDefaultValues;

  static getDefaults(): Record<string, any> {
    return {
      ...super.getDefaults(),
      ...FabricImage.ownDefaults,
    };
  }
  /**
   * Constructor
   * Image can be initialized with any canvas drawable or a string.
   * The string should be a url and will be loaded as an image.
   * Canvas and Image element work out of the box, while videos require extra code to work.
   * Please check video element events for seeking.
   * @param {ImageSource | string} element Image element
   * @param {Object} [options] Options object
   */
  constructor(elementId: string, options?: Props);
  constructor(element: ImageSource, options?: Props);
  constructor(arg0: ImageSource | string, options?: Props) {
    super();
    this.filters = [];
    Object.assign(this, FabricImage.ownDefaults);
    this.setOptions(options);
    this.cacheKey = `texture${uid()}`;
    this.setElement(
      typeof arg0 === 'string'
        ? ((
            (this.canvas && getDocumentFromElement(this.canvas.getElement())) ||
            getFabricDocument()
          ).getElementById(arg0) as ImageSource)
        : arg0,
      options,
    );
  }

  /**
   * Returns image element which this instance if based on
   */
  getElement() {
    return this._element;
  }

  /**
   * Sets image element for this instance to a specified one.
   * If filters defined they are applied to new image.
   * You might need to call `canvas.renderAll` and `object.setCoords` after replacing, to render new image and update controls area.
   * @param {HTMLImageElement} element
   * @param {Partial<TSize>} [size] Options object
   */
  setElement(element: ImageSource, size: Partial<TSize> = {}) {
    this.removeTexture(this.cacheKey);
    this.removeTexture(`${this.cacheKey}_filtered`);
    this._element = element;
    this._originalElement = element;
    this._setWidthHeight(size);
    element.classList.add(FabricImage.CSS_CANVAS);
    if (this.filters.length !== 0) {
      this.applyFilters();
    }
    // resizeFilters work on the already filtered copy.
    // we need to apply resizeFilters AFTER normal filters.
    // applyResizeFilters is run more often than normal filters
    // and is triggered by user interactions rather than dev code
    if (this.resizeFilter) {
      this.applyResizeFilters();
    }
  }

  /**
   * Delete a single texture if in webgl mode
   */
  removeTexture(key: string) {
    const backend = getFilterBackend(false);
    if (backend instanceof WebGLFilterBackend) {
      backend.evictCachesForKey(key);
    }
  }

  /**
   * Delete textures, reference to elements and eventually JSDOM cleanup
   */
  dispose() {
    super.dispose();
    this.removeTexture(this.cacheKey);
    this.removeTexture(`${this.cacheKey}_filtered`);
    this._cacheContext = null;
    (
      ['_originalElement', '_element', '_filteredEl', '_cacheCanvas'] as const
    ).forEach((elementKey) => {
      const el = this[elementKey];
      el && getEnv().dispose(el);
      // @ts-expect-error disposing
      this[elementKey] = undefined;
    });
  }

  /**
   * Get the crossOrigin value (of the corresponding image element)
   */
  getCrossOrigin(): string | null {
    return (
      this._originalElement &&
      ((this._originalElement as any).crossOrigin || null)
    );
  }

  /**
   * Returns original size of an image
   */
  getOriginalSize() {
    const element = this.getElement() as any;
    if (!element) {
      return {
        width: 0,
        height: 0,
      };
    }
    return {
      width: element.naturalWidth || element.width,
      height: element.naturalHeight || element.height,
    };
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _stroke(ctx: CanvasRenderingContext2D) {
    if (!this.stroke || this.strokeWidth === 0) {
      return;
    }
    const w = this.width / 2,
      h = this.height / 2;
    ctx.beginPath();
    ctx.moveTo(-w, -h);
    ctx.lineTo(w, -h);
    ctx.lineTo(w, h);
    ctx.lineTo(-w, h);
    ctx.lineTo(-w, -h);
    ctx.closePath();
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} Object representation of an instance
   */
  toObject<
    T extends Omit<Props & TClassProperties<this>, keyof SProps>,
    K extends keyof T = never,
  >(propertiesToInclude: K[] = []): Pick<T, K> & SProps {
    const filters: Record<string, any>[] = [];
    this.filters.forEach((filterObj) => {
      filterObj && filters.push(filterObj.toObject());
    });
    return {
      ...super.toObject([...IMAGE_PROPS, ...propertiesToInclude]),
      src: this.getSrc(),
      crossOrigin: this.getCrossOrigin(),
      filters,
      ...(this.resizeFilter
        ? { resizeFilter: this.resizeFilter.toObject() }
        : {}),
    };
  }

  /**
   * Returns true if an image has crop applied, inspecting values of cropX,cropY,width,height.
   * @return {Boolean}
   */
  hasCrop() {
    return (
      !!this.cropX ||
      !!this.cropY ||
      this.width < this._element.width ||
      this.height < this._element.height
    );
  }

  /**
   * Returns svg representation of an instance
   * @return {string[]} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const imageMarkup: string[] = [],
      element = this._element,
      x = -this.width / 2,
      y = -this.height / 2;
    let svgString: string[] = [],
      strokeSvg: string[] = [],
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
        '</clipPath>\n',
      );
      clipPath = ' clip-path="url(#imageCrop_' + clipPathId + ')" ';
    }
    if (!this.imageSmoothing) {
      imageRendering = ' image-rendering="optimizeSpeed"';
    }
    imageMarkup.push(
      '\t<image ',
      'COMMON_PARTS',
      `xlink:href="${this.getSvgSrc(true)}" x="${x - this.cropX}" y="${
        y - this.cropY
        // we're essentially moving origin of transformation from top/left corner to the center of the shape
        // by wrapping it in container <g> element with actual transformation, then offsetting object to the top/left
        // so that object's center aligns with container's left/top
      }" width="${
        element.width || (element as HTMLImageElement).naturalWidth
      }" height="${
        element.height || (element as HTMLImageElement).naturalHeight
      }"${imageRendering}${clipPath}></image>\n`,
    );

    if (this.stroke || this.strokeDashArray) {
      const origFill = this.fill;
      this.fill = null;
      strokeSvg = [
        `\t<rect x="${x}" y="${y}" width="${this.width}" height="${
          this.height
        }" style="${this.getSvgStyles()}" />\n`,
      ];
      this.fill = origFill;
    }
    if (this.paintFirst !== FILL) {
      svgString = svgString.concat(strokeSvg, imageMarkup);
    } else {
      svgString = svgString.concat(imageMarkup, strokeSvg);
    }
    return svgString;
  }

  /**
   * Returns source of an image
   * @param {Boolean} filtered indicates if the src is needed for svg
   * @return {String} Source of an image
   */
  getSrc(filtered?: boolean): string {
    const element = filtered ? this._element : this._originalElement;
    if (element) {
      if ((element as HTMLCanvasElement).toDataURL) {
        return (element as HTMLCanvasElement).toDataURL();
      }

      if (this.srcFromAttribute) {
        return element.getAttribute('src') || '';
      } else {
        return (element as HTMLImageElement).src;
      }
    } else {
      return this.src || '';
    }
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

  applyResizeFilters() {
    const filter = this.resizeFilter,
      minimumScale = this.minimumScaleTrigger,
      objectScale = this.getTotalObjectScaling(),
      scaleX = objectScale.x,
      scaleY = objectScale.y,
      elementToFilter = this._filteredEl || this._originalElement;
    if (this.group) {
      this.set('dirty', true);
    }
    if (!filter || (scaleX > minimumScale && scaleY > minimumScale)) {
      this._element = elementToFilter;
      this._filterScalingX = 1;
      this._filterScalingY = 1;
      this._lastScaleX = scaleX;
      this._lastScaleY = scaleY;
      return;
    }
    const canvasEl = createCanvasElementFor(elementToFilter),
      { width, height } = elementToFilter;
    this._element = canvasEl;
    this._lastScaleX = filter.scaleX = scaleX;
    this._lastScaleY = filter.scaleY = scaleY;
    getFilterBackend().applyFilters(
      [filter],
      elementToFilter,
      width,
      height,
      this._element,
    );
    this._filterScalingX = canvasEl.width / this._originalElement.width;
    this._filterScalingY = canvasEl.height / this._originalElement.height;
  }

  /**
   * Applies filters assigned to this image (from "filters" array) or from filter param
   * @method applyFilters
   * @param {Array} filters to be applied
   * @param {Boolean} forResizing specify if the filter operation is a resize operation
   */
  applyFilters(
    filters: BaseFilter<string, Record<string, any>>[] = this.filters || [],
  ) {
    filters = filters.filter((filter) => filter && !filter.isNeutralState());
    this.set('dirty', true);

    // needs to clear out or WEBGL will not resize correctly
    this.removeTexture(`${this.cacheKey}_filtered`);

    if (filters.length === 0) {
      this._element = this._originalElement;
      // this is unsafe and needs to be rethinkend
      this._filteredEl = undefined;
      this._filterScalingX = 1;
      this._filterScalingY = 1;
      return;
    }

    const imgElement = this._originalElement,
      sourceWidth =
        (imgElement as HTMLImageElement).naturalWidth || imgElement.width,
      sourceHeight =
        (imgElement as HTMLImageElement).naturalHeight || imgElement.height;

    if (this._element === this._originalElement) {
      // if the _element a reference to _originalElement
      // we need to create a new element to host the filtered pixels
      const canvasEl = createCanvasElementFor({
        width: sourceWidth,
        height: sourceHeight,
      });
      this._element = canvasEl;
      this._filteredEl = canvasEl;
    } else if (this._filteredEl) {
      // if the _element is it own element,
      // and we also have a _filteredEl, then we clean up _filteredEl
      // and we assign it to _element.
      // in this way we invalidate the eventual old resize filtered element
      this._element = this._filteredEl;
      this._filteredEl
        .getContext('2d')!
        .clearRect(0, 0, sourceWidth, sourceHeight);
      // we also need to resize again at next renderAll, so remove saved _lastScaleX/Y
      this._lastScaleX = 1;
      this._lastScaleY = 1;
    }
    getFilterBackend().applyFilters(
      filters,
      this._originalElement,
      sourceWidth,
      sourceHeight,
      this._element as HTMLCanvasElement,
    );
    if (
      this._originalElement.width !== this._element.width ||
      this._originalElement.height !== this._element.height
    ) {
      this._filterScalingX = this._element.width / this._originalElement.width;
      this._filterScalingY =
        this._element.height / this._originalElement.height;
    }
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = this.imageSmoothing;
    if (this.isMoving !== true && this.resizeFilter && this._needsResize()) {
      this.applyResizeFilters();
    }
    this._stroke(ctx);
    this._renderPaintInOrder(ctx);
  }

  /**
   * Paint the cached copy of the object on the target context.
   * it will set the imageSmoothing for the draw operation
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  drawCacheOnCanvas(
    this: TCachedFabricObject<FabricImage>,
    ctx: CanvasRenderingContext2D,
  ) {
    ctx.imageSmoothingEnabled = this.imageSmoothing;
    super.drawCacheOnCanvas(ctx);
  }

  /**
   * Decide if the FabricImage should cache or not. Create its own cache level
   * needsItsOwnCache should be used when the object drawing method requires
   * a cache step.
   * Generally you do not cache objects in groups because the group outside is cached.
   * This is the special Image version where we would like to avoid caching where possible.
   * Essentially images do not benefit from caching. They may require caching, and in that
   * case we do it. Also caching an image usually ends in a loss of details.
   * A full performance audit should be done.
   * @return {Boolean}
   */
  shouldCache() {
    return this.needsItsOwnCache();
  }

  _renderFill(ctx: CanvasRenderingContext2D) {
    const elementToDraw = this._element;
    if (!elementToDraw) {
      return;
    }
    const scaleX = this._filterScalingX,
      scaleY = this._filterScalingY,
      w = this.width,
      h = this.height,
      // crop values cannot be lesser than 0.
      cropX = Math.max(this.cropX, 0),
      cropY = Math.max(this.cropY, 0),
      elWidth =
        (elementToDraw as HTMLImageElement).naturalWidth || elementToDraw.width,
      elHeight =
        (elementToDraw as HTMLImageElement).naturalHeight ||
        elementToDraw.height,
      sX = cropX * scaleX,
      sY = cropY * scaleY,
      // the width height cannot exceed element width/height, starting from the crop offset.
      sW = Math.min(w * scaleX, elWidth - sX),
      sH = Math.min(h * scaleY, elHeight - sY),
      x = -w / 2,
      y = -h / 2,
      maxDestW = Math.min(w, elWidth / scaleX - cropX),
      maxDestH = Math.min(h, elHeight / scaleY - cropY);

    elementToDraw &&
      ctx.drawImage(elementToDraw, sX, sY, sW, sH, x, y, maxDestW, maxDestH);
  }

  /**
   * needed to check if image needs resize
   * @private
   */
  _needsResize() {
    const scale = this.getTotalObjectScaling();
    return scale.x !== this._lastScaleX || scale.y !== this._lastScaleY;
  }

  /**
   * @private
   * @deprecated unused
   */
  _resetWidthHeight() {
    this.set(this.getOriginalSize());
  }

  /**
   * @private
   * Set the width and the height of the image object, using the element or the
   * options.
   */
  _setWidthHeight({ width, height }: Partial<TSize> = {}) {
    const size = this.getOriginalSize();
    this.width = width || size.width;
    this.height = height || size.height;
  }

  /**
   * Calculate offset for center and scale factor for the image in order to respect
   * the preserveAspectRatio attribute
   * @private
   */
  parsePreserveAspectRatioAttribute() {
    const pAR = parsePreserveAspectRatioAttribute(
        this.preserveAspectRatio || '',
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

    if (pAR && (pAR.alignX !== NONE || pAR.alignY !== NONE)) {
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
   * Default CSS class name for canvas
   * @static
   * @type String
   * @default
   */
  static CSS_CANVAS = 'canvas-img';

  /**
   * List of attribute names to account for when parsing SVG element (used by {@link FabricImage.fromElement})
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
   * Creates an instance of FabricImage from its object representation
   * @static
   * @param {Object} object Object to create an instance from
   * @param {object} [options] Options object
   * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns {Promise<FabricImage>}
   */
  static fromObject<T extends TOptions<SerializedImageProps>>(
    { filters: f, resizeFilter: rf, src, crossOrigin, type, ...object }: T,
    options?: Abortable,
  ) {
    return Promise.all([
      loadImage(src!, { ...options, crossOrigin }),
      f && enlivenObjects<BaseFilter<string>>(f, options),
      // TODO: redundant - handled by enlivenObjectEnlivables
      rf && enlivenObjects<BaseFilter<'Resize'>>([rf], options),
      enlivenObjectEnlivables(object, options),
    ]).then(([el, filters = [], [resizeFilter] = [], hydratedProps = {}]) => {
      return new this(el, {
        ...object,
        // TODO: this creates a difference between image creation and restoring from JSON
        src,
        filters,
        resizeFilter,
        ...hydratedProps,
      });
    });
  }

  /**
   * Creates an instance of Image from an URL string
   * @static
   * @param {String} url URL to create an image from
   * @param {LoadImageOptions} [options] Options object
   * @returns {Promise<FabricImage>}
   */
  static fromURL<T extends TOptions<ImageProps>>(
    url: string,
    { crossOrigin = null, signal }: LoadImageOptions = {},
    imageOptions?: T,
  ): Promise<FabricImage> {
    return loadImage(url, { crossOrigin, signal }).then(
      (img) => new this(img, imageOptions),
    );
  }

  /**
   * Returns {@link FabricImage} instance from an SVG element
   * @static
   * @param {HTMLElement} element Element to parse
   * @param {Object} [options] Options object
   * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @param {Function} callback Callback to execute when Image object is created
   */
  static async fromElement(
    element: HTMLElement,
    options: Abortable = {},
    cssRules?: CSSRules,
  ) {
    const parsedAttributes = parseAttributes(
      element,
      this.ATTRIBUTE_NAMES,
      cssRules,
    );
    return this.fromURL(
      parsedAttributes['xlink:href'],
      options,
      parsedAttributes,
    ).catch((err) => {
      log('log', 'Unable to parse Image', err);
      return null;
    });
  }
}

classRegistry.setClass(FabricImage);
classRegistry.setSVGClass(FabricImage);
