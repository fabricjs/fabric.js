(function() {

  var controlsUtils = fabric.controlsUtils,
      scaleSkewStyleHandler = controlsUtils.scaleSkewCursorStyleHandler,
      scaleStyleHandler = controlsUtils.scaleCursorStyleHandler,
      scalingEqually = controlsUtils.scalingEqually,
      scalingYOrSkewingX = controlsUtils.scalingYOrSkewingX,
      scalingXOrSkewingY = controlsUtils.scalingXOrSkewingY,
      scaleOrSkewActionName = controlsUtils.scaleOrSkewActionName,
      rotationWithSnapping = controlsUtils.rotationWithSnapping,
      rotationStyleHandler = controlsUtils.rotationStyleHandler,
      changeWidth = controlsUtils.changeWidth;

  class ObjectControls {
    constructor() { 
      this.ml = new fabric.Control({
        x: -0.5,
        y: 0,
        cursorStyleHandler: scaleSkewStyleHandler,
        actionHandler: scalingXOrSkewingY,
        getActionName: scaleOrSkewActionName
      });

      this.mr = new fabric.Control({
        x: 0.5,
        y: 0,
        cursorStyleHandler: scaleSkewStyleHandler,
        actionHandler: scalingXOrSkewingY,
        getActionName: scaleOrSkewActionName
      });

      this.mb = new fabric.Control({
        x: 0,
        y: 0.5,
        cursorStyleHandler: scaleSkewStyleHandler,
        actionHandler: scalingYOrSkewingX,
        getActionName: scaleOrSkewActionName
      });

      this.mt = new fabric.Control({
        x: 0,
        y: -0.5,
        cursorStyleHandler: scaleSkewStyleHandler,
        actionHandler: scalingYOrSkewingX,
        getActionName: scaleOrSkewActionName
      });

      this.tl = new fabric.Control({
        x: -0.5,
        y: -0.5,
        cursorStyleHandler: scaleStyleHandler,
        actionHandler: scalingEqually
      });

      this.tr = new fabric.Control({
        x: 0.5,
        y: -0.5,
        cursorStyleHandler: scaleStyleHandler,
        actionHandler: scalingEqually
      });

      this.bl = new fabric.Control({
        x: -0.5,
        y: 0.5,
        cursorStyleHandler: scaleStyleHandler,
        actionHandler: scalingEqually
      });

      this.br = new fabric.Control({
        x: 0.5,
        y: 0.5,
        cursorStyleHandler: scaleStyleHandler,
        actionHandler: scalingEqually
      });

      this.mtr = new fabric.Control({
        x: 0,
        y: -0.5,
        actionHandler: rotationWithSnapping,
        cursorStyleHandler: rotationStyleHandler,
        offsetY: -40,
        withConnection: true,
        actionName: 'rotate'
      });
    }

    attach(object) {
      this.forEachControl(function (control) {
        control.object = object;
      });
    }

    /**
     * Calls a function for each control. The function gets called,
     * with the control, the object that is calling the iterator and the control's key
     * @param {(control: fabric.Control, key: string) => any} callback function to iterate over the controls
     */
    forEachControl(callback) {
      for (var key in this) {
        callback(this[key], key);
      }
    }
  }
  
  class TextboxControls extends ObjectControls {
    constructor() {
      super();
      
      this.mr = new fabric.Control({
        x: 0.5,
        y: 0,
        actionHandler: changeWidth,
        cursorStyleHandler: scaleSkewStyleHandler,
        actionName: 'resizing'
      })

      this.ml = new fabric.Control({
        x: -0.5,
        y: 0,
        actionHandler: changeWidth,
        cursorStyleHandler: scaleSkewStyleHandler,
        actionName: 'resizing'
      })
    }
  }

  fabric.ObjectControls = ObjectControls;
  fabric.TextboxControls = TextboxControls;
})();
