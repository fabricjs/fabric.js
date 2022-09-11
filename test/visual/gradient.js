
function createBackgroundGradientTest(configureCanvas, gradientOptions = {}) {
  return (canvas, callback) => {
    var g = new fabric.Gradient({
      type: 'linear',
      gradientTransform: [0.2, -0.4, 0.2, 0.1, -3, -5],
      coords: {
        x1: 0,
        y1: 0,
        x2: 200,
        y2: 0
      },
      colorStops: [{
        offset: 0,
        color: 'green'
      },
      {
        offset: 0.5,
        color: 'white'
      },
      {
        offset: 1,
        color: 'blue'
      }],
      ...gradientOptions
    });
    configureCanvas && configureCanvas(canvas);
    canvas.set({ backgroundColor: g });
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  };
}

[
  {
    test: 'canvas can have a gradient background',
    code: createBackgroundGradientTest(),
    golden: 'backgroundWithGradient.png',
    percentage: 0.09,
    width: 300,
    height: 300,
  },
  {
    test: 'canvas can have a gradient background and being zoomed',
    code: createBackgroundGradientTest(canvas => {
      canvas.setZoom(0.1);
    }),
    golden: 'backgroundWithGradientZoom.png',
    percentage: 0.09,
    width: 300,
    height: 300,
  },
  {
    test: 'canvas can have a gradient background with zoom but being unaffected',
    code: createBackgroundGradientTest(canvas => {
      canvas.setZoom(0.1);
      canvas.backgroundVpt = false;
    }),
    golden: 'backgroundWithGradient.png',
    percentage: 0.09,
    width: 300,
    height: 300,
  },
  {
    test: 'canvas can have a percentage gradient background',
    code: createBackgroundGradientTest(null, {
      gradientUnits: 'percentage',
      coords: {
        x1: 0,
        y1: 0,
        x2: 2 / 3,
        y2: 0
      }
    }),
    golden: 'backgroundWithGradient.png',
    percentage: 0.09,
    width: 300,
    height: 300,
  },
  {
    test: 'canvas can have a percentage gradient background and being zoomed',
    code: createBackgroundGradientTest(canvas => {
      canvas.setZoom(0.1);
    }, {
      gradientUnits: 'percentage',
      coords: {
        x1: 0,
        y1: 0,
        x2: 2 / 3,
        y2: 0
      }
    }),
    golden: 'backgroundWithGradientZoom.png',
    percentage: 0.09,
    width: 300,
    height: 300,
  },
  {
    test: 'canvas can have a percentage gradient background with zoom but being unaffected',
    code: createBackgroundGradientTest(canvas => {
      canvas.setZoom(0.1);
      canvas.backgroundVpt = false;
    }, {
      gradientUnits: 'percentage',
      coords: {
        x1: 0,
        y1: 0,
        x2: 2 / 3,
        y2: 0
      }
    }),
    golden: 'backgroundWithGradient.png',
    percentage: 0.09,
    width: 300,
    height: 300,
  },
].forEach(visualTestLoop(QUnit));;
