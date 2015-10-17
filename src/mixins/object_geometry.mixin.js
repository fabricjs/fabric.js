(function() {

  function getCoords(oCoords) {
    return [
      new fabric.Point(oCoords.tl.x, oCoords.tl.y),
      new fabric.Point(oCoords.tr.x, oCoords.tr.y),
      new fabric.Point(oCoords.br.x, oCoords.br.y),
      new fabric.Point(oCoords.bl.x, oCoords.bl.y)
    ];
  }

  var degreesToRadians = fabric.util.degreesToRadians,
      multiplyMatrices = fabric.util.multiplyTransformMatrices;

  fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

    /**
     * Object containing coordinates of object's controls
     * @type Object
     * @default
     */
    oCoords: null,

    /**
     * Checks if object intersects with an area formed by 2 points
     * @param {Object} pointTL top-left point of area
     * @param {Object} pointBR bottom-right point of area
     * @return {Boolean} true if object intersects with an area formed by 2 points
     */
    intersectsWithRect: function(pointTL, pointBR) {
      var oCoords = getCoords(this.oCoords),
          intersection = fabric.Intersection.intersectPolygonRectangle(
            oCoords,
            pointTL,
            pointBR
          );
      return intersection.status === 'Intersection';
    },

    /**
     * Checks if object intersects with another object
     * @param {Object} other Object to test
     * @return {Boolean} true if object intersects with another object
     */
    intersectsWithObject: function(other) {
      var intersection = fabric.Intersection.intersectPolygonPolygon(
            getCoords(this.oCoords),
            getCoords(other.oCoords)
          );

      return intersection.status === 'Intersection';
    },

    /**
     * Checks if object is fully contained within area of another object
     * @param {Object} other Object to test
     * @return {Boolean} true if object is fully contained within area of another object
     */
    isContainedWithinObject: function(other) {
      var boundingRect = other.getBoundingRect(),
          point1 = new fabric.Point(boundingRect.left, boundingRect.top),
          point2 = new fabric.Point(boundingRect.left + boundingRect.width, boundingRect.top + boundingRect.height);

      return this.isContainedWithinRect(point1, point2);
    },

    /**
     * Checks if object is fully contained within area formed by 2 points
     * @param {Object} pointTL top-left point of area
     * @param {Object} pointBR bottom-right point of area
     * @return {Boolean} true if object is fully contained within area formed by 2 points
     */
    isContainedWithinRect: function(pointTL, pointBR) {
      var boundingRect = this.getBoundingRect();

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
     * @return {Boolean} true if point is inside the object
     */
    containsPoint: function(point) {
      var lines = this._getImageLines(this.oCoords),
          xPoints = this._findCrossPoints(point, lines);

      // if xPoints is odd then point is inside the object
      return (xPoints !== 0 && xPoints % 2 === 1);
    },

    /**
     * Method that returns an object with the object edges in it, given the coordinates of the corners
     * @private
     * @param {Object} oCoords Coordinates of the object corners
     */
    _getImageLines: function(oCoords) {
      return {
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
    },

    /**
     * Helper method to determine how many cross points are between the 4 object edges
     * and the horizontal line determined by a point on canvas
     * @private
     * @param {fabric.Point} point Point to check
     * @param {Object} oCoords Coordinates of the object being evaluated
     */
    _findCrossPoints: function(point, oCoords) {
      var b1, b2, a1, a2, xi, yi,
          xcount = 0,
          iLine;

      for (var lineKey in oCoords) {
        iLine = oCoords[lineKey];
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
          yi = point.y;
        }
        // calculate the intersection point
        else {
          b1 = 0;
          b2 = (iLine.d.y - iLine.o.y) / (iLine.d.x - iLine.o.x);
          a1 = point.y - b1 * point.x;
          a2 = iLine.o.y - b2 * iLine.o.x;

          xi = - (a1 - a2) / (b1 - b2);
          yi = a1 + b1 * xi;
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
     * Returns width of an object's bounding rectangle
     * @deprecated since 1.0.4
     * @return {Number} width value
     */
    getBoundingRectWidth: function() {
      return this.getBoundingRect().width;
    },

    /**
     * Returns height of an object's bounding rectangle
     * @deprecated since 1.0.4
     * @return {Number} height value
     */
    getBoundingRectHeight: function() {
      return this.getBoundingRect().height;
    },

    /**
     * Returns coordinates of object's bounding rectangle (left, top, width, height)
     * @return {Object} Object with left, top, width, height properties
     */
    getBoundingRect: function() {
      this.oCoords || this.setCoords();
      return fabric.util.makeBoundingBoxFromPoints([
        this.oCoords.tl,
        this.oCoords.tr,
        this.oCoords.br,
        this.oCoords.bl
      ]);
    },

    /**
     * Returns width of an object
     * @return {Number} width value
     */
    getWidth: function() {
      //needs to be changed
      return this._getTransformedDimensions().x;
    },

    /**
     * Returns height of an object
     * @return {Number} height value
     */
    getHeight: function() {
      //needs to be changed
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
      return value;
    },

    /**
     * Scales an object (equally by x and y)
     * @param {Number} value Scale factor
     * @return {fabric.Object} thisArg
     * @chainable
     */
    scale: function(value) {
      value = this._constrainScale(value);

      if (value < 0) {
        this.flipX = !this.flipX;
        this.flipY = !this.flipY;
        value *= -1;
      }

      this.scaleX = value;
      this.scaleY = value;
      this.setCoords();
      return this;
    },

    /**
     * Scales an object to a given width, with respect to bounding box (scaling by x/y equally)
     * @param {Number} value New width value
     * @return {fabric.Object} thisArg
     * @chainable
     */
    scaleToWidth: function(value) {
      // adjust to bounding rect factor so that rotated shapes would fit as well
      var boundingRectFactor = this.getBoundingRect().width / this.getWidth();
      return this.scale(value / this.width / boundingRectFactor);
    },

    /**
     * Scales an object to a given height, with respect to bounding box (scaling by x/y equally)
     * @param {Number} value New height value
     * @return {fabric.Object} thisArg
     * @chainable
     */
    scaleToHeight: function(value) {
      // adjust to bounding rect factor so that rotated shapes would fit as well
      var boundingRectFactor = this.getBoundingRect().height / this.getHeight();
      return this.scale(value / this.height / boundingRectFactor);
    },

    /**
     * Sets corner position coordinates based on current angle, width and height
     * See https://github.com/kangax/fabric.js/wiki/When-to-call-setCoords
     * @return {fabric.Object} thisArg
     * @chainable
     */
    setCoords: function() {
      var theta = degreesToRadians(this.angle),
          vpt = this.getViewportTransform(),
          dim = this._calculateCurrentDimensions(),
          currentWidth = dim.x, currentHeight = dim.y;

      // If width is negative, make postive. Fixes path selection issue
      if (currentWidth < 0) {
        currentWidth = Math.abs(currentWidth);
      }

      var sinTh = Math.sin(theta),
          cosTh = Math.cos(theta),
          _angle = currentWidth > 0 ? Math.atan(currentHeight / currentWidth) : 0,
          _hypotenuse = (currentWidth / Math.cos(_angle)) / 2,
          offsetX = Math.cos(_angle + theta) * _hypotenuse,
          offsetY = Math.sin(_angle + theta) * _hypotenuse,

          // offset added for rotate and scale actions
          coords = fabric.util.transformPoint(this.getCenterPoint(), vpt),
          tl  = new fabric.Point(coords.x - offsetX, coords.y - offsetY),
          tr  = new fabric.Point(tl.x + (currentWidth * cosTh), tl.y + (currentWidth * sinTh)),
          bl  = new fabric.Point(tl.x - (currentHeight * sinTh), tl.y + (currentHeight * cosTh)),
          br  = new fabric.Point(coords.x + offsetX, coords.y + offsetY),
          ml  = new fabric.Point((tl.x + bl.x)/2, (tl.y + bl.y)/2),
          mt  = new fabric.Point((tr.x + tl.x)/2, (tr.y + tl.y)/2),
          mr  = new fabric.Point((br.x + tr.x)/2, (br.y + tr.y)/2),
          mb  = new fabric.Point((br.x + bl.x)/2, (br.y + bl.y)/2),
          mtr = new fabric.Point(mt.x + sinTh * this.rotatingPointOffset, mt.y - cosTh * this.rotatingPointOffset);
      // debugging

      /* setTimeout(function() {
         canvas.contextTop.fillStyle = 'green';
         canvas.contextTop.fillRect(mb.x, mb.y, 3, 3);
         canvas.contextTop.fillRect(bl.x, bl.y, 3, 3);
         canvas.contextTop.fillRect(br.x, br.y, 3, 3);
         canvas.contextTop.fillRect(tl.x, tl.y, 3, 3);
         canvas.contextTop.fillRect(tr.x, tr.y, 3, 3);
         canvas.contextTop.fillRect(ml.x, ml.y, 3, 3);
         canvas.contextTop.fillRect(mr.x, mr.y, 3, 3);
         canvas.contextTop.fillRect(mt.x, mt.y, 3, 3);
         canvas.contextTop.fillRect(mtr.x, mtr.y, 3, 3);
       }, 50); */

      this.oCoords = {
        // corners
        tl: tl, tr: tr, br: br, bl: bl,
        // middle
        ml: ml, mt: mt, mr: mr, mb: mb,
        // rotating point
        mtr: mtr
      };

      // set coordinates of the draggable boxes in the corners used to scale/rotate the image
      this._setCornerCoords && this._setCornerCoords();

      return this;
    },

    _calcRotateMatrix: function() {
      if (this.angle) {
        var theta = degreesToRadians(this.angle), cos = Math.cos(theta), sin = Math.sin(theta);
        return [cos, sin, -sin, cos, 0, 0];
      }
      return [1, 0, 0, 1, 0, 0];
    },

    calcTransformMatrix: function() {
      var center = this.getCenterPoint(),
          translateMatrix = [1, 0, 0, 1, center.x, center.y],
          rotateMatrix = this._calcRotateMatrix(),
          dimensionMatrix = this._calcDimensionsTransformMatrix(this.skewX, this.skewY, true),
          matrix = this.group ? this.group.calcTransformMatrix() : [1, 0, 0, 1, 0, 0];
      matrix = multiplyMatrices(matrix, translateMatrix);
      matrix = multiplyMatrices(matrix, rotateMatrix);
      matrix = multiplyMatrices(matrix, dimensionMatrix);
      return matrix;
    },

    _calcDimensionsTransformMatrix: function(skewX, skewY, flipping) {
      var skewMatrixX = [1, 0, Math.tan(degreesToRadians(skewX)), 1],
          skewMatrixY = [1, Math.tan(degreesToRadians(skewY)), 0, 1],
          scaleX = this.scaleX * (flipping && this.flipX ? -1 : 1),
          scaleY = this.scaleY * (flipping && this.flipY ? -1 : 1),
          scaleMatrix = [scaleX, 0, 0, scaleY],
          m = multiplyMatrices(scaleMatrix, skewMatrixX, true);
      return multiplyMatrices(m, skewMatrixY, true);
    }
  });
})();
