import { expect, test } from '@playwright/test';
import setup from '../../setup';
import { CanvasUtil } from '../../utils/CanvasUtil';
import { createNodeSnapshot } from '../../utils/createNodeSnapshot';
import { render } from './common';

setup();

test('TEST NAME', async ({ page }, config) => {
  await test.step('browser', async () => {
    expect(
      await new CanvasUtil(page).screenshot(),
      'browser snapshot',
    ).toMatchSnapshot({
      name: 'textbox.png',
      maxDiffPixelRatio: 0.05,
    });
  });

  await test.step('node', async () => {
    // we want the browser snapshot of a test to be committed and not the node snapshot
    config.config.updateSnapshots = 'none';
    expect(
      await createNodeSnapshot(render),
      'node snapshot should match browser snapshot',
    ).toMatchSnapshot({ name: 'textbox.png', maxDiffPixelRatio: 0.05 });
  });
});
