import { test } from '@playwright/test';
import setup from '../../setup';
import { CanvasUtil } from '../../utils/CanvasUtil';
import { ObjectUtil } from '../../utils/ObjectUtil';

setup();

test('TEST NAME', async ({ page }) => {
  const canvasUtil = new CanvasUtil(page);
  // note that `textbox` correlates to the returned key in `index.ts` => `beforeAll`
  const textboxUtil = new ObjectUtil(page, 'textbox');
  // write the test
});

if (!process.env.CI) {
  test.only('Codegen', async ({ page, browser }) => {
    // unfortunately move events are not captured by codegen so it is not very useful for testing fabric
    // see https://github.com/microsoft/playwright/issues/21504
    // this is why we shall use our own recorder

    // opens playwright codegen devtools
    await page.pause();
  });
}
