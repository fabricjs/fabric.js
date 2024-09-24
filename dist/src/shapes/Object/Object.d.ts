import type { ObjectEvents } from '../../EventTypeDefs';
import { Point } from '../../Point';
import { Shadow } from '../../Shadow';
import type { TDegree, TFiller, TSize, TCacheCanvasDimensions, Abortable, TOptions, ImageFormat } from '../../typedefs';
import type { Group } from '../Group';
import { StaticCanvas } from '../../canvas/StaticCanvas';
import type { FabricImage } from '../Image';
import type { SerializedObjectProps } from './types/SerializedObjectProps';
import type { ObjectProps } from './types/ObjectProps';
import type { TColorArg } from '../../color/typedefs';
import type { TAnimation } from '../../util/animation/animate';
import type { AnimationOptions } from '../../util/animation/types';
import { ObjectGeometry } from './ObjectGeometry';
type TAncestor = FabricObject;
export type Ancestors = [FabricObject | Group] | [FabricObject | Group, ...Group[]] | Group[];
export type AncestryComparison = {
    /**
     * common ancestors of `this` and`other`(may include`this` | `other`)
     */
    common: Ancestors;
    /**
     * ancestors that are of `this` only
     */
    fork: Ancestors;
    /**
     * ancestors that are of `other` only
     */
    otherFork: Ancestors;
};
export type TCachedFabricObject<T extends FabricObject = FabricObject> = T & Required<Pick<T, 'zoomX' | 'zoomY' | '_cacheCanvas' | '_cacheContext' | 'cacheTranslationX' | 'cacheTranslationY'>> & {
    _cacheContext: CanvasRenderingContext2D;
};
export type ObjectToCanvasElementOptions = {
    format?: ImageFormat;
    /** Multiplier to scale by */
    multiplier?: number;
    /** Cropping left offset. Introduced in v1.2.14 */
    left?: number;
    /** Cropping top offset. Introduced in v1.2.14 */
    top?: number;
    /** Cropping width. Introduced in v1.2.14 */
    width?: number;
    /** Cropping height. Introduced in v1.2.14 */
    height?: number;
    /** Enable retina scaling for clone image. Introduce in 1.6.4 */
    enableRetinaScaling?: boolean;
    /** Remove current object transform ( no scale , no angle, no flip, no skew ). Introduced in 2.3.4 */
    withoutTransform?: boolean;
    /** Remove current object shadow. Introduced in 2.4.2 */
    withoutShadow?: boolean;
    /** Account for canvas viewport transform */
    viewportTransform?: boolean;
    /** Function to create the output canvas to export onto */
    canvasProvider?: <T extends StaticCanvas>(el?: HTMLCanvasElement) => T;
};
type toDataURLOptions = ObjectToCanvasElementOptions & {
    quality?: number;
};
/**
 * Root object class from which all 2d shape classes inherit from
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-1#objects}
 *
 * @fires added
 * @fires removed
 *
 * @fires selected
 * @fires deselected
 *
 * @fires rotating
 * @fires scaling
 * @fires moving
 * @fires skewing
 * @fires modified
 *
 * @fires mousedown
 * @fires mouseup
 * @fires mouseover
 * @fires mouseout
 * @fires mousewheel
 * @fires mousedblclick
 *
 * @fires dragover
 * @fires dragenter
 * @fires dragleave
 * @fires drop
 */
export declare class FabricObject<Props extends TOptions<ObjectProps> = Partial<ObjectProps>, SProps extends SerializedObjectProps = SerializedObjectProps, EventSpec extends ObjectEvents = ObjectEvents> extends ObjectGeometry<EventSpec> implements ObjectProps {
    minScaleLimit: number;
    opacity: number;
    paintFirst: 'fill' | 'stroke';
    fill: string | TFiller | null;
    fillRule: CanvasFillRule;
    stroke: string | TFiller | null;
    strokeDashArray: number[] | null;
    strokeDashOffset: number;
    strokeLineCap: CanvasLineCap;
    strokeLineJoin: CanvasLineJoin;
    strokeMiterLimit: number;
    globalCompositeOperation: GlobalCompositeOperation;
    backgroundColor: string;
    shadow: Shadow | null;
    visible: boolean;
    includeDefaultValues: boolean;
    excludeFromExport: boolean;
    objectCaching: boolean;
    clipPath?: FabricObject;
    inverted: boolean;
    absolutePositioned: boolean;
    centeredRotation: boolean;
    centeredScaling: boolean;
    /**
     * This list of properties is used to check if the state of an object is changed.
     * This state change now is only used for children of groups to understand if a group
     * needs its cache regenerated during a .set call
     * @type Array
     */
    static stateProperties: string[];
    /**
     * List of properties to consider when checking if cache needs refresh
     * Those properties are checked by
     * calls to Object.set(key, value). If the key is in this list, the object is marked as dirty
     * and refreshed at the next render
     * @type Array
     */
    static cacheProperties: string[];
    /**
     * When set to `true`, object's cache will be rerendered next render call.
     * since 1.7.0
     * @type Boolean
     * @default true
     */
    dirty: boolean;
    /**
     * Quick access for the _cacheCanvas rendering context
     * This is part of the objectCaching feature
     * since 1.7.0
     * @type boolean
     * @default undefined
     * @private
     */
    _cacheContext: CanvasRenderingContext2D | null;
    /**
     * A reference to the HTMLCanvasElement that is used to contain the cache of the object
     * this canvas element is resized and cleared as needed
     * Is marked private, you can read it, don't use it since it is handled by fabric
     * since 1.7.0
     * @type HTMLCanvasElement
     * @default undefined
     * @private
     */
    _cacheCanvas?: HTMLCanvasElement;
    /**
     * zoom level used on the cacheCanvas to draw the cache, X axe
     * since 1.7.0
     * @type number
     * @default undefined
     * @private
     */
    zoomX?: number;
    /**
     * zoom level used on the cacheCanvas to draw the cache, Y axe
     * since 1.7.0
     * @type number
     * @default undefined
     * @private
     */
    zoomY?: number;
    /**
     * zoom level used on the cacheCanvas to draw the cache, Y axe
     * since 1.7.0
     * @type number
     * @default undefined
     * @private
     */
    cacheTranslationX?: number;
    /**
     * translation of the cacheCanvas away from the center, for subpixel accuracy and crispness
     * since 1.7.0
     * @type number
     * @default undefined
     * @private
     */
    cacheTranslationY?: number;
    /**
     * A reference to the parent of the object, usually a Group
     * @type number
     * @default undefined
     * @private
     */
    group?: Group;
    /**
     * Indicate if the object is sitting on a cache dedicated to it
     * or is part of a larger cache for many object ( a group for example)
     * @type number
     * @default undefined
     * @private
     */
    ownCaching?: boolean;
    /**
     * Private. indicates if the object inside a group is on a transformed context or not
     * or is part of a larger cache for many object ( a group for example)
     * @type boolean
     * @default undefined
     * @private
     */
    _transformDone?: boolean;
    static ownDefaults: Partial<import("../../typedefs").TClassProperties<FabricObject<Partial<ObjectProps>, SerializedObjectProps, ObjectEvents>>>;
    static getDefaults(): Record<string, any>;
    /**
     * The class type.
     * This is used for serialization and deserialization purposes and internally it can be used
     * to identify classes.
     * When we transform a class in a plain JS object we need a way to recognize which class it was,
     * and the type is the way we do that. It has no other purposes and you should not give one.
     * Hard to reach on instances and please do not use to drive instance's logic (this.constructor.type).
     * To idenfity a class use instanceof class ( instanceof Rect ).
     * We do not do that in fabricJS code because we want to try to have code splitting possible.
     */
    static type: string;
    /**
     * Legacy identifier of the class. Prefer using utils like isType or instanceOf
     * Will be removed in fabric 7 or 8.
     * The setter exists to avoid type errors in old code and possibly current deserialization code.
     * @TODO add sustainable warning message
     * @type string
     * @deprecated
     */
    get type(): string;
    set type(value: string);
    /**
     * Constructor
     * @param {Object} [options] Options object
     */
    constructor(options?: Props);
    /**
     * Create a the canvas used to keep the cached copy of the object
     * @private
     */
    _createCacheCanvas(): void;
    /**
     * Limit the cache dimensions so that X * Y do not cross config.perfLimitSizeTotal
     * and each side do not cross fabric.cacheSideLimit
     * those numbers are configurable so that you can get as much detail as you want
     * making bargain with performances.
     * @param {Object} dims
     * @param {Object} dims.width width of canvas
     * @param {Object} dims.height height of canvas
     * @param {Object} dims.zoomX zoomX zoom value to unscale the canvas before drawing cache
     * @param {Object} dims.zoomY zoomY zoom value to unscale the canvas before drawing cache
     * @return {Object}.width width of canvas
     * @return {Object}.height height of canvas
     * @return {Object}.zoomX zoomX zoom value to unscale the canvas before drawing cache
     * @return {Object}.zoomY zoomY zoom value to unscale the canvas before drawing cache
     */
    _limitCacheSize(dims: TSize & {
        zoomX: number;
        zoomY: number;
        capped: boolean;
    } & any): any;
    /**
     * Return the dimension and the zoom level needed to create a cache canvas
     * big enough to host the object to be cached.
     * @private
     * @return {Object}.x width of object to be cached
     * @return {Object}.y height of object to be cached
     * @return {Object}.width width of canvas
     * @return {Object}.height height of canvas
     * @return {Object}.zoomX zoomX zoom value to unscale the canvas before drawing cache
     * @return {Object}.zoomY zoomY zoom value to unscale the canvas before drawing cache
     */
    _getCacheCanvasDimensions(): TCacheCanvasDimensions;
    /**
     * Update width and height of the canvas for cache
     * returns true or false if canvas needed resize.
     * @private
     * @return {Boolean} true if the canvas has been resized
     */
    _updateCacheCanvas(): boolean;
    /**
     * Sets object's properties from options, for class constructor only.
     * Needs to be overridden for different defaults.
     * @protected
     * @param {Object} [options] Options object
     */
    protected setOptions(options?: Record<string, any>): void;
    /**
     * Transforms context when rendering an object
     * @param {CanvasRenderingContext2D} ctx Context
     */
    transform(ctx: CanvasRenderingContext2D): void;
    /**
     * Return the object scale factor counting also the group scaling
     * @return {Point}
     */
    getObjectScaling(): Point;
    /**
     * Return the object scale factor counting also the group scaling, zoom and retina
     * @return {Object} object with scaleX and scaleY properties
     */
    getTotalObjectScaling(): Point;
    /**
     * Return the object opacity counting also the group property
     * @return {Number}
     */
    getObjectOpacity(): number;
    /**
     * Makes sure the scale is valid and modifies it if necessary
     * @todo: this is a control action issue, not a geometry one
     * @private
     * @param {Number} value, unconstrained
     * @return {Number} constrained value;
     */
    _constrainScale(value: number): number;
    /**
     * Handles setting values on the instance and handling internal side effects
     * @protected
     * @param {String} key
     * @param {*} value
     */
    _set(key: string, value: any): this;
    isNotVisible(): boolean;
    /**
     * Renders an object on a specified context
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    render(ctx: CanvasRenderingContext2D): void;
    drawSelectionBackground(_ctx: CanvasRenderingContext2D): void;
    renderCache(options?: any): void;
    /**
     * Remove cacheCanvas and its dimensions from the objects
     */
    _removeCacheCanvas(): void;
    /**
     * return true if the object will draw a stroke
     * Does not consider text styles. This is just a shortcut used at rendering time
     * We want it to be an approximation and be fast.
     * wrote to avoid extra caching, it has to return true when stroke happens,
     * can guess when it will not happen at 100% chance, does not matter if it misses
     * some use case where the stroke is invisible.
     * @since 3.0.0
     * @returns Boolean
     */
    hasStroke(): boolean | "" | null;
    /**
     * return true if the object will draw a fill
     * Does not consider text styles. This is just a shortcut used at rendering time
     * We want it to be an approximation and be fast.
     * wrote to avoid extra caching, it has to return true when fill happens,
     * can guess when it will not happen at 100% chance, does not matter if it misses
     * some use case where the fill is invisible.
     * @since 3.0.0
     * @returns Boolean
     */
    hasFill(): boolean | "" | null;
    /**
     * When set to `true`, force the object to have its own cache, even if it is inside a group
     * it may be needed when your object behave in a particular way on the cache and always needs
     * its own isolated canvas to render correctly.
     * Created to be overridden
     * since 1.7.12
     * @returns Boolean
     */
    needsItsOwnCache(): boolean;
    /**
     * Decide if the object should cache or not. Create its own cache level
     * objectCaching is a global flag, wins over everything
     * needsItsOwnCache should be used when the object drawing method requires
     * a cache step. None of the fabric classes requires it.
     * Generally you do not cache objects in groups because the group outside is cached.
     * Read as: cache if is needed, or if the feature is enabled but we are not already caching.
     * @return {Boolean}
     */
    shouldCache(): boolean;
    /**
     * Check if this object will cast a shadow with an offset.
     * used by Group.shouldCache to know if child has a shadow recursively
     * @return {Boolean}
     * @deprecated
     */
    willDrawShadow(): boolean;
    /**
     * Execute the drawing operation for an object clipPath
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {FabricObject} clipPath
     */
    drawClipPathOnCache(ctx: CanvasRenderingContext2D, clipPath: TCachedFabricObject): void;
    /**
     * Execute the drawing operation for an object on a specified context
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {boolean} forClipping apply clipping styles
     */
    drawObject(ctx: CanvasRenderingContext2D, forClipping?: boolean): void;
    /**
     * Prepare clipPath state and cache and draw it on instance's cache
     * @param {CanvasRenderingContext2D} ctx
     * @param {FabricObject} clipPath
     */
    _drawClipPath(ctx: CanvasRenderingContext2D, clipPath?: FabricObject): void;
    /**
     * Paint the cached copy of the object on the target context.
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    drawCacheOnCanvas(this: TCachedFabricObject, ctx: CanvasRenderingContext2D): void;
    /**
     * Check if cache is dirty
     * @param {Boolean} skipCanvas skip canvas checks because this object is painted
     * on parent canvas.
     */
    isCacheDirty(skipCanvas?: boolean): boolean;
    /**
     * Draws a background for the object big as its untransformed dimensions
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderBackground(ctx: CanvasRenderingContext2D): void;
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _setOpacity(ctx: CanvasRenderingContext2D): void;
    _setStrokeStyles(ctx: CanvasRenderingContext2D, decl: Pick<this, 'stroke' | 'strokeWidth' | 'strokeLineCap' | 'strokeDashOffset' | 'strokeLineJoin' | 'strokeMiterLimit'>): void;
    _setFillStyles(ctx: CanvasRenderingContext2D, { fill }: Pick<this, 'fill'>): void;
    _setClippingProperties(ctx: CanvasRenderingContext2D): void;
    /**
     * @private
     * Sets line dash
     * @param {CanvasRenderingContext2D} ctx Context to set the dash line on
     * @param {Array} dashArray array representing dashes
     */
    _setLineDash(ctx: CanvasRenderingContext2D, dashArray?: number[] | null): void;
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _setShadow(ctx: CanvasRenderingContext2D): void;
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _removeShadow(ctx: CanvasRenderingContext2D): void;
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {TFiller} filler {@link Pattern} or {@link Gradient}
     */
    _applyPatternGradientTransform(ctx: CanvasRenderingContext2D, filler: TFiller): {
        offsetX: number;
        offsetY: number;
    };
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderPaintInOrder(ctx: CanvasRenderingContext2D): void;
    /**
     * @private
     * function that actually render something on the context.
     * empty here to allow Obects to work on tests to benchmark fabric functionalites
     * not related to rendering
     * @param {CanvasRenderingContext2D} _ctx Context to render on
     */
    _render(_ctx: CanvasRenderingContext2D): void;
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderFill(ctx: CanvasRenderingContext2D): void;
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderStroke(ctx: CanvasRenderingContext2D): void;
    /**
     * This function try to patch the missing gradientTransform on canvas gradients.
     * transforming a context to transform the gradient, is going to transform the stroke too.
     * we want to transform the gradient but not the stroke operation, so we create
     * a transformed gradient on a pattern and then we use the pattern instead of the gradient.
     * this method has drawbacks: is slow, is in low resolution, needs a patch for when the size
     * is limited.
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Gradient} filler
     */
    _applyPatternForTransformedGradient(ctx: CanvasRenderingContext2D, filler: TFiller): void;
    /**
     * This function is an helper for svg import. it returns the center of the object in the svg
     * untransformed coordinates
     * @private
     * @return {Point} center point from element coordinates
     */
    _findCenterFromElement(): Point;
    /**
     * Clones an instance.
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @returns {Promise<FabricObject>}
     */
    clone(propertiesToInclude?: string[]): Promise<this>;
    /**
     * Creates an instance of Image out of an object
     * makes use of toCanvasElement.
     * Once this method was based on toDataUrl and loadImage, so it also had a quality
     * and format option. toCanvasElement is faster and produce no loss of quality.
     * If you need to get a real Jpeg or Png from an object, using toDataURL is the right way to do it.
     * toCanvasElement and then toBlob from the obtained canvas is also a good option.
     * @todo fix the export type, it could not be Image but the type that getClass return for 'image'.
     * @param {ObjectToCanvasElementOptions} [options] for clone as image, passed to toDataURL
     * @param {Number} [options.multiplier=1] Multiplier to scale by
     * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
     * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
     * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
     * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
     * @param {Boolean} [options.enableRetinaScaling] Enable retina scaling for clone image. Introduce in 1.6.4
     * @param {Boolean} [options.withoutTransform] Remove current object transform ( no scale , no angle, no flip, no skew ). Introduced in 2.3.4
     * @param {Boolean} [options.withoutShadow] Remove current object shadow. Introduced in 2.4.2
     * @return {FabricImage} Object cloned as image.
     */
    cloneAsImage(options: ObjectToCanvasElementOptions): FabricImage;
    /**
     * Converts an object into a HTMLCanvas element
     * @param {ObjectToCanvasElementOptions} options Options object
     * @param {Number} [options.multiplier=1] Multiplier to scale by
     * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
     * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
     * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
     * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
     * @param {Boolean} [options.enableRetinaScaling] Enable retina scaling for clone image. Introduce in 1.6.4
     * @param {Boolean} [options.withoutTransform] Remove current object transform ( no scale , no angle, no flip, no skew ). Introduced in 2.3.4
     * @param {Boolean} [options.withoutShadow] Remove current object shadow. Introduced in 2.4.2
     * @param {Boolean} [options.viewportTransform] Account for canvas viewport transform
     * @param {(el?: HTMLCanvasElement) => StaticCanvas} [options.canvasProvider] Create the output canvas
     * @return {HTMLCanvasElement} Returns DOM element <canvas> with the FabricObject
     */
    toCanvasElement(options?: ObjectToCanvasElementOptions): HTMLCanvasElement;
    /**
     * Converts an object into a data-url-like string
     * @param {Object} options Options object
     * @param {String} [options.format=png] The format of the output image. Either "jpeg" or "png"
     * @param {Number} [options.quality=1] Quality level (0..1). Only used for jpeg.
     * @param {Number} [options.multiplier=1] Multiplier to scale by
     * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
     * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
     * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
     * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
     * @param {Boolean} [options.enableRetinaScaling] Enable retina scaling for clone image. Introduce in 1.6.4
     * @param {Boolean} [options.withoutTransform] Remove current object transform ( no scale , no angle, no flip, no skew ). Introduced in 2.3.4
     * @param {Boolean} [options.withoutShadow] Remove current object shadow. Introduced in 2.4.2
     * @return {String} Returns a data: URL containing a representation of the object in the format specified by options.format
     */
    toDataURL(options?: toDataURLOptions): string;
    /**
     * Returns true if any of the specified types is identical to the type of an instance
     * @param {String} type Type to check against
     * @return {Boolean}
     */
    isType(...types: string[]): boolean;
    /**
     * Returns complexity of an instance
     * @return {Number} complexity of this instance (is 1 unless subclassed)
     */
    complexity(): number;
    /**
     * Returns a JSON representation of an instance
     * @return {Object} JSON
     */
    toJSON(): any;
    /**
     * Sets "angle" of an instance with centered rotation
     * @param {TDegree} angle Angle value (in degrees)
     */
    rotate(angle: TDegree): void;
    /**
     * This callback function is called by the parent group of an object every
     * time a non-delegated property changes on the group. It is passed the key
     * and value as parameters. Not adding in this function's signature to avoid
     * Travis build error about unused variables.
     */
    setOnGroup(): void;
    /**
     * Sets canvas globalCompositeOperation for specific object
     * custom composition operation for the particular object can be specified using globalCompositeOperation property
     * @param {CanvasRenderingContext2D} ctx Rendering canvas context
     */
    _setupCompositeOperation(ctx: CanvasRenderingContext2D): void;
    /**
     * cancel instance's running animations
     * override if necessary to dispose artifacts such as `clipPath`
     */
    dispose(): void;
    /**
     * List of properties to consider for animating colors.
     * @type String[]
     */
    static colorProperties: string[];
    /**
     * Animates object's properties
     * @param {Record<string, number | number[] | TColorArg>} animatable map of keys and end values
     * @param {Partial<AnimationOptions<T>>} options
     * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#animation}
     * @return {Record<string, TAnimation<T>>} map of animation contexts
     *
     * As object — multiple properties
     *
     * object.animate({ left: ..., top: ... });
     * object.animate({ left: ..., top: ... }, { duration: ... });
     */
    animate<T extends number | number[] | TColorArg>(animatable: Record<string, T>, options?: Partial<AnimationOptions<T>>): Record<string, TAnimation<T>>;
    /**
     * @private
     * @param {String} key Property to animate
     * @param {String} to Value to animate to
     * @param {Object} [options] Options object
     */
    _animate<T extends number | number[] | TColorArg>(key: string, endValue: T, options?: Partial<AnimationOptions<T>>): TAnimation<T>;
    /**
     * A reference to the parent of the object
     * Used to keep the original parent ref when the object has been added to an ActiveSelection, hence loosing the `group` ref
     */
    parent?: Group;
    /**
     * Checks if object is descendant of target
     * Should be used instead of {@link Group.contains} or {@link StaticCanvas.contains} for performance reasons
     * @param {TAncestor} target
     * @returns {boolean}
     */
    isDescendantOf(target: TAncestor): boolean;
    /**
     * @returns {Ancestors} ancestors (excluding `ActiveSelection`) from bottom to top
     */
    getAncestors(): Ancestors;
    /**
     * Compare ancestors
     *
     * @param {StackedObject} other
     * @returns {AncestryComparison} an object that represent the ancestry situation.
     */
    findCommonAncestors<T extends this>(other: T): AncestryComparison;
    /**
     *
     * @param {StackedObject} other
     * @returns {boolean}
     */
    hasCommonAncestors<T extends this>(other: T): boolean;
    /**
     *
     * @param {FabricObject} other object to compare against
     * @returns {boolean | undefined} if objects do not share a common ancestor or they are strictly equal it is impossible to determine which is in front of the other; in such cases the function returns `undefined`
     */
    isInFrontOf<T extends this>(other: T): boolean | undefined;
    /**
     * Define a list of custom properties that will be serialized when
     * instance.toObject() gets called
     */
    static customProperties: string[];
    /**
     * Returns an object representation of an instance
     * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toObject(propertiesToInclude?: any[]): any;
    /**
     * Returns (dataless) object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toDatalessObject(propertiesToInclude?: any[]): any;
    /**
     * @private
     * @param {Object} object
     */
    _removeDefaultValues<T extends object>(object: T): Partial<T>;
    /**
     * Returns a string representation of an instance
     * @return {String}
     */
    toString(): string;
    /**
     *
     * @param {Function} klass
     * @param {object} object
     * @param {object} [options]
     * @param {string} [options.extraParam] property to pass as first argument to the constructor
     * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
     * @returns {Promise<FabricObject>}
     */
    static _fromObject<S extends FabricObject>({ type, ...serializedObjectOptions }: Record<string, unknown>, { extraParam, ...options }?: Abortable & {
        extraParam?: string;
    }): Promise<S>;
    /**
     *
     * @param {object} object
     * @param {object} [options]
     * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
     * @returns {Promise<FabricObject>}
     */
    static fromObject<T extends TOptions<SerializedObjectProps>>(object: T, options?: Abortable): Promise<FabricObject<Partial<ObjectProps>, SerializedObjectProps, ObjectEvents>>;
}
export {};
//# sourceMappingURL=Object.d.ts.map