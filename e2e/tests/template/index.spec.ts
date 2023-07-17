import { test } from '@playwright/test';
import { CanvasUtil } from '../../utils/CanvasUtil';
import '../../setup';

test('TEST NAME', async ({ page }) => {
  const util = new CanvasUtil(page);
  // write the test
});
