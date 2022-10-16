const { fabric } = require("../../dist/fabric");

(function() {
  var getFixture;
  if (fabric.isLikelyNode) {
    if (process.env.launcher === 'Firefox') {
      fabric.browserShadowBlurConstant = 0.9;
    }
    if (process.env.launcher === 'Node') {
      fabric.browserShadowBlurConstant = 1;
    }
    if (process.env.launcher === 'Chrome') {
      fabric.browserShadowBlurConstant = 1.5;
    }
    if (process.env.launcher === 'Edge') {
      fabric.browserShadowBlurConstant = 1.75;
    }
    getFixture = global.getFixture;
  }
  else {
    if (navigator.userAgent.indexOf('Firefox') !== -1) {
      fabric.browserShadowBlurConstant = 0.9;
    }
    if (navigator.userAgent.indexOf('Chrome') !== -1) {
      fabric.browserShadowBlurConstant = 1.5;
    }
    if (navigator.userAgent.indexOf('Edge') !== -1) {
      fabric.browserShadowBlurConstant = 1.75;
    }
    getFixture = window.getFixture;
  }
  fabric.enableGLFiltering = false;
  fabric.isWebglSupported = false;
  fabric.Object.prototype.objectCaching = true;
  var visualTestLoop;
  if (fabric.isLikelyNode) {
    visualTestLoop = global.visualTestLoop;
  }
 else {
    visualTestLoop = window.visualTestLoop;
  }

  var tests = [];

  function genPoints(originPoint, numOfPoints, angleRotation) {
    return [...Array(numOfPoints - 1).keys()].reduce((acc, cur, idx) => {
        const actualAngle = idx === numOfPoints - 2 ? angleRotation : 90,
          vRotated =  fabric.util.rotateVector(
            fabric.util.getUnitVector(acc[idx]), 
            fabric.util.degreesToRadians(actualAngle)
          ).scalarMultiply(40),
          newPos = acc[idx].subtract(vRotated);
        acc.push(newPos);
        return acc;
      }, [originPoint])
  }
 
  function renderStrokeTest(canvas, testOptions, polyOptions) {
    const scale = new fabric.Point(2, 3),
      originPoint = canvas.getVpCenter().scalarMultiply(0.2),
      points = genPoints(originPoint, testOptions.numOfPoints, testOptions.angle),
      poly = new testOptions.builder(points, {
        fill: `rgb(255, 0, 0)`,
        strokeWidth: 10,
        stroke: 'rgb(120, 0, 0)',
        cornerColor: 'white',
        objectCaching: false,
        exactBoundingBox: true,
        ...polyOptions
      });
    poly.scaleX = scale.x;
    poly.scaleY = scale.y;
    poly.setDimensions();
    const size = poly._getTransformedDimensions(),
      bg = new fabric.Rect({
        width: size.x,
        height: size.y,
        left: poly.left,
        top: poly.top,
        originX: poly.originX,
        originY: poly.originY,
        fill: 'blue'
      });
    canvas.add(bg, poly);
    canvas.setActiveObject(poly);
    canvas.setViewportTransform([1.5, 0, 0, 0.8, 0, 0]);
    bg.viewportCenter();
    poly.viewportCenter();
    canvas.backgroundColor = 'white';
    canvas.renderAll();
  }

  let newModule = true;

  [3, 6].forEach(numOfPoints => {
    for (let angle = 0, step = 15; angle < 360; angle += step) {
      [fabric.Polyline, fabric.Polygon].forEach((builder) => {
        const type = builder.prototype.type,
          isPolygon = type === 'polygon';
        (isPolygon ? ['miter', 'round', 'bevel'] : ['butt', 'square', 'round']).forEach((strokeLineType) => {
          [true, false].forEach((strokeUniform) => {
            [0, 30].forEach((skewX) => {
              [0, 40].forEach((skewY) => {
                tests.push({
                  test: `${type} with ${numOfPoints} points, ${isPolygon ? 'strokeLineJoin' : 'strokeLineCap'}=${strokeLineType}, strokeUniform=${strokeUniform}, skewX=${skewX}, skewY=${skewY} and angle=${angle} values`,
                  code: function (canvas, callback) {
                    renderStrokeTest(canvas,
                      {
                        builder,
                        angle,
                        numOfPoints
                      },
                      {
                        strokeLineJoin: strokeLineType,
                        strokeUniform,
                        skewX,
                        skewY
                      }
                    );
                    callback(canvas.lowerCanvasEl);
                  },
                  golden: `stroke-projection/${isPolygon ? 'strokeLineJoin' : 'strokeLineCap'}/${strokeLineType}/${numOfPoints}points-${strokeUniform ? 'uniform-' : ''}${type}-${skewX}skewX-${skewY}skewY-${angle}degAngle.png`,
                  percentage: 0.001,
                  width: 600,
                  height: 900,
                  fabricClass: 'Canvas',
                  newModule: newModule ? 'stroke projection' : undefined,
                });
                newModule = false;
              })
            })
          });
        });
      });
    }
  })

  for (let angle = 0, step = 1; angle <= 90; angle += step) {
    if (angle === 15) {
      step = 5;
    }
    else if (angle === 45) {
      step = 15;
    }
    [fabric.Polyline, fabric.Polygon].forEach((builder) => {
      var type = builder.prototype.type;
      [4, 16].forEach((strokeMiterLimit) => {
        [true, false].forEach((strokeUniform) => {
          [0, 30].forEach((skewX) => {
            [0, 40].forEach((skewY) => {
              tests.push({
                test: `${type} with strokeMiterLimit=${strokeMiterLimit}, strokeUniform=${strokeUniform}, skewX=${skewX}, skewY=${skewY} and angle=${angle} values`,
                code: function (canvas, callback) {
                  renderStrokeTest(canvas,
                    {
                      builder,
                      angle,
                      numOfPoints: 3
                    },
                    {
                      strokeLineJoin: 'miter',
                      strokeUniform,
                      strokeMiterLimit
                    }
                  );
                  callback(canvas.lowerCanvasEl);
                },
                golden: `stroke-projection/strokeLineJoin/miter-limit/${strokeUniform ? 'uniform-' : ''}${type}-miter${strokeMiterLimit}-${skewX}skewX-${skewY}skewY-${angle}degAngle.png`,
                percentage: 0.001,
                width: 600,
                height: 900,
                fabricClass: 'Canvas'
              });
            });
            })
          })
      });
    });
  }

  tests.forEach(visualTestLoop(QUnit));
})();
