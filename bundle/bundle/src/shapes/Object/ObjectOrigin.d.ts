import { Point } from '../../point.class';
import type { Group } from '../group.class';
import { TDegree, TOriginX, TOriginY } from '../../typedefs';
import { CommonMethods } from '../../mixins/shared_methods.mixin';
export declare class ObjectOrigin<EventSpec> extends CommonMethods<EventSpec> {
    /**
     * Top position of an object. Note that by default it's relative to object top. You can change this by setting originY={top/center/bottom}
     * @type Number
     * @default 0
     */
    top: number;
    /**
     * Left position of an object. Note that by default it's relative to object left. You can change this by setting originX={left/center/right}
     * @type Number
     * @default 0
     */
    left: number;
    /**
     * Object width
     * @type Number
     * @default
     */
    width: number;
    /**
     * Object height
     * @type Number
     * @default
     */
    height: number;
    /**
     * Object scale factor (horizontal)
     * @type Number
     * @default 1
     */
    scaleX: number;
    /**
     * Object scale factor (vertical)
     * @type Number
     * @default 1
     */
    scaleY: number;
    /**
     * Angle of skew on x axes of an object (in degrees)
     * @type Number
     * @default 0
     */
    skewX: number;
    /**
     * Angle of skew on y axes of an object (in degrees)
     * @type Number
     * @default 0
     */
    skewY: number;
    /**
     * Horizontal origin of transformation of an object (one of "left", "right", "center")
     * See http://jsfiddle.net/1ow02gea/244/ on how originX/originY affect objects in groups
     * @type String
     * @default 'left'
     */
    originX: TOriginX;
    /**
     * Vertical origin of transformation of an object (one of "top", "bottom", "center")
     * See http://jsfiddle.net/1ow02gea/244/ on how originX/originY affect objects in groups
     * @type String
     * @default 'top'
     */
    originY: TOriginY;
    /**
     * Angle of rotation of an object (in degrees)
     * @type Number
     * @default 0
     */
    angle: TDegree;
    /**
     * Width of a stroke used to render this object
     * @type Number
     * @default 1
     */
    strokeWidth: number;
    /**
     * When `false`, the stoke width will scale with the object.
     * When `true`, the stroke will always match the exact pixel size entered for stroke width.
     * this Property does not work on Text classes or drawing call that uses strokeText,fillText methods
     * default to false
     * @since 2.6.0
     * @type Boolean
     * @default false
     * @type Boolean
     * @default false
     */
    strokeUniform: boolean;
    /**
     * Object containing this object.
     * can influence its size and position
     */
    group?: Group;
    _originalOriginX?: TOriginX;
    _originalOriginY?: TOriginY;
    /**
     * Calculate object bounding box dimensions from its properties scale, skew.
     * @param {Object} [options]
     * @param {Number} [options.scaleX]
     * @param {Number} [options.scaleY]
     * @param {Number} [options.skewX]
     * @param {Number} [options.skewY]
     * @private
     * @returns {Point} dimensions
     */
    _getTransformedDimensions(options?: any): Point;
    /**
     * Translates the coordinates from a set of origin to another (based on the object's dimensions)
     * @param {Point} point The point which corresponds to the originX and originY params
     * @param {TOriginX} fromOriginX Horizontal origin: 'left', 'center' or 'right'
     * @param {TOriginY} fromOriginY Vertical origin: 'top', 'center' or 'bottom'
     * @param {TOriginX} toOriginX Horizontal origin: 'left', 'center' or 'right'
     * @param {TOriginY} toOriginY Vertical origin: 'top', 'center' or 'bottom'
     * @return {Point}
     */
    translateToGivenOrigin(point: Point, fromOriginX: TOriginX, fromOriginY: TOriginY, toOriginX: TOriginX, toOriginY: TOriginY): Point;
    /**
     * Translates the coordinates from origin to center coordinates (based on the object's dimensions)
     * @param {Point} point The point which corresponds to the originX and originY params
     * @param {TOriginX} originX Horizontal origin: 'left', 'center' or 'right'
     * @param {TOriginY} originY Vertical origin: 'top', 'center' or 'bottom'
     * @return {Point}
     */
    translateToCenterPoint(point: Point, originX: TOriginX, originY: TOriginY): Point;
    /**
     * Translates the coordinates from center to origin coordinates (based on the object's dimensions)
     * @param {Point} center The point which corresponds to center of the object
     * @param {OriginX} originX Horizontal origin: 'left', 'center' or 'right'
     * @param {OriginY} originY Vertical origin: 'top', 'center' or 'bottom'
     * @return {Point}
     */
    translateToOriginPoint(center: Point, originX: TOriginX, originY: TOriginY): Point;
    /**
     * Returns the center coordinates of the object relative to canvas
     * @return {Point}
     */
    getCenterPoint(): Point;
    /**
     * Returns the center coordinates of the object relative to it's parent
     * @return {Point}
     */
    getRelativeCenterPoint(): Point;
    /**
     * Returns the coordinates of the object as if it has a different origin
     * @param {TOriginX} originX Horizontal origin: 'left', 'center' or 'right'
     * @param {TOriginY} originY Vertical origin: 'top', 'center' or 'bottom'
     * @return {Point}
     */
    getPointByOrigin(originX: TOriginX, originY: TOriginY): Point;
    /**
     * Sets the position of the object taking into consideration the object's origin
     * @param {Point} pos The new position of the object
     * @param {TOriginX} originX Horizontal origin: 'left', 'center' or 'right'
     * @param {TOriginY} originY Vertical origin: 'top', 'center' or 'bottom'
     * @return {void}
     */
    setPositionByOrigin(pos: Point, originX: TOriginX, originY: TOriginY): void;
    /**
     * Sets the origin/position of the object to it's center point
     * @private
     * @return {void}
     */
    _setOriginToCenter(): void;
    /**
     * Resets the origin/position of the object to it's original origin
     * @private
     * @return {void}
     */
    _resetOrigin(): void;
    /**
     * @private
     */
    _getLeftTopCoords(): Point;
}
//# sourceMappingURL=ObjectOrigin.d.ts.map