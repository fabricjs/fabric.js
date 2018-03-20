import { CommonMethods } from "../fabric-sink";
import { Object, ObjectOptions} from "./object"

export interface ImageOptions extends ObjectOptions {

  /**
   * crossOrigin value (one of "", "anonymous", "use-credentials")
   * @see https://developer.mozilla.org/en-US/docs/HTML/CORS_settings_attributes
   * @type Stringevent
   * @default
   */
  crossOrigin?: string;

  /**
   * Width of a stroke.
   * For image quality a stroke multiple of 2 gives better results.
   * @type Number
   * @default
   */
  strokeWidth?: number;

  /**
   * minimum scale factor under which any resizeFilter is triggered to resize the image
   * 0 will disable the automatic resize. 1 will trigger automatically always.
   * number bigger than 1 are not implemented yet.
   * @type Number
   */
  minimumScaleTrigger?: number;

  /**
   * When `true`, object is cached on an additional canvas.
   * default to false for images
   * since 1.7.0
   * @type Boolean
   * @default
   */
  objectCaching?: boolean;

  /**
   * key used to retrieve the texture representing this image
   * since 2.0.0
   * @type String
   * @default
   */
  cacheKey?: string;

  /**
   * Image crop in pixels from original image size.
   * since 2.0.0
   * @type Number
   * @default
   */
  cropX?: number;

  /**
   * Image crop in pixels from original image size.
   * since 2.0.0
   * @type Number
   * @default
   */
  cropY?: number;
}

/**
 * Image class
 * @class fabric.Image
 * @extends fabric.Object
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-1#images}
 * @see {@link fabric.Image#initialize} for constructor definition
 */
export interface Image extends ImageOptions, Object, CommonMethods {}
export class Image {

  /**
   * Constructor
   * @param {HTMLImageElement | String} element Image element
   * @param {Object} [options] Options object
   * @return {fabric.Image} thisArg
   */
  constructor(element: HTMLImageElement | String, options?: ImageOptions);

  /**
   * Returns image element which this instance if based on
   * @return {HTMLImageElement} Image element
   */
  public getElement(): HTMLImageElement;

  /**
   * Sets image element for this instance to a specified one.
   * If filters defined they are applied to new image.
   * You might need to call `canvas.renderAll` and `object.setCoords` after replacing, to render new image and update controls area.
   * @param {HTMLImageElement} element
   * @param {Object} [options] Options object
   * @return {fabric.Image} thisArg
   * @chainable
   */
  public setElement(element: HTMLImageElement, options?: ImageOptions): this;

  /**
   * Delete cacheKey if we have a webGlBackend
   * delete reference to image elements
   */
  public dispose(): void;

  /**
   * Sets crossOrigin value (on an instance and corresponding image element)
   * @return {fabric.Image} thisArg
   * @chainable
   */
  public setCrossOrigin(value: string): Image;

  /**
   * Returns original size of an image
   * @return {Object} Object with "width" and "height" properties
   */
  public getOriginalSize(): { width: number, height: number };

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} Object representation of an instance
   */
  public toObject<T extends keyof this>(propertiesToInclude?: (keyof T)[]): any; // TODO

  /**
   * Returns true if an image has crop applied, inspecting values of cropX,cropY,width,hight.
   * @return {Boolean}
   */
  public hasCrop(): boolean;

  /* _TO_SVG_START_ */
  /**
   * Returns SVG representation of an instance
   * @param {Function} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  public toSVG(reviver?: (svg: string) => string): string;
  /* _TO_SVG_END_ */

  /**
   * Returns source of an image
   * @param {Boolean} filtered indicates if the src is needed for svg
   * @return {String} Source of an image
   */
  public getSrc(filtered: Boolean): string;

  /**
   * Sets source of an image
   * @param {String} src Source string (URL)
   * @param {Function} [callback] Callback is invoked when image has been loaded (and all filters have been applied)
   * @param {Object} [options] Options object
   * @return {fabric.Image} thisArg
   * @chainable
   */
  public setSrc(src: string,
                callback?: (this: Image) => void,
                options?: ImageOptions): Image;

  /**
   * Returns string representation of an instance
   * @return {String} String representation of an instance
   */
  public toString(): string;

  public applyResizeFilters(): void;

  /**
   * Applies filters assigned to this image (from "filters" array) or from filter param
   * @method applyFilters
   * @param {Array} filters to be applied
   * @param {Boolean} forResizing specify if the filter operation is a resize operation
   * @return {thisArg} return the fabric.Image object
   * @chainable
   */
  public applyFilters(filters: ReadonlyArray<any>[]): Image;

  /**
   * Default CSS class name for canvas
   * 'canvas-img' by default
   * @static
   * @type String
   * @default
   */
  public static CSS_CANVAS: string;

  /**
   * Alias for getSrc
   * @static
   */
  public getSvgSrc(filtered: Boolean): string;

  /**
   * Creates an instance of fabric.Image from its object representation
   * @static
   * @param {Object} object Object to create an instance from
   * @param {Function} callback Callback to invoke when an image instance is created
   */
  public static fromObject(object: Object, callback: (img: Image) => void): void;

  /**
   * Creates an instance of fabric.Image from an URL string
   * @static
   * @param {String} url URL to create an image from
   * @param {Function} [callback] Callback to invoke when image is created (newly created image is passed as a first argument)
   * @param {Object} [imgOptions] Options object
   */
  public static fromURL(url: string, callback?: (image: Image) => void , imgOptions? : ImageOptions): void;

  /* _FROM_SVG_START_ */
  /**
   * List of attribute names to account for when parsing SVG element (used by {@link fabric.Image.fromElement})
   * @static
   * @see {@link http://www.w3.org/TR/SVG/struct.html#ImageElement}
   */
  public static ATTRIBUTE_NAMES: ReadonlyArray<string>;

  /**
   * Returns {@link fabric.Image} instance from an SVG element
   * @static
   * @param {SVGElement} element Element to parse
   * @param {Object} [options] Options object
   * @param {Function} callback Callback to execute when fabric.Image object is created
   * @return {fabric.Image} Instance of fabric.Image
   */
  public static fromElement(element: SVGElement, callback?: (image: Image) => void, options?: ImageOptions): Image;
}
