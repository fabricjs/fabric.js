import { expect, test } from '@playwright/test';
import type { StaticCanvas } from 'fabric/node';
import setup from '../../setup';
import { CanvasUtil } from '../../utils/CanvasUtil';
import { render } from './common';

for (const type of ['rect', 'text'] as const) {
  test.describe(`Gradient transform on ${type}`, () => {
    setup(() => ({ type }));
    test('Gradient transform', async ({ page }, config) => {
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
          (
            (await render(await import('../../..'), { type }))
              .canvas as StaticCanvas
          )
            .getNodeCanvas()
            .toBuffer(),
          'node snapshot should match browser snapshot'
        ).toMatchSnapshot({ name: `${type}.png`, maxDiffPixelRatio: 0.05 });
      });
    });
  });
}
