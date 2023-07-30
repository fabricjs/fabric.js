import { expect, test } from '@playwright/test';
import { CanvasUtil } from '../../utils/CanvasUtil';
import { createNodeSnapshot } from '../../utils/createNodeSnapshot';

import '../../setup';
import { render } from './common';

/**
 * **CAUTION**:
 * When updating snapshots we want the browser snapshot to be committed and not the node snapshot
 * so we disable the node test.
 * This means that you should run tests once again after updating snapshots to ensure node snapshots pass.
 */
test('TEST NAME', async ({ page }, { config: { updateSnapshots } }) => {
  const canvasUtil = new CanvasUtil(page);
  // browser
  expect(await canvasUtil.screenshot(), 'browser snapshot').toMatchSnapshot({
    name: 'textbox.png',
  });
  // node
  !updateSnapshots &&
    expect(
      await createNodeSnapshot(render),
      'node snapshot should match browser snapshot'
    ).toMatchSnapshot({ name: 'textbox.png' });
});
