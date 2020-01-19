(function() {

  var controlHandlers = fabric.controlHandlers,
      scaleSkewStyleHandler = controlHandlers.scaleSkewCursorStyleHandler,
      scaleStyleHandler = controlHandlers.scaleCursorStyleHandler,
      scalingEqually = controlHandlers.scalingEqually,
      scalingYOrSkewingX = controlHandlers.scalingYOrSkewingX,
      scalingXOrSkewingY = controlHandlers.scalingXOrSkewingY,
      scaleOrSkewActionName = controlHandlers.scaleOrSkewActionName,
      objectControls = fabric.Object.prototype.controls;

  objectControls.ml = new fabric.Control({
    name: 'ml',
    position: { x: -0.5, y: 0 },
    cursorStyleHandler: scaleSkewStyleHandler,
    actionHandler: scalingXOrSkewingY,
    getActionName: scaleOrSkewActionName,
  });

  objectControls.mr = new fabric.Control({
    name: 'mr',
    position: { x: 0.5, y: 0 },
    cursorStyleHandler: scaleSkewStyleHandler,
    actionHandler: scalingXOrSkewingY,
    getActionName: scaleOrSkewActionName,
  });

  objectControls.mb = new fabric.Control({
    name: 'mb',
    position: { x: 0, y: 0.5 },
    cursorStyleHandler: scaleSkewStyleHandler,
    actionHandler: scalingYOrSkewingX,
    getActionName: scaleOrSkewActionName,
  });

  objectControls.mt = new fabric.Control({
    name: 'mt',
    position: { x: 0, y: -0.5 },
    cursorStyleHandler: scaleSkewStyleHandler,
    actionHandler: scalingYOrSkewingX,
    getActionName: scaleOrSkewActionName,
  });

  objectControls.tl = new fabric.Control({
    name: 'tl',
    position: { x: -0.5, y: -0.5 },
    cursorStyleHandler: scaleStyleHandler,
    actionHandler: scalingEqually
  });

  objectControls.tr = new fabric.Control({
    name: 'tr',
    position: { x: 0.5, y: -0.5 },
    cursorStyleHandler: scaleStyleHandler,
    actionHandler: scalingEqually
  });

  objectControls.bl = new fabric.Control({
    name: 'bl',
    position: { x: -0.5, y: 0.5 },
    cursorStyleHandler: scaleStyleHandler,
    actionHandler: scalingEqually
  });

  objectControls.br = new fabric.Control({
    name: 'br',
    position: { x: 0.5, y: 0.5 },
    cursorStyleHandler: scaleStyleHandler,
    actionHandler: scalingEqually
  });

  objectControls.mtr = new fabric.Control({
    name: 'mtr',
    position: { x: 0, y: -0.5 },
    actionHandler: controlHandlers.rotationWithSnapping,
    cursorStyleHandler: controlHandlers.rotationStyleHandler,
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
    var textBoxControls = fabric.Textbox.prototype.controls = { };

    textBoxControls.mtr = objectControls.mtr;
    textBoxControls.tr = objectControls.tr;
    textBoxControls.br = objectControls.br;
    textBoxControls.tl = objectControls.tl;
    textBoxControls.bl = objectControls.bl;
    textBoxControls.mt = objectControls.mt;
    textBoxControls.mb = objectControls.mb;

    textBoxControls.mr = new fabric.Control({
      name: 'mr',
      position: { x: 0.5, y: 0 },
      actionHandler: controlHandlers.changeWidth,
      cursorStyleHandler: scaleSkewStyleHandler,
      actionName: 'resizing',
    });

    textBoxControls.ml = new fabric.Control({
      name: 'ml',
      position: { x: -0.5, y: 0 },
      actionHandler: controlHandlers.changeWidth,
      cursorStyleHandler: scaleSkewStyleHandler,
      actionName: 'resizing',
    });
  }
})();
