import { expect, test } from '@playwright/test';
import { CanvasUtil } from '../../utils/CanvasUtil';

import '../../setup';

test('Path Animation', async ({ page }) => {
  const canvasUtil = new CanvasUtil(page);
  expect(await canvasUtil.screenshot()).toMatchSnapshot({ name: 'before.png' });
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('animation:start'));
    return new Promise((resolve) =>
      window.addEventListener('animation:end', resolve, { once: true })
    );
  });
  expect(await canvasUtil.screenshot()).toMatchSnapshot({ name: 'after.png' });
});
