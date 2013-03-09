(function(global) {

  "use strict";

  var fabric = global.fabric || (global.fabric = { });

  var utilMin = fabric.util.array.min,
      utilMax = fabric.util.array.max;

  if (fabric.FreeDrawing) {
    fabric.warn('fabric.FreeDrawing is already defined');
    return;
  }

  /**
   * Free drawing class
   * Free Drawer handles scribbling on a fabric canvas
   * It converts the hand writting to a SVG Path and adds this path to the canvas
   *
   * @class FreeDrawing
   * @memberOf fabric
   */
  fabric.FreeDrawing = fabric.util.createClass( /** @scope fabric.FreeDrawing.prototype */ {

    /**
     * Constructor
     * @metod initialize
     * @param fabricCanvas {fabric.Canvas}
     * @return {fabric.FreeDrawing}
     */
    initialize: function(fabricCanvas) {
      this.canvas = fabricCanvas;
      this._points = [];
    },

    /**
     * @private
     * @method _addPoint
     *
     */
    _addPoint: function(point) {
      this._points.push(point);
    },

    /**
     * Clear points array and set contextTop canvas
     * style.
     *
     * @private
     * @method _reset
     *
     */
    _reset: function() {
      this._points.length = 0;
      var ctx = this.canvas.contextTop;

      // set freehanddrawing line canvas parameters
      ctx.strokeStyle = this.canvas.freeDrawingColor;
      ctx.lineWidth = this.canvas.freeDrawingLineWidth;
      ctx.lineCap = ctx.lineJoin = 'round';
    },

     /**
     * @method _prepareForDrawing
     */
     _prepareForDrawing: function(pointer) {

      this.canvas._isCurrentlyDrawing = true;
      this.canvas.discardActiveObject().renderAll();

      var p = new fabric.Point(pointer.x, pointer.y);
      this._reset();
      this._addPoint(p);
      this.canvas.contextTop.moveTo(p.x, p.y);
    },

    /**
     * @private
     * @method _captureDrawingPath
     *
     * @param point {pointer} (fabric.util.pointer) actual mouse position
     *   related to the canvas.
     */
    _captureDrawingPath: function(pointer) {
      var pointerPoint = new fabric.Point(pointer.x, pointer.y);
      this._addPoint(pointerPoint);
    },

    /**
     * Draw a smooth path on the topCanvas using
     * quadraticCurveTo.
     *
     * @private
     * @method _render
     *
     */
    _render: function() {
      var ctx  = this.canvas.contextTop;
      ctx.beginPath();

      var p1 = this._points[0];
      var p2 = this._points[1];

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
     * Return an SVG path based on our
     * captured points and their boundinb box.
     *
     * @private
     * @method _getSVGPathData
     *
     */
    _getSVGPathData: function() {
      this.box = this.getPathBoundingBox(this._points);
      return this.convertPointsToSVGPath(
        this._points, this.box.minx, this.box.maxx, this.box.miny, this.box.maxy);
     },

     /**
      * Returns bounding box of a path based on given points
      * @method getPathBoundingBox
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
     * @method convertPointsToSVGPath
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
     * @method createPath
     * @param {String} pathData Path data
     * @return {fabric.Path} path to add on canvas
     */
    createPath: function(pathData) {
      var path = new fabric.Path(pathData);
      path.fill = null;
      path.stroke = this.canvas.freeDrawingColor;
      path.strokeWidth = this.canvas.freeDrawingLineWidth;
      return path;
    },

    /**
     * On mouseup after drawing the path on contextTop canvas
     * we use the points captured to create an new fabric path object
     * and add it to the fabric canvas.
     *
     * @method _finalizeAndAddPath
     */
    _finalizeAndAddPath: function() {
      this.canvas._isCurrentlyDrawing = false;
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
      path.set({ left: originLeft, top: originTop });

      this.canvas.add(path);
      path.setCoords();

      this.canvas.contextTop && this.canvas.clearContext(this.canvas.contextTop);
      this.canvas.renderAll();

      // fire event 'path' created
      this.canvas.fire('path:created', { path: path });
    }
  });

})(typeof exports !== 'undefined' ? exports : this);
