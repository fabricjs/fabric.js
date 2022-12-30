import type { TBBox, TCornerPoint, TDegree, TMat2D, TOriginX, TOriginY } from '../../typedefs';
import { Point } from '../../point.class';
import type { Canvas } from '../../canvas/canvas_events';
import type { StaticCanvas } from '../../canvas/static_canvas.class';
import { ObjectOrigin } from './ObjectOrigin';
import { ObjectEvents } from '../../EventTypeDefs';
type TLineDescriptor = {
    o: Point;
    d: Point;
};
type TBBoxLines = {
    topline: TLineDescriptor;
    leftline: TLineDescriptor;
    bottomline: TLineDescriptor;
    rightline: TLineDescriptor;
};
type TMatrixCache = {
    key: string;
    value: TMat2D;
};
type TACoords = TCornerPoint;
export declare class ObjectGeometry<EventSpec extends ObjectEvents = ObjectEvents> extends ObjectOrigin<EventSpec> {
    /**
     * When true, an object is rendered as flipped horizontally
     * @type Boolean
     * @default false
     */
    flipX: boolean;
    /**
     * When true, an object is rendered as flipped vertically
     * @type Boolean
     * @default false
     */
    flipY: boolean;
    /**
     * Padding between object and its controlling borders (in pixels)
     * @type Number
     * @default 0
     */
    padding: number;
    /**
     * Describe object's corner position in canvas object absolute coordinates
     * properties are tl,tr,bl,br and describe the four main corner.
     * each property is an object with x, y, instance of Fabric.Point.
     * The coordinates depends from this properties: width, height, scaleX, scaleY
     * skewX, skewY, angle, strokeWidth, top, left.
     * Those coordinates are useful to understand where an object is. They get updated
     * with lineCoords or oCoords in interactive cases but they do not need to be updated when zoom or panning change.
     * The coordinates get updated with @method setCoords.
     * You can calculate them without updating with @method calcACoords();
     */
    aCoords: TACoords;
    /**
     * Describe object's corner position in canvas element coordinates.
     * includes padding. Used of object detection.
     * set and refreshed with setCoords.
     * Those could go away
     * @todo investigate how to get rid of those
     */
    lineCoords: TCornerPoint;
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
     * @param {Point} point position in canvas coordinate plane
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
     * return correct set of coordinates for intersection
     * this will return either aCoords or lineCoords.
     * @param {boolean} absolute will return aCoords if true or lineCoords
     * @param {boolean} calculate will calculate the coords or use the one
     * that are attached to the object instance
     * @return {Object} {tl, tr, br, bl} points
     */
    _getCoords(absolute?: boolean, calculate?: boolean): TCornerPoint;
    /**
     * return correct set of coordinates for intersection
     * this will return either aCoords or lineCoords.
     * The coords are returned in an array.
     * @param {boolean} absolute will return aCoords if true or lineCoords
     * @param {boolean} calculate will return aCoords if true or lineCoords
     * @return {Array} [tl, tr, br, bl] of points
     */
    getCoords(absolute?: boolean, calculate?: boolean): Point[];
    /**
     * Checks if object intersects with an area formed by 2 points
     * @param {Object} pointTL top-left point of area
     * @param {Object} pointBR bottom-right point of area
     * @param {Boolean} [absolute] use coordinates without viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of stored one
     * @return {Boolean} true if object intersects with an area formed by 2 points
     */
    intersectsWithRect(pointTL: Point, pointBR: Point, absolute?: boolean, calculate?: boolean): boolean;
    /**
     * Checks if object intersects with another object
     * @param {Object} other Object to test
     * @param {Boolean} [absolute] use coordinates without viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of calculating them
     * @return {Boolean} true if object intersects with another object
     */
    intersectsWithObject(other: ObjectGeometry, absolute?: boolean, calculate?: boolean): boolean;
    /**
     * Checks if object is fully contained within area of another object
     * @param {Object} other Object to test
     * @param {Boolean} [absolute] use coordinates without viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of store ones
     * @return {Boolean} true if object is fully contained within area of another object
     */
    isContainedWithinObject(other: ObjectGeometry, absolute?: boolean, calculate?: boolean): boolean;
    /**
     * Checks if object is fully contained within area formed by 2 points
     * @param {Object} pointTL top-left point of area
     * @param {Object} pointBR bottom-right point of area
     * @param {Boolean} [absolute] use coordinates without viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of stored one
     * @return {Boolean} true if object is fully contained within area formed by 2 points
     */
    isContainedWithinRect(pointTL: Point, pointBR: Point, absolute?: boolean, calculate?: boolean): boolean;
    isOverlapping<T extends ObjectGeometry>(other: T): boolean;
    /**
     * Checks if point is inside the object
     * @param {Point} point Point to check against
     * @param {Object} [lines] object returned from @method _getImageLines
     * @param {Boolean} [absolute] use coordinates without viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of stored ones
     * @return {Boolean} true if point is inside the object
     */
    containsPoint(point: Point, lines?: TBBoxLines, absolute?: boolean, calculate?: boolean): boolean;
    /**
     * Checks if object is contained within the canvas with current viewportTransform
     * the check is done stopping at first point that appears on screen
     * @param {Boolean} [calculate] use coordinates of current position instead of .aCoords
     * @return {Boolean} true if object is fully or partially contained within canvas
     */
    isOnScreen(calculate?: boolean): boolean;
    /**
     * Checks if the object contains the midpoint between canvas extremities
     * Does not make sense outside the context of isOnScreen and isPartiallyOnScreen
     * @private
     * @param {Point} pointTL Top Left point
     * @param {Point} pointBR Top Right point
     * @param {Boolean} calculate use coordinates of current position instead of stored ones
     * @return {Boolean} true if the object contains the point
     */
    private _containsCenterOfCanvas;
    /**
     * Checks if object is partially contained within the canvas with current viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of stored ones
     * @return {Boolean} true if object is partially contained within canvas
     */
    isPartiallyOnScreen(calculate?: boolean): boolean;
    /**
     * Method that returns an object with the object edges in it, given the coordinates of the corners
     * @private
     * @param {Object} lineCoords or aCoords Coordinates of the object corners
     */
    _getImageLines({ tl, tr, bl, br }: TCornerPoint): TBBoxLines;
    /**
     * Helper method to determine how many cross points are between the 4 object edges
     * and the horizontal line determined by a point on canvas
     * @private
     * @param {Point} point Point to check
     * @param {Object} lines Coordinates of the object being evaluated
     * @return {number} number of crossPoint
     */
    _findCrossPoints(point: Point, lines: TBBoxLines): number;
    /**
     * Returns coordinates of object's bounding rectangle (left, top, width, height)
     * the box is intended as aligned to axis of canvas.
     * @param {Boolean} [absolute] use coordinates without viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of .lineCoords / .aCoords
     * @return {Object} Object with left, top, width, height properties
     */
    getBoundingRect(absolute?: boolean, calculate?: boolean): TBBox;
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
     * @param {Boolean} absolute ignore viewport
     * @return {void}
     */
    scaleToWidth(value: number, absolute?: boolean): void;
    /**
     * Scales an object to a given height, with respect to bounding box (scaling by x/y equally)
     * @param {Number} value New height value
     * @param {Boolean} absolute ignore viewport
     * @return {void}
     */
    scaleToHeight(value: number, absolute?: boolean): void;
    getCanvasRetinaScaling(): number;
    /**
     * Returns the object angle relative to canvas counting also the group property
     * @returns {TDegree}
     */
    getTotalAngle(): TDegree;
    /**
     * return the coordinate of the 4 corners of the bounding box in HTMLCanvasElement coordinates
     * used for bounding box interactivity with the mouse
     * @returns {TCornerPoint}
     */
    calcLineCoords(): TCornerPoint;
    /**
     * Retrieves viewportTransform from Object's canvas if possible
     * @method getViewportTransform
     * @memberOf FabricObject.prototype
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
     * aCoords are used to quickly find an object on the canvas
     * lineCoords are used to quickly find object during pointer events.
     * See {@link https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords} and {@link http://fabricjs.com/fabric-gotchas}
     * @param {Boolean} [skipCorners] skip calculation of aCoord, lineCoords.
     * @return {void}
     */
    setCoords(): void;
    transformMatrixKey(skipGroup?: boolean): string;
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
}
export {};
//# sourceMappingURL=ObjectGeometry.d.ts.map