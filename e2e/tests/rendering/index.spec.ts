import { expect, test } from '@playwright/test';
import setup from '../../setup';
import { CanvasUtil } from '../../utils/CanvasUtil';
import { TestingCanvas } from '../../utils/createNodeSnapshot';
import { renderTests } from './renderingCases';
import * as fabric from 'fabric/node';

setup();

test('VISUAL RENDERING TESTS', async ({ page }, config) => {
  for (const testCase of renderTests) {
    await test.step('browser', async () => {
      await page.evaluate(
        (testTitle) => renderingTestMap.get(testTitle)(),
        testCase.title
      );
      expect(
        await new CanvasUtil(page).screenshot(),
        'browser snapshot'
      ).toMatchSnapshot({
        name: `${testCase.title}.png`,
        maxDiffPixelRatio: testCase.percentage,
      });
    });

    await test.step('node', async () => {
      // we want the browser snapshot of a test to be committed and not the node snapshot
      config.config.updateSnapshots = 'none';
      const canvas = new TestingCanvas(null, {
        enableRetinaScaling: false,
        renderOnAddRemove: false,
        width: testCase.size[0],
        height: testCase.size[1],
      });
      await testCase.renderFunction(canvas, fabric);
      canvas.renderAll();
      const buffer = canvas.getNodeCanvas().toBuffer();
      expect(
        buffer,
        'node snapshot should match browser snapshot'
      ).toMatchSnapshot({
        name: `${testCase.title}.png`,
        maxDiffPixelRatio: testCase.percentage,
      });
    });
  }
});
