(function(exports) {

  exports.getFixture = async function(name, original, callback) {
    callback(await getImage(getFixtureName(name), original));
  };

  exports.getAsset = function(name, callback) {
    var finalName = getAssetName(name);
    if (fabric.isLikelyNode) {
      var plainFileName = finalName.replace('file://', '');
      return fs.readFile(plainFileName, { encoding: 'utf8' }, callback);
    }
    else {
      fabric.util.request(finalName, {
        onComplete: function(xhr) {
          callback(null, xhr.responseText);
        }
      });
    }
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
    // stub TODO use sinon
    canvas.requestRenderAll = canvas.renderAll;
    return canvas;
  }

  function localPath(path, filename) {
    return 'file://' + require('path').join(__dirname, path, filename)
  }

  function getAssetName(filename) {
    var finalName = '/assets/' + filename + '.svg';
    return fabric.isLikelyNode ? localPath('/../visual', finalName) : finalName;
  }
  exports.getAssetName = getAssetName;

  function getGoldenName(filename) {
    var finalName = '/golden/' + filename;
    return fabric.isLikelyNode ? localPath('/../visual', finalName) : finalName;
  }

  function getFixtureName(filename) {
    var finalName = '/fixtures/' + filename;
    return fabric.isLikelyNode ? localPath('/..', finalName) : finalName;
  }

  function generateGolden(filename, original) {
    if (fabric.isLikelyNode && original) {
      var plainFileName = filename.replace('file://', '');
      var dataUrl = original.toDataURL().split(',')[1];
      console.log('creating golden for ', filename);
      fs.writeFileSync(plainFileName, dataUrl, { encoding: 'base64' });
    }
    else if (original) {
      return new Promise((resolve, reject) => {
        return original.toBlob(blob => {
          const formData = new FormData();
          formData.append('file', blob, filename);
          formData.append('filename', filename);
          const request = new XMLHttpRequest();
          request.open('POST', '/goldens', true);
          request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE) {
              const status = request.status;
              if (status === 0 || (status >= 200 && status < 400)) {
                resolve();
              } else {
                reject();
              }
            }
          };
          request.send(formData);
        });     
      }, 'image/png');
    }
  }

  async function getImage(filename) {
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
      img.src = filename;
    });
  }
  
  function goldenExists(fileName) {
    if (fabric.isLikelyNode) {
      var plainFileName = fileName.replace('file://', '');
      return fs.existsSync(plainFileName);
    }
    else {
      return fetch(`/goldens/${fileName}`, { method: 'GET' })
        .then(res => res.json())
        .then(res => res.exists);
    }
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
      QUnit[action](testName,  function(assert) {
        assert.visualEqual(code, golden, {
          fabricClass,
          width,
          height,
          percentage,
          testOnly,
        });
      });
    }
  }

  QUnit.assert.visualEqual = async function visualAssertion(callback, ref, {
    fabricClass,
    width,
    height,
    percentage,
    /**
     * do not generate a golden
     */
    testOnly,
  }) {
    const done = this.async();
    const fabricCanvas = createCanvasForTest({ fabricClass, width, height });
    const fileName = getGoldenName(ref);
    const exists = await goldenExists(fileName);

    if (true) {
      // this means that the golden wasn't committed to the repo
      // we do not want the test to create the missing golden thus reporting a false positive
      done();
      throw new Error(`golden ${ref} not found`);
    };
        
    callback(fabricCanvas, async (renderedCanvas) => {
      // retrieve golden
      if (!exists) {
        await generateGolden(fileName, renderedCanvas);
      }
      const goldenImage = await getImage(fileName, renderedCanvas);

      const width = renderedCanvas.width;
      const height = renderedCanvas.height;
      const totalPixels = width * height;
      const imageDataCanvas = renderedCanvas.getContext('2d').getImageData(0, 0, width, height);

      const canvas = fabric.document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      const output = ctx.getImageData(0, 0, width, height);
      ctx.drawImage(goldenImage, 0, 0);
      visualCallback.addArguments({
        enabled: true,
        golden: canvas,
        fabric: imageDataCanvas,
        diff: output,
        goldenName: ref
      });

      const imageDataGolden = ctx.getImageData(0, 0, width, height).data;
      const differentPixels = pixelmatch(imageDataCanvas.data, imageDataGolden, output.data, width, height, pixelmatchOptions);
      const okDiff = totalPixels * percentage;
      const isOK = differentPixels <= okDiff;
      this.pushResult({
        result: isOK,
        actual: `${differentPixels} pixels, ${(differentPixels / totalPixels * 100).toFixed(2)}%`,
        expected: `<= ${okDiff} pixels, ${(percentage * 100).toFixed(2)}%`,
        message: ` [${ref}] has too many different pixels`
      });

      if (!this.todo && !testOnly && ((!isOK && QUnit.debugVisual) || QUnit.recreateVisualRefs)) {
        await generateGolden(fileName, renderedCanvas);
      }
      
      await fabricCanvas.dispose();
      done();
    });

  }
})(typeof window === 'undefined' ? exports : this);
