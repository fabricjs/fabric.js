(function (exports) {
  
  const pixelmatchOptions = {
    includeAA: false,
    threshold: 0.095
  };

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

  async function getImage(src) {
    return new Promise((resolve, reject) => {
      const img = fabric.document.createElement('img');
      img.onload = function () {
        img.onerror = null;
        img.onload = null;
        resolve(img);
      };
      img.onerror = function (err) {
        img.onerror = null;
        img.onload = null;
        reject(err);
      };
      img.src = src;
    });
  }

  /**
   * Runs in context
   * @param {*} callback 
   * @param {*} file 
   * @param {*} param2 
   * @returns 
   */
  async function visualAssertion(callback, file, {
    fabricClass,
    width,
    height,
    /**
     * [0, 1]
     */
    percentageThreshold,
  }) {
    const fabricCanvas = createCanvasForTest({ fabricClass, width, height });
    const exists = await this.goldenExists(file);

    if (!exists && this.shouldFailIfNotFound()) {
      // this case occurs when running from CI
      // it means that the golden wasn't committed to the repo
      // we do not want the test to create the missing golden, thus reporting a false positive
      return {
        result: false,
        actual: `not found`,
        expected: `golden [${file}]`,
        message: `golden [${file}] not found`
      };
    };
        
    return new Promise(resolve => {
      callback(fabricCanvas, async (actual) => {
        // retrieve golden
        if (!exists) {
          await this.generateGolden(file, actual);
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
        ctx.drawImage(await this.getGolden(file), 0, 0);

        const imageDataGolden = ctx.getImageData(0, 0, width, height).data;
        const differentPixels = this.pixelmatch(imageDataActual.data, imageDataGolden, diffOutput.data, width, height, pixelmatchOptions);
        const okDiff = totalPixels * percentageThreshold;
        const isOK = differentPixels <= okDiff;
        const result = {
          result: isOK,
          actual: `${differentPixels} different pixels (${(differentPixels / totalPixels * 100).toFixed(2)}%)`,
          expected: `${okDiff} >= different pixels (${(percentageThreshold * 100).toFixed(2)}%)`,
          message: ` [${file}] has too many different pixels`
        };

        if (this.shouldGenerateGolden(isOK)) {
          await this.generateGolden(file, actual);
        }

        // dump results
        const diff = fabric.document.createElement('canvas');
        diff.width = width;
        diff.height = height;
        diff.getContext('2d', { willReadFrequently: true }).putImageData(diffOutput, 0, 0);
      
        await this.dumpResults(file,
          {
            passing: isOK,
            test: this.testName,
            module: this.moduleName
          },
          {
            expected,
            actual,
            diff
          });
      
        await fabricCanvas.dispose();

        resolve(result);
      });
    });
  }

  exports.getImage = getImage;
  exports.visualAssertion = visualAssertion;
})(typeof window === 'undefined' ? exports : this);
