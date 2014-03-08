(function() {

  var utilMin = fabric.util.array.min,
      utilMax = fabric.util.array.max;

  /**
   * PencilBrush class
   * @class fabric.PencilBrush
   * @extends fabric.BaseBrush
   */
  fabric.PencilBrush = fabric.util.createClass(fabric.BaseBrush, /** @lends fabric.PencilBrush.prototype */ {

    /**
     * Constructor
     * @param {fabric.Canvas} canvas
     * @return {fabric.PencilBrush} Instance of a pencil brush
     */
    initialize: function(canvas) {
      this.canvas = canvas;
      this._points = [ ];
    },

    /**
     * Inovoked on mouse down
     * @param {Object} pointer
     */
    onMouseDown: function(pointer) {
      this._prepareForDrawing(pointer);
      // capture coordinates immediately
      // this allows to draw dots (when movement never occurs)
      this._captureDrawingPath(pointer);
      this._render();
    },

    /**
     * Inovoked on mouse move
     * @param {Object} pointer
     */
    onMouseMove: function(pointer) {
      this._captureDrawingPath(pointer);
      // redraw curve
      // clear top canvas
      this.canvas.clearContext(this.canvas.contextTop);
      this._render();
    },

    /**
     * Invoked on mouse up
     */
    onMouseUp: function() {
      this._finalizeAndAddPath();
    },

    /**
     * @param {Object} pointer
     */
    _prepareForDrawing: function(pointer) {

      var p = new fabric.Point(pointer.x, pointer.y);

      this._reset();
      this._addPoint(p);

      this.canvas.contextTop.moveTo(p.x, p.y);
    },

    /**
     * @private
     * @param {fabric.Point} point
     */
    _addPoint: function(point) {
      this._points.push(point);
    },

    /**
     * Clear points array and set contextTop canvas
     * style.
     *
     * @private
     *
     */
    _reset: function() {
      this._points.length = 0;

      this._setBrushStyles();
      this._setShadow();
    },

    /**
     * @private
     *
     * @param point {pointer} (fabric.util.pointer) actual mouse position
     *   related to the canvas.
     */
    _captureDrawingPath: function(pointer) {
      var pointerPoint = new fabric.Point(pointer.x, pointer.y);
      this._addPoint(pointerPoint);
    },

    /**
     * Draw a smooth path on the topCanvas using quadraticCurveTo
     *
     * @private
     */
    _render: function() {
      var ctx  = this.canvas.contextTop;
      ctx.beginPath();

      var p1 = this._points[0];
      var p2 = this._points[1];

      //if we only have 2 points in the path and they are the same
      //it means that the user only clicked the canvas without moving the mouse
      //then we should be drawing a dot. A path isn't drawn between two identical dots
      //that's why we set them apart a bit
      if (this._points.length === 2 && p1.x === p2.x && p1.y === p2.y) {
          p1.x -= 0.5;
          p2.x += 0.5;
      }
      ctx.moveTo(p1.x, p1.y);

      for (var i = 1, len = this._points.length; i < len; i++) {
        // we pick the point between pi+1 & pi+2 as the
        // end point and p1 as our control point.
        var midPoint = p1.midPointFrom(p2);
        ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);

        p1 = this._points[i];
        p2 = this._points[i+1];
      }
      // Draw last line as a straight line while
      // we wait for the next point to be able to calculate
      // the bezier control point
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();
    },

    /**
     * Return an SVG path based on our captured points and their bounding box
     *
     * @private
     */
    _getSVGPathData: function() {
      this.box = this.getPathBoundingBox(this._points);
      return this.convertPointsToSVGPath(
        this._points, this.box.minx, this.box.maxx, this.box.miny, this.box.maxy);
     },

     /**
      * Returns bounding box of a path based on given points
      * @param {Array} points
      * @return {Object} object with minx, miny, maxx, maxy
      */
     getPathBoundingBox: function(points) {
      var xBounds = [],
          yBounds = [],
          p1 = points[0],
          p2 = points[1],
          startPoint = p1;

      for (var i = 1, len = points.length; i < len; i++) {
        var midPoint = p1.midPointFrom(p2);
        // with startPoint, p1 as control point, midpoint as end point
        xBounds.push(startPoint.x);
        xBounds.push(midPoint.x);
        yBounds.push(startPoint.y);
        yBounds.push(midPoint.y);

        p1 = points[i];
        p2 = points[i+1];
        startPoint = midPoint;
     } // end for

     xBounds.push(p1.x);
     yBounds.push(p1.y);

     return {
       minx: utilMin(xBounds),
       miny: utilMin(yBounds),
       maxx: utilMax(xBounds),
       maxy: utilMax(yBounds)
     };
    },

    /**
     * Converts points to SVG path
     * @param {Array} points Array of points
     * @return {String} SVG path
     */
    convertPointsToSVGPath: function(points, minX, maxX, minY) {
      var path = [];
      var p1 = new fabric.Point(points[0].x - minX, points[0].y - minY);
      var p2 = new fabric.Point(points[1].x - minX, points[1].y - minY);

      path.push('M ', points[0].x - minX, ' ', points[0].y - minY, ' ');
      for (var i = 1, len = points.length; i < len; i++) {
        var midPoint = p1.midPointFrom(p2);
        // p1 is our bezier control point
        // midpoint is our endpoint
        // start point is p(i-1) value.
        path.push('Q ', p1.x, ' ', p1.y, ' ', midPoint.x, ' ', midPoint.y, ' ');
        p1 = new fabric.Point(points[i].x - minX, points[i].y - minY);
        if ((i+1) < points.length) {
          p2 = new fabric.Point(points[i+1].x - minX, points[i+1].y - minY);
        }
      }
      path.push('L ', p1.x, ' ', p1.y, ' ');
      return path;
    },

    /**
     * Creates fabric.Path object to add on canvas
     * @param {String} pathData Path data
     * @return {fabric.Path} path to add on canvas
     */
    createPath: function(pathData) {
      var path = new fabric.Path(pathData);
      path.fill = null;
      path.stroke = this.color;
      path.strokeWidth = this.width;
      path.strokeLineCap = this.strokeLineCap;
      path.strokeLineJoin = this.strokeLineJoin;

      if (this.shadow) {
        this.shadow.affectStroke = true;
        path.setShadow(this.shadow);
      }

      return path;
    },

    /**
     * On mouseup after drawing the path on contextTop canvas
     * we use the points captured to create an new fabric path object
     * and add it to the fabric canvas.
     *
     */
    _finalizeAndAddPath: function() {
      var ctx = this.canvas.contextTop;
      ctx.closePath();

      var pathData = this._getSVGPathData().join('');
      if (pathData === "M 0 0 Q 0 0 0 0 L 0 0") {
        // do not create 0 width/height paths, as they are
        // rendered inconsistently across browsers
        // Firefox 4, for example, renders a dot,
        // whereas Chrome 10 renders nothing
        this.canvas.renderAll();
        return;
      }

      // set path origin coordinates based on our bounding box
      var originLeft = this.box.minx  + (this.box.maxx - this.box.minx) /2;
      var originTop = this.box.miny  + (this.box.maxy - this.box.miny) /2;

      this.canvas.contextTop.arc(originLeft, originTop, 3, 0, Math.PI * 2, false);

      var path = this.createPath(pathData);
      path.set({
        left: originLeft,
        top: originTop,
        originX: 'center',
        originY: 'center'
      });

      this.canvas.add(path);
      path.setCoords();

      this.canvas.clearContext(this.canvas.contextTop);
      this._resetShadow();
      this.canvas.renderAll();

      // fire event 'path' created
      this.canvas.fire('path:created', { path: path });
    }
  });
})();
