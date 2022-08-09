(function(window) {
  function visualCallback() {
    this.currentArgs = {};
  }

  visualCallback.prototype.addArguments = function(argumentObj) {
    this.currentArgs = Object.assign({}, argumentObj);
  };

  visualCallback.prototype.testDone = function(details) {
    if (window && document && this.currentArgs.enabled) {
      var fabricCanvasDataRef = this.currentArgs.fabric;
      var ouputImageDataRef = this.currentArgs.diff;
      var goldenCanvasRef = this.currentArgs.golden;
      var goldenName = this.currentArgs.goldenName;
      var id = 'qunit-test-output-' + details.testId;
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

      new MutationObserver((mutationList, observer) => {
        for (const mutation of mutationList) {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.id === id && !node.querySelector('table')) {
                var template = document.getElementById('error_output');
                var errorOutput = template.content.cloneNode(true);
                Object.keys(data).forEach(key => {
                  const canvas = data[key];
                  errorOutput.querySelector(`*[data-canvas-type="${key}"]`).appendChild(canvas);
                  canvas.style.cursor = 'pointer';
                  canvas.setAttribute('data-golden', goldenName);
                  canvas.onclick = () => {
                    const link = document.createElement('a');
                    link.href = fabric.util.toDataURL(canvas, 'png', 1);
                    link.download = `(${key}) ${goldenName}`;
                    link.click();
                  }
                });
                node.appendChild(errorOutput);
                !!node.querySelector('.qunit-collapsed') && node.querySelector('table').classList.add('qunit-collapsed');
                node.firstChild.addEventListener('click', () => {
                  node.querySelector('table').classList.toggle('qunit-collapsed');
                });
                observer.disconnect();
              }
            });
          }
        }
      }).observe(document.getElementById('qunit-tests'), { childList: true });
      
      // after one run, disable
      this.currentArgs.enabled = false;
    }
  };

  if (window) {
    window.visualCallback = new visualCallback();
  }
})(this);
