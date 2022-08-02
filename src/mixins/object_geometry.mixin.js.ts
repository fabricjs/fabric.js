(function(global) {

  function arrayFromCoords(coords) {
    return [
      new fabric.Point(coords.tl.x, coords.tl.y),
      new fabric.Point(coords.tr.x, coords.tr.y),
      new fabric.Point(coords.br.x, coords.br.y),
      new fabric.Point(coords.bl.x, coords.bl.y)
    ];
  }

  var fabric = global.fabric, util = fabric.util,
      degreesToRadians = util.degreesToRadians,
      multiplyMatrices = util.multiplyTransformMatrices,
      transformPoint = util.transformPoint;

  util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

    /**
     * Describe object's corner position in canvas element coordinates.
     * properties are depending on control keys and padding the main controls.
     * each property is an object with x, y and corner.
     * The `corner` property contains in a similar manner the 4 points of the
     * interactive area of the corner.
     * The coordinates depends from the controls positionHandler and are used
     * to draw and locate controls
     * @memberOf fabric.Object.prototype
     */
    oCoords: null,

    /**
     * Describe object's corner position in canvas object absolute coordinates
     * properties are tl,tr,bl,br and describe the four main corner.
     * each property is an object with x, y, instance of Fabric.Point.
     * The coordinates depends from this properties: width, height, scaleX, scaleY
     * skewX, skewY, angle, strokeWidth, top, left.
     * Those coordinates are useful to understand where an object is. They get updated
     * with oCoords but they do not need to be updated when zoom or panning change.
     * The coordinates get updated with @method setCoords.
     * You can calculate them without updating with @method calcACoords();
     * @memberOf fabric.Object.prototype
     */
    aCoords: null,

    /**
     * Describe object's corner position in canvas element coordinates.
     * includes padding. Used of object detection.
     * set and refreshed with setCoords.
     * @memberOf fabric.Object.prototype
     */
    lineCoords: null,

    /**
     * storage for object transform matrix
     */
    ownMatrixCache: null,

    /**
     * storage for object full transform matrix
     */
    matrixCache: null,

    /**
     * custom controls interface
     * controls are added by default_controls.js
     */
    controls: { },

    /**
     * @returns {number} x position according to object's {@link fabric.Object#originX} property in canvas coordinate plane
     */
    getX: function () {
      return this.getXY().x;
    },

    /**
     * @param {number} value x position according to object's {@link fabric.Object#originX} property in canvas coordinate plane
     */
    setX: function (value) {
      this.setXY(this.getXY().setX(value));
    },

    /**
     * @returns {number} x position according to object's {@link fabric.Object#originX} property in parent's coordinate plane\
     * if parent is canvas then this property is identical to {@link fabric.Object#getX}
     */
    getRelativeX: function () {
      return this.left;
    },

    /**
     * @param {number} value x position according to object's {@link fabric.Object#originX} property in parent's coordinate plane\
     * if parent is canvas then this method is identical to {@link fabric.Object#setX}
     */
    setRelativeX: function (value) {
      this.left = value;
    },

    /**
     * @returns {number} y position according to object's {@link fabric.Object#originY} property in canvas coordinate plane
     */
    getY: function () {
      return this.getXY().y;
    },

    /**
     * @param {number} value y position according to object's {@link fabric.Object#originY} property in canvas coordinate plane
     */
    setY: function (value) {
      this.setXY(this.getXY().setY(value));
    },

    /**
     * @returns {number} y position according to object's {@link fabric.Object#originY} property in parent's coordinate plane\
     * if parent is canvas then this property is identical to {@link fabric.Object#getY}
     */
    getRelativeY: function () {
      return this.top;
    },

    /**
     * @param {number} value y position according to object's {@link fabric.Object#originY} property in parent's coordinate plane\
     * if parent is canvas then this property is identical to {@link fabric.Object#setY}
     */
    setRelativeY: function (value) {
      this.top = value;
    },

    /**
     * @returns {number} x position according to object's {@link fabric.Object#originX} {@link fabric.Object#originY} properties in canvas coordinate plane
     */
    getXY: function () {
      var relativePosition = this.getRelativeXY();
      return this.group ?
        fabric.util.transformPoint(relativePosition, this.group.calcTransformMatrix()) :
        relativePosition;
    },

    /**
     * Set an object position to a particular point, the point is intended in absolute ( canvas ) coordinate.
     * You can specify {@link fabric.Object#originX} and {@link fabric.Object#originY} values,
     * that otherwise are the object's current values.
     * @example <caption>Set object's bottom left corner to point (5,5) on canvas</caption>
     * object.setXY(new fabric.Point(5, 5), 'left', 'bottom').
     * @param {fabric.Point} point position in canvas coordinate plane
     * @param {'left'|'center'|'right'|number} [originX] Horizontal origin: 'left', 'center' or 'right'
     * @param {'top'|'center'|'bottom'|number} [originY] Vertical origin: 'top', 'center' or 'bottom'
     */
    setXY: function (point, originX, originY) {
      if (this.group) {
        point = fabric.util.transformPoint(
          point,
          fabric.util.invertTransform(this.group.calcTransformMatrix())
        );
      }
      this.setRelativeXY(point, originX, originY);
    },

    /**
     * @returns {number} x position according to object's {@link fabric.Object#originX} {@link fabric.Object#originY} properties in parent's coordinate plane
     */
    getRelativeXY: function () {
      return new fabric.Point(this.left, this.top);
    },

    /**
     * As {@link fabric.Object#setXY}, but in current parent's coordinate plane ( the current group if any or the canvas)
     * @param {fabric.Point} point position according to object's {@link fabric.Object#originX} {@link fabric.Object#originY} properties in parent's coordinate plane
     * @param {'left'|'center'|'right'|number} [originX] Horizontal origin: 'left', 'center' or 'right'
     * @param {'top'|'center'|'bottom'|number} [originY] Vertical origin: 'top', 'center' or 'bottom'
     */
    setRelativeXY: function (point, originX, originY) {
      this.setPositionByOrigin(point, originX || this.originX, originY || this.originY);
    },

    /**
     * return correct set of coordinates for intersection
     * this will return either aCoords or lineCoords.
     * @param {Boolean} absolute will return aCoords if true or lineCoords
     * @return {Object} {tl, tr, br, bl} points
     */
    _getCoords: function(absolute, calculate) {
      if (calculate) {
        return (absolute ? this.calcACoords() : this.calcLineCoords());
      }
      if (!this.aCoords || !this.lineCoords) {
        this.setCoords(true);
      }
      return (absolute ? this.aCoords : this.lineCoords);
    },

    /**
     * return correct set of coordinates for intersection
     * this will return either aCoords or lineCoords.
     * The coords are returned in an array.
     * @return {Array} [tl, tr, br, bl] of points
     */
    getCoords: function (absolute, calculate) {
      var coords = arrayFromCoords(this._getCoords(absolute, calculate));
      if (this.group) {
        var t = this.group.calcTransformMatrix();
        return coords.map(function (p) {
          return util.transformPoint(p, t);
        });
      }
      return coords;
    },

    /**
     * Checks if object intersects with an area formed by 2 points
     * @param {Object} pointTL top-left point of area
     * @param {Object} pointBR bottom-right point of area
     * @param {Boolean} [absolute] use coordinates without viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords
     * @return {Boolean} true if object intersects with an area formed by 2 points
     */
    intersectsWithRect: function(pointTL, pointBR, absolute, calculate) {
      var coords = this.getCoords(absolute, calculate),
          intersection = fabric.Intersection.intersectPolygonRectangle(
            coords,
            pointTL,
            pointBR
          );
      return intersection.status === 'Intersection';
    },

    /**
     * Checks if object intersects with another object
     * @param {Object} other Object to test
     * @param {Boolean} [absolute] use coordinates without viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords
     * @return {Boolean} true if object intersects with another object
     */
    intersectsWithObject: function(other, absolute, calculate) {
      var intersection = fabric.Intersection.intersectPolygonPolygon(
        this.getCoords(absolute, calculate),
        other.getCoords(absolute, calculate)
      );

      return intersection.status === 'Intersection'
        || other.isContainedWithinObject(this, absolute, calculate)
        || this.isContainedWithinObject(other, absolute, calculate);
    },

    /**
     * Checks if object is fully contained within area of another object
     * @param {Object} other Object to test
     * @param {Boolean} [absolute] use coordinates without viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords
     * @return {Boolean} true if object is fully contained within area of another object
     */
    isContainedWithinObject: function(other, absolute, calculate) {
      var points = this.getCoords(absolute, calculate),
          otherCoords = absolute ? other.aCoords : other.lineCoords,
          i = 0, lines = other._getImageLines(otherCoords);
      for (; i < 4; i++) {
        if (!other.containsPoint(points[i], lines)) {
          return false;
        }
      }
      return true;
    },

    /**
     * Checks if object is fully contained within area formed by 2 points
     * @param {Object} pointTL top-left point of area
     * @param {Object} pointBR bottom-right point of area
     * @param {Boolean} [absolute] use coordinates without viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords
     * @return {Boolean} true if object is fully contained within area formed by 2 points
     */
    isContainedWithinRect: function(pointTL, pointBR, absolute, calculate) {
      var boundingRect = this.getBoundingRect(absolute, calculate);

      return (
        boundingRect.left >= pointTL.x &&
        boundingRect.left + boundingRect.width <= pointBR.x &&
        boundingRect.top >= pointTL.y &&
        boundingRect.top + boundingRect.height <= pointBR.y
      );
    },

    /**
     * Checks if point is inside the object
     * @param {fabric.Point} point Point to check against
     * @param {Object} [lines] object returned from @method _getImageLines
     * @param {Boolean} [absolute] use coordinates without viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords
     * @return {Boolean} true if point is inside the object
     */
    containsPoint: function(point, lines, absolute, calculate) {
      var coords = this._getCoords(absolute, calculate),
          lines = lines || this._getImageLines(coords),
          xPoints = this._findCrossPoints(point, lines);
      // if xPoints is odd then point is inside the object
      return (xPoints !== 0 && xPoints % 2 === 1);
    },

    /**
     * Checks if object is contained within the canvas with current viewportTransform
     * the check is done stopping at first point that appears on screen
     * @param {Boolean} [calculate] use coordinates of current position instead of .aCoords
     * @return {Boolean} true if object is fully or partially contained within canvas
     */
    isOnScreen: function(calculate) {
      if (!this.canvas) {
        return false;
      }
      var pointTL = this.canvas.vptCoords.tl, pointBR = this.canvas.vptCoords.br;
      var points = this.getCoords(true, calculate);
      // if some point is on screen, the object is on screen.
      if (points.some(function(point) {
        return point.x <= pointBR.x && point.x >= pointTL.x &&
        point.y <= pointBR.y && point.y >= pointTL.y;
      })) {
        return true;
      }
      // no points on screen, check intersection with absolute coordinates
      if (this.intersectsWithRect(pointTL, pointBR, true, calculate)) {
        return true;
      }
      return this._containsCenterOfCanvas(pointTL, pointBR, calculate);
    },

    /**
     * Checks if the object contains the midpoint between canvas extremities
     * Does not make sense outside the context of isOnScreen and isPartiallyOnScreen
     * @private
     * @param {Fabric.Point} pointTL Top Left point
     * @param {Fabric.Point} pointBR Top Right point
     * @param {Boolean} calculate use coordinates of current position instead of .oCoords
     * @return {Boolean} true if the object contains the point
     */
    _containsCenterOfCanvas: function(pointTL, pointBR, calculate) {
      // worst case scenario the object is so big that contains the screen
      var centerPoint = { x: (pointTL.x + pointBR.x) / 2, y: (pointTL.y + pointBR.y) / 2 };
      if (this.containsPoint(centerPoint, null, true, calculate)) {
        return true;
      }
      return false;
    },

    /**
     * Checks if object is partially contained within the canvas with current viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords
     * @return {Boolean} true if object is partially contained within canvas
     */
    isPartiallyOnScreen: function(calculate) {
      if (!this.canvas) {
        return false;
      }
      var pointTL = this.canvas.vptCoords.tl, pointBR = this.canvas.vptCoords.br;
      if (this.intersectsWithRect(pointTL, pointBR, true, calculate)) {
        return true;
      }
      var allPointsAreOutside = this.getCoords(true, calculate).every(function(point) {
        return (point.x >= pointBR.x || point.x <= pointTL.x) &&
        (point.y >= pointBR.y || point.y <= pointTL.y);
      });
      return allPointsAreOutside && this._containsCenterOfCanvas(pointTL, pointBR, calculate);
    },

    /**
     * Method that returns an object with the object edges in it, given the coordinates of the corners
     * @private
     * @param {Object} oCoords Coordinates of the object corners
     */
    _getImageLines: function(oCoords) {

      var lines = {
        topline: {
          o: oCoords.tl,
          d: oCoords.tr
        },
        rightline: {
          o: oCoords.tr,
          d: oCoords.br
        },
        bottomline: {
          o: oCoords.br,
          d: oCoords.bl
        },
        leftline: {
          o: oCoords.bl,
          d: oCoords.tl
        }
      };

      // // debugging
      // if (this.canvas.contextTop) {
      //   this.canvas.contextTop.fillRect(lines.bottomline.d.x, lines.bottomline.d.y, 2, 2);
      //   this.canvas.contextTop.fillRect(lines.bottomline.o.x, lines.bottomline.o.y, 2, 2);
      //
      //   this.canvas.contextTop.fillRect(lines.leftline.d.x, lines.leftline.d.y, 2, 2);
      //   this.canvas.contextTop.fillRect(lines.leftline.o.x, lines.leftline.o.y, 2, 2);
      //
      //   this.canvas.contextTop.fillRect(lines.topline.d.x, lines.topline.d.y, 2, 2);
      //   this.canvas.contextTop.fillRect(lines.topline.o.x, lines.topline.o.y, 2, 2);
      //
      //   this.canvas.contextTop.fillRect(lines.rightline.d.x, lines.rightline.d.y, 2, 2);
      //   this.canvas.contextTop.fillRect(lines.rightline.o.x, lines.rightline.o.y, 2, 2);
      // }

      return lines;
    },

    /**
     * Helper method to determine how many cross points are between the 4 object edges
     * and the horizontal line determined by a point on canvas
     * @private
     * @param {fabric.Point} point Point to check
     * @param {Object} lines Coordinates of the object being evaluated
     */
    // remove yi, not used but left code here just in case.
    _findCrossPoints: function(point, lines) {
      var b1, b2, a1, a2, xi, // yi,
          xcount = 0,
          iLine;

      for (var lineKey in lines) {
        iLine = lines[lineKey];
        // optimisation 1: line below point. no cross
        if ((iLine.o.y < point.y) && (iLine.d.y < point.y)) {
          continue;
        }
        // optimisation 2: line above point. no cross
        if ((iLine.o.y >= point.y) && (iLine.d.y >= point.y)) {
          continue;
        }
        // optimisation 3: vertical line case
        if ((iLine.o.x === iLine.d.x) && (iLine.o.x >= point.x)) {
          xi = iLine.o.x;
          // yi = point.y;
        }
        // calculate the intersection point
        else {
          b1 = 0;
          b2 = (iLine.d.y - iLine.o.y) / (iLine.d.x - iLine.o.x);
          a1 = point.y - b1 * point.x;
          a2 = iLine.o.y - b2 * iLine.o.x;

          xi = -(a1 - a2) / (b1 - b2);
          // yi = a1 + b1 * xi;
        }
        // dont count xi < point.x cases
        if (xi >= point.x) {
          xcount += 1;
        }
        // optimisation 4: specific for square images
        if (xcount === 2) {
          break;
        }
      }
      return xcount;
    },

    /**
     * Returns coordinates of object's bounding rectangle (left, top, width, height)
     * the box is intended as aligned to axis of canvas.
     * @param {Boolean} [absolute] use coordinates without viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords / .aCoords
     * @return {Object} Object with left, top, width, height properties
     */
    getBoundingRect: function(absolute, calculate) {
      var coords = this.getCoords(absolute, calculate);
      return util.makeBoundingBoxFromPoints(coords);
    },

    /**
     * Returns width of an object's bounding box counting transformations
     * before 2.0 it was named getWidth();
     * @return {Number} width value
     */
    getScaledWidth: function() {
      return this._getTransformedDimensions().x;
    },

    /**
     * Returns height of an object bounding box counting transformations
     * before 2.0 it was named getHeight();
     * @return {Number} height value
     */
    getScaledHeight: function() {
      return this._getTransformedDimensions().y;
    },

    /**
     * Makes sure the scale is valid and modifies it if necessary
     * @private
     * @param {Number} value
     * @return {Number}
     */
    _constrainScale: function(value) {
      if (Math.abs(value) < this.minScaleLimit) {
        if (value < 0) {
          return -this.minScaleLimit;
        }
        else {
          return this.minScaleLimit;
        }
      }
      else if (value === 0) {
        return 0.0001;
      }
      return value;
    },

    /**
     * Scales an object (equally by x and y)
     * @param {Number} value Scale factor
     * @return {fabric.Object} thisArg
     * @chainable
     */
    scale: function(value) {
      this._set('scaleX', value);
      this._set('scaleY', value);
      return this.setCoords();
    },

    /**
     * Scales an object to a given width, with respect to bounding box (scaling by x/y equally)
     * @param {Number} value New width value
     * @param {Boolean} absolute ignore viewport
     * @return {fabric.Object} thisArg
     * @chainable
     */
    scaleToWidth: function(value, absolute) {
      // adjust to bounding rect factor so that rotated shapes would fit as well
      var boundingRectFactor = this.getBoundingRect(absolute).width / this.getScaledWidth();
      return this.scale(value / this.width / boundingRectFactor);
    },

    /**
     * Scales an object to a given height, with respect to bounding box (scaling by x/y equally)
     * @param {Number} value New height value
     * @param {Boolean} absolute ignore viewport
     * @return {fabric.Object} thisArg
     * @chainable
     */
    scaleToHeight: function(value, absolute) {
      // adjust to bounding rect factor so that rotated shapes would fit as well
      var boundingRectFactor = this.getBoundingRect(absolute).height / this.getScaledHeight();
      return this.scale(value / this.height / boundingRectFactor);
    },

    calcLineCoords: function() {
      var vpt = this.getViewportTransform(),
          padding = this.padding, angle = degreesToRadians(this.getTotalAngle()),
          cos = util.cos(angle), sin = util.sin(angle),
          cosP = cos * padding, sinP = sin * padding, cosPSinP = cosP + sinP,
          cosPMinusSinP = cosP - sinP, aCoords = this.calcACoords();

      var lineCoords = {
        tl: transformPoint(aCoords.tl, vpt),
        tr: transformPoint(aCoords.tr, vpt),
        bl: transformPoint(aCoords.bl, vpt),
        br: transformPoint(aCoords.br, vpt),
      };

      if (padding) {
        lineCoords.tl.x -= cosPMinusSinP;
        lineCoords.tl.y -= cosPSinP;
        lineCoords.tr.x += cosPSinP;
        lineCoords.tr.y -= cosPMinusSinP;
        lineCoords.bl.x -= cosPSinP;
        lineCoords.bl.y += cosPMinusSinP;
        lineCoords.br.x += cosPMinusSinP;
        lineCoords.br.y += cosPSinP;
      }

      return lineCoords;
    },

    calcOCoords: function () {
      var vpt = this.getViewportTransform(),
          center = this.getCenterPoint(),
          tMatrix = [1, 0, 0, 1, center.x, center.y],
          rMatrix = util.calcRotateMatrix({ angle: this.getTotalAngle() - (!!this.group && this.flipX ? 180 : 0) }),
          positionMatrix = multiplyMatrices(tMatrix, rMatrix),
          startMatrix = multiplyMatrices(vpt, positionMatrix),
          finalMatrix = multiplyMatrices(startMatrix, [1 / vpt[0], 0, 0, 1 / vpt[3], 0, 0]),
          transformOptions = this.group ? fabric.util.qrDecompose(this.calcTransformMatrix()) : undefined,
          dim = this._calculateCurrentDimensions(transformOptions),
          coords = {};
      this.forEachControl(function(control, key, fabricObject) {
        coords[key] = control.positionHandler(dim, finalMatrix, fabricObject);
      });

      // debug code
      /*
       var canvas = this.canvas;
      setTimeout(function () {
        if (!canvas) return;
         canvas.contextTop.clearRect(0, 0, 700, 700);
         canvas.contextTop.fillStyle = 'green';
         Object.keys(coords).forEach(function(key) {
           var control = coords[key];
           canvas.contextTop.fillRect(control.x, control.y, 3, 3);
         });
       }, 50);
      */
      return coords;
    },

    calcACoords: function() {
      var rotateMatrix = util.calcRotateMatrix({ angle: this.angle }),
          center = this.getRelativeCenterPoint(),
          translateMatrix = [1, 0, 0, 1, center.x, center.y],
          finalMatrix = multiplyMatrices(translateMatrix, rotateMatrix),
          dim = this._getTransformedDimensions(),
          w = dim.x / 2, h = dim.y / 2;
      return {
        // corners
        tl: transformPoint({ x: -w, y: -h }, finalMatrix),
        tr: transformPoint({ x: w, y: -h }, finalMatrix),
        bl: transformPoint({ x: -w, y: h }, finalMatrix),
        br: transformPoint({ x: w, y: h }, finalMatrix)
      };
    },

    /**
     * Sets corner and controls position coordinates based on current angle, width and height, left and top.
     * oCoords are used to find the corners
     * aCoords are used to quickly find an object on the canvas
     * lineCoords are used to quickly find object during pointer events.
     * See {@link https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords} and {@link http://fabricjs.com/fabric-gotchas}
     *
     * @param {Boolean} [skipCorners] skip calculation of oCoords.
     * @return {fabric.Object} thisArg
     * @chainable
     */
    setCoords: function(skipCorners) {
      this.aCoords = this.calcACoords();
      // in case we are in a group, for how the inner group target check works,
      // lineCoords are exactly aCoords. Since the vpt gets absorbed by the normalized pointer.
      this.lineCoords = this.group ? this.aCoords : this.calcLineCoords();
      if (skipCorners) {
        return this;
      }
      // set coordinates of the draggable boxes in the corners used to scale/rotate the image
      this.oCoords = this.calcOCoords();
      this._setCornerCoords && this._setCornerCoords();
      return this;
    },

    transformMatrixKey: function(skipGroup) {
      var sep = '_', prefix = '';
      if (!skipGroup && this.group) {
        prefix = this.group.transformMatrixKey(skipGroup) + sep;
      };
      return prefix + this.top + sep + this.left + sep + this.scaleX + sep + this.scaleY +
        sep + this.skewX + sep + this.skewY + sep + this.angle + sep + this.originX + sep + this.originY +
        sep + this.width + sep + this.height + sep + this.strokeWidth + this.flipX + this.flipY;
    },

    /**
     * calculate transform matrix that represents the current transformations from the
     * object's properties.
     * @param {Boolean} [skipGroup] return transform matrix for object not counting parent transformations
     * There are some situation in which this is useful to avoid the fake rotation.
     * @return {Array} transform matrix for the object
     */
    calcTransformMatrix: function(skipGroup) {
      var matrix = this.calcOwnMatrix();
      if (skipGroup || !this.group) {
        return matrix;
      }
      var key = this.transformMatrixKey(skipGroup), cache = this.matrixCache || (this.matrixCache = {});
      if (cache.key === key) {
        return cache.value;
      }
      if (this.group) {
        matrix = multiplyMatrices(this.group.calcTransformMatrix(false), matrix);
      }
      cache.key = key;
      cache.value = matrix;
      return matrix;
    },

    /**
     * calculate transform matrix that represents the current transformations from the
     * object's properties, this matrix does not include the group transformation
     * @return {Array} transform matrix for the object
     */
    calcOwnMatrix: function() {
      var key = this.transformMatrixKey(true), cache = this.ownMatrixCache || (this.ownMatrixCache = {});
      if (cache.key === key) {
        return cache.value;
      }
      var center = this.getRelativeCenterPoint(),
          options = {
            angle: this.angle,
            translateX: center.x,
            translateY: center.y,
            scaleX: this.scaleX,
            scaleY: this.scaleY,
            skewX: this.skewX,
            skewY: this.skewY,
            flipX: this.flipX,
            flipY: this.flipY,
          };
      cache.key = key;
      cache.value = util.composeMatrix(options);
      return cache.value;
    },

    /**
     * Calculate object dimensions from its properties
     * @private
     * @returns {fabric.Point} dimensions
     */
    _getNonTransformedDimensions: function() {
      return new fabric.Point(this.width, this.height).scalarAddEquals(this.strokeWidth);
    },

    /**
     * Calculate object bounding box dimensions from its properties scale, skew.
     * @param {Object} [options]
     * @param {Number} [options.scaleX]
     * @param {Number} [options.scaleY]
     * @param {Number} [options.skewX]
     * @param {Number} [options.skewY]
     * @private
     * @returns {fabric.Point} dimensions
     */
    _getTransformedDimensions: function (options) {
      options = Object.assign({
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        skewX: this.skewX,
        skewY: this.skewY,
        width: this.width,
        height: this.height,
        strokeWidth: this.strokeWidth
      }, options || {});
      //  stroke is applied before/after transformations are applied according to `strokeUniform`
      var preScalingStrokeValue, postScalingStrokeValue, strokeWidth = options.strokeWidth;
      if (this.strokeUniform) {
        preScalingStrokeValue = 0;
        postScalingStrokeValue = strokeWidth;
      }
      else {
        preScalingStrokeValue = strokeWidth;
        postScalingStrokeValue = 0;
      }
      var dimX = options.width + preScalingStrokeValue,
          dimY = options.height + preScalingStrokeValue,
          finalDimensions,
          noSkew = options.skewX === 0 && options.skewY === 0;
      if (noSkew) {
        finalDimensions = new fabric.Point(dimX * options.scaleX, dimY * options.scaleY);
      }
      else {
        var bbox = util.sizeAfterTransform(dimX, dimY, options);
        finalDimensions = new fabric.Point(bbox.x, bbox.y);
      }

      return finalDimensions.scalarAddEquals(postScalingStrokeValue);
    },

    /**
     * Calculate object dimensions for controls box, including padding and canvas zoom.
     * and active selection
     * @private
     * @param {object} [options] transform options
     * @returns {fabric.Point} dimensions
     */
    _calculateCurrentDimensions: function(options)  {
      var vpt = this.getViewportTransform(),
          dim = this._getTransformedDimensions(options),
          p = transformPoint(dim, vpt, true);
      return p.scalarAdd(2 * this.padding);
    },
  });
})(typeof exports !== 'undefined' ? exports : window);
