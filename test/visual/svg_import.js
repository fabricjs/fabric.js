(function() {
  fabric.enableGLFiltering = false;
  fabric.isWebglSupported = false;
  fabric.Object.prototype.objectCaching = true;
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

  function createTestFromSVG(svgName) {
    var test = function(canvas, callback) {
      getAsset(svgName, function(err, string) {
        fabric.loadSVGFromString(string, function(objects, options) {
          // something is disabling objectCaching and i cannot find where it is.
          objects.forEach(function(o) {
            o.objectCaching = true;
          });
          var group = fabric.util.groupSVGElements(objects, options);
          group.includeDefaultValues = false;
          canvas.includeDefaultValues = false;
          canvas.add(group);
          canvas.setDimensions({ width: group.width + group.left, height: group.height + group.top });
          canvas.renderAll();
          callback(canvas.lowerCanvasEl);
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

  QUnit.module('Simple svg import test');

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
    'svg_text_letterspacing',
    'clippath-5',
    'clippath-6',
    'clippath-7',
    'clippath-9',
    'vector-effect',
    'svg-with-no-dim-rect'
    //'clippath-8',
  ].map(createTestFromSVG);

  tests.forEach(visualTestLoop(QUnit));
})();
