(function(window) {
  function visualCallback() {
    this.currentArgs = {};
  }

  visualCallback.prototype.addArguments = function(argumentObj) {
    this.currentArgs = {
      enabled: true,
      fabric: argumentObj.fabric,
      golden: argumentObj.golden,
      diff: argumentObj.diff,
    };
  };

  visualCallback.prototype.testDone = function(details) {
    if (window && document && this.currentArgs.enabled) {
      var fabricCanvas = this.currentArgs.fabric;
      var ouputImageDataRef = this.currentArgs.diff;
      var goldenCanvasRef = this.currentArgs.golden;
      var id = 'qunit-test-output-' + details.testId;
      var node = document.getElementById(id);
      var fabricCopy = document.createElement('canvas');
      var diff = document.createElement('canvas');
      diff.width = fabricCopy.width = fabricCanvas.width;
      diff.height = fabricCopy.height = fabricCanvas.height;
      diff.getContext('2d').putImageData(ouputImageDataRef, 0, 0);
      fabricCopy.getContext('2d').drawImage(fabricCanvas, 0, 0);
      var _div = document.createElement('div');
      _div.appendChild(goldenCanvasRef);
      _div.appendChild(fabricCopy);
      _div.appendChild(diff);
      node.appendChild(_div);
      // after one run, disable
      this.currentArgs.enabled = false;
    }
  };

  if (window) {
    window.visualCallback = new visualCallback();
  }
})(this);
