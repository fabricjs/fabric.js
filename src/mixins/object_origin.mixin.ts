//@ts-nocheck


  var degreesToRadians = fabric.util.degreesToRadians,
      originXOffset = {
        left: -0.5,
        center: 0,
        right: 0.5
      },
      originYOffset = {
        top: -0.5,
        center: 0,
        bottom: 0.5
      };

  /**
   * @typedef {number | 'left' | 'center' | 'right'} OriginX
   * @typedef {number | 'top' | 'center' | 'bottom'} OriginY
   */

  
export function ObjectOriginMixinGenerator(Klass) {
  return class ObjectOriginMixin extends Klass {

    /**
     * Resolves origin value relative to center
     * @private
     * @param {OriginX} originX
     * @returns number
     */
    resolveOriginX(originX) {
      return typeof originX === 'string' ?
        originXOffset[originX] :
        originX - 0.5;
    }

    /**
     * Resolves origin value relative to center
     * @private
     * @param {OriginY} originY
     * @returns number
     */
    resolveOriginY(originY) {
      return typeof originY === 'string' ?
        originYOffset[originY] :
        originY - 0.5;
    }

    /**
     * Translates the coordinates from a set of origin to another (based on the object's dimensions)
     * @param {fabric.Point} point The point which corresponds to the originX and originY params
     * @param {OriginX} fromOriginX Horizontal origin: 'left', 'center' or 'right'
     * @param {OriginY} fromOriginY Vertical origin: 'top', 'center' or 'bottom'
     * @param {OriginX} toOriginX Horizontal origin: 'left', 'center' or 'right'
     * @param {OriginY} toOriginY Vertical origin: 'top', 'center' or 'bottom'
     * @return {fabric.Point}
     */
    translateToGivenOrigin(point, fromOriginX, fromOriginY, toOriginX, toOriginY) {
      var x = point.x,
          y = point.y,
          dim,
          offsetX = this.resolveOriginX(toOriginX) - this.resolveOriginX(fromOriginX),
          offsetY = this.resolveOriginY(toOriginY) - this.resolveOriginY(fromOriginY);

      if (offsetX || offsetY) {
        dim = this._getTransformedDimensions();
        x = point.x + offsetX * dim.x;
        y = point.y + offsetY * dim.y;
      }

      return new fabric.Point(x, y);
    }

    /**
     * Translates the coordinates from origin to center coordinates (based on the object's dimensions)
     * @param {fabric.Point} point The point which corresponds to the originX and originY params
     * @param {OriginX} originX Horizontal origin: 'left', 'center' or 'right'
     * @param {OriginY} originY Vertical origin: 'top', 'center' or 'bottom'
     * @return {fabric.Point}
     */
    translateToCenterPoint(point, originX, originY) {
      var p = this.translateToGivenOrigin(point, originX, originY, 'center', 'center');
      if (this.angle) {
        return fabric.util.rotatePoint(p, point, degreesToRadians(this.angle));
      }
      return p;
    }

    /**
     * Translates the coordinates from center to origin coordinates (based on the object's dimensions)
     * @param {fabric.Point} center The point which corresponds to center of the object
     * @param {OriginX} originX Horizontal origin: 'left', 'center' or 'right'
     * @param {OriginY} originY Vertical origin: 'top', 'center' or 'bottom'
     * @return {fabric.Point}
     */
    translateToOriginPoint(center, originX, originY) {
      var p = this.translateToGivenOrigin(center, 'center', 'center', originX, originY);
      if (this.angle) {
        return fabric.util.rotatePoint(p, center, degreesToRadians(this.angle));
      }
      return p;
    }

    /**
     * Returns the center coordinates of the object relative to canvas
     * @return {fabric.Point}
     */
    getCenterPoint() {
      var relCenter = this.getRelativeCenterPoint();
      return this.group ?
        fabric.util.transformPoint(relCenter, this.group.calcTransformMatrix()) :
        relCenter;
    }

    /**
     * Returns the center coordinates of the object relative to it's containing group or null
     * @return {fabric.Point|null} point or null of object has no parent group
     */
    getCenterPointRelativeToParent() {
      return this.group ? this.getRelativeCenterPoint() : null;
    }

    /**
     * Returns the center coordinates of the object relative to it's parent
     * @return {fabric.Point}
     */
    getRelativeCenterPoint() {
      return this.translateToCenterPoint(new fabric.Point(this.left, this.top), this.originX, this.originY);
    }

    /**
     * Returns the coordinates of the object based on center coordinates
     * @param {fabric.Point} point The point which corresponds to the originX and originY params
     * @return {fabric.Point}
     */
    // getOriginPoint(center) {
    //   return this.translateToOriginPoint(center, this.originX, this.originY);
    // }

    /**
     * Returns the coordinates of the object as if it has a different origin
     * @param {OriginX} originX Horizontal origin: 'left', 'center' or 'right'
     * @param {OriginY} originY Vertical origin: 'top', 'center' or 'bottom'
     * @return {fabric.Point}
     */
    getPointByOrigin(originX, originY) {
      var center = this.getRelativeCenterPoint();
      return this.translateToOriginPoint(center, originX, originY);
    }

    /**
     * Returns the normalized point (rotated relative to center) in local coordinates
     * @param {fabric.Point} point The point relative to instance coordinate system
     * @param {OriginX} originX Horizontal origin: 'left', 'center' or 'right'
     * @param {OriginY} originY Vertical origin: 'top', 'center' or 'bottom'
     * @return {fabric.Point}
     */
    normalizePoint(point, originX, originY) {
      var center = this.getRelativeCenterPoint(), p, p2;
      if (typeof originX !== 'undefined' && typeof originY !== 'undefined' ) {
        p = this.translateToGivenOrigin(center, 'center', 'center', originX, originY);
      }
      else {
        p = new fabric.Point(this.left, this.top);
      }

      p2 = new fabric.Point(point.x, point.y);
      if (this.angle) {
        p2 = fabric.util.rotatePoint(p2, center, -degreesToRadians(this.angle));
      }
      return p2.subtractEquals(p);
    }

    /**
     * Returns coordinates of a pointer relative to object's top left corner in object's plane
     * @param {Event} e Event to operate upon
     * @param {Object} [pointer] Pointer to operate upon (instead of event)
     * @return {Object} Coordinates of a pointer (x, y)
     */
    getLocalPointer(e, pointer) {
      pointer = pointer || this.canvas.getPointer(e);
      return fabric.util.transformPoint(
        new fabric.Point(pointer.x, pointer.y),
        fabric.util.invertTransform(this.calcTransformMatrix())
      ).addEquals(new fabric.Point(this.width / 2, this.height / 2));
    }

    /**
     * Returns the point in global coordinates
     * @param {fabric.Point} The point relative to the local coordinate system
     * @return {fabric.Point}
     */
    // toGlobalPoint(point) {
    //   return fabric.util.rotatePoint(point, this.getCenterPoint(), degreesToRadians(this.angle)).addEquals(new fabric.Point(this.left, this.top));
    // }

    /**
     * Sets the position of the object taking into consideration the object's origin
     * @param {fabric.Point} pos The new position of the object
     * @param {OriginX} originX Horizontal origin: 'left', 'center' or 'right'
     * @param {OriginY} originY Vertical origin: 'top', 'center' or 'bottom'
     * @return {void}
     */
    setPositionByOrigin(pos, originX, originY) {
      var center = this.translateToCenterPoint(pos, originX, originY),
          position = this.translateToOriginPoint(center, this.originX, this.originY);
      this.set('left', position.x);
      this.set('top', position.y);
    }

    /**
     * @param {String} to One of 'left', 'center', 'right'
     */
    adjustPosition(to) {
      var angle = degreesToRadians(this.angle),
          hypotFull = this.getScaledWidth(),
          xFull = fabric.util.cos(angle) * hypotFull,
          yFull = fabric.util.sin(angle) * hypotFull,
          offsetFrom, offsetTo;

      //TODO: this function does not consider mixed situation like top, center.
      if (typeof this.originX === 'string') {
        offsetFrom = originXOffset[this.originX];
      }
      else {
        offsetFrom = this.originX - 0.5;
      }
      if (typeof to === 'string') {
        offsetTo = originXOffset[to];
      }
      else {
        offsetTo = to - 0.5;
      }
      this.left += xFull * (offsetTo - offsetFrom);
      this.top += yFull * (offsetTo - offsetFrom);
      this.setCoords();
      this.originX = to;
    }

    /**
     * Sets the origin/position of the object to it's center point
     * @private
     * @return {void}
     */
    _setOriginToCenter() {
      this._originalOriginX = this.originX;
      this._originalOriginY = this.originY;

      var center = this.getRelativeCenterPoint();

      this.originX = 'center';
      this.originY = 'center';

      this.left = center.x;
      this.top = center.y;
    }

    /**
     * Resets the origin/position of the object to it's original origin
     * @private
     * @return {void}
     */
    _resetOrigin() {
      var originPoint = this.translateToOriginPoint(
        this.getRelativeCenterPoint(),
        this._originalOriginX,
        this._originalOriginY);

      this.originX = this._originalOriginX;
      this.originY = this._originalOriginY;

      this.left = originPoint.x;
      this.top = originPoint.y;

      this._originalOriginX = null;
      this._originalOriginY = null;
    }

    /**
     * @private
     */
    _getLeftTopCoords() {
      return this.translateToOriginPoint(this.getRelativeCenterPoint(), 'left', 'top');
    }
  }
}

fabric.Object = ObjectOriginMixinGenerator(fabric.Object);


