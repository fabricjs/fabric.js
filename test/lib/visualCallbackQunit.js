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
      var fabricCanvasDataRef = this.currentArgs.fabric;
      var ouputImageDataRef = this.currentArgs.diff;
      var goldenCanvasRef = this.currentArgs.golden;
      var goldenName = this.currentArgs.goldenName;
      var id = 'qunit-test-output-' + details.testId;
      var node = document.getElementById(id);
      var fabricCopy = document.createElement('canvas');
      var diff = document.createElement('canvas');
      diff.width = fabricCopy.width = fabricCanvasDataRef.width;
      diff.height = fabricCopy.height = fabricCanvasDataRef.height;
      diff.getContext('2d').putImageData(ouputImageDataRef, 0, 0);
      fabricCopy.getContext('2d').putImageData(fabricCanvasDataRef, 0, 0);

      var data = {
        actual: fabricCopy,
        expected: goldenCanvasRef,
        diff: diff,
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
      if (node) {
        node.appendChild(errorOutput);
      }
      // after one run, disable
      this.currentArgs.enabled = false;
    }
  };

  if (window) {
    window.visualCallback = new visualCallback();
  }
})(this);
