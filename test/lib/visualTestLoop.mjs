// import { fileURLToPath } from 'url';
// import path from 'path';
// import fs from 'fs';
import pixelmatch from 'pixelmatch';
// import { fabric } from '../../dist/fabric';
import { visualCallback } from './visualCallbackQunit.mjs';


  export const getFixture = async function(name, original, callback) {
    callback(await getImage(getFixtureName(name), original));
  };

  export const getAsset = function(name, callback) {
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
    return new fabric[fabricClass](null, options);
  }

function localPath(_path, filename) {
    const __filename = fileURLToPath(import.meta.url);
 const __dirname = path.dirname(__filename);
    return 'file://' + path.join(__dirname, _path, filename)
  }

  export function getAssetName(filename) {
    var finalName = '/assets/' + filename + '.svg';
    return fabric.isLikelyNode ? localPath('/../visual', finalName) : finalName;
  }

  function getGoldeName(filename) {
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

async function getImage(filename, original) {
    if (fabric.isLikelyNode && original) {
      var plainFileName = filename.replace('file://', '');
      if (!fs.existsSync(plainFileName)) {
        generateGolden(filename, original);
      }
    }
    else if (original) {
      await fetch(`/goldens/${filename}`, { method: 'GET' })
        .then(res => res.json())
        .then(res => !res.exists && generateGolden(filename, original));
    }
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
  

  export const visualTestLoop = function(QUnit) {

    const pixelmatchOptions = {
      includeAA: false,
      threshold: 0.095
    };

    return function testCallback(testObj) {
      if (testObj.disabled) {
        return;
      }
      fabric.StaticCanvas.prototype.requestRenderAll = fabric.StaticCanvas.prototype.renderAll;
      var testName = testObj.test;
      var code = testObj.code;
      var percentage = testObj.percentage;
      var golden = testObj.golden;
      var newModule = testObj.newModule;
      if (newModule) {
        QUnit.module(newModule, {
          beforeEach: testObj.beforeEachHandler,
        });
      }
      QUnit.test(testName, function(assert) {
        var done = assert.async();
        var fabricCanvas = createCanvasForTest(testObj);
        code(fabricCanvas, async function (renderedCanvas) {
          var width = renderedCanvas.width;
          var height = renderedCanvas.height;
          var totalPixels = width * height;
          var imageDataCanvas = renderedCanvas.getContext('2d').getImageData(0, 0, width, height);
          var canvas = fabric.document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          var ctx = canvas.getContext('2d');
          var output = ctx.getImageData(0, 0, width, height);
          const goldenImage = await getImage(getGoldeName(golden), renderedCanvas);
          ctx.drawImage(goldenImage, 0, 0);
          !fabric.isLikelyNode && visualCallback.addArguments({
            enabled: true,
            golden: canvas,
            fabric: imageDataCanvas,
            diff: output,
            goldenName: golden
          });
          var imageDataGolden = ctx.getImageData(0, 0, width, height).data;
          var differentPixels = pixelmatch(imageDataCanvas.data, imageDataGolden, output.data, width, height, pixelmatchOptions);
          var percDiff = differentPixels / totalPixels * 100;
          var okDiff = totalPixels * percentage;
          var isOK = differentPixels <= okDiff;
          assert.ok(
            isOK,
            testName + ' [' + golden + '] has too many different pixels ' + differentPixels + '(' + okDiff + ') representing ' + percDiff + '% (>' + (percentage * 100) + '%)'
          );
          if (!testObj.testOnly && ((!isOK && QUnit.debugVisual) || QUnit.recreateVisualRefs)) {
            await generateGolden(getGoldeName(golden), renderedCanvas);
          }
          await fabricCanvas.dispose();
          done();
        });
      });
    }
  }
