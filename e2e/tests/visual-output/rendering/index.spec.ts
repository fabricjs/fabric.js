import { expect, test } from '@playwright/test';
import setup from '../../../setup';
import { CanvasUtil } from '../../../utils/CanvasUtil';
import { TestingCanvas } from '../../../utils/createNodeSnapshot';
import { renderTests } from './renderingCases';
import * as fabric from 'fabric/node';

setup();

function dataURLOutputToBuffer(dataURL: string) {
  const base64Data = dataURL.replace(/^data:image\/png;base64,/, '');
  return Buffer.from(base64Data, 'base64');
}

test.describe('VISUAL RENDERING TESTS', () => {
  const focusedTests = renderTests.filter((test) => test.only);
  const casesToRun = focusedTests.length > 0 ? focusedTests : renderTests;

  for (const testCase of casesToRun) {
    if (testCase.disabled === true) {
      continue;
    }

    test(testCase.title, async ({ page }, config) => {
      if (testCase.disabled !== 'browser') {
        await test.step(`browser - ${testCase.title}`, async () => {
          // enable and disable this inside the loop
          config.config.updateSnapshots = 'missing';
          const output = await page.evaluate(
            (testTitle) => renderingTestMap.get(testTitle)(),
            testCase.title,
          );

          if (output) {
            expect(
              dataURLOutputToBuffer(output),
              `browser snapshot`,
            ).toMatchSnapshot({
              name: testCase.golden || `${testCase.title}.png`,
              maxDiffPixelRatio: testCase.percentage,
            });
          } else {
            expect(
              await new CanvasUtil(page).screenshot(),
              `browser snapshot`,
            ).toMatchSnapshot({
              name: testCase.golden || `${testCase.title}.png`,
              maxDiffPixelRatio: testCase.percentage,
            });
          }
        });
      }
      if (testCase.disabled !== 'node') {
        await test.step(`node - ${testCase.title}`, async () => {
          // we want the browser snapshot of a test to be committed and not the node snapshot
          config.config.updateSnapshots = 'none';
          const canvas = new TestingCanvas(null, {
            enableRetinaScaling: false,
            renderOnAddRemove: false,
            width: testCase.size[0],
            height: testCase.size[1],
          });
          const output = await testCase.renderFunction(canvas, fabric);
          if (output) {
            expect(
              dataURLOutputToBuffer(output),
              `node snapshot should match browser snapshot`,
            ).toMatchSnapshot({
              name: testCase.golden || `${testCase.title}.png`,
              maxDiffPixelRatio: testCase.percentage,
            });
          } else {
            canvas.renderAll();
            const buffer = canvas.getNodeCanvas().toBuffer();
            expect(
              buffer,
              `node snapshot should match browser snapshot`,
            ).toMatchSnapshot({
              name: testCase.golden || `${testCase.title}.png`,
              maxDiffPixelRatio: testCase.percentage,
            });
          }
        });
      }
    });
  }
});
