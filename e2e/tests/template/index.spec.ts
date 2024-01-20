import { expect, test } from '@playwright/test';
import setup from '../../setup';
import type setupCodegen from '../../setup/setupCodegen';
import { CanvasUtil } from '../../utils/CanvasUtil';
import { ObjectUtil } from '../../utils/ObjectUtil';

setup();

test('TEST NAME', async ({ page }) => {
  const canvasUtil = new CanvasUtil(page);
  // note that `textbox` correlates to the returned key in `index.ts` => `beforeAll`
  const textboxUtil = new ObjectUtil(page, 'textbox');
  // write the test
});

/**
 * ## Codegen
 *
 * This test supports code generation of tests
 * see {@link setupCodegen} for uage information
 */
!process.env.CI &&
  test.only('Codegen', async ({ page }) => {
    // opens playwright codegen devtools
    await page.pause();
  });
