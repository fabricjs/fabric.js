import { expect, test } from '@playwright/test';
import setup from '../../setup';
import { CanvasUtil } from '../../utils/CanvasUtil';
import { createNodeSnapshot } from '../../utils/createNodeSnapshot';
import { render } from './common';

for (const type of ['rect', 'text'] as const) {
  test.describe(`Gradient transform on ${type}`, () => {
    setup(() => ({ type }));
    test(`Gradient transform on ${type}`, async ({ page }, config) => {
      await test.step('browser', async () => {
        expect(
          await new CanvasUtil(page).screenshot({ element: 'main' }),
          'browser snapshot'
        ).toMatchSnapshot({
          name: `${type}.png`,
          maxDiffPixelRatio: 0.05,
        });
      });

      await test.step('node', async () => {
        // we want the browser snapshot of a test to be committed and not the node snapshot
        config.config.updateSnapshots = 'none';
        expect(
          await createNodeSnapshot(
            (canvas, fabric) => render(canvas, fabric, { type }),
            { width: 1000, height: 400 }
          ),
          'node snapshot should match browser snapshot'
        ).toMatchSnapshot({ name: `${type}.png`, maxDiffPixelRatio: 0.05 });
      });
    });
  });
}
