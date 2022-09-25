// import path from 'path';
// import fs from 'fs';
import pixelmatch from 'pixelmatch';
import { createCanvasForTest, getImage } from './common.mjs';
// import { fabric } from '../../dist/fabric';
import util from './util.mjs';

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
          const goldenImage = await getImage(util.getGoldenName(golden), renderedCanvas);
          ctx.drawImage(goldenImage, 0, 0);
          QUnit.visualCallback?.addArguments({
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
            await util.generateGolden(util.getGoldenName(golden), renderedCanvas);
          }
          await fabricCanvas.dispose();
          done();
        });
      });
    }
  }
