(function(window) {
  function visualCallback() {
    this.currentArgs = {};
  }

  visualCallback.prototype.addArguments = function(argumentObj) {
    this.currentArgs = Object.assign({}, argumentObj);
  };

  visualCallback.prototype.testDone = function(details) {
    if (window && document && this.currentArgs.enabled) {
      var fabricCanvas = this.currentArgs.fabric;
      var ouputImageDataRef = this.currentArgs.diff;
      var goldenCanvasRef = this.currentArgs.golden;
      var goldenName = this.currentArgs.goldenName;
      var id = 'qunit-test-output-' + details.testId;
      var node = document.getElementById(id);
      var fabricCopy = document.createElement('canvas');
      var diff = document.createElement('canvas');
      diff.width = fabricCopy.width = fabricCanvas.width;
      diff.height = fabricCopy.height = fabricCanvas.height;
      diff.getContext('2d').putImageData(ouputImageDataRef, 0, 0);
      fabricCopy.getContext('2d').drawImage(fabricCanvas, 0, 0);

      var data = {
        actual: fabricCopy,
        expected: goldenCanvasRef,
        diff
      };

      var template = document.getElementById('error_output');
      var errorOutput = template.content.cloneNode(true);
      Object.keys(data).forEach(key => {
        const canvas = data[key];
        errorOutput.querySelector(`*[data-canvas-type="${key}"]`).appendChild(canvas);
        canvas.style.cursor = 'pointer';
        canvas.onclick = () => {
          const link = document.createElement('a');
          link.href = fabric.util.toDataURL(canvas, 'png', 1);
          link.download = `(${key}) ${goldenName}`;
          link.click();
        }
      });
      node.appendChild(errorOutput);
      
      // after one run, disable
      this.currentArgs.enabled = false;
    }
  };

  if (window) {
    window.visualCallback = new visualCallback();
  }
})(this);
