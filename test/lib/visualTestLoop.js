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
    // stub
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

  async function dumpResults(filename, { passing, test, module }, visuals) {
    const keys = Object.keys(visuals);
    if (fabric.isLikelyNode && !passing) {
      const plainFileName = filename.replace('file://', '');
      const goldenPath = path.relative(path.resolve('test', 'visual', 'golden'), plainFileName);
      const basename = path.basename(goldenPath, '.png');
      const dumpsPath = path.resolve(process.env.REPORT_DIR, RUNNER_ID, basename);
      fs.ensureDirSync(dumpsPath);
      fs.writeFileSync(path.resolve(dumpsPath, 'info.json'), JSON.stringify({
        module,
        test,
        file: basename,
        passing: false
      }, null, 2));
      keys.forEach(key => {
        const dataUrl = visuals[key].toDataURL().split(',')[1];
        fs.writeFileSync(path.resolve(dumpsPath, `${key}.png`), dataUrl, { encoding: 'base64' });
      });
    }
    else if (!fabric.isLikelyNode && (QUnit.launch || !passing)) {
      const blobs = await Promise.all(keys.map(key => new Promise((resolve, reject) => {
        try {
          visuals[key].toBlob(resolve, 'image/png');
        } catch (error) {
          reject(error);
        }
      })));
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        keys.forEach((key, index) => formData.append(key, blobs[index], `${key}.png`));
        formData.append('filename', filename);
        formData.append('passing', passing);
        formData.append('test', test);
        formData.append('module', module);
        formData.append('runner', RUNNER_ID);
        const request = new XMLHttpRequest();
        request.open('POST', '/goldens/results', true);
        request.onreadystatechange = () => {
          if (request.readyState === XMLHttpRequest.DONE) {
            const status = request.status;
            if (status === 0 || (status >= 200 && status < 400)) {
              resolve(JSON.parse(request.responseText));
            } else {
              reject();
            }
          }
        };
        request.send(formData);
      }).catch(err => {
        throw err;
      });
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

  QUnit.assert.visualEqual = async function visualAssertion(callback, ref, {
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
    const fileName = getGoldenName(ref);
    const basename = /(.*)\..*/.exec(ref)[1];
    testIdToFileMap[this.test.testId] = {
      name: ref,
      basename,
      expected: `/results/${RUNNER_ID}/${basename}/expected.png`,
      actual: `/results/${RUNNER_ID}/${basename}/actual.png`,
      diff: `/results/${RUNNER_ID}/${basename}/diff.png`,
    };
    const exists = await goldenExists(fileName);

    if (CI && !exists) {
      // this means that the golden wasn't committed to the repo
      // we do not want the test to create the missing golden thus reporting a false positive
      this.ok(false, `golden [${ref}] not found`);
      done();
      return;
    };
        
    callback(fabricCanvas, async (actual) => {
      // retrieve golden
      if (!exists) {
        await generateGolden(fileName, actual);
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
      ctx.drawImage(await getImage(fileName, actual), 0, 0);

      const imageDataGolden = ctx.getImageData(0, 0, width, height).data;
      const differentPixels = pixelmatch(imageDataActual.data, imageDataGolden, diffOutput.data, width, height, pixelmatchOptions);
      const okDiff = totalPixels * percentageThreshold;
      const isOK = differentPixels <= okDiff;
      this.pushResult({
        result: isOK,
        actual: `${differentPixels} different pixels (${(differentPixels / totalPixels * 100).toFixed(2)}%)`,
        expected: `${okDiff} >= different pixels (${(percentageThreshold * 100).toFixed(2)}%)`,
        message: ` [${ref}] has too many different pixels`
      });

      if (!this.todo && !testOnly && ((!isOK && QUnit.debugVisual) || QUnit.recreateVisualRefs)) {
        await generateGolden(fileName, actual);
      }

      // dump results
      const diff = fabric.document.createElement('canvas');
      diff.width = width;
      diff.height = height;
      diff.getContext('2d', { willReadFrequently: true }).putImageData(diffOutput, 0, 0);
      
      await dumpResults(fileName,
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
