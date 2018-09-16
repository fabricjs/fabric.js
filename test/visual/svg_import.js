(function() {
  fabric.enableGLFiltering = false;
  fabric.isWebglSupported = false;
  fabric.Object.prototype.objectCaching = false;
  var visualTestLoop;
  var getAsset;
  if (fabric.isLikelyNode) {
    visualTestLoop = global.visualTestLoop;
    getAsset = global.getAsset;
  }
  else {
    visualTestLoop = window.visualTestLoop;
    getAsset = window.getAsset;
  }
  var fabricCanvas = this.canvas = new fabric.Canvas(null, {enableRetinaScaling: false, renderOnAddRemove: false});

  function createTestFromSVG(svgName) {
    var test = function(canvas, callback) {
      getAsset(svgName, function(err, string) {
        fabric.loadSVGFromString(string, function(objects) {
          canvas.add.apply(canvas, objects);
          canvas.renderAll();
          callback(fabricCanvas.lowerCanvasEl);
        });
      });
    };
    return {
      test: 'Svg import test ' + svgName,
      code: test,
      golden: svgName + '.png',
      percentage: 0.06,
    };
  }

  function beforeEachHandler() {
    fabricCanvas.clipPath = null;
    fabricCanvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    fabricCanvas.clear();
    fabricCanvas.renderAll();
  }

  QUnit.module('Simple svg import test', {
    beforeEach: beforeEachHandler,
  });

  var tests = [
    'svg_stroke_1',
    'svg_stroke_2',
    'svg_stroke_3',
    'svg_stroke_4',
    'svg_stroke_5',
    'svg_stroke_6',
    'svg_stroke_7',
    'svg_stroke_8',
    'svg_linear_1',
    'svg_linear_2',
    'svg_linear_3',
    'svg_linear_4',
    'svg_linear_5',
    'svg_linear_6',
    'svg_linear_7',
    'svg_linear_8',
    'svg_radial_1',
    'svg_radial_2',
    'svg_radial_3',
    'svg_radial_4',
    'svg_radial_5',
    'svg_radial_6',
    'svg_radial_8',
    'svg_radial_9',
    'svg_radial_10',
    'svg_radial_11',
    'svg_radial_12',
    'svg_radial_13',
  ].map(createTestFromSVG);

  tests.forEach(visualTestLoop(fabricCanvas, QUnit));
})();
