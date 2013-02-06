(function() {

  var degreesToRadians = fabric.util.degreesToRadians;

  fabric.util.object.extend(fabric.Object.prototype, /** @scope fabric.Object.prototype */ {

    /**
     * Translates the coordinates from origin to center coordinates (based on the object's dimensions)
     * @method translateToCenterPoint
     * @param {fabric.Point} point The point which corresponds to the originX and originY params
     * @param {string} enum('left', 'center', 'right') Horizontal origin
     * @param {string} enum('top', 'center', 'bottom') Vertical origin
     * @return {fabric.Point}
     */
    translateToCenterPoint: function(point, originX, originY) {
      var cx = point.x, cy = point.y;

      if ( originX === "left" ) {
        cx = point.x + this.getWidth() / 2;
      }
      else if ( originX === "right" ) {
        cx = point.x - this.getWidth() / 2;
      }

      if ( originY === "top" ) {
        cy = point.y + this.getHeight() / 2;
      }
      else if ( originY === "bottom" ) {
        cy = point.y - this.getHeight() / 2;
      }

      // Apply the reverse rotation to the point (it's already scaled properly)
      return fabric.util.rotatePoint(new fabric.Point(cx, cy), point, degreesToRadians(this.angle));
    },

    /**
     * Translates the coordinates from center to origin coordinates (based on the object's dimensions)
     * @method translateToOriginPoint
     * @param {fabric.Point} point The point which corresponds to center of the object
     * @param {string} enum('left', 'center', 'right') Horizontal origin
     * @param {string} enum('top', 'center', 'bottom') Vertical origin
     * @return {fabric.Point}
     */
    translateToOriginPoint: function(center, originX, originY) {
      var x = center.x, y = center.y;

      // Get the point coordinates
      if ( originX === "left" ) {
        x = center.x - this.getWidth() / 2;
      }
      else if ( originX === "right" ) {
        x = center.x + this.getWidth() / 2;
      }
      if ( originY === "top" ) {
        y = center.y - this.getHeight() / 2;
      }
      else if ( originY === "bottom" ) {
        y = center.y + this.getHeight() / 2;
      }

      // Apply the rotation to the point (it's already scaled properly)
      return fabric.util.rotatePoint(new fabric.Point(x, y), center, degreesToRadians(this.angle));
    },

    /**
     * Returns the real center coordinates of the object
     * @method getCenterPoint
     * @return {fabric.Point}
     */
    getCenterPoint: function() {
      return this.translateToCenterPoint(
        new fabric.Point(this.left, this.top), this.originX, this.originY);
    },

    /**
     * Returns the coordinates of the object based on center coordinates
     * @method getOriginPoint
     * @param {fabric.Point} point The point which corresponds to the originX and originY params
     * @return {fabric.Point}
     */
    // getOriginPoint: function(center) {
    //   return this.translateToOriginPoint(center, this.originX, this.originY);
    // },

    /**
     * Returns the coordinates of the object as if it has a different origin
     * @method getPointByOrigin
     * @param {string} enum('left', 'center', 'right') Horizontal origin
     * @param {string} enum('top', 'center', 'bottom') Vertical origin
     * @return {fabric.Point}
     */
    // getPointByOrigin: function(originX, originY) {
    //   var center = this.getCenterPoint();

    //   return this.translateToOriginPoint(center, originX, originY);
    // },

    /**
     * Returns the point in local coordinates
     * @method toLocalPoint
     * @param {fabric.Point} The point relative to the global coordinate system
     * @return {fabric.Point}
     */
    toLocalPoint: function(point, originX, originY) {
      var center = this.getCenterPoint();

      var x, y;
      if (originX !== undefined && originY !== undefined) {
        if ( originX === "left" ) {
          x = center.x - this.getWidth() / 2;
        }
        else if ( originX === "right" ) {
          x = center.x + this.getWidth() / 2;
        }
        else {
          x = center.x;
        }

        if ( originY === "top" ) {
          y = center.y - this.getHeight() / 2;
        }
        else if ( originY === "bottom" ) {
          y = center.y + this.getHeight() / 2;
        }
        else {
          y = center.y;
        }
      }
      else {
        x = this.left;
        y = this.top;
      }

      return fabric.util.rotatePoint(new fabric.Point(point.x, point.y), center, -degreesToRadians(this.angle)).subtractEquals(new fabric.Point(x, y));
    },

    /**
     * Returns the point in global coordinates
     * @method toGlobalPoint
     * @param {fabric.Point} The point relative to the local coordinate system
     * @return {fabric.Point}
     */
    // toGlobalPoint: function(point) {
    //   return fabric.util.rotatePoint(point, this.getCenterPoint(), degreesToRadians(this.angle)).addEquals(new fabric.Point(this.left, this.top));
    // },

    /**
     * Sets the position of the object taking into consideration the object's origin
     * @method setPositionByOrigin
     * @param {fabric.Point} point The new position of the object
     * @param {string} enum('left', 'center', 'right') Horizontal origin
     * @param {string} enum('top', 'center', 'bottom') Vertical origin
     * @return {void}
     */
    setPositionByOrigin: function(pos, originX, originY) {
      var center = this.translateToCenterPoint(pos, originX, originY);
      var position = this.translateToOriginPoint(center, this.originX, this.originY);

      this.set('left', position.x);
      this.set('top', position.y);
    },

    /**
     * @method adjustPosition
     * @param {String} to One of left, center, right
     */
    adjustPosition: function(to) {

      var angle = degreesToRadians(this.angle);

      var hypotHalf = this.getWidth() / 2;
      var xHalf = Math.cos(angle) * hypotHalf;
      var yHalf = Math.sin(angle) * hypotHalf;

      var hypotFull = this.getWidth();
      var xFull = Math.cos(angle) * hypotFull;
      var yFull = Math.sin(angle) * hypotFull;

      if (this.originX === 'center' && to === 'left' ||
          this.originX === 'right' && to === 'center') {
        // move half left
        this.left -= xHalf;
        this.top -= yHalf;
      }
      else if (this.originX === 'left' && to === 'center' ||
               this.originX === 'center' && to === 'right') {
        // move half right
        this.left += xHalf;
        this.top += yHalf;
      }
      else if (this.originX === 'left' && to === 'right') {
        // move full right
        this.left += xFull;
        this.top += yFull;
      }
      else if (this.originX === 'right' && to === 'left') {
        // move full left
        this.left -= xFull;
        this.top -= yFull;
      }

      this.setCoords();
      this.originX = to;
    }
  });

})();