(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { }),
      degreesToRadians = fabric.util.degreesToRadians,
      controls = {};

  function renderCircleControl (ctx, left, top, styleOverride, fabricObject) {
    styleOverride = styleOverride || {};
    var size = styleOverride.cornerSize || fabricObject.cornerSize,
        transparentCorners = typeof styleOverride.transparentCorners !== 'undefined' ?
          styleOverride.transparentCorners : this.transparentCorners,
        methodName = transparentCorners ? 'stroke' : 'fill',
        stroke = !transparentCorners && (styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor);
    ctx.save();
    ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor;
    ctx.strokeStyle = styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor;
    // this is still wrong
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(left, top, size / 2, 0, 2 * Math.PI, false);
    ctx[methodName]();
    if (stroke) {
      ctx.stroke();
    }
    ctx.restore();
  }

  function renderSquareControl(ctx, left, top, styleOverride, fabricObject) {
    styleOverride = styleOverride || {};
    var size = styleOverride.cornerSize || fabricObject.cornerSize,
        transparentCorners = typeof styleOverride.transparentCorners !== 'undefined' ?
          styleOverride.transparentCorners : fabricObject.transparentCorners,
        methodName = transparentCorners ? 'stroke' : 'fill',
        stroke = !transparentCorners && (
          styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor
        ), sizeBy2 = size / 2;
    ctx.save();
    ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor;
    ctx.strokeStyle = styleOverride.strokeCornerColor || fabricObject.strokeCornerColor;
    // this is still wrong
    ctx.lineWidth = 1;
    ctx.translate(left, top);
    ctx.rotate(degreesToRadians(fabricObject.angle));
    // this does not work, and fixed with ( && ) does not make sense.
    // to have real transparent corners we need the controls on upperCanvas
    // transparentCorners || ctx.clearRect(-sizeBy2, -sizeBy2, size, size);
    ctx[methodName + 'Rect'](-sizeBy2, -sizeBy2, size, size);
    if (stroke) {
      ctx.strokeRect(-sizeBy2, -sizeBy2, size, size);
    }
    ctx.restore();
  }

  controls.renderCircleControl = renderCircleControl;
  controls.renderSquareControl = renderSquareControl;
  fabric.controlRenderers = controls;

})(typeof exports !== 'undefined' ? exports : this);
