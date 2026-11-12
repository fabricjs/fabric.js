import { expect, test } from '../../../fixtures/base';
import {
  TestingCanvas,
  fabric,
  isSkia,
} from '../../../utils/createNodeSnapshot';
import { renderTests } from './renderingCases';

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

    test(testCase.title, async ({ page, canvasUtil }, config) => {
      test.skip(
        isSkia && testCase.disabled === 'node',
        'This existing rendering case is browser-only',
      );
      const goldenName = testCase.golden || `${testCase.title}.png`;
      const snapshotName = testCase.snapshotSuffix
        ? [testCase.snapshotSuffix, goldenName]
        : goldenName;

      if (!isSkia && testCase.disabled !== 'browser') {
        await test.step(`browser - ${testCase.title}`, async () => {
          // enable and disable this inside the loop
          config.config.updateSnapshots = 'missing';
          let output: void | string;
          try {
            output = await page.evaluate(
              (testTitle) => renderingTestMap.get(testTitle)!(),
              testCase.title,
            );
          } finally {
            if (testCase.assertRendering) {
              await config.attach('browser-rendering', {
                body: await canvasUtil.screenshot(),
                contentType: 'image/png',
              });
            }
          }
          if (testCase.assertRendering) return;
          if (output) {
            expect(
              dataURLOutputToBuffer(output),
              `browser snapshot`,
            ).toMatchSnapshot({
              name: snapshotName,
              maxDiffPixelRatio: testCase.percentage,
            });
          } else {
            expect(
              await canvasUtil.screenshot(),
              `browser snapshot`,
            ).toMatchSnapshot({
              name: snapshotName,
              maxDiffPixelRatio: testCase.percentage,
            });
          }
        });
      }
      if (testCase.disabled !== 'node') {
        await test.step(`${isSkia ? 'skia' : 'node'} - ${testCase.title}`, async () => {
          // we want the browser snapshot of a test to be committed and not the node snapshot
          config.config.updateSnapshots = 'none';
          const canvas = new TestingCanvas(undefined, {
            enableRetinaScaling: false,
            renderOnAddRemove: false,
            width: testCase.size[0],
            height: testCase.size[1],
          });
          try {
            const output = await testCase.renderFunction(canvas, fabric);
            if (testCase.assertRendering) {
              canvas.renderAll();
              await config.attach(`${isSkia ? 'skia' : 'node'}-rendering`, {
                body: canvas.getNodeCanvas().toBuffer('image/png'),
                contentType: 'image/png',
              });
              await testCase.assertRendering(canvas, fabric);
              return;
            }
            if (output) {
              expect(
                dataURLOutputToBuffer(output),
                `${isSkia ? 'skia' : 'node'} snapshot should match browser snapshot`,
              ).toMatchSnapshot({
                name: snapshotName,
                maxDiffPixelRatio: testCase.percentage,
              });
            } else {
              canvas.renderAll();
              const buffer = canvas.getNodeCanvas().toBuffer('image/png');
              expect(
                buffer,
                `${isSkia ? 'skia' : 'node'} snapshot should match browser snapshot`,
              ).toMatchSnapshot({
                name: snapshotName,
                maxDiffPixelRatio: testCase.percentage,
              });
            }
          } finally {
            await canvas.dispose();
          }
        });
      }
    });
  }
});
