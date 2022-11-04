(function (exports) {
  
  function createCanvasForTest(opts) {
    var fabricClass = opts.fabricClass || 'StaticCanvas';
    var options = { enableRetinaScaling: false, renderOnAddRemove: false, width: 200, height: 200 };
    if (opts.width) {
      options.width = opts.width;
    }
    if (opts.height) {
      options.height = opts.height;
    }
    const canvas = new fabric[fabricClass](null, options);
    // stub
    canvas.requestRenderAll = canvas.renderAll;
    return canvas;
  }
  
  const pixelmatchOptions = {
    includeAA: false,
    threshold: 0.095
  };

  exports.visualTestLoop = function(QUnit) {

    return function testCallback({
      disabled,
      action = 'test',
      test: testName,
      code,
      percentage,
      golden,
      newModule,
      beforeEachHandler,
      /**
       * do not generate a golden
       */
      testOnly,
      fabricClass = 'StaticCanvas',
      width,
      height
    }) {
      if (disabled) {
        return;
      }
      if (newModule) {
        QUnit.module(newModule, {
          beforeEach: beforeEachHandler,
        });
      }
      QUnit[action](testName, function (assert) {
        assert.visualEqual(code, golden, {
          fabricClass,
          width,
          height,
          percentageThreshold: percentage,
          testOnly,
        });
      });
    }
  }

  const testIdToFileMap = {};
  exports.testIdToFileMap = testIdToFileMap;

  QUnit.assert.visualEqual = async function visualAssertion(callback, file, {
    fabricClass,
    width,
    height,
    /**
     * [0, 1]
     */
    percentageThreshold,
    /**
     * do not generate a golden if test fails, overriding all cli flags
     */
    testOnly,
  }) {
    const done = this.async();
    const fabricCanvas = createCanvasForTest({ fabricClass, width, height });
    const basename = /(.*)\..*/.exec(file)[1];
    testIdToFileMap[this.test.testId] = {
      name: file,
      basename,
      expected: `/results/${RUNNER_ID}/${basename}/expected.png`,
      actual: `/results/${RUNNER_ID}/${basename}/actual.png`,
      diff: `/results/${RUNNER_ID}/${basename}/diff.png`,
    };
    const exists = await goldenExists(file);

    if (CI && !exists) {
      // this means that the golden wasn't committed to the repo
      // we do not want the test to create the missing golden thus reporting a false positive
      this.pushResult({
        result: false,
        actual: `not found`,
        expected: `golden [${file}]`,
        message: `golden [${file}] not found`
      });
      done();
      return;
    };
        
    callback(fabricCanvas, async (actual) => {
      // retrieve golden
      if (!exists) {
        await generateGolden(file, actual);
      }
      const width = actual.width;
      const height = actual.height;
      const totalPixels = width * height;
      const imageDataActual = actual.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, width, height);

      const expected = fabric.document.createElement('canvas');
      expected.width = width;
      expected.height = height;
      const ctx = expected.getContext('2d', { willReadFrequently: true });
      const diffOutput = ctx.getImageData(0, 0, width, height);
      ctx.drawImage(await getGolden(file), 0, 0);

      const imageDataGolden = ctx.getImageData(0, 0, width, height).data;
      const differentPixels = pixelmatch(imageDataActual.data, imageDataGolden, diffOutput.data, width, height, pixelmatchOptions);
      const okDiff = totalPixels * percentageThreshold;
      const isOK = differentPixels <= okDiff;
      this.pushResult({
        result: isOK,
        actual: `${differentPixels} different pixels (${(differentPixels / totalPixels * 100).toFixed(2)}%)`,
        expected: `${okDiff} >= different pixels (${(percentageThreshold * 100).toFixed(2)}%)`,
        message: ` [${file}] has too many different pixels`
      });

      if (!this.todo && !testOnly && ((!isOK && QUnit.debugVisual) || QUnit.recreateVisualRefs)) {
        await generateGolden(file, actual);
      }

      // dump results
      const diff = fabric.document.createElement('canvas');
      diff.width = width;
      diff.height = height;
      diff.getContext('2d', { willReadFrequently: true }).putImageData(diffOutput, 0, 0);
      
      await dumpResults(file,
        {
          passing: isOK,
          test: this.test.testName,
          module: this.test.module.name
        },
        {
          expected,
          actual,
          diff
        });
      
      await fabricCanvas.dispose();
      done();
    });

  }
})(typeof window === 'undefined' ? exports : this);
