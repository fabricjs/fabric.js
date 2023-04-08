// @ts-nocheck

import { getDocument, getEnv } from '../env';
import type { BaseFilter } from '../filters/BaseFilter';
import { getFilterBackend } from '../filters/FilterBackend';
import { TClassProperties, TCrossOrigin, TSize } from '../typedefs';
import { uid } from '../util/internals/uid';
import { createCanvasElement } from '../util/misc/dom';
import {
  enlivenObjectEnlivables,
  enlivenObjects,
} from '../util/misc/objectEnlive';
import { FabricObject, cacheProperties } from './Object/FabricObject';
import type {
  FabricObjectProps,
  SerializedObjectProps,
  TProps,
} from './Object/types';
import type { ObjectEvents } from '../EventTypeDefs';
import { WebGLFilterBackend } from '../filters/WebGLFilterBackend';

// @todo Would be nice to have filtering code not imported directly.

export type ImageSourceElement =
  | HTMLImageElement
  | HTMLVideoElement
  | HTMLCanvasElement;
interface UniqueImageProps {
  srcFromAttribute: boolean;
  minimumScaleTrigger: number;
  cropX: number;
  cropY: number;
  imageSmoothing: boolean;
  crossOrigin: TCrossOrigin;
  filters: BaseFilter[];
  resizeFilter?: BaseFilter;
}

export const imageDefaultValues: Partial<UniqueImageProps> &
  Partial<FabricObjectProps> = {
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

export class ImageSource<
    Source extends ImageSourceElement = ImageSourceElement,
    Props extends TProps<ImageProps> = Partial<ImageProps>,
    SProps extends SerializedImageProps = SerializedImageProps,
    EventSpec extends ObjectEvents = ObjectEvents
  >
  extends FabricObject<Props, SProps, EventSpec>
  implements ImageProps
{
  /**
   * When calling {@link ImageSource.getSrc}, return value from element src with `element.getAttribute('src')`.
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

  protected declare src: string;
  declare crossOrigin: TCrossOrigin;

  declare filters: BaseFilter[];
  declare resizeFilter: BaseFilter;

  protected declare _element: Source;
  protected declare _originalElement: Source;
  protected declare _filteredEl: HTMLCanvasElement;

  static cacheProperties = [...cacheProperties, ...IMAGE_PROPS];

  static ownDefaults: Record<string, any> = imageDefaultValues;

  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...ImageSource.ownDefaults,
    };
  }
  /**
   * Constructor
   * Image can be initialized with any canvas drawable or a string.
   * The string should be a url and will be loaded as an image.
   * Canvas and Image element work out of the box, while videos require extra code to work.
   * Please check video element events for seeking.
   * @param {ImageSourceElement | string} element Image element
   * @param {Object} [options] Options object
   */
  constructor(elementId: string, options?: Props);
  constructor(element: Source, options?: Props);
  constructor(element: Source | string, options?: Props);
  constructor(arg0: Source | string, options: Props = {} as Props) {
    super({ filters: [], ...options });
    this.cacheKey = `texture${uid()}`;
    this.setElement(
      typeof arg0 === 'string'
        ? (getDocument().getElementById(arg0) as Source)
        : arg0,
      options
    );
  }

  /**
   * @returns image source element which is used for rendering
   */
  getImageSource() {
    return this._element;
  }

  getElement() {
    return this.getImageSource();
  }

  /**
   * Sets image element for this instance to a specified one.
   * If filters defined they are applied to new image.
   * You might need to call `canvas.renderAll` and `object.setCoords` after replacing, to render new image and update controls area.
   * @param {HTMLImageElement} element
   * @param {Partial<TSize>} [size] Options object
   */
  setElement(element: Source, size: Partial<TSize> = {}) {
    this.removeTexture(this.cacheKey);
    this.removeTexture(`${this.cacheKey}_filtered`);
    this._element = element;
    this._originalElement = element;
    this._setWidthHeight(size);
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
    ['_originalElement', '_element', '_filteredEl', '_cacheCanvas'].forEach(
      (elementKey) => {
        getEnv().dispose(this[elementKey as keyof this] as Element);
        // @ts-expect-error disposing
        this[elementKey] = undefined;
      }
    );
  }

  /**
   * Get the crossOrigin value (of the corresponding image element)
   */
  getCrossOrigin(): TCrossOrigin | null {
    return (
      ((this._originalElement as HTMLImageElement)
        ?.crossOrigin as TCrossOrigin) || null
    );
  }

  static getElementOriginalSize(element: ImageSourceElement) {
    return {
      width:
        (element as HTMLImageElement).naturalWidth ||
        (element as HTMLVideoElement).videoWidth ||
        element.width,
      height:
        (element as HTMLImageElement).naturalHeight ||
        (element as HTMLVideoElement).videoHeight ||
        element.height,
    };
  }

  /**
   * Returns original size of an image
   */
  getOriginalSize(element = this.getImageSource()) {
    if (!element) {
      return {
        width: 0,
        height: 0,
      };
    }
    return (this.constructor as typeof ImageSource).getElementOriginalSize(
      element
    );
  }

  getFinalSize(element = this.getImageSource()) {
    if (!element) {
      return {
        width: 0,
        height: 0,
      };
    }
    const original = (
      this.constructor as typeof ImageSource
    ).getElementOriginalSize(element);
    return {
      width: element.width || original.width,
      height: element.height || original.height,
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
    K extends keyof T = never
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
   * Returns source of an image
   * @param {Boolean} filtered indicates if the src is needed for svg
   * @return {String} Source of an image
   */
  getSrc(filtered?: boolean): string {
    const element = filtered ? this._element : this._originalElement;
    if (element) {
      if (element.toDataURL) {
        return element.toDataURL();
      }

      if (this.srcFromAttribute) {
        return element.getAttribute('src');
      } else {
        return element.src;
      }
    } else {
      return this.src || '';
    }
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
    const canvasEl = createCanvasElement(),
      sourceWidth = elementToFilter.width,
      sourceHeight = elementToFilter.height;
    canvasEl.width = sourceWidth;
    canvasEl.height = sourceHeight;
    this._element = canvasEl;
    this._lastScaleX = filter.scaleX = scaleX;
    this._lastScaleY = filter.scaleY = scaleY;
    getFilterBackend().applyFilters(
      [filter],
      elementToFilter,
      sourceWidth,
      sourceHeight,
      this._element
    );
    const sourceSize = this.getFinalSize(this._originalElement);
    this._filterScalingX = canvasEl.width / sourceSize.width;
    this._filterScalingY = canvasEl.height / sourceSize.height;
  }

  /**
   * Applies filters assigned to this image (from "filters" array) or from filter param
   * @method applyFilters
   * @param {Array} filters to be applied
   * @param {Boolean} forResizing specify if the filter operation is a resize operation
   */
  applyFilters(filters: BaseFilter[] = this.filters || []) {
    filters = filters.filter((filter) => filter && !filter.isNeutralState());
    this.set('dirty', true);

    // needs to clear out or WEBGL will not resize correctly
    this.removeTexture(`${this.cacheKey}_filtered`);

    if (filters.length === 0) {
      this._element = this._originalElement;
      this._filteredEl = null;
      this._filterScalingX = 1;
      this._filterScalingY = 1;
      return;
    }

    const imgElement = this._originalElement,
      { width: sourceWidth, height: sourceHeight } =
        this.getOriginalSize(imgElement);

    if (this._element === this._originalElement) {
      // if the element is the same we need to create a new element
      const canvasEl = createCanvasElement();
      canvasEl.width = sourceWidth;
      canvasEl.height = sourceHeight;
      this._element = canvasEl;
      this._filteredEl = canvasEl;
    } else {
      // clear the existing element to get new filter data
      // also dereference the eventual resized _element
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
      this._element
    );
    const sourceSize = this.getFinalSize(this._originalElement);
    const targetSize = this.getFinalSize(this._element);
    if (
      sourceSize.width !== targetSize.width ||
      sourceSize.height !== targetSize.height
    ) {
      this._filterScalingX = targetSize.width / sourceSize.width;
      this._filterScalingY = targetSize.height / sourceSize.height;
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
  drawCacheOnCanvas(ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = this.imageSmoothing;
    super.drawCacheOnCanvas(ctx);
  }

  /**
   * Decide if the object should cache or not. Create its own cache level
   * needsItsOwnCache should be used when the object drawing method requires
   * a cache step. None of the fabric classes requires it.
   * Generally you do not cache objects in groups because the group outside is cached.
   * This is the special image version where we would like to avoid caching where possible.
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
    this.renderImage(ctx, elementToDraw);
  }

  renderImage(ctx: CanvasRenderingContext2D, img: ImageSourceElement) {
    const scaleX = this._filterScalingX,
      scaleY = this._filterScalingY,
      w = this.width,
      h = this.height,
      // crop values cannot be lesser than 0.
      cropX = Math.max(this.cropX, 0),
      cropY = Math.max(this.cropY, 0),
      { width: elWidth, height: elHeight } = this.getOriginalSize(),
      sX = cropX * scaleX,
      sY = cropY * scaleY,
      // the width height cannot exceed element width/height, starting from the crop offset.
      sW = Math.min(w * scaleX, elWidth - sX),
      sH = Math.min(h * scaleY, elHeight - sY),
      x = -w / 2,
      y = -h / 2,
      maxDestW = Math.min(w, elWidth / scaleX - cropX),
      maxDestH = Math.min(h, elHeight / scaleY - cropY);

    ctx.drawImage(img, sX, sY, sW, sH, x, y, maxDestW, maxDestH);
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

  static _fromObject<
    R extends ImageSource,
    T extends TProps<SerializedImageProps> = TProps<SerializedImageProps>
  >(
    {
      imageSource,
      filters: f,
      resizeFilter: rf,
      ...object
    }: T & { imageSource: ReturnType<R['getElement']> },
    options: { signal?: AbortSignal } = {}
  ) {
    return Promise.all([
      f && enlivenObjects(f, options),
      // TODO: redundant - handled by enlivenObjectEnlivables
      rf && enlivenObjects([rf], options),
      enlivenObjectEnlivables(object, options),
    ]).then(([filters = [], [resizeFilter] = [], hydratedProps = {}]) => {
      return new this(imageSource, {
        ...object,
        filters,
        resizeFilter,
        ...hydratedProps,
      }) as R;
    });
  }
}
