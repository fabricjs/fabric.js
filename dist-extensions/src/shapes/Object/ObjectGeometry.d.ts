import type { TBBox, TCornerPoint, TDegree, TMat2D, TOriginX, TOriginY } from '../../typedefs';
import { Point } from '../../Point';
import type { Canvas } from '../../canvas/Canvas';
import type { StaticCanvas } from '../../canvas/StaticCanvas';
import type { ObjectEvents } from '../../EventTypeDefs';
import type { ControlProps } from './types/ControlProps';
import type { Group } from '../Group';
import { CommonMethods } from '../../CommonMethods';
import type { BaseProps } from './types/BaseProps';
import type { FillStrokeProps } from './types/FillStrokeProps';
type TMatrixCache = {
    key: number[];
    value: TMat2D;
};
type TACoords = TCornerPoint;
export declare class ObjectGeometry<EventSpec extends ObjectEvents = ObjectEvents> extends CommonMethods<EventSpec> implements Pick<ControlProps, 'padding'>, BaseProps, Pick<FillStrokeProps, 'strokeWidth' | 'strokeUniform'> {
    padding: number;
    /**
     * Describe object's corner position in scene coordinates.
     * The coordinates are derived from the following:
     * left, top, width, height, scaleX, scaleY, skewX, skewY, angle, strokeWidth.
     * The coordinates do not depend on viewport changes.
     * The coordinates get updated with {@link setCoords}.
     * You can calculate them without updating with {@link calcACoords()}
     */
    aCoords: TACoords;
    /**
     * storage cache for object transform matrix
     */
    ownMatrixCache?: TMatrixCache;
    /**
     * storage cache for object full transform matrix
     */
    matrixCache?: TMatrixCache;
    /**
     * A Reference of the Canvas where the object is actually added
     * @type StaticCanvas | Canvas;
     * @default undefined
     * @private
     */
    canvas?: StaticCanvas | Canvas;
    /**
     * @returns {number} x position according to object's {@link originX} property in canvas coordinate plane
     */
    getX(): number;
    /**
     * @param {number} value x position according to object's {@link originX} property in canvas coordinate plane
     */
    setX(value: number): void;
    /**
     * @returns {number} y position according to object's {@link originY} property in canvas coordinate plane
     */
    getY(): number;
    /**
     * @param {number} value y position according to object's {@link originY} property in canvas coordinate plane
     */
    setY(value: number): void;
    /**
     * @returns {number} x position according to object's {@link originX} property in parent's coordinate plane\
     * if parent is canvas then this property is identical to {@link getX}
     */
    getRelativeX(): number;
    /**
     * @param {number} value x position according to object's {@link originX} property in parent's coordinate plane\
     * if parent is canvas then this method is identical to {@link setX}
     */
    setRelativeX(value: number): void;
    /**
     * @returns {number} y position according to object's {@link originY} property in parent's coordinate plane\
     * if parent is canvas then this property is identical to {@link getY}
     */
    getRelativeY(): number;
    /**
     * @param {number} value y position according to object's {@link originY} property in parent's coordinate plane\
     * if parent is canvas then this property is identical to {@link setY}
     */
    setRelativeY(value: number): void;
    /**
     * @returns {Point} x position according to object's {@link originX} {@link originY} properties in canvas coordinate plane
     */
    getXY(): Point;
    /**
     * Set an object position to a particular point, the point is intended in absolute ( canvas ) coordinate.
     * You can specify {@link originX} and {@link originY} values,
     * that otherwise are the object's current values.
     * @example <caption>Set object's bottom left corner to point (5,5) on canvas</caption>
     * object.setXY(new Point(5, 5), 'left', 'bottom').
     * @param {Point} point position in scene coordinate plane
     * @param {TOriginX} [originX] Horizontal origin: 'left', 'center' or 'right'
     * @param {TOriginY} [originY] Vertical origin: 'top', 'center' or 'bottom'
     */
    setXY(point: Point, originX?: TOriginX, originY?: TOriginY): void;
    /**
     * @returns {Point} x,y position according to object's {@link originX} {@link originY} properties in parent's coordinate plane
     */
    getRelativeXY(): Point;
    /**
     * As {@link setXY}, but in current parent's coordinate plane (the current group if any or the canvas)
     * @param {Point} point position according to object's {@link originX} {@link originY} properties in parent's coordinate plane
     * @param {TOriginX} [originX] Horizontal origin: 'left', 'center' or 'right'
     * @param {TOriginY} [originY] Vertical origin: 'top', 'center' or 'bottom'
     */
    setRelativeXY(point: Point, originX?: TOriginX, originY?: TOriginY): void;
    /**
     * @deprecated intermidiate method to be removed, do not use
     */
    protected isStrokeAccountedForInDimensions(): boolean;
    /**
     * @return {Point[]} [tl, tr, br, bl] in the scene plane
     */
    getCoords(): Point[];
    /**
     * Checks if object intersects with the scene rect formed by {@link tl} and {@link br}
     */
    intersectsWithRect(tl: Point, br: Point): boolean;
    /**
     * Checks if object intersects with another object
     * @param {Object} other Object to test
     * @return {Boolean} true if object intersects with another object
     */
    intersectsWithObject(other: ObjectGeometry): boolean;
    /**
     * Checks if object is fully contained within area of another object
     * @param {Object} other Object to test
     * @return {Boolean} true if object is fully contained within area of another object
     */
    isContainedWithinObject(other: ObjectGeometry): boolean;
    /**
     * Checks if object is fully contained within the scene rect formed by {@link tl} and {@link br}
     */
    isContainedWithinRect(tl: Point, br: Point): boolean;
    isOverlapping<T extends ObjectGeometry>(other: T): boolean;
    /**
     * Checks if point is inside the object
     * @param {Point} point Point to check against
     * @return {Boolean} true if point is inside the object
     */
    containsPoint(point: Point): boolean;
    /**
     * Checks if object is contained within the canvas with current viewportTransform
     * the check is done stopping at first point that appears on screen
     * @return {Boolean} true if object is fully or partially contained within canvas
     */
    isOnScreen(): boolean;
    /**
     * Checks if object is partially contained within the canvas with current viewportTransform
     * @return {Boolean} true if object is partially contained within canvas
     */
    isPartiallyOnScreen(): boolean;
    /**
     * Returns coordinates of object's bounding rectangle (left, top, width, height)
     * the box is intended as aligned to axis of canvas.
     * @return {Object} Object with left, top, width, height properties
     */
    getBoundingRect(): TBBox;
    /**
     * Returns width of an object's bounding box counting transformations
     * @todo shouldn't this account for group transform and return the actual size in canvas coordinate plane?
     * @return {Number} width value
     */
    getScaledWidth(): number;
    /**
     * Returns height of an object bounding box counting transformations
     * @todo shouldn't this account for group transform and return the actual size in canvas coordinate plane?
     * @return {Number} height value
     */
    getScaledHeight(): number;
    /**
     * Scales an object (equally by x and y)
     * @param {Number} value Scale factor
     * @return {void}
     */
    scale(value: number): void;
    /**
     * Scales an object to a given width, with respect to bounding box (scaling by x/y equally)
     * @param {Number} value New width value
     * @return {void}
     */
    scaleToWidth(value: number): void;
    /**
     * Scales an object to a given height, with respect to bounding box (scaling by x/y equally)
     * @param {Number} value New height value
     * @return {void}
     */
    scaleToHeight(value: number): void;
    getCanvasRetinaScaling(): number;
    /**
     * Returns the object angle relative to canvas counting also the group property
     * @returns {TDegree}
     */
    getTotalAngle(): TDegree;
    /**
     * Retrieves viewportTransform from Object's canvas if available
     * @return {TMat2D}
     */
    getViewportTransform(): TMat2D;
    /**
     * Calculates the coordinates of the 4 corner of the bbox, in absolute coordinates.
     * those never change with zoom or viewport changes.
     * @return {TCornerPoint}
     */
    calcACoords(): TCornerPoint;
    /**
     * Sets corner and controls position coordinates based on current angle, width and height, left and top.
     * aCoords are used to quickly find an object on the canvas.
     * See {@link https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords} and {@link http://fabricjs.com/fabric-gotchas}
     */
    setCoords(): void;
    transformMatrixKey(skipGroup?: boolean): number[];
    /**
     * calculate transform matrix that represents the current transformations from the
     * object's properties.
     * @param {Boolean} [skipGroup] return transform matrix for object not counting parent transformations
     * There are some situation in which this is useful to avoid the fake rotation.
     * @return {TMat2D} transform matrix for the object
     */
    calcTransformMatrix(skipGroup?: boolean): TMat2D;
    /**
     * calculate transform matrix that represents the current transformations from the
     * object's properties, this matrix does not include the group transformation
     * @return {TMat2D} transform matrix for the object
     */
    calcOwnMatrix(): TMat2D;
    /**
     * Calculate object dimensions from its properties
     * @private
     * @returns {Point} dimensions
     */
    _getNonTransformedDimensions(): Point;
    /**
     * Calculate object dimensions for controls box, including padding and canvas zoom.
     * and active selection
     * @private
     * @param {object} [options] transform options
     * @returns {Point} dimensions
     */
    _calculateCurrentDimensions(options?: any): Point;
    top: number;
    left: number;
    width: number;
    height: number;
    flipX: boolean;
    flipY: boolean;
    scaleX: number;
    scaleY: number;
    skewX: number;
    skewY: number;
    /**
     * @deprecated please use 'center' as value in new projects
     * */
    originX: TOriginX;
    /**
     * @deprecated please use 'center' as value in new projects
     * */
    originY: TOriginY;
    angle: TDegree;
    strokeWidth: number;
    strokeUniform: boolean;
    /**
     * Object containing this object.
     * can influence its size and position
     */
    group?: Group;
    /**
     * Calculate object bounding box dimensions from its properties scale, skew.
     * This bounding box is aligned with object angle and not with canvas axis or screen.
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
     * Returns the position of the object as if it has a different origin.
     * Take an object that has left, top set to 100, 100 with origin 'left', 'top'.
     * Return the values of left top ( wrapped in a point ) that you would need to keep
     * the same position if origin where different.
     * Alternatively you can use this to also find which point in the parent plane is a specific origin
     * ( where is the bottom right corner of my object? )
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
     * @private
     */
    _getLeftTopCoords(): Point;
}
export {};
//# sourceMappingURL=ObjectGeometry.d.ts.map