import { Point } from "../point";
import { Group } from "../shapes/group";
import { Object } from "../shapes/object"

export namespace util {

    /**
     * Calculate the cos of an angle, avoiding returning floats for known results
     * @static
     * @memberOf fabric.util
     * @param {Number} angle the angle in radians or in degree
     * @return {Number}
     */
    export function cos(angle: number): number;

    /**
     * Calculate the sin of an angle, avoiding returning floats for known results
     * @static
     * @memberOf fabric.util
     * @param {Number} angle the angle in radians or in degree
     * @return {Number}
     */
    export function sin(angle: number): number;

    /**
     * Removes value from an array.
     * Presence of value (and its position in an array) is determined via `Array.prototype.indexOf`
     * @static
     * @memberOf fabric.util
     * @param {Array} array
     * @param {*} value
     * @return {Array} original array
     */
    export function removeFromArray(array: Array<any>, value: any): Array<any>;

    /**
     * Returns random number between 2 specified ones.
     * @static
     * @memberOf fabric.util
     * @param {Number} min lower limit
     * @param {Number} max upper limit
     * @return {Number} random value (between min and max)
     */
    export function getRandomInt(min: number, max: number): number

    /**
     * Transforms degrees to radians.
     * @static
     * @memberOf fabric.util
     * @param {Number} degrees value in degrees
     * @return {Number} value in radians
     */
    export function degreesToRadians(degrees: number): number;

    /**
     * Transforms radians to degrees.
     * @static
     * @memberOf fabric.util
     * @param {Number} radians value in radians
     * @return {Number} value in degrees
     */
    export function radiansToDegrees(radians: number): number;

    /**
     * Rotates `point` around `origin` with `radians`
     * @static
     * @memberOf fabric.util
     * @param {fabric.Point} point The point to rotate
     * @param {fabric.Point} origin The origin of the rotation
     * @param {Number} radians The radians of the angle for the rotation
     * @return {fabric.Point} The new rotated point
     */
    export function rotatePoint(point: Point, origin: Point, radians: number): Point;

    /**
     * Rotates `vector` with `radians`
     * @static
     * @memberOf fabric.util
     * @param {Object} vector The vector to rotate (x and y)
     * @param {Number} radians The radians of the angle for the rotation
     * @return {Object} The new rotated point
     */
    export function rotateVector(vector: Point, radians: Object): Object;

    /**
     * Apply transform t to point p
     * @static
     * @memberOf fabric.util
     * @param  {fabric.Point} p The point to transform
     * @param  {Array} t The transform
     * @param  {Boolean} [ignoreOffset] Indicates that the offset should not be applied
     * @return {fabric.Point} The transformed point
     */
    export function transformPoint(p: Point, t: [number, number, number, number, number, number], ignoreOffset: boolean): Point;

    /**
     * Returns coordinates of points's bounding rectangle (left, top, width, height)
     * @param {Array} points 4 points array
     * @return {Object} Object with left, top, width, height properties
     */
    export function makeBoundingBoxFromPoints(points: [Point, Point, Point, Point]): Object;

    /**
     * Invert transformation t
     * @static
     * @memberOf fabric.util
     * @param {Array} t The transform
     * @return {Array} The inverted transform
     */
    export function invertTransform(t: [number, number, number, number, number, number]): [number, number, number, number, number, number];

    /**
     * A wrapper around Number#toFixed, which contrary to native method returns number, not string.
     * @static
     * @memberOf fabric.util
     * @param {Number|String} number number to operate on
     * @param {Number} fractionDigits number of fraction digits to "leave"
     * @return {Number}
     */
    export function toFixed(number: number | string, fractionDigits: number): number;

    /**
     * Converts from attribute value to pixel value if applicable.
     * Returns converted pixels or original value not converted.
     * @param {Number|String} value number to operate on
     * @param {Number} fontSize
     * @return {Number|String}
     */
    export function parseUnit(value: number | string, fontSize: number): number | string;

    /**
     * Function which always returns `false`.
     * @static
     * @memberOf fabric.util
     * @return {Boolean}
     */
    export function falseFunction(): boolean;

    /**
     * Returns klass "Class" object of given namespace
     * @memberOf fabric.util
     * @param {String} type Type of object (eg. 'circle')
     * @param {String} namespace Namespace to get klass "Class" object from
     * @return {Object} klass "Class"
     */
    export function getKlass(type: string, namespace: string): Object;

    /**
     * Returns array of attributes for given svg that fabric parses
     * @memberOf fabric.util
     * @param {String} type Type of svg element (eg. 'circle')
     * @return {Array} string names of supported attributes
     */
    export function getSvgAttributes(type: string): Array<string>;

    /**
     * Returns object of given namespace
     * @memberOf fabric.util
     * @param {String} namespace Namespace string e.g. 'fabric.Image.filter' or 'fabric'
     * @return {Object} Object for given namespace (default fabric)
     */
    export function resolveNamespace(namespace: string): Object;

    /**
     * Loads image element from given url and passes it to a callback
     * @memberOf fabric.util
     * @param {String} url URL representing an image
     * @param {Function} callback Callback; invoked with loaded image
     * @param {*} [context] Context to invoke callback in
     * @param {Object} [crossOrigin] crossOrigin value to set image element to
     */
    export function loadImage(url: string, callback: (element: HTMLElement, object: Object) => void, context?: any, crossOrigin?: Object): void;

    /**
     * Attaches SVG image with data: URL to the dom
     * @memberOf fabric.util
     * @param {Object} img Image object with data:image/svg src
     * @param {Function} onLoadCallback Callback; invoked with loaded image
     * @return {Object} DOM element (div containing the SVG image)
     */
    export function loadImageInDom(img: Object, onLoadCallback: () => void): void;

    /**
     * Creates corresponding fabric instances from their object representations
     * @static
     * @memberOf fabric.util
     * @param {Array} objects Objects to enliven
     * @param {Function} callback Callback to invoke when all objects are created
     * @param {String} namespace Namespace to get klass "Class" object from
     * @param {Function} reviver Method for further parsing of object elements,
     * called after each fabric object created.
     */
    export function enlivenObjects(objects: ReadonlyArray<Object>,
                                   callback: (objects: Array<Object>) => void,
                                   namespace: string,
                                   reviver: (object: Object) => Object): void;

    /**
     * Create and wait for loading of patterns
     * @static
     * @memberOf fabric.util
     * @param {Array} patterns Objects to enliven
     * @param {Function} callback Callback to invoke when all objects are created
     * called after each fabric object created.
     */
    export function enlivenPatterns(patterns: ReadonlyArray<Object>, callback: (object: Object) => void): void;

    /**
     * Groups SVG elements (usually those retrieved from SVG document)
     * @static
     * @memberOf fabric.util
     * @param {Array} elements SVG elements to group
     * @param {Object} [options] Options object
     * @param {String} [path] Value to set sourcePath to
     * @return {fabric.Object|fabric.Group}
     */
    export function groupSVGElements(elements: Array<Object>, options?: Object, path?: string): Group | Object;

    /**
     * Populates an object with properties of another object
     * @static
     * @memberOf fabric.util
     * @param {Object} source Source object
     * @param {Object} destination Destination object
     * @param {Array} properties Properties names to include
     */
    export function populateWithProperties(source: Object, destination: Object, properties: Array<string>): void;

    /**
     * Draws a dashed line between two points
     *
     * This method is used to draw dashed line around selection area.
     * See <a href="http://stackoverflow.com/questions/4576724/dotted-stroke-in-canvas">dotted stroke in canvas</a>
     *
     * @param {CanvasRenderingContext2D} ctx context
     * @param {Number} x  start x coordinate
     * @param {Number} y start y coordinate
     * @param {Number} x2 end x coordinate
     * @param {Number} y2 end y coordinate
     * @param {Array} da dash array pattern
     */
    export function drawDashedLine(ctx: CanvasRenderingContext2D, x: number, y: number, x2: number, y2: number, da: Array<number>): void;

    /**
     * Creates canvas element
     * @static
     * @memberOf fabric.util
     * @return {CanvasElement} initialized canvas element
     */
    export function createCanvasElement(): HTMLCanvasElement;

    /**
     * Creates image element (works on client and node)
     * @static
     * @memberOf fabric.util
     * @return {HTMLImageElement} HTML image element
     */
    export function createImage(): HTMLImageElement;

    /**
     * @static
     * @memberOf fabric.util
     * @deprecated since 2.0.0
     * @param {fabric.Object} receiver Object implementing `clipTo` method
     * @param {CanvasRenderingContext2D} ctx Context to clip
     */
    export function clipContext(receiver: Object, ctx: CanvasRenderingContext2D): void;

    /**
     * Multiply matrix A by matrix B to nest transformations
     * @static
     * @memberOf fabric.util
     * @param  {Array} a First transformMatrix
     * @param  {Array} b Second transformMatrix
     * @param  {Boolean} is2x2 flag to multiply matrices as 2x2 matrices
     * @return {Array} The product of the two transform matrices
     */
    export function multiplyTransformMatrices(a: [number, number, number, number, number, number],
                                              b: [number, number, number, number, number, number],
                                              is2x2: boolean): [number, number, number, number, number, number];

    /**
     * Decomposes standard 2x2 matrix into transform componentes
     * @static
     * @memberOf fabric.util
     * @param  {Array} a transformMatrix
     * @return {Object} Components of transform
     */
    export function qrDecompose(a: [number, number, number, number, number, number]): Object;

    export function customTransformMatrix(scaleX: number, scaleY: number, skewX: number): [number, number, number, number, number, number];

    export function resetObjectTransform(target: Object): void;

    /**
     * Returns string representation of function body
     * @param {Function} fn Function to get body of
     * @return {String} Function body
     */
    export function getFunctionBody(fn: Function): string;

    /**
     * Returns true if context has transparent pixel
     * at specified location (taking tolerance into account)
     * @param {CanvasRenderingContext2D} ctx context
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {Number} tolerance Tolerance
     */
    export function isTransparent(ctx: CanvasRenderingContext2D, x: number, y: number, tolerance: number): void;

    /**
     * Parse preserveAspectRatio attribute from element
     * @param {string} attribute to be parsed
     * @return {Object} an object containing align and meetOrSlice attribute
     */
    export function parsePreserveAspectRatioAttribute(attribute: string): Object;

    /**
     * Clear char widths cache for a font family.
     * @memberOf fabric.util
     * @param {String} [fontFamily] font family to clear
     */
    export function clearFabricFontCache(fontFamily: string): void;

    /**
     * Clear char widths cache for a font family.
     * @memberOf fabric.util
     * @param {Number} ar aspect ratio
     * @param {Number} maximumArea Maximum area you want to achieve
     * @return {Object.x} Limited dimensions by X
     * @return {Object.y} Limited dimensions by Y
     */
    export function limitDimsByArea(ar: number, maximumArea: number): { x: number, y: number };

    export function capValue(min: number, value: number, max: number): number;

    export function findScaleToFit(source: Object, destination: Object): number;

    export function findScaleToCover(source: Object, destination: Object): number;
}
