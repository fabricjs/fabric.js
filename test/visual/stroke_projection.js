// re-enable these tests in a follow up PR
QUnit.module.skip('stroke projection', (hooks) => {
  const tests = [];
  let __objectCaching;

  hooks.before(() => {
    __objectCaching = fabric.Object.prototype.objectCaching;
    fabric.Object.prototype.objectCaching = false;
  });

  hooks.after(() => {
    fabric.Object.prototype.objectCaching = __objectCaching;
  });

  const generalCasesToTest = {
    acuteAngle: [
      { x: 3, y: -10 },
      { x: 18, y: 16 },
      { x: 123, y: -26 },
    ],
    obtuseAngle: [
      { x: 16, y: -29 },
      { x: 187, y: 50 },
      { x: 123, y: -26 },
    ],
    rightAngle: [
      { x: 0, y: 0 },
      { x: 0, y: -30 },
      { x: 30, y: -30 },
    ],
    straightAngle: [
      { x: 1, y: 1 },
      { x: 6, y: 6 },
      { x: 36, y: 36 },
    ],
    twoPoints: [
      { x: 10, y: 10 },
      { x: 100, y: 100 },
    ],
    twoEqualPointsLine: [
      { x: 10, y: 10 },
      { x: 10, y: 10 },
      { x: 100, y: 0 },
    ],
    twoEqualPointsTriangle: [
      { x: 100, y: 100 },
      { x: 100, y: 120 },
      { x: 100, y: 120 },
      { x: 210, y: 110 },
    ],
    multipleEqualPoints: [
      { x: 100, y: 110 },
      { x: 120, y: 120 },
      { x: 120, y: 120 },
      { x: 100, y: 110 },
    ],
    equalStartEnd: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 0, y: 0 },
    ],
    convex: [
      { x: 20, y: 4 },
      { x: 20, y: 27 },
      { x: 60, y: 27 },
      { x: 60, y: 4 },
      { x: 40, y: -10 },
    ],
    concave: [
      { x: 23.23027292144134, y: -20.710253258520993 },
      { x: 20, y: 27 },
      { x: 68, y: 37 },
      { x: 90, y: -4 },
      { x: 48, y: 12 },
    ],
    complex: [
      { x: 20, y: 4 },
      { x: 10, y: 27 },
      { x: 60, y: 27 },
      { x: 70, y: 4 },
      { x: 40, y: 37 },
    ],
    lambdaLetter: [
      { x: 6, y: 6 },
      { x: 1, y: 1 },
      { x: 6, y: 6 },
      { x: 38.77601986838591, y: 27.967786748661318 },
      { x: 15.760060710778454, y: 75.5007458785029 },
      { x: 27.26804028958214, y: 59.48964385581943 },
      { x: 56.78850964390483, y: 59.489643855819416 },
      { x: 66.02231772645243, y: 71.09250552411001 },
      { x: 10.289783513792408, y: 10.149937092784299 },
    ],
    orthogonalProjection1: [
      { x: 4.1139063087281045, y: 6.008805382999107 },
      { x: 3.661690750974974, y: 6.067776795471968 },
      { x: 3.205180554242954, y: 5.878987418072784 },
    ],
    orthogonalProjection2: [
      { x: 76.58215114247255, y: -48.214288917214105 },
      { x: 76.95213430503364, y: -54.68899426204861 },
      { x: 82.704500475429, y: -49.91128595590783 },
    ],
    orthogonalProjection3: [
      { x: 79.76446629479383, y: -43.30180101207208 },
      { x: 84.9774418788902, y: -48.28812548381641 },
      { x: 82.704500475429, y: -49.91128595590783 },
    ],
    orthogonalProjection4: [
      { x: 79.63237629347668, y: -41.260831452943876 },
      { x: 84.9774418788902, y: -48.28812548381641 },
      { x: 85.52113122175491, y: -50.718528761996765 },
    ],
  };

  // Single point
  const testSinglePoint = {
    name: 'singlePoint',
    points: [{ x: 100, y: 100 }],
  };

  // Test only miter limit
  const selectedMiterLimitCases = {
    acuteAngle: generalCasesToTest.acuteAngle,
    obtuseAngle: generalCasesToTest.obtuseAngle,
    convex: generalCasesToTest.convex,
    concave: generalCasesToTest.concave,
    complex: generalCasesToTest.complex,
  };

  function renderStrokeTest(canvas, { builder, points, group }, polyOptions) {
    const scale = new fabric.Point(2, 3),
      poly = new builder(points, {
        fill: `rgb(255, 0, 0)`,
        strokeWidth: 10,
        stroke: 'rgb(120, 0, 0)',
        cornerColor: 'white',
        objectCaching: false,
        exactBoundingBox: true,
        ...polyOptions,
      });
    const target = group ? new fabric.Group([poly]) : poly;
    target.scaleX = scale.x;
    target.scaleY = scale.y;
    target.setDimensions();
    const size = target._getTransformedDimensions(),
      bg = new fabric.Rect({
        width: size.x,
        height: size.y,
        left: poly.left,
        top: poly.top,
        originX: poly.originX,
        originY: poly.originY,
        fill: 'blue',
        strokeWidth: 0,
        objectCaching: false
      });
    canvas.add(bg, target);
    canvas.setActiveObject(target);
    canvas.setViewportTransform([
      (canvas.width / size.x) * 0.9,
      0,
      0,
      (canvas.height / size.y) * 0.9,
      0,
      0,
    ]);
    canvas.viewportCenterObject(bg);
    canvas.viewportCenterObject(target);
    canvas.backgroundColor = 'white';
    canvas.renderAll();
  }

  for (let [caseName, casePoints] of Object.entries(generalCasesToTest)) {
    [fabric.Polyline, fabric.Polygon].forEach((builder) => {
      const builderType = builder.prototype.type,
        isPolygon = builderType === 'polygon',
        strokes = isPolygon
          ? ['miter', 'round', 'bevel']
          : ['butt', 'square', 'round'],
        strokeLineType = isPolygon ? 'strokeLineJoin' : 'strokeLineCap';
      strokes.forEach((strokeLineTypeCase) => {
        [true, false].forEach((strokeUniform) => {
          [false, true].forEach((group) => {
            if (group) return; // TODO: remove this line when fix group
            [
              [0, 0],
              [0, 30],
              [20, 0],
              [25, 35],
            ].forEach(([skewX, skewY]) => {
              tests.push({
                test: `${caseName} of type ${builderType} with ${strokeLineType}=${strokeLineTypeCase}, strokeUniform=${strokeUniform}, skewX=${skewX}, skewY=${skewY}, grouped=${group}`,
                code: function (canvas, callback) {
                  renderStrokeTest(
                    canvas,
                    {
                      builder,
                      points: casePoints,
                      group,
                    },
                    {
                      [strokeLineType]: strokeLineTypeCase,
                      strokeUniform,
                      skewX,
                      skewY,
                    }
                  );
                  callback(canvas.lowerCanvasEl);
                },
                golden: `stroke-projection/${strokeLineType}/${strokeLineTypeCase}/${caseName}-${
                  strokeUniform ? 'uniform-' : ''
                }-${skewX}skewX-${skewY}skewY-${group ? 'grouped' : ''}.png`,
                percentage: 0.001,
                width: 600,
                height: 900,
                fabricClass: 'Canvas',
                disabled: fabric.isLikelyNode,
              });
            });
          });
        });
      });
    });
  }

  for (let [caseName, casePoints] of Object.entries(selectedMiterLimitCases)) {
    const builder = fabric.Polygon;
    [5, 20, 120].forEach((strokeMiterLimit) => {
      [true, false].forEach((strokeUniform) => {
        tests.push({
          test: `${caseName} with strokeMiterLimit=${strokeMiterLimit}, strokeUniform=${strokeUniform} values`,
          code: function (canvas, callback) {
            renderStrokeTest(
              canvas,
              {
                builder,
                points: casePoints,
              },
              {
                strokeLineJoin: 'miter',
                strokeUniform,
                strokeMiterLimit,
              }
            );
            callback(canvas.lowerCanvasEl);
          },
          golden: `stroke-projection/strokeLineJoin/miter-limit/${caseName}-${
            strokeUniform ? 'uniform-' : ''
          }-${strokeMiterLimit}miterLimit.png`,
          percentage: 0.001,
          width: 600,
          height: 900,
          fabricClass: 'Canvas',
          disabled: fabric.isLikelyNode,
        });
      });
    });
  }

  [fabric.Polyline, fabric.Polygon].forEach((builder) => {
    const builderType = builder.prototype.type,
      isPolygon = builderType === 'polygon';
    ['square', 'round'].forEach((strokeLineCap) => {
      [true, false].forEach((strokeUniform) => {
        [
          [0, 0],
          [0, 30],
          [20, 0],
          [25, 35],
        ].forEach(([skewX, skewY]) => {
          tests.push({
            test: `${testSinglePoint.name} of type ${builderType} with strokeLineCap=${strokeLineCap}, strokeUniform=${strokeUniform}, skewX=${skewX}, skewY=${skewY}`,
            code: function (canvas, callback) {
              renderStrokeTest(
                canvas,
                {
                  builder,
                  points: testSinglePoint.points,
                },
                {
                  strokeLineCap,
                  strokeUniform,
                  skewX,
                  skewY,
                }
              );
              callback(canvas.lowerCanvasEl);
            },
            golden: `stroke-projection/${
              isPolygon ? 'strokeLineJoin' : 'strokeLineCap'
            }/${testSinglePoint.name}-${strokeLineCap}${
              strokeUniform ? '-uniform-' : ''
            }-${skewX}skewX-${skewY}skewY.png`,
            percentage: 0.001,
            width: 600,
            height: 900,
            fabricClass: 'Canvas',
            disabled: fabric.isLikelyNode,
          });
        });
      });
    });
  });

  tests.forEach(visualTestLoop(QUnit));
});
