(function() {

  var controlsUtils = fabric.controlsUtils,
      scaleSkewStyleHandler = controlsUtils.scaleSkewCursorStyleHandler,
      scaleStyleHandler = controlsUtils.scaleCursorStyleHandler,
      scalingEqually = controlsUtils.scalingEqually,
      scalingYOrSkewingX = controlsUtils.scalingYOrSkewingX,
      scalingXOrSkewingY = controlsUtils.scalingXOrSkewingY,
      scaleOrSkewActionName = controlsUtils.scaleOrSkewActionName;

  class ObjectControls {
    constructor(object) {
      this.object = object;
      this.controls = [
        'ml',
        'mr',
        'mb',
        'mt',
        'tl',
        'tr',
        'bl',
        'br',
        'mtr'
      ];

      this.ml = new fabric.Control({
        x: -0.5,
        y: 0,
        cursorStyleHandler: scaleSkewStyleHandler,
        actionHandler: scalingXOrSkewingY,
        getActionName: scaleOrSkewActionName,
        object: this.object
      });

      this.mr = new fabric.Control({
        x: 0.5,
        y: 0,
        cursorStyleHandler: scaleSkewStyleHandler,
        actionHandler: scalingXOrSkewingY,
        getActionName: scaleOrSkewActionName,
        object: this.object
      });

      this.mb = new fabric.Control({
        x: 0,
        y: 0.5,
        cursorStyleHandler: scaleSkewStyleHandler,
        actionHandler: scalingYOrSkewingX,
        getActionName: scaleOrSkewActionName,
        object: this.object
      });

      this.mt = new fabric.Control({
        x: 0,
        y: -0.5,
        cursorStyleHandler: scaleSkewStyleHandler,
        actionHandler: scalingYOrSkewingX,
        getActionName: scaleOrSkewActionName,
        object: this.object
      });

      this.tl = new fabric.Control({
        x: -0.5,
        y: -0.5,
        cursorStyleHandler: scaleStyleHandler,
        actionHandler: scalingEqually,
        object: this.object
      });

      this.tr = new fabric.Control({
        x: 0.5,
        y: -0.5,
        cursorStyleHandler: scaleStyleHandler,
        actionHandler: scalingEqually,
        object: this.object
      });

      this.bl = new fabric.Control({
        x: -0.5,
        y: 0.5,
        cursorStyleHandler: scaleStyleHandler,
        actionHandler: scalingEqually,
        object: this.object
      });

      this.br = new fabric.Control({
        x: 0.5,
        y: 0.5,
        cursorStyleHandler: scaleStyleHandler,
        actionHandler: scalingEqually,
        object: this.object
      });

      this.mtr = new fabric.Control({
        x: 0,
        y: -0.5,
        actionHandler: controlsUtils.rotationWithSnapping,
        cursorStyleHandler: controlsUtils.rotationStyleHandler,
        offsetY: -40,
        withConnection: true,
        actionName: 'rotate',
        object: this.object
      });
    }

    /**
     * Calls a function for each control. The function gets called,
     * with the control, the object that is calling the iterator and the control's key
     * @param {(control: fabric.Control, key: string) => any} callback function to iterate over the controls
     */
    forEachControl(callback) {
      this.controls.forEach(function (key) {
        callback.call(this.object, this[key], key);
      }.bind(this));
    }
  }
  
  class TextboxControls extends ObjectControls {
    constructor(object) {
      super(object);
      
      this.mr = new fabric.Control({
        x: 0.5,
        y: 0,
        actionHandler: controlsUtils.changeWidth,
        cursorStyleHandler: scaleSkewStyleHandler,
        actionName: 'resizing',
        object: this.object
      })

      this.ml = new fabric.Control({
        x: -0.5,
        y: 0,
        actionHandler: controlsUtils.changeWidth,
        cursorStyleHandler: scaleSkewStyleHandler,
        actionName: 'resizing',
        object: this.object
      })
    }
  }

  fabric.ObjectControls = ObjectControls;
  fabric.TextboxControls = TextboxControls;
})();
