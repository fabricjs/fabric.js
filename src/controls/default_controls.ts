//@ts-nocheck

import { FabricObject } from '../shapes/object.class';
import {
  changeWidth,
  rotationStyleHandler,
  rotationWithSnapping,
  scaleOrSkewActionName,
  scalingEqually,
  scalingXOrSkewingY,
  scalingYOrSkewingX,
  scaleSkewCursorStyleHandler,
} from './actions';
import { Control } from './control.class';

(function (global) {
  var fabric = global.fabric,
    objectControls = FabricObject.prototype.controls;

  objectControls.ml = new Control({
    x: -0.5,
    y: 0,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionHandler: scalingXOrSkewingY,
    getActionName: scaleOrSkewActionName,
  });

  objectControls.mr = new Control({
    x: 0.5,
    y: 0,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionHandler: scalingXOrSkewingY,
    getActionName: scaleOrSkewActionName,
  });

  objectControls.mb = new Control({
    x: 0,
    y: 0.5,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionHandler: scalingYOrSkewingX,
    getActionName: scaleOrSkewActionName,
  });

  objectControls.mt = new Control({
    x: 0,
    y: -0.5,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionHandler: scalingYOrSkewingX,
    getActionName: scaleOrSkewActionName,
  });

  objectControls.tl = new Control({
    x: -0.5,
    y: -0.5,
    cursorStyleHandler: scaleStyleHandler,
    actionHandler: scalingEqually,
  });

  objectControls.tr = new Control({
    x: 0.5,
    y: -0.5,
    cursorStyleHandler: scaleStyleHandler,
    actionHandler: scalingEqually,
  });

  objectControls.bl = new Control({
    x: -0.5,
    y: 0.5,
    cursorStyleHandler: scaleStyleHandler,
    actionHandler: scalingEqually,
  });

  objectControls.br = new Control({
    x: 0.5,
    y: 0.5,
    cursorStyleHandler: scaleStyleHandler,
    actionHandler: scalingEqually,
  });

  objectControls.mtr = new Control({
    x: 0,
    y: -0.5,
    actionHandler: rotationWithSnapping,
    cursorStyleHandler: rotationStyleHandler,
    offsetY: -40,
    withConnection: true,
    actionName: 'rotate',
  });

  if (fabric.Textbox) {
    // this is breaking the prototype inheritance, no time / ideas to fix it.
    // is important to document that if you want to have all objects to have a
    // specific custom control, you have to add it to Object prototype and to Textbox
    // prototype. The controls are shared as references. So changes to control `tr`
    // can still apply to all objects if needed.
    var textBoxControls = (fabric.Textbox.prototype.controls = {});

    textBoxControls.mtr = objectControls.mtr;
    textBoxControls.tr = objectControls.tr;
    textBoxControls.br = objectControls.br;
    textBoxControls.tl = objectControls.tl;
    textBoxControls.bl = objectControls.bl;
    textBoxControls.mt = objectControls.mt;
    textBoxControls.mb = objectControls.mb;

    textBoxControls.mr = new Control({
      x: 0.5,
      y: 0,
      actionHandler: changeWidth,
      cursorStyleHandler: scaleSkewCursorStyleHandler,
      actionName: 'resizing',
    });

    textBoxControls.ml = new Control({
      x: -0.5,
      y: 0,
      actionHandler: changeWidth,
      cursorStyleHandler: scaleSkewCursorStyleHandler,
      actionName: 'resizing',
    });
  }
})(typeof exports !== 'undefined' ? exports : window);
