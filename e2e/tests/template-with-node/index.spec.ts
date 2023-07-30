import { expect, test } from '@playwright/test';
import { CanvasUtil } from '../../utils/CanvasUtil';
import { createNodeSnapshot } from '../../utils/createNodeSnapshot';
import { render } from './common';

import '../../setup';

/**
 * **CAUTION**:
 * When updating snapshots we want the browser snapshot of a test to be committed and not the node snapshot
 * so we disable the node test.
 * This means that you should run tests once again after updating snapshots to ensure node snapshots pass.
 * In order to enforce that the test will fail.
 */
test('TEST NAME', async ({ page }, { config: { updateSnapshots } }) => {
  await test.step('browser', async () => {
    expect(
      await new CanvasUtil(page).screenshot(),
      'browser snapshot'
    ).toMatchSnapshot({
      name: 'textbox.png',
    });
  });

  await test.step('node', async () => {
    if (!updateSnapshots) {
      expect(
        await createNodeSnapshot(render),
        'node snapshot should match browser snapshot'
      ).toMatchSnapshot({ name: 'textbox.png' });
    } else {
      test.step('Run the test again after updating snapshots to ensure node snapshots pass', () => {
        test.fail();
      });
    }
  });
});
