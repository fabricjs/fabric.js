import type { CanvasEvents, StaticCanvasEvents } from '../EventTypeDefs';
import { CommonMethods } from '../CommonMethods';
import { Point } from '../Point';
import type { TCachedFabricObject } from '../shapes/Object/Object';
import type { Abortable, TCornerPoint, TDataUrlOptions, TFiller, TMat2D, TSize, TSVGReviver, TToCanvasElementOptions, TValidToObjectMethod, TOptions } from '../typedefs';
import type { EnlivenObjectOptions } from '../util/misc/objectEnlive';
import { StaticCanvasDOMManager } from './DOMManagers/StaticCanvasDOMManager';
import type { CSSDimensions } from './DOMManagers/util';
import type { FabricObject } from '../shapes/Object/FabricObject';
import type { StaticCanvasOptions } from './StaticCanvasOptions';
/**
 * Having both options in TCanvasSizeOptions set to true transform the call in a calcOffset
 * Better try to restrict with types to avoid confusion.
 */
export type TCanvasSizeOptions = {
    backstoreOnly?: true;
    cssOnly?: false;
} | {
    backstoreOnly?: false;
    cssOnly?: true;
};
export type TSVGExportOptions = {
    suppressPreamble?: boolean;
    viewBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    encoding?: 'UTF-8';
    width?: string;
    height?: string;
    reviver?: TSVGReviver;
};
declare const StaticCanvas_base: {
    new (...args: any[]): {
        _objects: FabricObject[];
        _onObjectAdded(object: FabricObject): void;
        _onObjectRemoved(object: FabricObject): void;
        _onStackOrderChanged(object: FabricObject): void;
        add(...objects: FabricObject[]): number;
        insertAt(index: number, ...objects: FabricObject[]): number;
        remove(...objects: FabricObject[]): FabricObject<Partial<import("../..").FabricObjectProps>, import("../..").SerializedObjectProps, import("../EventTypeDefs").ObjectEvents>[];
        forEachObject(callback: (object: FabricObject, index: number, array: FabricObject[]) => any): void;
        getObjects(...types: string[]): FabricObject<Partial<import("../..").FabricObjectProps>, import("../..").SerializedObjectProps, import("../EventTypeDefs").ObjectEvents>[];
        item(index: number): FabricObject<Partial<import("../..").FabricObjectProps>, import("../..").SerializedObjectProps, import("../EventTypeDefs").ObjectEvents>;
        isEmpty(): boolean;
        size(): number;
        contains(object: FabricObject, deep?: boolean): boolean;
        complexity(): number;
        sendObjectToBack(object: FabricObject): boolean;
        bringObjectToFront(object: FabricObject): boolean;
        sendObjectBackwards(object: FabricObject, intersecting?: boolean): boolean;
        bringObjectForward(object: FabricObject, intersecting?: boolean): boolean;
        moveObjectTo(object: FabricObject, index: number): boolean;
        findNewLowerIndex(object: FabricObject, idx: number, intersecting?: boolean): number;
        findNewUpperIndex(object: FabricObject, idx: number, intersecting?: boolean): number;
        collectObjects({ left, top, width, height }: import("../typedefs").TBBox, { includeIntersecting }?: {
            includeIntersecting?: boolean;
        }): import("../..").InteractiveFabricObject<Partial<import("../..").FabricObjectProps>, import("../..").SerializedObjectProps, import("../EventTypeDefs").ObjectEvents>[];
    };
} & {
    new (): CommonMethods<CanvasEvents>;
};
/**
 * Static canvas class
 * @see {@link http://fabricjs.com/static_canvas|StaticCanvas demo}
 * @fires before:render
 * @fires after:render
 * @fires canvas:cleared
 * @fires object:added
 * @fires object:removed
 */
export declare class StaticCanvas<EventSpec extends StaticCanvasEvents = StaticCanvasEvents> extends StaticCanvas_base implements StaticCanvasOptions {
    width: number;
    height: number;
    backgroundVpt: boolean;
    backgroundColor: TFiller | string;
    backgroundImage?: FabricObject;
    overlayVpt: boolean;
    overlayColor: TFiller | string;
    overlayImage?: FabricObject;
    clipPath?: FabricObject;
    includeDefaultValues: boolean;
    renderOnAddRemove: boolean;
    skipOffscreen: boolean;
    enableRetinaScaling: boolean;
    imageSmoothingEnabled: boolean;
    /**
     * @todo move to Canvas
     */
    controlsAboveOverlay: boolean;
    /**
     * @todo move to Canvas
     */
    allowTouchScrolling: boolean;
    viewportTransform: TMat2D;
    /**
     * The viewport bounding box in scene plane coordinates, see {@link calcViewportBoundaries}
     */
    vptCoords: TCornerPoint;
    /**
     * A reference to the canvas actual HTMLCanvasElement.
     * Can be use to read the raw pixels, but never write or manipulate
     * @type HTMLCanvasElement
     */
    get lowerCanvasEl(): HTMLCanvasElement;
    get contextContainer(): CanvasRenderingContext2D;
    /**
     * If true the Canvas is in the process or has been disposed/destroyed.
     * No more rendering operation will be executed on this canvas.
     * @type boolean
     */
    destroyed?: boolean;
    /**
     * Started the process of disposing but not done yet.
     * WIll likely complete the render cycle already scheduled but stopping adding more.
     * @type boolean
     */
    disposed?: boolean;
    _offset: {
        left: number;
        top: number;
    };
    protected hasLostContext: boolean;
    protected nextRenderHandle: number;
    elements: StaticCanvasDOMManager;
    /**
     * When true control drawing is skipped.
     * This boolean is used to avoid toDataURL to export controls.
     * Usage of this boolean to build up other flows and features is not supported
     * @type Boolean
     * @default false
     */
    protected skipControlsDrawing: boolean;
    static ownDefaults: TOptions<StaticCanvasOptions>;
    protected __cleanupTask?: {
        (): void;
        kill: (reason?: any) => void;
    };
    static getDefaults(): Record<string, any>;
    constructor(el?: string | HTMLCanvasElement, options?: TOptions<StaticCanvasOptions>);
    protected initElements(el?: string | HTMLCanvasElement): void;
    add(...objects: FabricObject[]): number;
    insertAt(index: number, ...objects: FabricObject[]): number;
    remove(...objects: FabricObject[]): FabricObject<Partial<import("../..").FabricObjectProps>, import("../..").SerializedObjectProps, import("../EventTypeDefs").ObjectEvents>[];
    _onObjectAdded(obj: FabricObject): void;
    _onObjectRemoved(obj: FabricObject): void;
    _onStackOrderChanged(): void;
    /**
     * @private
     * @see https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/SettingUptheCanvas/SettingUptheCanvas.html
     * @return {Number} retinaScaling if applied, otherwise 1;
     */
    getRetinaScaling(): number;
    /**
     * Calculates canvas element offset relative to the document
     * This method is also attached as "resize" event handler of window
     */
    calcOffset(): {
        left: number;
        top: number;
    };
    /**
     * Returns canvas width (in px)
     * @return {Number}
     */
    getWidth(): number;
    /**
     * Returns canvas height (in px)
     * @return {Number}
     */
    getHeight(): number;
    /**
     * Sets width of this canvas instance
     * @param {Number|String} value                         Value to set width to
     * @param {Object}        [options]                     Options object
     * @param {Boolean}       [options.backstoreOnly=false] Set the given dimensions only as canvas backstore dimensions
     * @param {Boolean}       [options.cssOnly=false]       Set the given dimensions only as css dimensions
     * @deprecated will be removed in 7.0
     */
    setWidth(value: TSize['width'], options?: {
        backstoreOnly?: true;
        cssOnly?: false;
    }): void;
    setWidth(value: CSSDimensions['width'], options?: {
        cssOnly?: true;
        backstoreOnly?: false;
    }): void;
    /**s
     * Sets height of this canvas instance
     * @param {Number|String} value                         Value to set height to
     * @param {Object}        [options]                     Options object
     * @param {Boolean}       [options.backstoreOnly=false] Set the given dimensions only as canvas backstore dimensions
     * @param {Boolean}       [options.cssOnly=false]       Set the given dimensions only as css dimensions
     * @deprecated will be removed in 7.0
     */
    setHeight(value: TSize['height'], options?: {
        backstoreOnly?: true;
        cssOnly?: false;
    }): void;
    setHeight(value: CSSDimensions['height'], options?: {
        cssOnly?: true;
        backstoreOnly?: false;
    }): void;
    /**
     * Internal use only
     * @protected
     */
    protected _setDimensionsImpl(dimensions: Partial<TSize | CSSDimensions>, { cssOnly, backstoreOnly }?: TCanvasSizeOptions): void;
    /**
     * Sets dimensions (width, height) of this canvas instance. when options.cssOnly flag active you should also supply the unit of measure (px/%/em)
     * @param {Object}        dimensions                    Object with width/height properties
     * @param {Number|String} [dimensions.width]            Width of canvas element
     * @param {Number|String} [dimensions.height]           Height of canvas element
     * @param {Object}        [options]                     Options object
     * @param {Boolean}       [options.backstoreOnly=false] Set the given dimensions only as canvas backstore dimensions
     * @param {Boolean}       [options.cssOnly=false]       Set the given dimensions only as css dimensions
     */
    setDimensions(dimensions: Partial<CSSDimensions>, options?: {
        cssOnly?: true;
        backstoreOnly?: false;
    }): void;
    setDimensions(dimensions: Partial<TSize>, options?: {
        backstoreOnly?: true;
        cssOnly?: false;
    }): void;
    setDimensions(dimensions: Partial<TSize>, options?: never): void;
    /**
     * Returns canvas zoom level
     * @return {Number}
     */
    getZoom(): number;
    /**
     * Sets viewport transformation of this canvas instance
     * @param {Array} vpt a Canvas 2D API transform matrix
     */
    setViewportTransform(vpt: TMat2D): void;
    /**
     * Sets zoom level of this canvas instance, the zoom centered around point
     * meaning that following zoom to point with the same point will have the visual
     * effect of the zoom originating from that point. The point won't move.
     * It has nothing to do with canvas center or visual center of the viewport.
     * @param {Point} point to zoom with respect to
     * @param {Number} value to set zoom to, less than 1 zooms out
     */
    zoomToPoint(point: Point, value: number): void;
    /**
     * Sets zoom level of this canvas instance
     * @param {Number} value to set zoom to, less than 1 zooms out
     */
    setZoom(value: number): void;
    /**
     * Pan viewport so as to place point at top left corner of canvas
     * @param {Point} point to move to
     */
    absolutePan(point: Point): void;
    /**
     * Pans viewpoint relatively
     * @param {Point} point (position vector) to move by
     */
    relativePan(point: Point): void;
    /**
     * Returns &lt;canvas> element corresponding to this instance
     * @return {HTMLCanvasElement}
     */
    getElement(): HTMLCanvasElement;
    /**
     * Clears specified context of canvas element
     * @param {CanvasRenderingContext2D} ctx Context to clear
     */
    clearContext(ctx: CanvasRenderingContext2D): void;
    /**
     * Returns context of canvas where objects are drawn
     * @return {CanvasRenderingContext2D}
     */
    getContext(): CanvasRenderingContext2D;
    /**
     * Clears all contexts (background, main, top) of an instance
     */
    clear(): void;
    /**
     * Renders the canvas
     */
    renderAll(): void;
    /**
     * Function created to be instance bound at initialization
     * used in requestAnimationFrame rendering
     * Let the fabricJS call it. If you call it manually you could have more
     * animationFrame stacking on to of each other
     * for an imperative rendering, use canvas.renderAll
     * @private
     */
    renderAndReset(): void;
    /**
     * Append a renderAll request to next animation frame.
     * unless one is already in progress, in that case nothing is done
     * a boolean flag will avoid appending more.
     */
    requestRenderAll(): void;
    /**
     * Calculate the position of the 4 corner of canvas with current viewportTransform.
     * helps to determinate when an object is in the current rendering viewport
     */
    calcViewportBoundaries(): TCornerPoint;
    cancelRequestedRender(): void;
    drawControls(_ctx: CanvasRenderingContext2D): void;
    /**
     * Renders background, objects, overlay and controls.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Array} objects to render
     */
    renderCanvas(ctx: CanvasRenderingContext2D, objects: FabricObject[]): void;
    /**
     * Paint the cached clipPath on the lowerCanvasEl
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    drawClipPathOnCanvas(ctx: CanvasRenderingContext2D, clipPath: TCachedFabricObject): void;
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} objects to render
     */
    _renderObjects(ctx: CanvasRenderingContext2D, objects: FabricObject[]): void;
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {string} property 'background' or 'overlay'
     */
    _renderBackgroundOrOverlay(ctx: CanvasRenderingContext2D, property: 'background' | 'overlay'): void;
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderBackground(ctx: CanvasRenderingContext2D): void;
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderOverlay(ctx: CanvasRenderingContext2D): void;
    /**
     * Returns coordinates of a center of canvas.
     * Returned value is an object with top and left properties
     * @return {Object} object with "top" and "left" number values
     * @deprecated migrate to `getCenterPoint`
     */
    getCenter(): {
        top: number;
        left: number;
    };
    /**
     * Returns coordinates of a center of canvas.
     * @return {Point}
     */
    getCenterPoint(): Point;
    /**
     * Centers object horizontally in the canvas
     */
    centerObjectH(object: FabricObject): void;
    /**
     * Centers object vertically in the canvas
     * @param {FabricObject} object Object to center vertically
     */
    centerObjectV(object: FabricObject): void;
    /**
     * Centers object vertically and horizontally in the canvas
     * @param {FabricObject} object Object to center vertically and horizontally
     */
    centerObject(object: FabricObject): void;
    /**
     * Centers object vertically and horizontally in the viewport
     * @param {FabricObject} object Object to center vertically and horizontally
     */
    viewportCenterObject(object: FabricObject): void;
    /**
     * Centers object horizontally in the viewport, object.top is unchanged
     * @param {FabricObject} object Object to center vertically and horizontally
     */
    viewportCenterObjectH(object: FabricObject): void;
    /**
     * Centers object Vertically in the viewport, object.top is unchanged
     * @param {FabricObject} object Object to center vertically and horizontally
     */
    viewportCenterObjectV(object: FabricObject): void;
    /**
     * Calculate the point in canvas that correspond to the center of actual viewport.
     * @return {Point} vpCenter, viewport center
     */
    getVpCenter(): Point;
    /**
     * @private
     * @param {FabricObject} object Object to center
     * @param {Point} center Center point
     */
    _centerObject(object: FabricObject, center: Point): void;
    /**
     * Returns dataless JSON representation of canvas
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {String} json string
     */
    toDatalessJSON(propertiesToInclude?: string[]): any;
    /**
     * Returns object representation of canvas
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject(propertiesToInclude?: string[]): any;
    /**
     * Returns Object representation of canvas
     * this alias is provided because if you call JSON.stringify on an instance,
     * the toJSON object will be invoked if it exists.
     * Having a toJSON method means you can do JSON.stringify(myCanvas)
     * @return {Object} JSON compatible object
     * @tutorial {@link http://fabricjs.com/fabric-intro-part-3#serialization}
     * @see {@link http://jsfiddle.net/fabricjs/pec86/|jsFiddle demo}
     * @example <caption>JSON without additional properties</caption>
     * var json = canvas.toJSON();
     * @example <caption>JSON with additional properties included</caption>
     * var json = canvas.toJSON(['lockMovementX', 'lockMovementY', 'lockRotation', 'lockScalingX', 'lockScalingY']);
     * @example <caption>JSON without default values</caption>
     * var json = canvas.toJSON();
     */
    toJSON(): any;
    /**
     * Returns dataless object representation of canvas
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toDatalessObject(propertiesToInclude?: string[]): any;
    /**
     * @private
     */
    _toObjectMethod(methodName: TValidToObjectMethod, propertiesToInclude?: string[]): any;
    /**
     * @private
     */
    protected _toObject(instance: FabricObject, methodName: TValidToObjectMethod, propertiesToInclude?: string[]): any;
    /**
     * @private
     */
    __serializeBgOverlay(methodName: TValidToObjectMethod, propertiesToInclude?: string[]): any;
    svgViewportTransformation: boolean;
    /**
     * Returns SVG representation of canvas
     * @function
     * @param {Object} [options] Options object for SVG output
     * @param {Boolean} [options.suppressPreamble=false] If true xml tag is not included
     * @param {Object} [options.viewBox] SVG viewbox object
     * @param {Number} [options.viewBox.x] x-coordinate of viewbox
     * @param {Number} [options.viewBox.y] y-coordinate of viewbox
     * @param {Number} [options.viewBox.width] Width of viewbox
     * @param {Number} [options.viewBox.height] Height of viewbox
     * @param {String} [options.encoding=UTF-8] Encoding of SVG output
     * @param {String} [options.width] desired width of svg with or without units
     * @param {String} [options.height] desired height of svg with or without units
     * @param {Function} [reviver] Method for further parsing of svg elements, called after each fabric object converted into svg representation.
     * @return {String} SVG string
     * @tutorial {@link http://fabricjs.com/fabric-intro-part-3#serialization}
     * @see {@link http://jsfiddle.net/fabricjs/jQ3ZZ/|jsFiddle demo}
     * @example <caption>Normal SVG output</caption>
     * var svg = canvas.toSVG();
     * @example <caption>SVG output without preamble (without &lt;?xml ../>)</caption>
     * var svg = canvas.toSVG({suppressPreamble: true});
     * @example <caption>SVG output with viewBox attribute</caption>
     * var svg = canvas.toSVG({
     *   viewBox: {
     *     x: 100,
     *     y: 100,
     *     width: 200,
     *     height: 300
     *   }
     * });
     * @example <caption>SVG output with different encoding (default: UTF-8)</caption>
     * var svg = canvas.toSVG({encoding: 'ISO-8859-1'});
     * @example <caption>Modify SVG output with reviver function</caption>
     * var svg = canvas.toSVG(null, function(svg) {
     *   return svg.replace('stroke-dasharray: ; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; ', '');
     * });
     */
    toSVG(options?: TSVGExportOptions, reviver?: TSVGReviver): string;
    /**
     * @private
     */
    _setSVGPreamble(markup: string[], options: TSVGExportOptions): void;
    /**
     * @private
     */
    _setSVGHeader(markup: string[], options: TSVGExportOptions): void;
    createSVGClipPathMarkup(options: TSVGExportOptions): string;
    /**
     * Creates markup containing SVG referenced elements like patterns, gradients etc.
     * @return {String}
     */
    createSVGRefElementsMarkup(): string;
    /**
     * Creates markup containing SVG font faces,
     * font URLs for font faces must be collected by developers
     * and are not extracted from the DOM by fabricjs
     * @param {Array} objects Array of fabric objects
     * @return {String}
     */
    createSVGFontFacesMarkup(): string;
    /**
     * @private
     */
    _setSVGObjects(markup: string[], reviver?: TSVGReviver): void;
    /**
     * This is its own function because the Canvas ( non static ) requires extra code here
     * @private
     */
    _setSVGObject(markup: string[], instance: FabricObject, reviver?: TSVGReviver): void;
    /**
     * @private
     */
    _setSVGBgOverlayImage(markup: string[], property: 'overlayImage' | 'backgroundImage', reviver?: TSVGReviver): void;
    /**
     * @TODO this seems to handle patterns but fail at gradients.
     * @private
     */
    _setSVGBgOverlayColor(markup: string[], property: 'background' | 'overlay'): void;
    /**
     * Populates canvas with data from the specified JSON.
     * JSON format must conform to the one of {@link fabric.Canvas#toJSON}
     *
     * **IMPORTANT**: It is recommended to abort loading tasks before calling this method to prevent race conditions and unnecessary networking
     *
     * @param {String|Object} json JSON string or object
     * @param {Function} [reviver] Method for further parsing of JSON elements, called after each fabric object created.
     * @param {Object} [options] options
     * @param {AbortSignal} [options.signal] see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
     * @return {Promise<Canvas | StaticCanvas>} instance
     * @tutorial {@link http://fabricjs.com/fabric-intro-part-3#deserialization}
     * @see {@link http://jsfiddle.net/fabricjs/fmgXt/|jsFiddle demo}
     * @example <caption>loadFromJSON</caption>
     * canvas.loadFromJSON(json).then((canvas) => canvas.requestRenderAll());
     * @example <caption>loadFromJSON with reviver</caption>
     * canvas.loadFromJSON(json, function(o, object) {
     *   // `o` = json object
     *   // `object` = fabric.Object instance
     *   // ... do some stuff ...
     * }).then((canvas) => {
     *   ... canvas is restored, add your code.
     * });
     *
     */
    loadFromJSON(json: string | Record<string, any>, reviver?: EnlivenObjectOptions['reviver'], { signal }?: Abortable): Promise<this>;
    /**
     * Clones canvas instance
     * @param {string[]} [properties] Array of properties to include in the cloned canvas and children
     */
    clone(properties: string[]): Promise<this>;
    /**
     * Clones canvas instance without cloning existing data.
     * This essentially copies canvas dimensions since loadFromJSON does not affect canvas size.
     */
    cloneWithoutData(): this;
    /**
     * Exports canvas element to a dataurl image. Note that when multiplier is used, cropping is scaled appropriately
     * @param {Object} [options] Options object
     * @param {String} [options.format=png] The format of the output image. Either "jpeg" or "png"
     * @param {Number} [options.quality=1] Quality level (0..1). Only used for jpeg.
     * @param {Number} [options.multiplier=1] Multiplier to scale by, to have consistent
     * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
     * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
     * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
     * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
     * @param {Boolean} [options.enableRetinaScaling] Enable retina scaling for clone image. Introduce in 2.0.0
     * @param {(object: fabric.Object) => boolean} [options.filter] Function to filter objects.
     * @return {String} Returns a data: URL containing a representation of the object in the format specified by options.format
     * @see {@link https://jsfiddle.net/xsjua1rd/ demo}
     * @example <caption>Generate jpeg dataURL with lower quality</caption>
     * var dataURL = canvas.toDataURL({
     *   format: 'jpeg',
     *   quality: 0.8
     * });
     * @example <caption>Generate cropped png dataURL (clipping of canvas)</caption>
     * var dataURL = canvas.toDataURL({
     *   format: 'png',
     *   left: 100,
     *   top: 100,
     *   width: 200,
     *   height: 200
     * });
     * @example <caption>Generate double scaled png dataURL</caption>
     * var dataURL = canvas.toDataURL({
     *   format: 'png',
     *   multiplier: 2
     * });
     * @example <caption>Generate dataURL with objects that overlap a specified object</caption>
     * var myObject;
     * var dataURL = canvas.toDataURL({
     *   filter: (object) => object.isContainedWithinObject(myObject) || object.intersectsWithObject(myObject)
     * });
     */
    toDataURL(options?: TDataUrlOptions): string;
    /**
     * Create a new HTMLCanvas element painted with the current canvas content.
     * No need to resize the actual one or repaint it.
     * Will transfer object ownership to a new canvas, paint it, and set everything back.
     * This is an intermediary step used to get to a dataUrl but also it is useful to
     * create quick image copies of a canvas without passing for the dataUrl string
     * @param {Number} [multiplier] a zoom factor.
     * @param {Object} [options] Cropping informations
     * @param {Number} [options.left] Cropping left offset.
     * @param {Number} [options.top] Cropping top offset.
     * @param {Number} [options.width] Cropping width.
     * @param {Number} [options.height] Cropping height.
     * @param {(object: fabric.Object) => boolean} [options.filter] Function to filter objects.
     */
    toCanvasElement(multiplier?: number, { width, height, left, top, filter }?: TToCanvasElementOptions): HTMLCanvasElement;
    /**
     * Waits until rendering has settled to destroy the canvas
     * @returns {Promise<boolean>} a promise resolving to `true` once the canvas has been destroyed or to `false` if the canvas has was already destroyed
     * @throws if aborted by a consequent call
     */
    dispose(): Promise<boolean>;
    /**
     * Clears the canvas element, disposes objects and frees resources.
     *
     * Invoked as part of the **async** operation of {@link dispose}.
     *
     * **CAUTION**:
     *
     * This method is **UNSAFE**.
     * You may encounter a race condition using it if there's a requested render.
     * Call this method only if you are sure rendering has settled.
     * Consider using {@link dispose} as it is **SAFE**
     *
     * @private
     */
    destroy(): void;
    /**
     * Returns a string representation of an instance
     * @return {String} string representation of an instance
     */
    toString(): string;
}
export {};
//# sourceMappingURL=StaticCanvas.d.ts.map