(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { }),
      degreesToRadians = fabric.util.degreesToRadians,
      controls = {};

  function renderCircleControl (ctx, methodName, left, top, styleOverride, fabricObject) {
    styleOverride = styleOverride || {};
    if (!this.getVisibility()) {
      return;
    }
    var size = fabricObject.cornerSize,
        transparent = styleOverride.transparentCorners && fabricObject.transparentCorners,
        stroke = !transparent && (styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor);
    ctx.save();
    ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor;
    ctx.strokeStyle = styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(left, top, size / 2, 0, 2 * Math.PI, false);
    ctx[methodName]();
    if (stroke) {
      ctx.stroke();
    }
    ctx.restore();
  }

  function renderSquareControl(ctx, methodName, left, top, styleOverride, fabricObject) {
    styleOverride = styleOverride || {};
    if (!this.getVisibility()) {
      return;
    }
    var size = fabricObject.cornerSize,
        transparent = styleOverride.transparentCorners && fabricObject.transparentCorners,
        stroke = !transparent && (
          styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor
        );
    ctx.save();
    ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor;
    ctx.strokeStyle = styleOverride.strokeCornerColor || fabricObject.strokeCornerColor;
    ctx.lineWidth = 1;
    ctx.rotate(-degreesToRadians(fabricObject.angle));
    fabricObject.transparentCorners || ctx.clearRect(left, top, size, size);
    ctx[methodName + 'Rect'](left - size / 2, top - size / 2, size, size);
    if (stroke) {
      ctx.strokeRect(left - size / 2, top - size / 2, size, size);
    }
    ctx.restore();
  }

  controls.renderCircleControl = renderCircleControl;
  controls.renderSquareControl = renderSquareControl;
  fabric.controlRenderers = controls;

})(typeof exports !== 'undefined' ? exports : this);
